---
title: "Building Reactive Microservices using Muon and scaling them using Kafka, Cassandra and friends"
date: 2017-09-01T20:32:36+01:00
draft: false
categories: ["Coding"]
tags: ["blog", "ddd", "events", "muon", "tech"]
description: "**TL/DR**"
slug: "building-reactive-microservices-using-muon-and-scaling-them-using-kafka-cassandra-and-friends"
aliases:
  - "/coding/building-reactive-microservices-using-muon-and-scaling-them-using-kafka-cassandra-and-friends/"
  - "/building-reactive-microservices-using-muon-and-scaling-them-using-kafka-cassandra-and-friends/"
---

**TL/DR**

  * Microservices == distributed systems. RPC is well known for creating fragility in systems, Muon offers a way of building others kinds of APIs, based on Reactive principles while keeping your existing internal frameworks, languages and runtimes.
  * Muon gives you very portable, polyglot message based APIs, across infrastructures. This lets you focus on the functionality you need for your business, rather than adopting a vendor best practice and becoming locked in.
  * It is based on CSP, and is focused squarely on communication as a way of expressing interaction about state. This lets you build highly distributed systems without falling into the traps of
  * This approach is implemented as Muon “protocols”, message based apis and defined interactions between services that implement well known communication and data architecture patterns. This lets you explicitly use particular architectures, such as event sourcing or SEDA, and know that it is correct, works well and is portable across languages, runtimes, frameworks and communication technologies (gRPC, Kafka, AMQP etc)
  * It allows you to adopt advanced technologies as a tactical decision later on in your project, without impact on your codebase. This includes tech such as Kafka, Hazelcast and Cassandra, knowing that as you need to scale your system, you can.

* * *

I have been a big fan of the Reactive approach to build software for as long as its been around. My view on the world of Microservices today is that there are several strands you need to weave together to make your software thrive.

  * “Microservices” itself – By saying “we want to build Microservices”, most people I’ve talked to are actually saying “we want to be able to adapt more quickly, and use cloud resources well”. Given that Microservices is more of a philosophical position than anything else, its a set of motivations (tied into the idea of distributed systems) rather than the design approach you will use.
  * Domain Driven Design. DDD is a design style, one that lets you build complex transactional systems that can handle distribution. This is where you will design and build your **functional requirements**.
  * [Reactive Systems](http://www.reactivemanifesto.org/) are a set of architectural principles that will inform how you implement your functionality, but won’t help in actually delivering it. The core principles of Responsive, Resilient, Elastic and Message Driven give you no approaches for functional design that you can usefully apply. Instead, Reactive gives you a set of approaches for ensuring your Microservice system will meet its **non-functional requirements**.

The three together make a powerful combined approach. How to start?

This is where I was several years ago, how can you go about building something that meets the above list?

After researching, prototyping, learning from deployed systems, gathering feedback and rebuilding I have what I believe to be a good solution and approach to building Microservice style systems that meet the above.

## The road to Muon

I have written and spoken about a group of projects, Muon, at length before. What I’d like to do in this article is to dig into the programming model that the projects are implementing, explain the rationale for that and then show the fairly extensive benefits that gives you.

My vision from the start of the project has been giving the ability to decompose and recompose systems as needed, move pieces around, replace and repurpose code as desired. All of this should be without compromising the richness of interaction you have within a monolithic system. When you have a monolith, you have a huge variety of options for interaction models, why should we compromise those for Microservices? I’ve always been highly dubious of the rush to http that has happened (unless you sell API tooling, eh?). The main reason is that, while it is a commonish API format, it is _semantically crippled_ compared to the system you are decomposing. Can the variations of .NET, JVM or whatever APIs be represented in HTTP? They cannot.

The focus on **the API** though, that is certainly very real. It is the enabler of a good microservices approach, by giving an impermeable barrier that allows you to vary the implementation of on either side without being overley concerned with the other. The nature of that API though, thats what interested me, and so for Muon I wanted to be able to provide APIs that weren’t simply HTTP/ RPCish (pipe down REST zealots!). I wanted to go much, much further than that.

We experimented a lot, almost totally with differing forms of messaging. We tried workflow patterns, SEDA, we wrote our own message broker, dove deep into event patterns, built our own PaaS, other fun things. In all we went through 7 major iterations of the ideas, refining them to bring us to what we now have, the thing I refer to as the **_Muon Model_**.

## The Muon Model

The focus of Muon is on the communication space. The gap between services where you need to integrate them together in order to be valuable. In that space I want to provide the ability to bring the services together with arbitrarily complex interactions, with the base communication being mediated by messaging.

This core concept of defining the interactions, the classes of APIs of services we refer to as a **_Protocol Stack_**. There are a variety of them, covering RPC, Reactive Streams, Events, Broadcast, SEDA, to name the major ones currently implemented.

The second motivation, beyond richness of the API is to enable you to change, improve, your **non functional** behaviour based on the technologies you adopt. For example, if you want to improve transactional processing in the JVM you will often bring in a data grid, such as Hazelcast or Geode/ Gemfire (/others). The downside is that you need to rebuild your application to make use of that grid, using its APIs. Imagine if, for the most part, you didn’t have to? By using the Muon API stacks to handle a certain type of problem, you don’t need to, as I’ll describe in detail below.

The Reactive Manifesto was written by a set of intelligent individuals. You will note that a few of them have had a lot of involvement in Actor based systems (Akka etc). This is not by chance, The Actor model is, at its core, message based. The main focus of Actors is on managing state effectively and making it easier to understand by giving support to the developer on managing highly concurrent, communicating systems. It does this by, for the most part, turning it in a set of problems that can be dealt with in code in serial, not in parallel. That’s a very useful technique and model. This isn’t Muon.

A model somewhat related to Actors is Communicating Sequential Processes (CSP). This model is related in that it is also focused on messages, and sending messages between components. The big difference between the two is on where you send messages to. In Actors, you send messages to an _actor_ , in CSP, you send messages to the _channel_. This is, crudely, the way Muon works. It implements a restricted subset of CSP.

If you dig into any of the Muon protocol stacks, you will quickly see code requesting channels to remote services, adding transform channels, channels to manage failure. It is a system to enable you to build channels between service instances.

On top of those channels, you put the messaging protocols that implement the APIs. This could be very simple (eg RPC, 3 message types), to more involved (Reactive Streams, ~10 message types) to the very complex (FIPA protocols, several dozen message types). Since the protocol is addressing a channel, the actual location of the service is fully transparent. So long as a channel exists that can move messages back and forth, the service can be anywhere at all.

This is the core of the Muon approach. Each stack provides useful APIs that, underneath, give you a messaging interface you can use.

The simplest way to use this is to fire up a Muon service in its default config, if you follow the examples you will end up with a service connected to an AMQP broker with a few APIs you can interact with. Adding new classes of API is as easy as adding a new stack, and can be done in a few minutes.

The real win though is what relying on these APIs will do to you system and its future evolution. I will use the Event stack (as the most popular stack) as an example of what will happen if you use it.

## A message API: Persisted Event Streams

You can, as many have told me, build an event based system using arbitrary message brokers. This is certainly true. You will likely though be either building a SEDA system (and so have compromised visibility of failure) or be using ephemeral events (and so have a system that has the consistency property of “hopeful”) or most likely, a combination of these approaches. I wrote the event stack to give form to what I consider to tbe the best event architecture, **persisted streams of events**. To learn more about the topic, I jotted down a set of thoughts on event systems → [read here](/2017/07/styles-of-event-architecture/)

Persisted event streams have a lot of benefits, which I won’t dwell on here. The Event Stack in Muon defines an API that allows your application to move up a level from simple message brokers and cold event stores and gain access to the following operations

  * Emit an event. This will be persisted into the given stream
  * Cold replay a stream. This will take all the events persisted into the stream and replay them back to you in order
  * Cold replay a stream from X. Same, but from a given known point in the stream.
  * Cold/Hot replay (+ from X). Same as cold, then stay subscribed to any new events that come in after you started replaying
  * Hot only. Ignore the history, play only new events.

For me, this is an event store worthy of the name. If it can’t do all of these things, its incomplete. The important thing to understand here is that I’m describing the point of view of the **client** , the API that your application will talk to. I haven’t mentioned an event store _server_. The reason is that I don’t really care much about what the implementation is, that is into the realm of non-functional upgrades, so long as the API above can be met. I take a system view. I honestly don’t care what your server/ service does internally, I only want to know what I can communicate with it about.

Now, you could implement the event API above on top of Kafka, or GetEventStore, or some other store+message bus. What if you wanted to store your transactional streams (eg, DDD style event sourced aggregate roots) in a data grid, and some of your streams in Kafka (aggregated streams for stream processing)? You’d need to put logic in to your application code to manage that.

This is all possible for you, but I’d like you to consider that what you’ve just done is to build a version of the already existing Muon event stack, while remaining tied to your underlying implementing technology and language.

The heavy focus in Muon on API and communication. If you implement the event api that the event stack describes, on any technology that you care to, and know that your applicaiton will continue to run. It will have different runtime characteristics and non functional performance, but it will, at least _function_.

## Transports and location

An interesting thing happened when we implemented this model and needed to test various things. We have a strong transport abstraction, one that is easy to replace with an in memory implementation. Perfect for testing. The serendipitous thing though is that Muon libraries support more than one transport at a time, and so can be easily attached to remote and local instances, while maintaing the same APIs.

The result of this is that you could implement the Event Store api above and have it run standalone, accessible over say, RabbitMQ (like Photonlite and PhotonClojure are) or gRPC and that would work well. You could also implement the event store API on top of Kafka and have it run in process. This aspect is something we’re building heavily on at the moment.

## Example: Building an event architecture, then scaling it over time

Continuing with the Event stack as our example. It is straightforward to take the [Muon Starter](http://github.com/muoncore/muon-starter) project, follow the instructions and come up with a simple event based system within a few minutes. If you are using Java/ Spring, your could use the Newton app framework (see below) to make a more complex system quickly following DDD patterns, and have it based on that same event stack.

The technology used there is

  * AMQP for network transport and discovery
  * Photonlite implementing the eventstore API, persisting to H2 or MongoDB.

This will scale up a reasonable amount, and is a good and easy environment for development. What happens when you get popular and start getting lots of traffic in your system? You scale it up!

The main scaling problems you will find in a system like this will be

  * Cost of event sourcing for aggregate roots. This is a cold replay of a stream. Often the stream can include many events, and loading them all to roll up into the current state can be expensive.
  * HA and latency of your messaging infrastructure.
  * Persistent space

An obvious technology to adopt now is Kafka. However you actually can use Kafka for two different things in a Muon system. Firstly, its a message broker, so you can use it as a Muon transport. Secondly, it has the interesting property of persisting its queues, and not really having the concept of “keep your queues empty” like RabbitMQ does. This means that you can build an event store on top of Kafka. You don’t though, want to have this accessible remotely, you need to access the API in process. To make this work, we include the Muon Kafka extension that uses Kafka as a transport, and also registers a Kafka implemention of the event store API that runs in process as a second Muon instance, only accessible in memory. Your application code can’t see any difference between the implementations, all the message communication is the same, just over a memory transport instead of AMQP.

Your HA, throughput, latency and ability to scale your runtime processes goes way up by doing this.

Your system gets more load, and you need to speed up your transactional processing. Now your decision to use Event Sourcing seems …​ unfortunate. Loading a hundred events each time for a single object is becoming a performance bottleneck, and you need a solution. This is the point at which many development teams will begin to investigate data grids. These allow transactional processing to happen purely in memory, if done right, it is local memory too.

There are two things Muon can offer here. Firstly, the Newton app framework has snapshot support, and so you can load snapshots of the current state of an entity from the grid, rather than do a full event stream replay. Secondly, you can allocate certain streams to be loaded and saved from the grid instead of Kafka. The key here is that data written to the grid should also be pushed into Kafka. THe nature of the streams is important, as they are used very differently than deep aggregated streams. By using the data grid for transactional streams, background loading into Kafka, and then Kafka directly for deep streams, you can get a huge performance increase again in your transactional processing.

Your system scales again, everything holds up, but you start to see that your system is going to need an event store with different patterns of data access. Kafka is great for certain access patterns, where you know the location, but if you need to query for that position, it becomes sub optimal when compared to database technologies. If you wanted to selectively replay different portions of the stream, start to implement correlation between streams (inferred causality between This will need a dedicated data store that can hold lots of data. There are a variety out there, but I have been requested Cassandra most often, and so that is what we will choose to use. You want it to be available. To properly integrate this into a data architecture based on event streams, you have to take advantage of one of the primary properties of the data structure, which is that it has a _direction of travel_. This means that it will

* * *

## Event Causality

An interesting aspect of event architectures is _causality_. That is, an event was `caused-by` another. The Muon Event stack has had this concept implemented from the start, with the expectation that you could analyse event streams and re-construct the relationships between the constituent events after the fact.

This technique gives you

  * A powerful debug tool, you can take events and track
  * An interesting approach to enhacing “classical” (ie, data oriented) TDD for event based code. Test some event oriented code, run your test, check the event store for relationships.
  * The ability to check workflows. Business logic is interesting in that it in invariably a form of state machine, mostly commonly poorly specified. Event orientation is an excellent technique for implementing state machines. What you can see in a event causality analysis is a particular business process moving through its constituent states. By taking the events that cause that, you can check to see that workflows are completing correctly, how often error classes appear etc.

* * *

## Honourable Mention: Newton

Communication, in the way Muon models and implements it, can only so far. Eventually you need to manage internal state of your services. DDD gives a nice approach for doing that, and you’ll find that many have noticed the similarity in concepts between DDD and Actors. There’s even a well known book by Vaugh Vernon on implementing DDD using Akka.

You could hook up Muon communication mechanisms to Actor systems and have good success. My clients though tend to be in the mainstream, which in the Java world currently means Spring, and more specifically Spring Boot. For that reason I was funded to develop an applicaition framework on top of Muon (JVM) that takes the event stack and deeply integrates it into a Spring Boot application. This framework is called Newton, I’ll be publishing an introductory blog post for it within the next week or so.

## The road ahead

Some of what I mention here is not in the current open source release of the Muon projects. Some will land within the next few months (such as Newton snapshotting), others are being defined and in beta with clients and will form commercial additions to the Muon projects. In all cases though, all Muon functionality is intended to be available in the open source release, the only commercial aspects we are planning are non functional in nature.

[blog](https://daviddawson.me/tag/blog/)[ddd](https://daviddawson.me/tag/ddd/)[events](https://daviddawson.me/tag/events/)[muon](https://daviddawson.me/tag/muon/)[tech](https://daviddawson.me/tag/tech/)
