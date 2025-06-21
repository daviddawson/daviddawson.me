---
title: "Generic DAO in Spring with Parameterized Types"
date: 2017-09-01T20:43:28+01:00
draft: false
categories: ["Coding"]
tags: ["blog", "ddd", "events", "java", "muon", "tech", "technology"]
description: "I’m currently finishing cleaning up a new application framework built upon the Muon communications toolkit, called **Newton**"
slug: "generic-dao-in-spring-with-parameterized-types"
aliases: ['/coding/generic-dao-in-spring-with-parameterized-types/', '/generic-dao-in-spring-with-parameterized-types/']
  - "/coding/generic-dao-in-spring-with-parameterized-types/"
---

I’m currently finishing cleaning up a new application framework built upon the Muon communications toolkit, called **Newton**

In this framework, we provide support for building Event Sourced **Aggregate Roots** , Stream processed Views, long running transactional Sagas, commands and general event handling. Lots of good things.

I want to describe the Aggregate Root handling, as I had an epic fight with Spring/ Java Generics today that left me somewhat drained!

In DDD an aggregate root is the boundary of transactional consistency. Everything that happens withing the aggregate is consistent with its own rules and view of the world. In Newton, all aggregates are event sourced, meaning that they are persisted as the events describing the changes in their state, and then rebuilt from that stream of events.

Queries on the state of the system are done exclusively against the Views, so the repositories that load/ save aggregates are actually all an extension of the same base class, `MuonEventSourceRepository<A extends AggregateRoot>`, implementing the interface `EventSourceRepository<A extends AggregateRoot>`

The ideal way of using these would be like so
    
    
    
    @Scope("prototype")
    @Component
    public class MyCommand implements Command {
     @Autowired
     private EventSourceRepository<User> repository
    
     @Override
     void execute() {
         log.debug("loading account ${id} to activate it")
         User user = repository.load(id)
         user.activateAccount()
         repository.save(user)
     }
    }
    
    

This is possible in vanilla spring with the appropriate beans, but you have to create extensions of the class to put in the generics information. So, create a `UserRepository extends MuonEventSourceRepository<User>`, and so on. This seems somewhat cluttered, and, in a little way, gets in the way of the aim of the Muon projects, which is to make distribuuted computing more approachable.

Solving this problem turned out to be somewhat more involved than I first thought!

The solutions I tried were :-

  * Using a Java Proxy. This doesn’t work, you don’t get the extended generic information.
  * Creating BeanDefinitions using GenericTypeResolver. This doesn’t work, its not useful for this.
  * Guava TypeTokens to capture the type information.
  * Finally, generating classes on the fly using Javassist. This works.

## The real problem

The real problem here is the way Java implements Generics. We have all seen Type Erasure in action, so Java developers are trained to think that Generic information is removed from the bytecode. This isn’t actually fully true.

Generic information **is** stripped from variable references, and never makes it into the bytecode, so any and all variables that you have in your code doesn’t have sufficient generic parameter information to support creating bean definitions that can be autowired using the generics parameters, as above.

There is, though, information kept in **Class** definitions. Its in the class files, just kept away from prying eyes apart from through some reflection apis. It is these reflection APIs that Spring, and other frameworks, use to do wiring using generic params.

So, to make the above work, I needed to get classes with this information in them. Its impossible to create raw instances of `MuonEventSourceRepository` that contain the parameter we’ve set, as only a subclass would have it in.

## The solution

The solution then is clear in hindsight, we need to create subclasses. The options were some kind of inline/ anonymous class approach, proxies and full on code generation.

The first two failed, and fairly quickly. I recommend you skip them!

The solution that worked for me was to use Javassist to generate subclasses, and explicitly insert the required generic parameter information into them.

The broader problem was identifying all of the Aggregate classes in the application, and then generating a new repository for each of them. We have a utility, using the Reflections library, that can do this, given a starting point. To give that starting point, and to hook in the automatic creation of repositories, we created a `@EnableNewton` annotation in the tradition of spring boot.

This looks like this
    
    
    @Target({ElementType.TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    @Documented
    @Import(EnableNewtonRegistrar.class) 
    **public** @interface EnableNewton {
      String[] value() **default** {};       
    }

| Reference a spring managed class that can be used to implement behaviour for this annotation  
---|---  
| This annotation can be, optionally, passes packages to include in the scanning for AggregateRoots  
  
The class referenced
    
    
    public class EnableNewtonRegistrar implements ImportBeanDefinitionRegistrar {
    
      @Override
      public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        try {
          initScan(importingClassMetadata);                                                                   
    
          MuonLookupUtils.listAllAggregateRootClass().forEach(s -> {                                          
    
            AggregateConfiguration a = s.getAnnotation(AggregateConfiguration.class);                         
    
            if (a == null)
              throw new IllegalArgumentException("Currently @AggregateConfiguration(context) is required");
            }
    
            GenericBeanDefinition beanDefinition = new GenericBeanDefinition();                              
            beanDefinition.setBeanClass(makeRepo(s));                                                        
            ConstructorArgumentValues vals = new ConstructorArgumentValues();
            vals.addGenericArgumentValue(s);                                                                 
            vals.addGenericArgumentValue(a.context());
            beanDefinition.setConstructorArgumentValues(vals);
    
            registry.registerBeanDefinition("newtonRepo" + s.getSimpleName(), beanDefinition);               
          });
        } catch (ClassNotFoundException e) {
          e.printStackTrace();
        }
      }
    
      ....
    }

| Use reflections to scan for the right classes. We end up with a list we can iterate.  
---|---  
| Use the list, and iterate them all. Each class extends AggregateRoot  
| Obtain an annotation on the particular AggregateRoot, ensure its there.  
| Create a new BeanDefinition, useful for low level adding of beans into a Spring app context.  
| Set the bean class to be a class returned by `makeRepo`…​. we’ll get to this ..  
| Set the arguments that can’t be injected, in this case, the Class we’re working on at the String extracted from the annotation  
| Register the bean  
  
When this has run, a new bean will have been created, the repository! The key is the `makeRepo(Class)` method. This needs to generate a new repository class, that extends `MuonEventSourceRepository`, and has the correct generic param set for the particular AggregateRoot we are looking at.

### Javassist to the rescue

By this point, I’d spent a good 3 hours hammering through this, and wanted to wrap up. The internet showed very little of anyone tackling this precise problem. By looking through the Javassist tutorials and some judicious googling, I learned that Generic parameter information can be injected into a class file by Javassist.

This is what I came up with
    
    
    private Class makeRepo(Class param) {
      ClassPool defaultClassPool = ClassPool.getDefault();
      try {
        CtClass superInterface = defaultClassPool.getCtClass(MuonEventSourceRepository.class
          .getName());
    
        String repoName = param.getName() + "Repository";
    
        CtClass repositoryInterface = defaultClassPool.makeClass(repoName, superInterface);                
        ClassFile classFile = repositoryInterface.getClassFile();
    
        String sig = "Ljava/lang/Object;Lio/muoncore/newton/eventsource/muon/MuonEventSourceRepository<L" + getSigName(param) + ";>;";  
    
        SignatureAttribute signatureAttribute = new SignatureAttribute(                                   
          classFile.getConstPool(),
          sig);
        classFile.addAttribute(signatureAttribute);
    
        return repositoryInterface.toClass();
    
      } catch (NotFoundException | CannotCompileException e) {
        e.printStackTrace();
      }
    
      return null;
    }
    
    private String getSigName(Class param) {
      log.info("VAL IS " + Arrays.asList(param.getName().split("\\.")));
      return StringUtils.arrayToDelimitedString(param.getName().split("\\."), "/");
    }

| Create a new class, extending MuonEventSourceRepository. Javassist automatically creates the appropriate constructors.  
---|---  
| This is a Java Generic Parameter signature. It is a fully qualified name of a class.  
| Create a new attribute in the class and insert it in. **This is the key!**  
  
The signature is fascinating. This is the information that is left behind after Type Erasure, the information that Spring and friends go hunting for to do their magic.

It’s fairly readable. All types extend Object, this class extends `MuonEventSourceRepository<User>` (or whatever the AggregateRoot is!)

With this in place, tests went green across the board and everything worked. I was shocked! After such a grind, this approach seems remarkably easy to work with. I’m still not fully sure of all the implications in all environments, as I expect this will fail in certain locked down Classloaders. They seem to be more infrequent these days, and the workaround is to go back to the old model of explicit repository implementations in those cases. So, I’m happy.

Watch out for an announcement on the public release of Newton in the next week or two. If you’re especially keen to talk about it before hand, let me know and I’ll see what I can arrange.

[blog](https://daviddawson.me/tag/blog/)[ddd](https://daviddawson.me/tag/ddd/)[events](https://daviddawson.me/tag/events/)[java](https://daviddawson.me/tag/java/)[muon](https://daviddawson.me/tag/muon/)[tech](https://daviddawson.me/tag/tech/)[technology](https://daviddawson.me/tag/technology/)
