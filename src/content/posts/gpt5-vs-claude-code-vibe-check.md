---
title: "Vibe Check: GPT-5 in Codex CLI vs Claude Code"
description: "Comparing GPT-5 and Claude Code for building a Linear workspace migration tool - the polish difference is significant"
date: "2025-08-10"
readTime: "3 min read"
featured: false
type: "markdown"
tags:
  [
    "vibecoding",
    "augmented-engineering",
    "gpt5",
    "claude",
    "linear",
    "migration",
    "comparison",
    "codex-cli",
  ]
author: "Craig Sturgis"
headerImage: "/images/posts/vibe-check-gpt-5-codex.jpeg"
---

Vibe check: tried GPT-5 in codex CLI. It's not close to Claude Code with Sonnet / Opus 4 yet.

Task I tried: creating a migration tool for linear to combine 3 separate workspaces I have into a single workspace with multiple teams.

Why am I doing this? I love linear and have been using it as a task tracker for various projects (and even content ideas)

At the time, it seemed easier to spin up new workspaces for each area of focus, but quickly I ran into annoyances and a GitHub org only allows one linear app install.

Since I recently got a free year of linear business from Lenny's Newsletter's amazing bundle, I figured migrating to one workspace and multiple teams was worth a quick attempt during weekend kid rest time.

Linear doesn't have a migration tool, but it does have a great, well documented API, so this is a great straightforward use case for a coding agent to knock out.

Codex CLI: the difference in polish here is really big for somebody used to working in Claude code.

The solution worked after some back and forth, but it was kind of crazy in what it chose to set up and was not following best practices for the type of quick node console app it went with - I intentionally did not put my thumb on the scale of framework or language choice.

After going back and forth with it and having it migrate a bunch of issues in the wrong order to preserve issue keys and having to tell it to migrate status too, it got out of sync and I spent a bit trying to work with it to build a migration map before calling a time out.

I spun up a new team in my linear workspace, and gave the task to claude code with the same prompt.

Within minutes, I had a better starting project that automatically set up a .env for me for secrets and got 85% of what I wanted in a way I would have set it up if I was doing it from scratch myself.

20 minutes of back and forth and all of my linear stuff is in my one workspace under multiple teams.

I have not tried GPT-5 yet in cursor or the brand new cursor CLI, but I increasingly find myself using Cursor as just an editor + diff reviewer since what happens in claude code is largely good enough for me. It's on the list.

I'll set a reminder to try codex cli again in a month or so, but so far me and Claude code are still best buds (for now).

Fellow augmented engineers, what's your take?

---

[Join the conversation on LinkedIn](https://www.linkedin.com/posts/craigsturgis_vibecoding-augmentedengineering-activity-7360384601606836224-KncK/)
