---
title: "A Microservices Developer API using …. Make"
date: 2021-09-01T21:01:30+01:00
draft: false
categories: ["Coding"]
tags: ["devops", "make", "tech"]
description: "This article was originally posted at simplicityitself.com."
slug: "a-microservices-developer-api-using-make"
aliases:
  - "/coding/a-microservices-developer-api-using-make/"
---

This article was originally posted at simplicityitself.com.

Simplicity Itself has now closed, and so I have moved my articles here.

If you would like to read up on why it closed – See [here](http://daviddawson.me/blog/2017/02/04/simplicity-itself-shutdown.html)

Gradle, NPM, Lein, Maven, Docker, Ansible, Kubernetes, Grunt …​ The list goes on (and on, and on). Developer tooling, constantly re-invented for the modern age.

Microservices projects put **particular pressures on development teams** , even without polyglot, you end up adding in a fair amount of automation tooling (Docker anyone?) that is patchily integrated into the core developer tooling. Every time you add in docker support to gradle or grunt, the more locked you are to that language, making moving away that much harder.

If you do go polyglot (and I recommend that you do), then your problems are multiplied, as your **common developer interface** is just gone.

We recently reviewed the various tooling we were using on a Microservices project, and came up with a long, long list. All of which a developer needs to be able to develop effectively across the entire system.

Any new joiner would start to write a cheat sheet out. Just like the one in the wiki, of course. The one that no one maintains properly and is actually wrong is various subtle and totally misleading ways.

So when you come to a part of the project you’ve not worked with on a while, you want to get that initial hook, the starting place to construct the ‘Theory’, the mental model of the system that you use to understand what you see in the repo.

Where do you start? First you have to figure out what the entry point is, for tests, runtime. Is there one? What’s the build tool?

**What if there’s more than one?**

Sound familiar?

## Enter Make, the Once and Future Dev Tool

For all of our projects, we now use make as the top level developer tooling. Every project is driven from a Makefile. Internally, this delegates to the tooling we know and love. So, for a java project, Gradle, for Clojure, Leiningen and so on.

This allows us to encode the coarse things a developer needs to do in a file that is checked in with the project.

Ever had to go digging into a CI server for how it actually does a release using Gradle?

For our projects that’s as simple as looking in the Makefile for what the `release` target is.

This helps from a vocabulary point of view, you decide your top level tasks, likely `test`, `build`, `release`, `clean` and put those in every Makefile.

Looking like so
    
    
    build:
    	./gradlew assemble
    
    test: build
    	./gradlew test
    
    release:
    	./gradlew publishSnapshot
    
    clean:
    	./gradlew clean
    	rm -rf outputs

This same api could wrap node projects, docker-compose projects, some combination of the all of them, with the exact same developer api.

Then, any developer can go to any project, do quick verifications and use the other make targets to start understanding more of the details.

Adding a new language into the system becomes feasible again, CI can build it with no modifications, it just calls `make test` in every instance.

You can see an example of this in [This Project](<https://github.com/muoncore/muon-intro-talk>)

So, I’m not proposing to replace your developer tooling. I’m saying your toolbox is incomplete. You need to use Make around them all, give them consistency and an ease of use.

## It Tab Completes

Did I mention make ships with bash tab autocomplete on most platforms. **Can your dev tool do that?**

[devops](https://daviddawson.me/tag/devops/)[make](https://daviddawson.me/tag/make/)[tech](https://daviddawson.me/tag/tech/)
