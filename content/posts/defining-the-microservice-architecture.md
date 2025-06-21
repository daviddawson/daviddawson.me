---
title: "Defining The Microservice Architecture"
date: 2015-09-01T00:00:00Z
draft: false
categories: ["Philosophy"]
tags: ["architecture", "best-practices", "blog", "ddd", "microservices"]
description: "Recently (June 2015), I gave a talk at the DDD Exchange at Skills Matter in London."
slug: "defining-the-microservice-architecture"
aliases: ['/philosophy/defining-the-microservice-architecture/', '/defining-the-microservice-architecture/']
  - "/philosophy/defining-the-microservice-architecture/"
---

Recently (June 2015), I gave a talk at the DDD Exchange at Skills Matter in London.

This was a little last minute! The (then Simplicity Itself) CTO, Russ Miles, was originally scheduled to deliver at the conference, but he had to be out of the country visiting one of our partners and so I was drafted in to deliver.

This is a talk I've wanted to give for a long time, so while it was a little rough around the edges, the message is something we've been working with for a while.

It cuts to the heart of what we're doing, and why we're doing it. It asks the question, "What is Microservice Architecture?", leading to "What is a Microservice?". Is this becoming debased, or can we pick out something useful?

## The Core Question

The microservices movement has gained tremendous momentum, but with that growth comes dilution of the core concepts. Everyone seems to have their own definition of what constitutes a microservice, from "small REST services" to "SOA done right" to "just use Docker."

This confusion isn't just academic - it has real implications for teams trying to adopt microservices and realize their benefits. Without a clear understanding of what microservices truly are, we risk missing their transformative potential.

## Isolation: The Fundamental Characteristic

After extensive discussion with clients, partners, and practitioners, one characteristic emerges as truly fundamental to microservices:

**Isolation between components, enforced using a network boundary.**

This isolation is what enables all the other benefits we associate with microservices:
- Independent deployment
- Technology diversity
- Fault isolation
- Team autonomy
- Scalability

Without isolation, you don't have microservices - you have a distributed monolith.

## The Aspirational Quality

Beyond the technical characteristic of isolation, microservices embody an aspiration: the ability to keep up with change.

This isn't just about technical change (though that's important). It's about:
- Business change - new requirements, new markets, new opportunities
- Organizational change - team growth, restructuring, different working methods
- Technology change - new tools, platforms, and approaches

Microservices architecture acknowledges that change is constant and builds that assumption into the very fabric of the system.

## Architecture, Not Design

This is a crucial distinction that's often missed. Microservices is an architecture - a set of principles and constraints that guide how we structure our systems. It is not a design methodology.

For design, we need to look elsewhere. Domain Driven Design (DDD) has proven to be an excellent companion to microservices, providing:
- Bounded contexts that map naturally to service boundaries
- Ubiquitous language that helps teams communicate
- Aggregates that define transactional boundaries
- Context mapping that helps manage service interactions

## The Centered Community

Unlike some architectural movements that have strict rules and certification processes, microservices remains a "centered community" - there are guiding principles and shared understanding, but room for interpretation and adaptation.

This flexibility is both a strength and a challenge. It allows for innovation and context-specific solutions, but also leads to the definitional confusion we see in the industry.

## Core Principles

From our work with numerous organizations adopting microservices, these principles consistently prove valuable:

1. **Services own their data** - No shared databases, each service is responsible for its own state
2. **Communication through well-defined interfaces** - Usually APIs, events, or messages
3. **Independent lifecycle** - Services can be developed, deployed, and scaled independently
4. **Business capability alignment** - Services represent business capabilities, not technical layers
5. **Decentralized governance** - Teams can make their own technology choices within bounds
6. **Design for failure** - Assume services will fail and build resilience into the system

## Common Pitfalls

Understanding what microservices are also means understanding what they're not:

- **Not just small services** - Size is a consequence, not a goal
- **Not just REST APIs** - The communication protocol is less important than the isolation
- **Not just containerization** - Containers are a deployment mechanism, not an architecture
- **Not suitable for every problem** - Some domains benefit from monolithic approaches

## Practical Application

When applying microservices architecture, consider:

1. **Start with the monolith** - Understand your domain before breaking it apart
2. **Identify boundaries through behavior** - Look for natural boundaries in how the business operates
3. **Invest in automation** - The operational overhead requires excellent tooling
4. **Build a strong team culture** - Microservices require high trust and communication
5. **Measure and iterate** - Use metrics to guide architectural decisions

## The Path Forward

Microservices represent a significant shift in how we think about building systems. By focusing on isolation and embracing change, we can build systems that are more resilient, flexible, and aligned with business needs.

But this isn't a silver bullet. It requires investment in skills, tooling, and organizational change. The key is to understand the fundamental principles and apply them thoughtfully to your specific context.

## Conclusion

Defining microservices architecture isn't about creating a prescriptive checklist. It's about understanding the fundamental principle of isolation and the aspiration to handle change gracefully.

By applying existing software design wisdom in the context of this new philosophy, we can build systems that not only meet today's needs but can evolve to meet tomorrow's challenges.

The microservices movement is still evolving, and that's a good thing. As a centered community, we can learn from each other's experiences while adapting the principles to our unique contexts. The key is to stay true to the core principles while remaining flexible in implementation.