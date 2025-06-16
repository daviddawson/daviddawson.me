---
title: "Sharing Code Between Microservices?"
date: 2015-09-01T21:38:22+01:00
draft: false
categories: ["Coding"]
tags: []
description: "My good friend Peter Ledbrook has been pondering the question [how can we share code between microservices](http://blog.cacoethes.co.uk/software/code-reuse-in-m..."
slug: "sharing-code-between-microservices"
aliases:
  - "/coding/sharing-code-between-microservices/"
---

My good friend Peter Ledbrook has been pondering the question [how can we share code between microservices](http://blog.cacoethes.co.uk/software/code-reuse-in-micro-services)

This is something we’ve had the opportunity to experiment with, on new projects and also longer running systems. This has given us some insight, which I’m happy to share here.

The process for building a new microservice is pretty well established by now.

  * Define the service contract
  * Expose on a network (somehow, http, messaging, or maybe https://muoncore.io[Muon])
  * Profit?

…​

Sorry, that was mean of me!

More seriously then. In many of our conference talks we drop down to first principles and philosophy and I want to do that here too, as the answer to the question above can only be found when the real, underlying question is asked. So, what is your motivation for building a microservice?

That will frame your answer, and we’ve found that the motivations for using microservices are actually fairly varied depending on the environment.

So, why make a microservice? Some of the typical answers we get when we ask are :-

  * Independently scale
  * ‘Ability to innovate’
  * Service isolation
  * Separate service life-cycles (deployment, build etc)
  * Monitor usage via gateways

Our take is that these are all attempting to handle some form of _change_. This is what we always look for , change in the environment, change in the codebase. Differing rates of change between two areas are almost the sole guide that we use for splitting services apart.

These all sit on the concept of _isolation _of one form or another. This underpins almost all of the benefits, and almost all of the costs of microservices. Creating and maintaining that isolation barrier we know as the service contract. Microservices go one layer above something like OSGI, as they enforce a network hop in the service barrier, creating an extra air gap, so they are highly decoupled from a code execution point of view.

All of this setup is to create isolation_._That isolation_ _enables the other benefits of microservices. This is the key point.

## Code Sharing

So, sharing code. Why would we do this?

Primarily, I’ve found that developers and organisations want to share code across microservices for only a few reasons, although they may couch them in different terminology. This list is not complete, but takes in the majority.

  * Leverage existing technical functionality, eg, the impressive array of Netflix OSS libs, Guava, other utils.
  * Sharing data schemas, using a class, for example, as an enforcement of a shared schema.
  * Sharing data sources, use of the same database by multiple services.

It is of utmost importance to pin down your motivation for wanting to share code, as unfortunately there is no right answer to this question. Like everything else, it’s contextual.

The order of the list above is important, I arranged them in how much coupling they will create across services, from least to most, with the most coupling created by sharing control of runtime data, through sharing a data schema, sharing technical/ infra libraries, to finally sharing nothing.

Code sharing, as when sharing anything, will always act to attach your services together via the shared code. This is unavoidable. The question you need to ask, is it worth it to do so?

You are crossing the isolation barrier, and so you _are_ reducing the effectiveness of it. By sharing nothing, you are giving it the maximum possible effectiveness. That, though, also comes at a cost.

When you build a new service and share nothing, you feel like you have ‘lost’ the functionality that is available in the other services. In fact, you’ve traded it away to give yourself more isolation, by sharing more, you lose more isolation. You gain the convenience of using existing code, at the cost of coupling more tightly to the other services in the system.

This demonstrably does occur even when you are sharing only technical libraries. I’m sure that any Netflix guys (or other larger microservices implementations) reading can attest to “build the world” CI storms if one of the base libraries are changed. This is witnessing the infamous  _ripple effect_ in full force. Those seemingly innocuous, merely technical libraries will start to gain a whiff of ‘scary’. This is because altering them will cause a large scale redeploy of services unrelated the one being developed. Developers will start to avoid them if possible, for fear of the unknown effect that you may create. There lies legacy …​

This, then, is just at the lowest level of sharing. If you attach at a higher level, sharing schemas, or even control of the data (via the sources), then you will suffer the ripple effect more often and it will hurt more when you hit it. You will be carrying the cost of maintaining a microservices based architecture, without gaining the benefits of isolation, because you’ve shortcircuited it.

## Micro vs Mono

This is a fairly stark message, but one that I can’t avoid. If you want convenience, build a monolith. They are significantly quicker to start a new project with, quicker to be able to alter the service boundaries as desired. To be able to get that initial jolt of primary development, they are the _right answer._

There is a continuum then, a constant tension between isolation and re-use. To lean to one is to lean away from the other. The discussion on  _what_ is shared has some value, but sharing anything has the same effect, just a greater or lesser severity.

The choice on which way you lean is of course, up to you.

The natural progression that we now expect in new Microservices implementations is :-

  * Prepare the ground (the ability to break services off)
  * Build a Monolith in the primary development phase
  * As areas of the system stop changing, break them off as new services behind their stable barrier.

At this point, they should share almost nothing with the monolith it has been pulled out from

During ongoing/ secondary development, new areas start life as new services.

[architecture](https://daviddawson.me/tag/architecture/)[blog](https://daviddawson.me/tag/blog/)[ddd](https://daviddawson.me/tag/ddd/)[dry](https://daviddawson.me/tag/dry/)[microservices](https://daviddawson.me/tag/microservices/)[technology](https://daviddawson.me/tag/technology/)
