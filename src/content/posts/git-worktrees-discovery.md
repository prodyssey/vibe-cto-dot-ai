---
title: "Discovering Git Worktrees for Multi-Agent Development"
description: "How git worktrees enable effective collaboration with multiple coding agents without the context switching penalties"
date: "2025-06-24"
readTime: "2 min read"
featured: true
type: "markdown"
tags:
  [
    "git",
    "worktrees",
    "augmented-engineering",
    "ai",
    "coding",
    "agents",
    "development",
    "workflow",
    "productivity",
  ]
author: "Craig Sturgis"
headerImage: "/images/posts/git-worktrees.jpeg"
---

I had never even heard of git worktrees before a couple of weeks ago, and I've been working with git professionally on and off for at least a dozen years.

Turns out, they're just the ticket for solving my problem of sitting and waiting for a coding agent to crank through a longer running hard task - allowing me to easily switch to another related task and collaborate with another agent on that.

I think Codex and Cursor's and its competitors background agents along with Devin are attempting to productize this type of thing, but this also lets me keep everything local which for a lot of environments is faster.

So, I asked Claude Code to write me a quick script to create a new worktree with a branch name I give it and pop a new cursor window in that context. It put some guardrails in bash I wouldn't have thought of to make sure I'm not doing something dumb by accident, and suggested an alias to make it memorable. I also had it make another script and alias to help me clean up after I'm done with it.

Context switching is the enemy of most software engineering, but as long as I'm not switching to another project entirely, this is the type of multi tasking I think has promise.

At first blush it feels more like hands on working with a team, not just pairing. I think both modes of working have their place, with people and with robots.

---

[Join the conversation on LinkedIn](https://www.linkedin.com/posts/craigsturgis_i-had-never-even-heard-of-git-worktrees-before-activity-7343354031932657664-N_JW)
