---
title: "Development by Slogan with DRY: Part 3, DRY vs WET"
date: 2015-09-01T21:35:20+01:00
draft: false
categories: ["Philosophy"]
tags: ["best-practices", "dry", "grails", "technology"]
description: "Hopefully, you now understand some of my pain when I’m arguing against DRY, and arguing against deep abstractions. The original definition of DRY though, Single..."
slug: "development-by-slogan-with-dry-part-3-dry-vs-wet"
aliases:
  - "/philosophy/development-by-slogan-with-dry-part-3-dry-vs-wet/"
---

## The Original DRY, WET and Slogan Based Development

Hopefully, you now understand some of my pain when I’m arguing against DRY, and arguing against deep abstractions. The original definition of DRY though, Single Source of Truth etc, that’s ok right? I mean, WET (Write Everything Twice etc) just sounds so bad, and it’s the opposite of DRY, right?

Well …​ no, not really. This is development by slogan, pure and simple. Luke is right to fear this, it leads to dogma and dogmatic position taking and so to endless, needless, debate and argument over developer practices.

There are real costs to applying the grand normalisation process that we like to call DRY, along with any of the benefits that also exist. Introduction of new and innovative coupling into a system. We’ve seen this with databases, with not many systems demanding 3rd normal form any more. Why? Query performance can get awful very quickly, and making changes starts to become harder.

There is an alternative position you can take, which I advocate, which is to see the component, the entities, as merely servants of your system, not the true shape of it. They are not the primary result of the architectural process.

Entities are, in practice at least, used to describe data at rest in a database. They are intended to allow controlled interactions with it, aka Business Logic. _Data at rest_ is a particular view of the world, resulting in a focus on a single system of record/ database centric design. This encapsulates the majority of enterprise systems being developed 10 or so years ago. The frameworks of the period show the effects of this, for example, EJB and friends.

Nowadays we have many more options and tools to employ, both mental and technical. The primary systems that Simplicity Itself builds, for example, are large volume, low latency event based systems presenting rich analytic front ends. Taking a variety of input streams, converting and enriching them and then building optimised data representations for user query and interaction.

We are in the middle of building another new product that has **no** System of Record data store that could be recognised as such. Instead, there is a central event store with no query capability, only stream replay. In this view of the world, the event stream is the only truth.

In a system of this style, the system boundaries and the flows of data through and around them are the primary concerns, and where we spend our development efforts. When seen this way, the idea of a single source of truth, in the sense of an entity, becomes far less important, or in the worst case a force for distraction. My good friend [Tareq Abedrabbo](http://www.terminalstate.net) has [written about this](http://www.terminalstate.net/2013/12/the-warehouse-and-shop-floor-separation.html).

## Microservices can’t be DRY

When you begin to see the boundaries within the system as more important, say in a [‘modular monolith’](http://www.slideshare.net/lhotari/ggx-2014-lari-hotari-modular-monoliths-with-spring-boot-and-grails-3), as Lari Hotari discusses, or in a Microservices based system, then having a single source of truth becomes confusing. Discussions abound on whether you can include multiple Microservices in a single transaction, how easy is it to create Data Transfer Objects using some automapper system, or the general upset about potential for temporary inconsistencies.

This results from applying the old style of thinking to the new problem. The effect of DRY based thinking here is to pull you into a data at rest/ single source of truth way of considering how to structure your code. Sometimes, there just is no source of truth, and the data is never truly at rest and you need to come to terms with that reality. When that happens, trying to ‘make the system DRY’ is simply the wrong approach and no amount of upset and hyperbole about copy and paste is going to change that.

Where this leaves you is to think about your intra system boundaries, and what lives within them. These tend to map neatly to the ‘bounded context’, and is also often a nice transactional boundary. Within this, many of the maxims hold true, including DRY. Within a single service boundary, by all means try to create a single source of truth, DRY style. This will create internal coupling, and that’s ok, welcome to internal cohesion.

However as soon as you cross a boundary, do not think that because something looks the same, or contains the same data that it is in fact the same.

It isn’t.

It is now in a different context and so it **must** be different, including being implemented by different code, different data store, the whole thing. No matter how similar it feels, resist it. Trying to attach them together means you are coupling across the system boundaries and across the different contexts. This is the most direct path to big ball of mud, and attempting to apply DRY here will lead you down that path while singing you a lullaby about how good a developer you are.

In conclusion then, I _can_ see the argument that DRY is useful in certain areas and should be used where it’s appropriate. Those areas are far, far more constrained than is generally described.

I see DRY as being the very thing that Luke was arguing against, development by slogan. This is not due to particular flaws in the original thinking, the authors of the book are highly intelligent and very effectively addressed the problems as they saw them at the time.

Instead we had a pithy phrase that became very established, divorced from it’s context and then finally generalised too broadly. It has led us all down a blind alley.

We have misled ourselves into thinking that something that was fairly specific and focused in scope was in fact some deep universal truth – “Don’t Repeat Yourself” – and should be applied everywhere possible, when it just wasn’t.

With that, I am happy to continue making my claim

**DRY sucks**

D.

[architecture](https://daviddawson.me/tag/architecture/)[best-practices](https://daviddawson.me/tag/best-practices/)[blog](https://daviddawson.me/tag/blog/)[dogma](https://daviddawson.me/tag/dogma/)[dry](https://daviddawson.me/tag/dry/)[microservices](https://daviddawson.me/tag/microservices/)[technology](https://daviddawson.me/tag/technology/)
