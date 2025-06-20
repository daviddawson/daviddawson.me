---
title: "Microservices and Philosophy"
date: 2016-09-07T21:42:49+01:00
draft: false
categories: ["Philosophy"]
tags: ["antifragile", "architecture", "ddd", "devops", "events", "evergreen", "microservices", "technology"]
description: "This article was originally posted at simplicityitself.com."
slug: "microservices-and-philosophy"
aliases:
  - "/philosophy/microservices-and-philosophy/"
---

This article was originally posted at simplicityitself.com.

Simplicity Itself has now closed, and so I have moved my articles here.

If you would like to read up on why it closed – See [here](http://daviddawson.me/blog/2017/02/04/simplicity-itself-shutdown.html)

When talking to clients, both current and potential, at conferences, users groups and the like, the question arises often, “what is a Microservice?”

In many respects, it’s a question that defies a single answer.

Since we’re a consultancy specialising in Microservices, we did a review a while ago with our clients and partners (some of you may remember), asking this very question!

The answers we got back were informative and ranged from the specific and technical, to the vague and emotional.

Some examples :-

  * Small web services
  * Bounded Contexts
  * Low LOC (yep!)
  * Small REST services
  * Pipes and filters
  * Not SOA
  * Fine grained SOA!
  * OO in the large
  * Functional in the large

and many, many others.

The problem we ended up with was that, when we layed them out to sort the common definition, we found that there wasn’t one.

As in, there wasn’t a point of agreement. Instead we had broadly disjoint sets. This kind of accounts for the lack of a clear definition!

Digging a little deeper, we found two things that did find general agreement.

The first, is **isolation**. The property of pulling a system apart, generally using a network boundary, although not always (eg OSGI and NetKernel).

The second point of agreement was a deep **aspiration**. The quality that the world would be better, if we deploy microservices.

Obviously, with my background as a hard technologist, this was fairly appalling. (although as a consultant, my proposal press fluttered!)

## The Microservice Architecture

An interesting thing came up though, which was the terminology that people use when talking microservices. For much of the conversations, the phrase used is actually “a microservice architecture”, rather than just “microservices”.

This intrigued me, as it leads directly to the question, if I can’t define Microservices, can I define **architecture**?

Well, to me, software architecture is something of a debased term, being stolen from construction. Is it the same as design? Many would say, yes it is.

I’d take the opposite and say that, no, it can’t be, and this is simply proven through cardinality.

Looking over a system, you see myriad design decisions, each line has some aspect of design associated with it. There appears to be an unlimited number of design decisions available to the software developer.

Architecture? There’s recognisably fairly few software architectures. Certainly a number with a limit, maybe a few dozen that are in active use. Consider things such as **n-tier** , **SEDA** , **event based** etc.

So, just with counting, they aren’t the same thing.

When I think of architecture, certain ideas and phrases go through my mind :-

  * A set of constraints put on the system
  * A set of mental tools used to understand problems and create solutions
  * The route to the design, rather than the design itself
  * A framework for arranging your skills, knowledge and aims within.

Sound fair?

I know all these ideas from another field, well outside of software. **Philosophy**

From this point of view, software architecture is a form of philosophy, and that leads us to an interesting place as far as **The Microservice Architecture** goes.

We can reframe this as the **Microservices Philosophy** and have it mean fundamentally the same thing. This is something I’m far more comfortable with, it’s actually much more concrete!

We’ve been understanding and grappling with philosophy for thousands of years, and we’ve got a lot of wisdom to draw upon.

## The Microservice Philosophy

From this point of view then, we can begin to frame Microservices very differently. Instead of reaching for a highly prescriptive view on the particular methods, technologies or techniques, we can start to frame our microservices journey in more philosophical terms.

What is your end goal? What properties of the resulting system do you actually want to achieve?

This turns the discussion of ‘what makes a microservices’ from the prescriptive, to the descriptive. It allows us to evaluate the resulting systems not in terms of how they were constructed, or what they used, but what they actually **do**.

For us, the essential properties of a successful Microservice system are all about responding positively to change pressure. A system that not only accepts and adapts to change, but learns and improves itself in response to that change happening.

Luckily, a term was invented for this property **antifragile**.

This was coined by Nicolas Taleb, originally referring to economic and financial systems that benefit from stresses, rather than collapsing.

From a pure tech point of view, this seems of limited use, is it really broadly applicable to have a system that responds to stresses?

When you are considering Microservices as a purely technical endeavour, then frankly no, its not really a properyy we can easily generate.

When looking at Microservices as a distributed system philosophy, and tech as a means to an end, then we have the opportunity to broaden our horizons somewhat in pursuit of Antifragility.

As soon as we bring people into the definition of ‘the system’, the development team in particular, then generating antifragile behaviour becomes easy and desirable.

The famous **Chaos Monkey** from Netflix is an excellent example of architecture given form. It isn’t merely a failure testing tool, it’s the architecture of the system enforced by a tool.

The antifragile feedback cycle in this case runs like this :-

  * The dev team is made responsible for production outages.
  * Chaos Monkey generates production outages, on the weekend.
  * The dev team comes in on Monday, and changes the system so that it can tolerate partial failure and still run.

The system then has been stressed, and then visibly improved itself in response to that stress. It can now tolerate failure in VM resources.

The system has become Antifragile.

This is done by creating the appropriate feedback loops, and then generating appropriate stress to push signals down those feedback loops.

## Of DevOps and Continuous Delivery

This is where Microservices overlaps heavily with the DevOps movement and Continuous Delivery.

Both place value on feedback cycles and improvement.

DevOps comes from a cultural and operational viewpoint, Continuous Delivery approaches from the process space, Microservices from the runtime technical viewpoint.

All are speaking similar language, and I don’t really care which you subscribe to in order to back up your philosophy of benefiting from change.

## Where does this lead?

Of course, this leads to building highly distributed systems. All the issues that are discussed, from log management, platform comparison, containerisation, data handling and the like are all valid.

Your system will almost certain look like a set of processes coordinating over requests. What I’d like you to take away is that there is an objective measure you can use to evaluate your success, or otherwise, when deploying a Microservice system.

That measure is how well your system expresses the essential properties defined by your architecture. These essential properties don’t tend to change, so they can be used to measure against over the lifetime of a system.

For us, the ability to change and benefit from that change is paramout. You may be looking more at team scaling, or simple runtime scaling.

If you aren’t achieving these properties, and yet paying the Microservices tax (which can be **expensive!**) then Microservices may well not be for you.

[antifragile](https://daviddawson.me/tag/antifragile/)[architecture](https://daviddawson.me/tag/architecture/)[ddd](https://daviddawson.me/tag/ddd/)[devops](https://daviddawson.me/tag/devops/)[events](https://daviddawson.me/tag/events/)[evergreen](https://daviddawson.me/tag/evergreen/)[microservices](https://daviddawson.me/tag/microservices/)[technology](https://daviddawson.me/tag/technology/)
