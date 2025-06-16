---
title: "Introducing Muon"
date: 2017-09-01T20:50:13+01:00
draft: false
categories: ["Coding"]
tags: []
description: "This article introduces a project I’ve been working on for the past few years in one form or another. Muon"
slug: "introducing-muon"
aliases:
  - "/coding/introducing-muon/"
---

This article introduces a project I’ve been working on for the past few years in one form or another. Muon

For the past bunch of years, I’ve been working with distributed systems, often with a messaging component. This is a fun and rewarding part of software development, up there with UI development. It’s fairly involved, and often hard, but covers lots of different areas, both deeply theoretical and very practical. Once you solve an issue involving a race condition that requires networks, heavy load and specific hardware to trigger, you become far more interested in the world of concurrency, networking and spreading beyond the regular languages you are used to!

Over the past 5 years or so, these systems I have been involved with have been recognisably what are now called Microservice systems. The only difference I see between them is the underlying [motivations and philosophy](http://daviddawson.me/microservices/2016/07/20/microservices-philosophy.html)

As I’ve built these systems, large, small, high performance, low performance and so on. I’ve noticed a set of things that keep on coming up. Not quite common problems, but common complaints perhaps. My current bug bears in the Microservices world are the **abuse of http** for local communication and the discarding of **polyglot**

HTTP is a lovely protocol, easy to grasp, easy to use. It is at the same time, too flexible and semantically weak to be the one and only protocol for use in a Microservice system. It is too flexible, as some of the most important things are left unspecified, for example versioning/ upgrades, schemas, conversational state management. It is semantically weak in that it can do request→response, and nothing more.

I don’t wish to criticise HTTP as a protocol, only to say that it isn’t good enough to be the only basis for a distributed system to communicate with. Every microservice system that I’ve seen beyond the trivial uses messaging of some sort, either replacing HTTP fully, or relegating HTTP to queries. The aim is to get rid of HTTP in order to get rid of what is being **done with HTTP** , which is building deep RPC style dependency webs. Which are awful.

The polyglot nature of Microservices is now under threat. Pretty much every Microservice framework is language locked, and seems to be happy to remain that way. I don’t like this state of affairs, I code in several languages at once, and I see benefits in doing this. Others may disagree, but if you buy into one of the current frameworks around, you are locked to a runtime by the investment in that framework, even if you’ve Swaggerred up. less so than a monolith, yes, but locked in all the same.

A couple of years ago, I started a research project into the communication aspects of Microservices and how that can be made more effective.

This project was called Muon, and I’ve talked about it a couple of times since. Showing where the research has gotten up to. I then worked with a research time at Sky, CIS Tech Futures, ably led by Gawain Hammond. THat team has recently been dissolved, but in the 2 years we researched and built together, we did some fascinating things.

This post is to introduce the Muon projects and give a taster to what they promise.

## What does it let me do?

Muon lets you build and then attach services together very quickly, allows them to communicate in a variety of ways that we call `Protocols`. We have a set of re-usable microservices that help you do certain things out of the box, and none of this cares about your infrastructure. You can choose Kubernetes, Mesos and AWS, or all at the same time and Muon services will run happily.

It gives you support in all the right places, works with your infrastructure of choice, and gets out of the way of you writing code that **makes you money** (or whatever your motivation is!).

For example, here’s a simple Java service, exposing a simple request/ response protocol (ie, what is used for _RPC_)
    
    
    **public** **static** void main(String[] args) **throws** Exception {
    
        AutoConfiguration config = MuonConfigBuilder.withServiceIdentifier("rpc-test").build();
    
        Muon muon = MuonBuilder.withConfig(config).build();
    
        muon.getDiscovery().blockUntilReady();
    
        muon.handleRequest(path("/"), wrapper -> {
          wrapper.ok("Hello World");
        });
    }

Apart from the build file, this is it.

Here’s a JavaScript service that consumes it
    
    
    **var** muoncore = require('muon-core')
    
    **var** amqpurl = "amqp://muon:microservices@localhost"
    muon = muoncore.create("nodejs-client", amqpurl)
    
    muon.request('rpc://rpc-test/ping', "i love dogs").then(**function** (event) {
        logger.warn("response received! event=" + JSON.stringify(event))
    }, **function** (err) {
        logger.error("error received!!!!!")
    })

Again, you’ll need a package.json/ NPM setup, but nothing else.

Quick, right?

What just happened there is that we defined an endpoint in the Request/Response **_messaging protocol_**. When you call `muon.request`, the remote service is discovered, a method of network communication is chosen (in this case AMQP), a connection is made to the remote, a message representing the request is sent and packaged into something to be sent across the AMQP broker (in this case). The server side receives it, unpacks it into a Request and gives the ability to respond to the message via the `requestWrapper.ok` method. This gives good threading behaviour as in all cases, conversation state is bound up to the logical Muon channel, not to any particular thread.

Although Muon lets you build Microservices, as you just saw a very simple example of, it does much more than that. We researched into the nature of **_distributed communication_** , and how we might tackle it in a generalised form. Muon is about distributed communication and making this as easy to use, reason about and importantly, **extend** , as local method calls.

At its core, Muon implements a few fairly simple concepts, that all communication can be reduced to messages over bidirectional channels between services. Once you have the ability to find remote services and open a `bichannel` to that service, arbitrarily complex message protocols can be written that make use of this.

Making this easy to use and extend is where we’ve spent our time, but all aspects of Muon implement this core idea. Communicating Sequential Processes – CSP

Muon is implemented using a form of CSP. It uses the core concept of the `channel` to attach logic together. Logic code sees only the channels it is connected to, not the agents or processes at the other end of the channel.

In Muon, the CSP model is both simplified, and extended. It is simplified in that much of the advanced process algebra isn’t present, only channel→process→channel with async dispatching and limited other special cases. It is extended in that all channels in Muon are fully bidirectional, to make that explicit we often refer to them as a `bichannel`.

This model allows us to create channels that compress, encrypt and cross a network, where the Protocol code we actually care about is kept insulated.

## Protocols – Codifying interactions between microservices

The concept of a message **Protocol** is core to Muon. It describes the ability to define interactions that are far richer than HTTP could be, coordinating multiple services, handling errors, being efficient in directing and orchestrating remote services, giving the ability to maintain long running conversations across the system.

All the while, with the hard Protocol/ BiChannel split, these are easily testable away from your transport implementations.

### Protocol Example: Reactive Streams

To take an example of something commonly required when using networked data, streaming. Currently the JVM world has standardised on the [Reactive Streams](http://daviddawson.me/blog/2017/02/21/www.reactive-streams.org) specification as the gold standard for streaming interoperability within the JVM. This has been adopted into Java 9, and so can be relied on to have broad support.

Wouldn’t it be useful to have access to this standard **_outside_** of the JVM?

The RS specification describes a set of signals being sent back and forth between a `Publisher` and a `Subscriber`. These are method calls, however in Muon, we can model these signals as messages sent between two services along their connecting `bichannel`.

This is in fact what we have as one of the Muon protocols, an implementation of Reactive Streams at the network level, so you can discover and subscribe to networked `Publishers`.

This means we can network reactive streams implementations very easily, and support this across different languages and runtimes, so long as they have the Muon Reactive Streams protocol implemented. If you have a Java RS `Publisher`, Muon can let you subscribe to that directly from a Nodejs service, or another language, event directly from a browser, including all the native back pressure signals, via the Muon.js browser implementation.

Of course, this is just one protocol that we can implement. There are others, and soon there will be many others, all cross platform and able to be formally verified.

### Protocol Example: Introspection

This idea of defining messaging protocols as the basis of Muon had some interesting effects. Since we are specifying the interface as a rich, message protocol, including interaction and message content (both the structure/ schema and also semantically), we decided that we could have each Muon library implement an **_Introspection_** protocol. This is the ability to ask a running service what it can do.

This means that we can use the Muon cli, for example, to do this :
    
    
    muon introspect remote-service

It will then show what the service can do, across all of the implemented protocols.

This fairly rich introspection information allows you, and running services, to understand the environment they are running in and begin to intelligently interact with it. It allows them to run **autonomously**.

It also let us implement advanced tab completion on the CLI. So you can, for example, tab complete service names and streams provided by a service
    
    
    > muon stream <TAB>
    photon my-remote-service aether ather-password random-service
    
    > muon stream my-remote-service <TAB>
    /stream1 /stream2 /mystream

The same can be done for event source replay streams, RPC and is fairly easy to add for your own Protocols 9and will become even easier!)

## Building a business protocol of your own

Both Introspection and Reactive Stream are both technically oriented messaging protocols. They are defined to support the technical capability that is needed.

Of particular interest to many is the ability to design and build **business oriented** protocols. Where messages that have semantics at the level of the business are being specified, and a distributed set of Muon agents can coordinate with each other in business terms.

This is currently possible with Muon, however there is more to do in this area. The problem we foresee is something we’re calling the “Matrix Effect” (not that Matrix, Neo!). We are supporting many languages, and we want to support many protocols. Done naively, these will multiply together as you implement each protocol in each language and lead to fragmentation of the nascent Muon world.

We are avoiding this with two major initiatives. We are handling the language runtime problem by implementing Muon natively, in C++ and providing language bindings for the majority of langauges, alonside our Java and JavaScript implementations.

The protocol question is something we have spent the last year researching, and we are well on the way to building a portable **Protocol Language**. This will provide the ability to define Muon protocols, whether purely technical, or more likely, business oriented, in a declarative language that is converted into a Buchi Automaton managing the internal protocol finite state machine.

Together, these will mean that you can write a protocol once, test it once and then quickly interate and use it in the languages that you want to.

## Technology

Muon is a broad set of projects, but also fairly simple. There are a set of implementation of Muon available now, covering Java, Clojure and Nodejs. These are all roughly feature equivalent and compatible with each other. A C++ version is being developed, which will enable very broad language support via language bindings.

Alongside these, there are a set of prebuilt Muon microservices that implement commonly required features. The most advanced of these is Photon, an event store with event projection support that provides the backing for the Muon `event` protocols.

You can see these as a platform of sorts, or as a set of tools you pull together to build your own services and use the ones we’ve made.

There are a set of plugins that are being developed to extend the Muon libraries to support working with your existing technologies. These cover **service discovery** , **network transport** and **protocols**.

![Muon Architecture](/images/muon-architecture.png)

Figure 1. Muon architecture, showing a Reactive Stream Client connecting to a remote Reactive Stream server

### Transports

A Muon transport takes the core channel concept of Muon and puts it across a network. This can take many forms, depending on the use case and surrounding technology stack. So long as the transport can expose the ability to connect to another service and exchange messages with it bidirectionally, it fits the Muon model.

The best supported transport at the moment is AMQP, this is the one used in all the documentation.

We are experimenting with supporting transports across Muon implementations by writing them in C++, wrapping them and importing into the various Muon libraries. This is being done on a Websocket based transport at <http://github.com/muoncore/transport-websocket>

### Discovery

Service Discovery is a core need of Microservice systems. In Muon we have a discovery concept built in that enables you to find services, understand how to connect to them (ie, the _transport_ to use) along with some hints on the capabilities of the remote system.

Currently available are **AMQP** and **Multicast**. Many others could be supported, covering services such as Consul and Etc, DNS or Netflix Eureka. Similarly to Transport, we are experimenting with a build once and integrate approach in concert with the native libMuon effort.

### Protocols

Enabling users to define their own protocols and allow them to be used cross platform is one of the key aims of the Muon project. This is requiring fairly advanced work to design and developing the Protocol Language that supports verification, is reactive in nature and can run across the Muon implementations.

This work is well underway, we have developed running protocols using it already and we hope to have something fully integrated into Muon to show within the next month or two that will enable you to define a messaging protocol in a simple, clean, declarative way that will support debugging, easy testing and enable a huge leap forward.

## Coming up soon

I’m going to be writing a series of developer diaries on the project, highlighting different areas and the progress that is being made. Subscribe to the RSS feed or follow me on Twitter for updates.

Muon focuses hard on the nature of distributed communication, this leads to some interesting places, which I’ll be writing about in their own right.

  * State management, CQRS, DDD and stream processing and how they interelate. This will introduce the Muon project event store, [Photon.](http://muoncore.io/submodules/photon/docs/index.html)
  * Protocols, how to define them and the upcoming Protocol Language
  * Creating Transports and Discovery implementations for Muon
  * Handling failures
  * Optimising messaging performance in various ways.

## Getting Started

The best place to get started is to visit the [Getting Involved](http://muoncore.io/guide/getting-involved.html) page.

If you are interested in Muon and would like to help the project then it is open to being sponsored by friendly organisations supplying time. The more time the core contributors dedicate to the project the faster it will move. [Get in touch](http://daviddawson.me/me.html) for more info on sponsoring.

I hope to see you there!

[architecture](https://daviddawson.me/tag/architecture/)[ddd](https://daviddawson.me/tag/ddd/)[events](https://daviddawson.me/tag/events/)[muon](https://daviddawson.me/tag/muon/)[technology](https://daviddawson.me/tag/technology/)
