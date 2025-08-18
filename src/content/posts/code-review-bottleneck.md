---
title: "Writing the Code Was Probably Not Your Main Bottleneck"
description: "How AI-generated code is making code review the new bottleneck and strategies to manage it effectively"
date: "2025-06-09"
readTime: "3 min read"
featured: true
type: "markdown"
tags:
  [
    "code-review",
    "ai",
    "development",
    "bottleneck",
    "stacked-diffs",
    "graphite",
    "augmented-engineering",
  ]
author: "Craig Sturgis"
headerImage: "/images/posts/code-review-tidal-wave.jpeg"
---

Writing the code was probably not your main bottleneck, but development agents writing gobs of code are going to make the real bottleneck a lot more prominent.

One I'm personally feeling right now? Code review.

AI writes the vast majority of my code now, but I still review every line if it's something someone will be paying for vs. my own vibe coded toys.

Claude Code and Cursor can in one or a few shots solve what I'm working on, but without a lot of care on my part they produce PRs with many, many files and thousands of lines of code. Even the most diligent reviewer is going to struggle to not have their eyes glaze over.

You can also use agents for review which is useful - copilot as a reviewer has given me a few morsels of value, and I'm experimenting with a review oriented command in Claude Code.

Also on my list to try: Charlie from Charlie labs which I've heard is a really good reviewer.

But relying mostly or fully on agents still can leave you with a system where the people responsible for maintaining it don't really understand it. Not great when something inevitably goes wrong.

One approach I'm feeling good about? Being really intentional about creating multiple, sequential PRs that are digestible enough to review in a few minutes and behind feature flags where possible.

I think something like the "stacked diffs" workflow that I've read about thanks to Gergely Orosz could be increasingly useful in this augmented engineering world. There's a startup called Graphite working to bring a flow like it into a GitHub centric workflow where most of us live. I'm planning to try the next chance I have in a team environment.

Will report back as I learn more, but in the meantime remember to have empathy for the reviewer - and the future you or your colleague working the incident.

Where's your current bottleneck?

---

[Join the conversation on LinkedIn](https://www.linkedin.com/posts/craigsturgis_writing-the-code-was-probably-not-your-main-activity-7350924560164114432-nwFD/)
