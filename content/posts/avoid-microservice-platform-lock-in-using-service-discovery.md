---
title: "Avoid Microservice Platform Lock In using Service Discovery"
date: 2015-09-01T00:00:00Z
draft: false
categories: ["Philosophy"]
tags: ["architecture", "microservices", "tech"]
description: "The promises of adopting the cloud for your software are enticing. Effectively limitless scalability, large reductions in capital expenditure, efficiency savings in staffing through automation."
slug: "avoid-microservice-platform-lock-in-using-service-discovery"
aliases: ['/philosophy/avoid-microservice-platform-lock-in-using-service-discovery/', '/avoid-microservice-platform-lock-in-using-service-discovery/']
  - "/philosophy/avoid-microservice-platform-lock-in-using-service-discovery/"
---

The promises of adopting the cloud for your software are enticing. Effectively limitless scalability, large reductions in capital expenditure, efficiency savings in staffing through automation. An exciting prospective, and one that has being brought into even greater focus by the rise and rise of Microservices.

Not all is sweetness and light, however. There is significant investment required in ensuring your organisation and software can make best use of the new environment of the cloud. That investment in technology, training, development approaches and aligning the business with the new adaptable technology world can be significant, and the potential for a misstep to cost and lead your organisation into a dead end is present and you are right to be wary.

One question that we are asked during our consultancy and project oversight engagements is "which deployment platform should we use?"

This is far more complex than initially appears. You could use IaaS style bare virtual machines, and build your own management infrastructure. Or, you could use one of the PaaS products and accept the restrictions they impose. New on the block are the the container management solutions, taking Docker and friends and bonding them into a more cohesive, manageable solution.

I could give examples of all of these different types of system that are good products and good solutions. They are very different from each other in the way they work and in the way they require your organisation to work with them. This speaks to one of the issues of the cloud, it is far from a single technology set or even a cohesive set of ideas.

Which then, do you choose? How can you begin to evaluate which is going to be the best fit for your needs?  This is not easy as you have to balance the differing capabilities of the platform against your applications, decide which applications are going to have to run sub-optimally, which need to be rewritten, which need to be abandoned.

This difficulty of this choice is telling you something. It is telling that you are attempting to pick a single solution, a single platform to rule them all. It will take your applications, manage them, secure them, keep them cosseted and warm. It will take over your infrastructure concerns entirely and become the new operating environment for your organisation.

This doesn't seem too bad. In times past, we would pick a technology platform, AIX, Unix, Windows or another and commit our organisations to that platform. It gave us a set of capabilities and a support structure to help us deliver our products.

## The New Mainframe

The issue with committing to a single cloud platform is that, while superficially similar to the operating system and server choices of old, the cloud and its platforms are an entirely different thing.

The cloud is not a deployment location for your software, it is a full operating environment, containing deployment and management, messaging, security and a host of other services that you can take advantage of. Committing to it and accepting that these services are appropriate for use and adoption across your organisation will give you the promised efficiency and flexibility.

This is, though, the very embodiment of vendor lock in.

By adopting a particular cloud platform deeply, you will have made a strategic commitment to one vendor. In time, your organisation and that vendor will be deeply intertwined, possibly on a permanent basis.

I believe that this flies entirely in the face of why Microservices is being adopted within the industry. 

## Optionality and Antifragility

One of the defining aspects of Microservices is the ability to keep up with change. In my previous article on the [philosophy of microservices](/philosophy/microservices-and-philosophy/), I describe this as the "aspiration" inherent in adopting a microservice approach.

This aspiration recognises that the world is not static. Technology is changing ever more rapidly, customer requirements are ever more fluid, organisations are having to evolve to survive and your system architecture should be aimed squarely at enabling and supporting this change.

Creating a system architecture that embodies this change can be seen as embracing the concept of Antifragility. The property of becoming stronger through adversity and stress.

In the case of adopting a deployment platform, we need to evaluate them from the point of view of "optionality". The ability to take options in the future and change your platform choices as technology and organisation changes.

## Retaining Service Discovery

So, how do we take a tactical approach to selecting and adopting cloud platforms? We want to evaluate them from a short to medium term, technical viewpoint. Does it give us good deployment options? Is is sufficiently performant? Can we operate in the way we want to work as an organisation? Do we have the skills to successfully adopt it?

All good questions, and ones that we can answer and evaluate. The issue with this approach is that, to avoid lock in, we need to be confident that we can, at some future point, seamlessly migrate off of the platform.

This is where Service Discovery comes in. By retaining full control of this aspect of their architecture, Netflix have given themselves the option of moving sections of their infrastructure off of the AWS stack. They have implemented Eureka (for intra region discovery) and use Cassandra (wrapped in a Eureka emulating API) for inter region discovery along with Zuul doing front door routing. The technologies they have chosen are deeply embedded within their architecture and are not delegated to a proprietary, vendor specific system. Using Apache projects such as Curator, they have built a full, platform neutral service discovery and management infrastructure.

This has been very effective for them, and you will see this approach taken by all of the organisations that are having similar successes with cloud technologies.

## Summary

The key to avoiding platform lock in when adopting cloud and microservices is to maintain control over your service discovery infrastructure. This gives you the optionality to change platforms in the future as your needs evolve, embodying the principles of antifragility that are core to successful microservices adoption.

By evaluating platforms tactically rather than strategically, and maintaining the ability to move between them through robust service discovery, you can gain the benefits of cloud adoption without the risks of vendor lock-in.