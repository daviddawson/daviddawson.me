---
title: "Styles of Event Architecture"
date: 2021-09-15T08:36:11+01:00
draft: false
categories: ["Philosophy"]
tags: ["architecture", "blog", "ddd", "events", "evergreen", "muon", "tech", "technology"]
description: "This article was spawned from a conversation I had with Ben Wilcock on his article about building an event sourced system on Cloud Foundry using Axon, which you..."
slug: "styles-of-event-architecture"
aliases:
  - "/philosophy/styles-of-event-architecture/"
  - "/styles-of-event-architecture/"
---

This article was spawned from a conversation I had with Ben Wilcock on his article about building an event sourced system on Cloud Foundry using Axon, which you can read [here](https://benwilcock.wordpress.com/2017/07/11/cqrs-and-event-sourcing-microservices-on-cloudfoundry/amp/). We covered some interesting topics, including some critiques of the model so he encouraged me to write up my thoughts on Event Architectures. 
    
    No small topic there, thanks Ben!

This is an interesting topic, with a lot of potential pitfalls.

Firstly, some definition. An Event Architecture is :-

  * A software architecture. As such, its akin to what I would call a [software philosophy](/2016/07/microservices-philosophy/). A mental model through which you create a coherent design expressing the principles and properties you want.
  * About **events**. Events are part of your data model, and so an Event Architecture is a **Data Architecture**.

An event architecture is not :-

  * A prescriptive design style
  * A set of technologies to use.
  * A single prescribed interaction model between services

Essentially, the phrase Event Architecture is a simple descriptive, meaning “our services communicate using events”. To come up with what _Your Event Architecture_ (YEA?) will be, you need to dig more deeply into what you need your system to do both functionally and non-functionally. Defining these will help you to select what style of event architecture you should use, and what technologies you should use to implement it.

Both Functional and Non Functional requirements will need to be brought into discussion when selecting your preferred model from the list below. Non functional aspects are the major driver when selecting the technologies to use to implement the architecture you have chosen to support your features and programming model you want to build them with.

I’m going to assume that you are building some sort of distributed system, a la Microservices, and have considered using events. If you aren’t building a distributed system, much of this won’t apply to you, as networks cause a lot of the issues event architectures can be used to protect you against. No network, less problems.

## What’s an event?

Events are a piece of system state. Broadly, most would agree that an event is :-

  * Something that happened in the past
  * A timestamp when it happened
  * Has a payload describing what happened
  * Is immutable, as the past can’t be changed
  * Is a **broadcast** to all listeners

The fact that an event is a broadcast about the past is, to my mind, the most important aspect. It changes the communication from an imperative “go and do X” to a declarative “Y happened”. This shift in semantics means that your various remote components can start to make very different assumptions about the data than in an RPC style model.

This is the starting point for building an event system.

This is also where many tutorials on event systems seem to **stop**. It not actually very helpful though, is it?

There are a variety of different things to consider in what to do next in actually implementing a successful event system.

We will consider

  * how you move the events around
  * what consistency guarantees you give around your events
  * what you use your events for
  * how you communicate with the outside world when your internal world is event based

## More structured events – SEDA

The reason, I believe, that many will not discuss how you use your events is that they have already internalised a particular style of event architecture, the Staged Event Driven Architecture – SEDA.

This model is very well established, and essentially describes a workflow process with messages flowing between each link in the workflow. Each component emits a “XCompleted” style event when it has finished processing, and so the process continues. This is most commonly used in concert with a message bus to transport the messages.

This is a simple model, and one that is easily grasped. It does though have some issues in implementation that you will suffer from when using events to build larger portions of your system, especially when networked.

I was recently working with a client to identify the issues they were having in their DDD/ Microservices implementation. They had implemented this precise model, and it was hurting them terribly. The issue with this model is one of _data consistency_. Specifically, since you are trading data, in the form of events, each side of the queue is responsible for creating its own consistent view of that data to be able to perform processing on it.

That processing may be transaction (a DDD Aggregate Root) or query based (The Q in CQRS), however at this level, the principle is the same, and the data on both sides must be the same. Some questions arise

  * If a message/ event goes missing in the message bus, how can you recover it?
  * If your downstream component “the view” becomes out of sync with the producer of events, how can you recover that consistency?

Ideally, in your mind, you are aiming for an **eventually consistent** model when building a SEDA architecture. Depending on how far along the workflow is, you may not see the same results at the last component as you would at the start. This is fine, we know how to handle eventually consistency when building systems, and often I would argue that eventually consistent systems are easier to build and can gain some very impressive non functional benefits.

The issue that arises from those questions though is one that I described to my client as their system having **“hopeful consistency”**. If everything works as hoped, the system remains consistent. If it doesn’t you are, to use a britishism, stuffed.

You are in the world of _manual recovery_ of consistent system state. The total worst case for a live distributed system to not only be able to put itself into, but likely to put itself into.

As such, I can’t recommend this architecture and would go as far as to warn you away from it in strong terms. You can identify this style by seeing _ephemeral events_ being used. This is independent of the transport technology used (Kafka, Rabbit etc don’t affect this property _per se_). The other aspect is seeing event interchange as a natural queue structure between exactly two components. Events are a broadcast mechanism, and should always be implemented in a way for this to be taken advantage of.

## Stream processing of events for query – The Q in Command Query Responsibility Segregation

CQRS is an interesting premise, that your transactional and query data models often have different requirements on them. Its one that I have a great deal of support and anecdotal evidence for.

In the system above, a service is receiving event updates (via SEDA or not!) and updating its internal model based on that.

The key thing here is that it in the transactional model each entity/ aggregate root (in DDD terms) will be generating events. All of the events across a particular entity will need to be combined into a single stream of events for the view to be able to consume them effectively. For example, when building a view of users, you should expect to be able to consume a “users” stream containing events about all instances of `User`.

## View with History – “The Kafka Model”

There still remains the problem with “ _**hopeful consistency**_ “. I can’t emphasise enough how much this can hurt you. If you take away anything from this article, **ephemeral events are your enemy**. Things go missing, even when you use Kafka (although their marketing is doing a good job of convincing the internet otherwise). If you don’t have a way of rebuilding a consistent state in an event based system, you’ll end up building systems that create islands of consistency that trade data via RPC calls. What I refer to as entity oriented microservices. This is sad, because RPC truly sucks.

So, the solution to this is to give your downstream services some way to rebuild consistency after the fact. In the face of some catastrophe (or even just an upgrade), they can destroy and rebuild their internal data models from the upstream service.

The best solution is to rely on the fact that **events are data**. Good data is durable data. So, the solution is to **persist your streams of events**.

With that in place, you can, at will, load and replay the stream of events from som arbitrary point and then play through those events in the same way as you would have originally. Your component _should_ not need to be aware of a replay happening.

This gives a set of nice benefits in addition to the ones above.

  * You get a truly eventually consistent system. Hopeful no longer!
  * You can maintain multiple views on the same stream, including multiple versions of the _same view_.
  * You gain an extra recovery mode. If your view data store corrupts, you can either restore from a backup, as now, or you can perform a full event replay and gain the same end state.

This model of persisted event streams being consumed by views is very often referred to as _Event Sourcing_. As a term, I feel this is overload by that usage. What we are discussing in terms of views is an application of _stream processing_. It is taking an unbounded stream of data describing an unbounded number of entities and generating some data structure about them. This is great if you want to process data about a set of entities. If you want to process data about a _single entity_ , its the wrong solution. Since Event Sourcing (below) is also used for that usage, I recommend using the term “stream processing”. Some use the term link: [Kappa Architecture](http://milinda.pathirage.org/kappa-architecture.com/) when discussing much the same thing. I find that too attached to Kafka, although I’m coming around to the usage.

This is one architecture where Kafka has come to the fore in the past couple of years. Its utility in implementing this portion of an event architecture has been noted to the point that I have heard many refer to it as the “Kafka Model”. Its natural model is that all data in its queues is persistent with some TTL applied. In this it is not just happy with queues containing lots of messages, it almost requires it. This puts it in opposition to, say, RabbitMQ, which very much appreciates you keeping the queues fairly empty.

In this model, in Kafka, you see a message persisted into a queue as an event. Your Kafka client can then track through the queue, reading the messages in order and that is your event replay mechanism. With the suitable adjustment to the TTL value (ie, aiming for _forever_) it works pretty well, although I recommend wrapping it up in a higher level API.

## Handling transactional systems – Event Sourced Aggregate Roots

This is what I would refer to a true event sourcing. I may be disagreed with.

In DDD, an Aggregate Root is a consistent boundary around a set of system entities. They should be able to be loaded from persistence as a unit and save as one. Within their boundary you accept system commands, imperative operations, then perform some logic, changing the internal state, and often emit some form of “domain event”. A description of what has happened. The rest of the system can then react to those events, much as our views do in the above sections.

Thats a useful thing in and of itself. The logical leap made with Event Sourcing (by Greg Young, credited as the originator of the term), is that the persistence of the aggregate root should only be in the form of those domain events. When you load an event sourced AR you actually load the stream of events that have happened to it, then replay them into the AR objects. This replaying recreates the state of the AR as it was when the system last accessed it.

This has a set of benefits

  * you can upgrade the way the internal state is held without affecting the persistence.
  * your events (consumed by other components) are a natural part of you dev process, not tacked onto the end.

It also has a set of drawbacks

  * Latency. There is an overhead of loading a potentially unbounded stream of events and replaying them to form the finished AR
  * Mutating state via events, not directly. When building an AR, an operation should generate an event, which is then reacted to by the AR to mutate the state. This can feel a little clunky.

Overall, I like this model, as it gives you a rich set of events to play with. One thing that is extremely important to note is that the persisted streams of events that your aggregate roots live in are not the same streams as your views will read from. An aggregate root should be persisted into its own, totally unique, stream. Nothing else should be writing to that stream, or reading from that stream, apart from the logic to load, process and save that particular instance of an aggregate root.

Depending on your implementing technologies/ APIs, you may have to duplicate events in order to put them onto 2 or more streams (ie, the AR stream, plus the combined AR/ deep component streams).

This is a portion of the model often missed, especially when first approaching an event architecture that involves event sourcing.

[My solution is, as above, just use the term “event sourcing” to refer to loading a single aggregate root. For the replay of deep, combined streams, use some other term.](/coding/replay-your-event-streams-for-fun-and-profit/)

# Picking technologies to implement this

Once you have picked your ideal event architecture from the above possibilities, you can begin to construct a set of implementing technologies that give you the required functionality and non functional characteristics.

You will almost certainly need

  * Something to transport your events around. A message broker is commonly use, although it is not absolutely required.
  * Somewhere to persist your events
  * Some app level structure to manage the DDD patterns

So long as they can implement that core functionality, you really need to look at the non functional aspects of it. For example, latency on transport, replay. How much data can be persisted and how easy is it to replay your streams. Imagine you have an important stream of data that is used in many places. It contains 20 million events at the moment, and a new view has been stood up. How long will it take to perform the full replay to bring it up to date, and will it affect the other components relying on event distribution?

## Summary

I find Event Architectures to be an enthralling topic, and in many ways delightful to build. They are, as all things are, not a silver bullet, and require thought to get right.

> We just pulled some stuff together and now it all works great
> 
> Said no-one ever

An event architecture is a different view of the world than perhaps you’re used to. It puts different pressure on your mental models than RPCish systems do, and they operate differently at the data level. This gives you a lot of potential benefits when implementing distributed systems. You can define “good enough consistency” and have that be a useful thing for you. You can build a read model that will utterly crush anything RPC based. There are many more.

The downside is that different world view. You must think in terms of data, and flows of data, not inter service interactions. The more you can frame your questions as “what data do I need and how can it get here” rather than “what API do I call” the greater success you will have with using event architectures.

If you’d like more in depth info on how to build this kind of system, I can happily help you build one, or at least advise you on the best way to go – [contact me](/me/)

[architecture](https://daviddawson.me/tag/architecture/)[blog](https://daviddawson.me/tag/blog/)[ddd](https://daviddawson.me/tag/ddd/)[events](https://daviddawson.me/tag/events/)[evergreen](https://daviddawson.me/tag/evergreen/)[muon](https://daviddawson.me/tag/muon/)[tech](https://daviddawson.me/tag/tech/)[technology](https://daviddawson.me/tag/technology/)
