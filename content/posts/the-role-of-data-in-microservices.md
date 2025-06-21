---
title: "The Role of Data in Microservices"
date: 2015-09-01T00:00:00+00:00
draft: false
categories: ["Coding"]
tags: ["architecture", "blog", "data flow", "datas schema", "ddd", "design", "events", "microservices", "technology"]
description: "Understanding how data flows and pipelines are more important than services themselves"
slug: "the-role-of-data-in-microservices"
aliases: ['/coding/the-role-of-data-in-microservices/', '/the-role-of-data-in-microservices/']
  - "/coding/the-role-of-data-in-microservices/"
---

When approaching development of Microservices, it's often easy to think of the services themselves as the valuable pieces of your system. Each service you add gives you more functionality, and so more value. For the majority of systems we have built and reviewed during our consultancy, we have found that the system itself is of fairly marginal value. Instead, the data that it contains and the intelligence it can provide based upon that data is what is actually valuable. This seems a subtle, even academic distinction, but it is important and putting it at the forefront of your mind during design has significant repercussions on the way you build your services and the way that they interact with each other.

Once you do this, the 'discussions' over what should be a service and what shouldn't be becomes far less abstract. Everything is being built to efficiently process, store and present your data. Nothing else really matters when you think about it.

## Design your Data

With this in mind, your data, and the flows of data through your system become far more important. The components that do the processing have to be there, but you actually want your data there. If you could get rid of your system components while still having your data processed, you would in a heartbeat. Keep that in mind.

In a Microservice architecture, these flows of data will always exist. Generally, they are implicit, only existing in the ephemeral nature of the communication between services. They can, however be explicitly built in, with services that actually implement particular data flows. We call this explicitly implemented data flow a _pipeline._

This is not a new concept, and many of you will have built just such a thing. Often you will have felt the need to grab a technology such as Storm or Spark in order to handle a flow of data. When you are doing that, you are building what we refer to as a pipeline. If you have ever built such a thing, take a step back and think about the flow of data in the abstract sense. Try to unpick other flows of data in your application.

## Implicit vs Explicit Pipelines

When building microservices, it's common to have a call stack of multiple services with data flowing from back to front through transformer services. This is essentially "a set of transformers on top of a stateful resource" and represents an implicit pipeline.

The problem with implicit pipelines is that they're hidden in the communication patterns between services. This makes them harder to understand, monitor, and debug.

## Benefits of Explicit Pipelines

### Simplified Error Tracking

Error tracking in microservices can be difficult, requiring tracking requests through call chains and correlating identifiers across logs. However, with explicit pipelines, error tracking becomes simpler as all high-level processing for a data flow is located in a single location.

### Maintained Benefits

This approach doesn't sacrifice the benefits of microservices but actually enhances them by localizing data flows into single services and potentially regaining some transactional behavior.

### Clearer Architecture

When data flows are explicit, the architecture becomes self-documenting. New developers can understand how data moves through the system by looking at the pipeline definitions.

## Stateful vs Stateless Services

It's important to clarify the distinction:

- **Stateful services**: Give access to data at rest (often fronting a data store)
- **Stateless services**: Don't give access to data at rest, though they may contain cached data

In a data-centric view, stateful services are the sources and sinks of your data, while stateless services are the transformers that process data as it flows through the system.

## Immutable Data Flows

When thinking about data pipelines, consider making your data flows immutable. Instead of modifying data in place:

1. Create new values from transformations
2. Preserve the original data
3. Build an audit trail of transformations

This approach simplifies reasoning about data consistency and enables powerful patterns like event sourcing and CQRS.

## Practical Implementation

When implementing data-centric microservices:

1. **Identify your data flows first**: Map out how data moves through your system before designing services
2. **Design services around data transformations**: Each service should have a clear role in the data pipeline
3. **Make flows explicit**: Use technologies like Kafka, RabbitMQ, or even simple HTTP to make data flows visible
4. **Monitor data, not just services**: Track data quality, throughput, and transformations

## Conclusion

By shifting our focus from services to data, we can design more coherent and maintainable microservice architectures. Services become what they should be - tools for processing, storing, and presenting data efficiently.

Remember: the value is in your data. The services are just there to help you realize that value. Design accordingly.