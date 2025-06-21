---
title: "Entity Oriented Microservices"
date: 2021-09-12T21:42:33+01:00
draft: false
categories: ["Guide"]
tags: ["blog", "ddd", "events", "evergreen", "technology"]
description: "![Image](/images/knowledge.jpg)"
slug: "entity-oriented-microservices"
aliases: ['/guide/entity-oriented-microservices/', '/entity-oriented-microservices/']
  - "/guide/entity-oriented-microservices/"
---

![Image](/images/knowledge.jpg)

Recently I read an article on the concept of [Entity Services](https://www.infoq.com/news/2017/12/entity-services-antipattern?utm_source=infoq&utm_medium=popular_widget&utm_campaign=popular_content_list&utm_content=homepage) over at InfoQ by Michael Nygard (and written up by Jan Stanberg). I’m not attempting to comment deeply on the article itself, only on the subject.

This is a topic I’ve spent an inordinate amount of time on over the years, you can see my thoughts in [many](/2017/07/styles-of-event-architecture/) a [blog](/2017/08/build-reactive-polyglot-muon/) post and [talk](https://skillsmatter.com/members/davidthecoder#skillscasts).

In talk form, I give a rundown of the problem and the issues it will create [here](https://youtu.be/OFV-1cpjQRk) while introducing the Muon project.

In summary, an entity microservice is one that you design to own the data and operations for a single domain entity in the system. You give it a runtime personality as well as a logical data one.

This comes from a simplistic view of Microservice decomposition, that I have found to be along the lines of “lets split up! how? erm, how about we take each table in the DB and make that a Microservice? Great Idea!”

This has led (at last!) to a broader discussion on the topic.

## DDD vs Microservices

Unfortunately, I see the argument raging, and I don’t really have any sympathy with it. It seems to be an argument at cross purposes. One side argues that Entity Services are bad, another argues that DDD should be applied better. Are you even arguing?

At this point, I’d like to throw in that Microservices != DDD Bounded Contexts, and no matter how many people say it is so, they’re wrong.

> “Microservices != DDD Bounded Contexts”

At its heart DDD is not an architectural approach. It is a software design discipline, probably the most comprehensive we currently have. Even so, it is not a way of creating architectures. I can approach a new software project and say “we will build this using a data flow approach, persist all events to provide deep analytics and provide HTTP facades for external integration”. All of that is architectural thought, none of it design, and here DDD has not been used one iota.

Microservices, well, that’s plainly not a design approach, the radically different designs I see in the wild prove that. Instead, it’s a set of architectural principles. At its crudest, when you say “we want microservices”, you are probably saying something along the lines of “we want to maintain the ability to change our software for longer, so will we introduce network boundaries to encourage isolation”. No design, no entities, no data model, no API specs. Simple architecture, simple software philosophy.

This is where I see the issue arising, the fact that Microservices is _apparently_ underspecified in terms of design, and so you must apply some form of design approach to do it properly. Most developers are used to an Object Oriented approach, and so reach for an _Objects-in-the-large_ style design, the commonly seen “entity oriented microservices” (as I have tended to call them). This is not a new approach, its simply networked now. Look in the majority of spring applications (for example) and you will see precisely the same thing, a bowdlerised version of Model driven development approaches, the immediate precursor to DDD.

Now, the fact that a DDD approach _can_ yield good Microservices designs, that I have certainly found to be true, but that is not the only approach that works. As I mentioned before, a dataflow architecture and then functional design style yields good results too, yet it looks very different from a DDD style system. Is there one true way, no, of course not.

## Entity Oriented Microservices

I very much see Entity services as a bad thing. Objects in the large just play into the fact that OO approaches have, given their originally stated aims, failed. OO abstractions that encapsulate state, identity and operation have led to poor designs in all levels of software. Instead we see the rise of immutability, 1 way data flow (witness Flux on the front end) and functional composition and extension ([event architectures](/2017/07/styles-of-event-architecture/))

So the simplistic “entity service” is a poor choice of design. This is not the only design that you can use, and as rightly pointed out in many of the comments around the above article, you can apply DDD to come up with something better.

## The right approach to Microservices design

Fundamentally, when starting with a Microservices project **the** thing you need to realise is that you are in the realm of distributed computing, that means data becomes the thing that actually matters. Specifically distribution, recombination and consistency models. DDD has techniques that _can_ help you with this, but only if you choose to, if you make the architectural choice to approach things from a different angle, and then apply DDD (or design discipline of your choice) to make that a reality.

The main approach I advocate is event based data flow. In that, you reason about the system in terms of events coming in, functional processing on the events, generation of data flows, gateways handling integration concerns. Persistence applied where needed, durability generally in the form of event logs.

Many of you will say “ah, event sourcing!”. No, thats not what I mean, thats an implementation, a potential way of applying the architectural thought. I want you to reason about your system in terms of the data, how it is created, how it moves, how it is transformed. When you do that, the concept of the “entity” simply vanishes. It is, after all, a collection of state, identity and operations. In a data flow approach, operations are functions that can be hosted anywhere (FaaS anyone?) identity is a key, one amongst many, state can mean many things in many different places.

Coming down to a design approach. the following is as good a way to start as any.

  * Event Storm your way to understanding the things that happen.
  * Group them up into potential bounded contexts for sanity
  * Understand the integration points, your gateways
  * See what queries are required
    * defining your data persistence and query engine requirements (especially **data joins**)
    * what consistency you require and where
  * Identify what functional transformations are needed to make this all work.
  * See if there are any integrations that require transactional validation. These become your aggregate roots (**AR**). You may have none, or many, depending on the type of system you have

This is fairly standard for DDD, although I suspect I do it backwards from many people (AR at the end) as I value data most highly, not entities, which I care little about in the final system. For a Microservice project, you then do a final step, identify where things change most and why. Break the system into runtime processes based upon that, and that only. If that means that you host multiple bounded contexts in a single process _so be it_. If that means a single bounded context is split over multiple services (eg, the gateway is changing a lot, but the AR processing never changes, break them up)

Data has always been the hardest thing in the vast majority of software development. In microservices it still is, with the addition of a network in the middle.

[blog](https://daviddawson.me/tag/blog/)[ddd](https://daviddawson.me/tag/ddd/)[events](https://daviddawson.me/tag/events/)[evergreen](https://daviddawson.me/tag/evergreen/)[technology](https://daviddawson.me/tag/technology/)
