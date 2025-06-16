---
title: "Groovy Gorm Shell Script"
date: 2021-09-14T17:09:18+01:00
draft: false
categories: ["Coding"]
tags: []
description: "Gorm is the data access layer in Grails. I’ve been mostly away from Grails since 3.0 landed (for reasons)."
slug: "groovy-gorm-shell-script"
aliases:
  - "/coding/groovy-gorm-shell-script/"
---

Gorm is the data access layer in Grails. I’ve been mostly away from Grails since 3.0 landed (for reasons).

I’ve recently been taking a look at how things have come along, and have continued delivering [training on Groovy](http://daviddawson.me/training/groovy.html).

In the session I’m delivering there was some interest in Gorm as I walked people through it, and since I’ve been showing people the benefits of using Groovy for shell scripting and system automation, I thought, why not Gorm too?

This is the result of 20 mins pulling things together, it all works with, with a tiny bit of ugliness.

Assembled from :-

  * <http://gorm.grails.org/latest/hibernate/manual/index.html#outsideGrails>
  * <https://github.com/grails/grails-core/issues/10654#issuecomment-306387891>
  * <https://github.com/grails-samples/gorm-outside-grails>

## The rationale

Bash is unique in being everywhere, yet seemingly the language that no one can remember to any workable degree, only surpassed in this by regular expressions. I’ve lost count of the number of times I’ve looked up how to do a loop in bash, and I still couldn’t tell you how to do it!

So, shell scripting in alternate languages is often useful for maintainability, testability and other ilities. Groovy makes a decent candidate for this as it has excellent support for data transformation and integration with various data sources and can contain a shell script shebang for ease of execution.

Gorm lets you map objects onto various data sources, then use a whole bunch of active record style operations. Its a lovely DSL on data. The relatively new [RxGorm](http://gorm.grails.org/latest/rx/manual/index.html) gives you FRP style back pressure/ functional processing for streaming data out of the data store and doing stuff with it.

## The bits

Putting it together wasn’t too difficult, bar a couple of niggles that came up.

Gorm has come along well and is pretty isolated from the surrounding Grails infrastructure now. All you need to do is to create a `HibernateDatastore` (or other) and pass in a config and your domain classes for initialisation. Then, you can start to use them as you do in Grails.

One rub is that there is no natural place to wrap a transactional Session around. This appears as a hiernate exception related to no session being present. This is something often not noticed in a grails app, as its all created automatically by Grails, and is also created by a full fat standalone Gorm app when you’re using services with any form of transactional annotation. Yet, you need a session to use hibernate, which the RDBMS version of Gorm uses.

The solution is to use the `.withTransaction` method added onto all grails domain classes. This creates a session and puts it into the thread context.

I did a light bit of syntax sugaring to hide that stuff and make things more readable, and its good to go!

## The full script
    
    
    #!/usr/bin/env groovy
    
    @Grapes([
            @Grab("org.grails:grails-datastore-gorm-hibernate5:6.1.4.RELEASE"),
            @Grab("com.h2database:h2:1.4.192"),
            @Grab("org.apache.tomcat:tomcat-jdbc:8.5.0"),
            @Grab("org.apache.tomcat.embed:tomcat-embed-logging-log4j:8.5.0"),
            @Grab("org.slf4j:slf4j-api:1.7.10")
    ])
    **import** **grails.gorm.annotation.Entity**
    **import** **org.grails.datastore.gorm.GormEntity**
    **import** **org.grails.orm.hibernate.HibernateDatastore**
    
    _// Create the domain classes you want_
    @Entity
    **class** **Person** **implements** GormEntity<Person> {
    
        String firstName
        String lastName
    
        **static** mapping = {
            firstName blank: **false**
            lastName blank: **false**
        }
    }
    
    _//Guts of the script, do your db stuff here with the power of Gorm_
    gormScript {
        **new** Person(firstName: 'Dave', lastName: 'Ronald').save()
        **new** Person(firstName: 'Jeff', lastName: 'Happy').save()
        **new** Person(firstName: 'Sergio', lastName: 'del Amo').save()
        **new** Person(firstName: 'Monica', lastName: 'Crazy').save()
    
        println "People = ${Person.count()}"
    
        def sergio = Person.findByFirstName("Sergio")
    
        println "Got ${sergio.firstName} ${sergio.lastName}"
    }
    
    
    def gormScript(Closure exec) {
        Map configuration = [
                'hibernate.hbm2ddl.auto':'create-drop',
                'dataSource.url':'jdbc:h2:mem:myDB'
        ]
        HibernateDatastore datastore = **new** HibernateDatastore( configuration, Person)
    
        Person.withTransaction {
            exec()
        }
    }

[blog](https://daviddawson.me/tag/blog/)[gorm](https://daviddawson.me/tag/gorm/)[groovy](https://daviddawson.me/tag/groovy/)
