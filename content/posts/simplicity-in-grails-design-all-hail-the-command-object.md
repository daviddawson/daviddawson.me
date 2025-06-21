---
title: "Simplicity in Grails Design – All Hail the Command Object"
date: 2013-09-01T21:26:10+01:00
draft: false
categories: ["Coding"]
tags: ["blog", "grails", "groovy", "technology"]
description: "This is a follow on to [Simplicity in Web Architecture – Beware the Stateless Service](/2013/03/stateless-services-are-evil/)"
slug: "simplicity-in-grails-design-all-hail-the-command-object"
aliases: ['/coding/simplicity-in-grails-design-all-hail-the-command-object/', '/simplicity-in-grails-design-all-hail-the-command-object/']
  - "/coding/simplicity-in-grails-design-all-hail-the-command-object/"
---

# All Hail the Command Object

This is a follow on to [Simplicity in Web Architecture – Beware the Stateless Service](/2013/03/stateless-services-are-evil/)

In that article, I gave my opinion on the Stateless Service programming model, and why I think it has been overused and touched on some of the issues it has caused.

It developed out of my unhappiness with the way I see code layed out in many Spring and Grails applications. The Service layer becomes stuffed with all the important logic, kept away from the domain and without much in the way of support to be had from the excellent Object Oriented language that Groovy is.

## ‘Standard’ Grails Architecture

The standard Grails architecture features that I’m discussing were, for the most part, inherited from Spring MVC. We have Controllers (prototype scoped), Services, Domains, Command Objects and Views as the core artifacts.

This has been implemented countless times across the years, and has been successfully applied by many teams.

Controllers are where HTTP interactions are managed. Views are for rendering, Domains handle mapping to the database and Services…​ well, they do everything else, pretty much.

## What’s the problem?

Good question!

This is an architecture that many, many people will recognise, and have successfully built applications with. Yet, I have seen issues with this architecture, sometimes subtle, sometimes much more obvious.

The most obvious one to my mind is the application of the Stateless Service model itself, which has bugged me for ages. It seems quite wrong that we have an exteremely powerful language like Groovy and rip out its object model to effectively pretend that its a Functional language, but with an awkward namespacing mechanism (I elaborate on this semi-rant <a href=”/article/stateless-services-are-evil”>here</a> ). I am not content with this state of affairs, but I have let it lie for a long time as the industry was behind it in a big way, and I who am I to argue..?!

The more subtle problems come from what amounts to an incomplete seperation of concerns between the Domain, Controller and Service. To my mind, there is just something missing.

Domains in Grails manage database mapping and interaction. Controllers manage HTTP interaction, Views manage rendering, Services manage ‘business logic’.

Yep, this sounds like a complete system, right?

Well …​ not really, no.

## Object Oriented Programming: the Once and Future King

The piece I see missing is the concept of the request, the flow of control, or overall representation of the state and the data. You see this kind of logic pop up all over the system, throughout Controllers and Services, yet with no real home of its own.

The question I asked in the talk on this subject was ‘where is the king’; If we are modelling something in an object oriented way, then the thing we are modelling should have a distinct and explicit identity in the system.

Looking in a normal Grails application, you do not see HTTP requests have any meaningful identity. They are effectively treated as function calls with some data payload.

The root causes for this also revolve around that stateless model we have adopted for controllers and services. By denying ourselves the ability to hold state and logic together as a component, we remove our ability to fully model the system in an Object Oriented way.

The most glaring problems that flow from this is that controllers (whose job is HTTP mediation) will be managing errors coming out of services, managing data transformations and performing other application logic; similarly, Services will begin to have a blend of application and utility logic. Codepaths around the service layer will become twisted and hard to follow, entry points into the service layer will be difficult to identify, service spaghettit will ensue.

A simple example of the simplest useful grails controller is informative, it will look something like this :-
    
    
    class UserController {
      def userService
    
      def getUser() {                          
        def userId = params.userId             
        def user = userService.getUser(userId) 
        return user
      }
    }

| We see some state being passed into the action : `params.userId`  
---|---  
| Some behaviour being executed : `userService.getUser(userId)`  
| Some implicit identity of the request : `class UserController.getUser()`  
  
This, my dear readers, is an Object in all but name. Those three things if bound up together could become an object that encapsulates the entirety of the request.

We would have our king back, and OO will be back on the throne.

How to do this for Grails?

## Enter the Command Object

Well, as you may have guessed from the title, this article is really about Command Objects. A command object in Grails is a marvellous creation. It has all of the capabilities of the Domain class, validation, auto binding, auto magical dependency injection and so on, without the extra baggage of worrying about persistence as well.

It is a very powerful little beast, and we can use it to model our request very effectively.

Taking our example from above, we can convert it to use a command object.
    
    
    class UserController {
    
      def getUser(FindUserCommand cmd) {
        def user = cmd.user
        return user
      }
    }
    
    class FindUserCommand {
      def userService
      def userId
    
      def getUser() {
        userService.getUser(userId)
      }
    }

This Command Object is now encapsulating the entirety of the request. It has an explicit identity, FindUserCommand, which is attached to a particular URL; it has the state that request is expected to contain; finally, it has the behaviour that should be executed for that request.

This acts to seperate out all of these things from the mechanics of HTTP interaction and rendering.

This leaves us with 4 major responsibilities in the app.

  * Persistence, managed by the Domain classes
  * HTTP mediation, handled by the Controller,
  * Transactional or utility logic, handled by Services
  * Finally the responsibility to model the queries and commands into the system, which I have handled with Command Objects.

This last one is new, and is a responsibility that has been pulled out of the service spaghetti.

We have been slowly moving towards enabling a Domain Driven Design approach through all this. The command object is very suitable to model a piece of the system domain for us, without other integration considerations such as HTTP or persistence.

## A fuller example

[All Hail Command on github](http://www.github.com/simplicityitself/all-hail-command)

On the github link above is an example implementation that takes this a little further. It is not the example given in the talk (which is too large to sanitise for public release). This example project defines a single command encapsulating a search request. This request is then able to be rendered in multiple ways by the Controller.

The controller is left to do its job of HTTP mediation. The Service layer can do transaction control and utility functions. The Command Object is very much in charge.

## Summary

If you app is beginning to resemble a bowl of spaghetti, consider that you have an incomplete application model. Your app exists in an HTTP environment, the requests coming in are part of your natural system structure, and they deserve to be treated as a first class part of your system model.

Command Objects are a powerful and cheap way to obtain that fuller model, and give added benefits such as parameter validation, data binding, type conversion and dependency injection.

In short, they are awesome.

[blog](https://daviddawson.me/tag/blog/)[grails](https://daviddawson.me/tag/grails/)[groovy](https://daviddawson.me/tag/groovy/)[technology](https://daviddawson.me/tag/technology/)
