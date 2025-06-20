---
title: "Simplicity in Web Architecture – Beware the Stateless Service"
date: 2013-09-01T21:22:15+01:00
draft: false
categories: ["Coding"]
tags: ["architecture", "groovy", "services"]
description: "This article is related to my recent talk at the London Groovy/ Grails User Group which you can see at [SkillsMatter](http://skillsmatter.com/podcast/groovy-gra..."
slug: "simplicity-in-web-architecture-beware-the-stateless-service"
aliases:
  - "/coding/simplicity-in-web-architecture-beware-the-stateless-service/"
---

# Simplicity in Web Architecture – Beware the Stateless Service

This article is related to my recent talk at the London Groovy/ Grails User Group which you can see at [SkillsMatter](http://skillsmatter.com/podcast/groovy-grails/all-hail-the-command-object-are-stateless-services-the-only-way)

In that talk I presented a way to get back to an Object Oriented way of thinking within Grails, using the existing infrastructure to help us get away from the Stateless Service paradigm that we have so deeply embedded in our psyche.

This is not only found in Grails, it is common in web frameworks of many kinds, especially those based on Spring or a similar IoC container.

This is because they all rely heavily on the singleton scoped Service as the primary architectural component in the system.

## What’s wrong with Stateless Services?

In many respects, nothing at all; they are a valid construct in many circumstances. For anyone reading this that isn’t aware of what I’m talking about as ‘Stateless Services’, its the Grails artefact called the ‘Service’ in its singleton form, which is the default. /grails-app/services/ReportingService.groovy
    
    
    class ReportingService {
    
        def generateReport(String name) {
          ...
        }
    }

The typical rule is that you _must not store data_ in the Service instance as you then open yourself up to some pretty awesome (and not in a good way) threading problems. For this reason, I try to refer to them as Stateless Services, to make that explicit. Read more on these, and the other service scopes, at the excellent [Grails Documentation](http://grails.org/doc/latest/guide/services.html)

The problem as I see it is that it has no clearly defined responsibilities, or boundaries within which it is designed to operate. The Grails documentation says that they are “the place to put the majority of the logic in your application”.

That’s an accurate description of how they are used, however I prefer to look at things in a highly conceptual way before delving into implementation.

So moving in that direction, when a request comes into the system, what artefact, conceptually, has the **responsibility** for that request?

The answer, in many cases, is nothing. Or rather, that responsibility is smeared around the application. Some of it is handled by the controller (error handling is a common case where the responsibility is assumed in controllers), most of it is split across various service class methods.

## So? Is this wrong?

**_Yes_**

This can have some significant effects on the system that sometimes, but not always immediately apparent. Those gotchas include:

**HTTP Controllers do too much**

They should only handle HTTP in and out and then delegate everything else to something else. If you code a controller to both handle HTTP and then do ‘something else’ then it becomes far harder to test and the internal structure will become confused. It also begins to break the [Single Responsibility Principle](http://codebetter.com/karlseguin/2008/12/05/get-solid-single-responsibility-principle/)

**Related state is not well encapsulated**

Often a request comes into the system that contains multiple pieces of state that are intended to be processed together. These will then be passed on to a service for processing. Whether they are passed individually, or within some holding object, the effect is the same. If the behaviour in the service interacts directly with the data items, then the data is not encapsulated. It may as well be passed in separated.

The result of this breaking of encapsulation is that an implicit coupling is introduced between your integration layer (HTTP/ persistence) and the core domain logic in unusual and unexpected ways, such as…​.

**Persistence, messaging, HTTP and other integration concerns are blended within the applications core domain logic**

This is an extremely common source of complexity in a system. Your domain logic should do nothing apart from model your business problem. Everything else is integration.

**State and the behaviour that operates on it are split**

This breaks encapsulation and spreads the behaviour across the system. It is not possible to look at any one piece of the system and understand the processes that will work upon it.

**Services are created along technical, rather than business, lines**

This seems a weird one so let me explain a little first. If the Service is the primary way to separate business logic up, then the way that the services are modelling the system _should_ map directly on to the business problem that it is implementing.

Instead you often find services like EmailService, QueueService, RabbitService etc. These examples are not part of the business domain (I use domain in the ‘model your business sense’, not the ‘persistence class’ sense). They are purely technical items and as such are not part of your core domain logic.

The fact that they exist at the same level as any business services results in confusion as it serves to blur the divide between the core domain and the surrounding integration; and so the seed is sewn for developers to think that integration code is somehow as important as the system domain.

**It is not**

## Ok, so what can I do about this?

Coming from a strong Object Oriented background, We’re not content with the responsibility of the system domain being invaded by integration concerns, or with the responsibility for a request being smeared around the system.

I recommend some general rules :-

  * Break your application’s core logic up into domains and use the Life Preserver tool to decide where your classes go.
  * Label up the classes that are part of the core logic of your application; that’s unique to your application’s concern and that you want to evolve at the rate of the your application, not at the rate of anyone else’s. This is the collection of domains that are at your application’s core.
  * Every other domain likely exists in the ‘outer ring’ of the Life Preserver, and as such it exists to manage an integration with the world outside your application. Be it integration with messaging, persistence or even a front-end concern such as the web; it’s all an integration and so the code there should be as limited to that integration concern as possible. This is firmly not the “code that makes you money”, so aim for as little in these domains as possible.
  * Unit test your application’s domain’s core classes to distraction. They’re your crown jewels, make sure they’re diamonds.
  * Use the Life Preserver tool to decide what logic is inside your core domains and what is in the integration layers going forward.

The talk above presents one method for doing this, which a subsequent article will elaborate on.

[architecture](https://daviddawson.me/tag/architecture/)[groovy](https://daviddawson.me/tag/groovy/)[services](https://daviddawson.me/tag/services/)
