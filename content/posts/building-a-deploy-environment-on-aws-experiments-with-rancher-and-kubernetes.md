---
title: "Building a deploy environment on AWS- Experiments with Rancher and Kubernetes"
date: 2017-09-01T20:46:15+01:00
draft: false
categories: ["Coding"]
tags: []
description: "Since [coming back to freelancing](/2017/02/simplicity-itself-shutdown/), I’ve (re)started a set of projects with clients, mana..."
slug: "building-a-deploy-environment-on-aws-experiments-with-rancher-and-kubernetes"
aliases: 
  - "/coding/building-a-deploy-environment-on-aws-experiments-with-rancher-and-kubernetes/"
  - "/building-a-deploy-environment-on-aws-experiments-with-rancher-and-kubernetes/"
---

Since [coming back to freelancing](/2017/02/simplicity-itself-shutdown/), I’ve (re)started a set of projects with clients, managing them end to end. This means that I need a deployment environment somewhere that I can throw stuff into. I have much experience with Cloud Foundry (I deliver training for Pivotal on it), but its a little heavy for my needs, and I want to have relatively small stateful containers that don’t take up a full box.

I have been using Docker Machine for a while to host small projects on AWS. I like the workflow that it gives, letting you deploy images from a registry, or have a docker compose file build in place and deploy directly for testing purposes.

The big issues when trying to scale it though are **visibility** and **multi node**.

Now that I have projects here that are moving into production, and without a larger company managed infrastructure anymore, I need to come up with a solution for these that don’t take lots of time and effort to install and manage.

I had a good look around at a few options for managing infrastructure. I recently came across a project called Rancher again at a client, that was actually presented at LMUG a good while ago, so I went to see how it had developed over the past year.

It has a good story to tell around making management of containerised infrastructure easy, and at first glance, appears to support docker compose which fits my existing workflow. So I thought I’d give it a try. I’m writing this as I go, so it’ll be a discovery for us all!

## Installation.

Installing the server is **very easy**

Take an existing docker host (created say, via docker machine on AWS, like I did), and you can install it with a single command. This runs a docker container on the host, which then bootstraps a set of other containers that make up the Rancher server install.

Once you have a running server, you need to then pick an orchestration to use for Rancher to manage your applications.

## Orchestration Options

**This confused me.**

Rancher has half a dozen different options for container orchestration. It’s own built in “Cattle” management. This seems to be the one that attracted me to Rancher in their documentation, as it has a very similar workflow to docker compose.

Alternatively, you can use Kubernetes, Mesos, Swarm (aka ‘Docker Native’) and Windows. Kube is a big draw I think, it certainly caught my eye.

These are partitioned into “Environments”, of which Rancher can manage multiples thereof, and support different orchestration options at the same time. I like this, it lets Rancher be the single management tool for orchestration.

What confused me, although perhaps it shouldn’t have done, is that the developer workflow for each orchestration is totally different. Rancher doesn’t wrap them particularly, it simply enables management of them in a single place. I installed Kubernetes, this was very quick and easy. I then very quickly realised that I didn’t remember how to use kube particularly well, and rapidly retreated. This doesn’t fit my requirement of “it has to be easy and low effort”.

Instead I chose “Cattle” orchestration, built into Rancher. This seems to fit the workflow that I want. I could probably have chosen Swarm to get a similar effect, although my experiments with it showed that it deployed a container per node for services. This seems remarkably crude as far as orcehstration goes (compare that to, say Mesos or Cloud Foundry Diego and their ability for very precise positioning). I can’t imagine this is really the case, but I didn’t go any deeper than a quick eval.

Cattle is easy and understandable. Low level enough without losing high level visibility and most importantly, it fits my current workflow, or so it appears.

I think that the key thing is that you should pick the orchestrator that fits with your current operational and development workflow. Rancher seems to have good support for working with the major orchestrations and bringing them together in one place.

I’ve kept the Kube cluster up for some things and I am intending to spend some time with Mesos in the next month or so now that I know it’s easy to set up from a single management interface.

## Dev workflow

I use docker compose a large amount, using it as the basis for continuous delivery workflows across all the platforms and runtimes I develop in. You can see this influence on the Muon project which promotes the tool for all of its “getting started” and other deployments.

I find that this also gives a good way to deploy sets of related projects locally and then into the remote system. This disconnect between local and remote is why i’ve shied away from using Kubernetes for production, as I don’t need th massive scale or complex orchestrations it provides.

Once I made the decision to choose a Cattle deployment, deployment of the projects started. I updated TeamCity with a call to rancher-compose and _most_ projects fired up. Rancher supports `docker-compose.yml` files, with an optional override in its own `rancher-compose.yml` file.What became clear is that Rancher support most of the docker compose format, when you are dealing with prebuilt services. When you are using containers built from the local disk (dev style **build:** commands), then it seems to break with the way I was using it. At least it did on all of the projects I had that used that style.

I quickly reworked those to build an image in a registry rather than pushing a locally built image using the `build` context in the docker-compose file. All my projects then deployed, and in truth, this is a better model.

## Rancher Extensions to Docker Compose

Rancher can accept straight docker compose files and run them. It also lets you define a `rancher-compose.yml` that contains extra information Rancher Cattle can use to manage and coddle your containers a bit more

This gets into active management of containers, which has been an issue on the basic docker machine environment I’ve used to host these projects before.

I haven’t gone deep into what else Rancher Cattle can do in this regard, but I like its simplicity.

## HA and Maintenance

One of the main motiviations for me was to get the ability to have a proper HA containerised setup. Docker machine is fine and all, but it’s totally fragile! I want to get an HA setup thats easy, multi cloud and reliable. Now that I’m a freelancer, I’m going to do this by myself and run client projects on it, so it has to be production grade, yet very low maintenance. So, dev workflow aside, this is a very important requirement.

### Setting up HA

HA in Rancher requires an external database. Since I’m on AWS, I used RDS to give a hosted MySQL that I don’t need to care about.

The hardest part about this was setting up networking in RDS! Fiddling around with VPC vs DB VPC and network routing was lots of fun and all, but I’ve got better things to do. In the end, I got it sorted, Rancher connected and seemed to work fine. (FYI, Frankfurt is not near Dublin)

This seems to be a decent setup, essentially delegating HA synchronisation to the DB cluster/ RDS

I’ve hit it with a wrench a few times, destroying the odd node and the like, and it’s not gone down yet, so I’m reasonably confident it’ll survive for a while.

### Ops stuff

With my previous little setup, scaling was a purely vertical affair, which was disruptive to say the least. Proper ops tooling wasn’t feasible to add in, or really worth it for a hobby system like that.

Now that it’s productionising, I need some monitoring, log management and alerting.

Lucky for me, Rancher has this setup in the Cattle catalogue. I installed Prometheus and ElasticSearch/Logstash. This took about 30 mins to do.

## HTTP Load Balancing

I’m hosting a fair few projects on the same containerised infrastructure. I don’t want to run the front end containers on every host, or to have a single host that is the single entry point. Instead I’d like to run 2 of each container (unless under load), spread across the various hosts, and have http traffic route to them after hitting any of the hosts. A load balancer sitting in front and distributing traffic to the host cluster completes the mix.

To make this work, this is what I did.

  * Set up an AWS Elastic Load Balancer, directing traffic at all the Rancher hosts.
  * Installed an [Event Sourced HTTP Proxy](https://github.com/muoncore/muon-http-proxy) from the Muon project.
  * In Rancher, create a new user stack `load-balancing` and then added a load balancer container.

The last entry is nice, Rancher lets you create a load balancer (which is HA proxy), run an instance on all hosts and have it direct HTTP traffic to a particular internal service. So I can direct all HTTP traffic to my 2 HTTP proxy nodes that then select the target from their event sourced routing table.

Adding a new http vhost is now as easy as emitting the appropriate muon event and the proxies scale horizontally very easily.

## End result.

I managed to deploy a new Rancher server in 5 minutes, experiment with various orchestration options by deploying them to various AWS datacentres and settle on Cattle within an hour. Migration of projects took a simple rebuilt to deploy them onto the new Rancher environment as simple docker compose stacks.

Rancher is an interesting tool with a lot to recommend it. After my initial confusion on what its role actually was as distinct from the orchestrators it was using, I’ve come to appreciate the multi-orchestration idea. I don’t like being forced to make “strategic” decisions based on silly technical reasons, say Kube vs Mesos. Why not both? Rancher gives a decent answer to that, and I expect it to be my top level Ops tool of choice for the foreseeable future.

## FAQ

### _Why didn’t you use [insert cloud provider offering here]._

I want multi cloud.

### _This sounds awesome, can I pay you to do some work for me?_

Why, [yes you can](/hireme/). (ok, fair enough, this is an advert)

### _What kind of projects are you deploying?_

A fair few.

On the new setup, I’m running

  * A marketing experimental analytics system for a top tier broadcast media firm.
  * 2 startup applications to support funding and MVP building *

These moving to production is the main impetus to getting someting production grade in place.

Simple

### _Are you deploying stateful containers?_

Yes. Generally I use Cassandra to back [Photon](http://muoncore.io/submodules/photon/docs/index.html), an event store from the Muon project. Or run a single Photon with an data store embedded in its own container for small data sets/ non prod workloads. Both of these need stateful volume management.

Apart from that as the data backbone, mysql and neo4j put in a good showing, although I currently have them as view data only. If they totally die, they will be recontstructed from the event store. For now I’m happy with that state of affairs. In the future, I may invest some time in making them HA, but I’m not that concerned given the ability to rebuild automatically is already there.

[aws](https://daviddawson.me/tag/aws/)[blog](https://daviddawson.me/tag/blog/)[containers](https://daviddawson.me/tag/containers/)[docker](https://daviddawson.me/tag/docker/)[kubernetes](https://daviddawson.me/tag/kubernetes/)[rancher](https://daviddawson.me/tag/rancher/)[technology](https://daviddawson.me/tag/technology/)
