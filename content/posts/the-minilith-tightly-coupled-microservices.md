---
title: "The Minilith – Tightly Coupled Microservices"
date: 2016-08-01T00:00:00+00:00
draft: false
categories: ["Design", "Philosophy"]
tags: ["architecture", "best-practices", "ddd", "dry", "events", "microservices", "technology"]
description: "Exploring the concept of tightly coupled microservices that deploy as a logical unit"
slug: "the-minilith-tightly-coupled-microservices"
aliases:
  - "/philosophy/the-minilith-tightly-coupled-microservices/"
  - "/the-minilith-tightly-coupled-microservices/"
  - "/blog/2016/03/11/the-minilith-tightly-coupled-microservices.html"
---

Without a doubt, Microservices as an architecture has grasped the imagination of modern development like no other.

We've found that, contrary to what many will tell you, it defies tight definition. Specifying how microservices should interact with each other, how they should store and master data, and how they should be deployed is great for a conference talk, but the style has been adopted too broadly now to be prescriptively tied down by anyone. Opinions abound, and yet you will find **no** consensus in what microservices actually are beyond the use of some form of effective isolation, usually network based.

This lack of definition is in many ways good. In fact what it allows is the creation of many definitions, all of them good for different purposes and different reasons.

The Agile wars seem to be coming to an end, I truly hope we won't now have the Microservices wars, another strain of dogma would frankly be upsetting.

With that in mind, I sat down to read about and then watch a recent [talk by Ben Christensen](http://www.infoq.com/news/2016/02/services-distributed-monolith).

I recommend you watch, it's an interesting take, and one worth analysing for yourself.

I've written on the perils of DRY [a](http://www.simplicityitself.io/our%20team/2015/01/01/development-by-slogan-dry-part1.html) [fair](http://www.simplicityitself.io/our%20team/2015/01/08/development-by-slogan-dry-part2.html) [amount](http://www.simplicityitself.io/our%20team/2015/01/09/development-by-slogan-dry-part3.html), and so to a large extent I totally agree. Where I diverge from much of the discussion is on the nature of autonomy in microservices.

## The Nature of Autonomy

In many discussions, full autonomy of services is held up as an ideal - each service should be independently deployable, scalable, and maintainable. However, in practice, this level of autonomy is not always achievable or even desirable.

## Introducing the Minilith

I borrowed the term "minilith" from Gawain Hammond of the Sky Tech Futures team. It invokes megalith, but smaller. A megalith is a collection of standing stones, most often interlocked in some way. Stone Henge is probably the most famous, and works for the analogy. The stones were all arranged in concentric circles, with top stones linking them all together.

A Minilith is similar, in that there are strong connections between services. Without the surrounding services these would simply fail. The point is that some services naturally deploy as logical unit. They are separate at runtime, but they can't exist without each other, and are effectively version locked.

## When Does This Make Sense?

There are several scenarios where the minilith pattern emerges naturally:

### 1. Regulated Environments
In regulated environments, determinism often trumps autonomy. You need to know exactly what version of each component is running, and you need to deploy them together to maintain compliance.

### 2. Tightly Coupled Business Logic
Sometimes business processes are so intertwined that separating them into fully autonomous services creates more complexity than it solves.

### 3. Performance Requirements
When services need to communicate with extremely low latency or high throughput, deploying them as a unit can provide operational benefits.

## Comparison to Other Concepts

The Kubernetes Pod is essentially the same idea, but most often described as bundling helper processes, databases, logging and the like. The minilith extends this concept to business services that are logically separate but operationally coupled.

## Benefits of the Minilith Approach

1. **Simplified Deployment**: Deploy related services as a unit
2. **Version Consistency**: Ensure compatible versions are always deployed together
3. **Reduced Operational Complexity**: Fewer moving parts to monitor and manage
4. **Clearer Boundaries**: The minilith boundary becomes a natural architectural boundary

## Challenges and Considerations

1. **Reduced Flexibility**: Services within a minilith can't be scaled or deployed independently
2. **Larger Deployment Units**: Updates require deploying the entire minilith
3. **Team Coordination**: Teams working on different services within a minilith need to coordinate more closely

## Conclusion

The minilith pattern is not a universal solution, but rather a pragmatic approach for specific contexts. By acknowledging that some services are naturally coupled and designing around this reality, we can create more maintainable and understandable systems.

In my next article, I'll take advantage of the minilith concept to enable continuous delivery in a regulated environment, showing how this pattern can actually increase deployment flexibility when applied correctly.

The key is to recognize when services truly need autonomy and when they're better served by explicit coupling. As with many architectural decisions, the answer is: it depends on your context.