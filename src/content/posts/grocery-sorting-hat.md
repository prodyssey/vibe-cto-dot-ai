---
title: "Vibe Coding Show & Tell: The Grocery Sorting Hat"
description: "How I built a personal budgeting helper using vibe coding to automatically categorize grocery purchases for YNAB"
date: "2025-07-27"
readTime: "4 min read"
featured: true
type: "markdown"
tags:
  [
    "vibe-coding",
    "show-and-tell",
    "youneedabudget",
    "ynab",
    "budgeting",
    "personal-projects",
    "sqlite",
    "automation",
  ]
author: "Craig Sturgis"
headerImage: "/images/posts/grocery-sorting-hat-1.jpeg"
---

Vibe coding show & tell: The Grocery Sorting Hat

One of the things true vibe coding is great for right now is low stakes, personal projects that will probably never make a dollar, but that solve a personal problem way better than the alternatives.

I'm kind of a crazy person about budgeting - I have budgeted every dollar in and out for years using an app called YNAB, and it fits with how my brain works.

Big grocery chains are not the most accessible to tinkerers, so for a long time I would go line by line every weekend and bucket what we bought into the right budget categories, because "groceries" is not sufficient for what I'm doing here.

![A typical YNAB screen for me](/images/posts/grocery-sorting-hat-2.jpeg)

In March of this year, I decided to try to make something to take some of the manual work out of this process.

I went into cursor and did some true vibe coding: I didn't closely review the output, and just accepted what was there as long as it worked as I expected. When it didn't, I directed it further and copy pasted errors in.

I even let Claude (3.5 I think at this time) design an SVG logo that doesn't look great but I think it has some understated charm.

I don't time track my budgeting time, but it feels like this part of it goes a lot faster now.

Here's how it works: I copy and paste the full set of items into the text field, pick the source, and it uses a text parser it built based on me copy pasting examples in for the agent to build around.

It recognizes items it has seen before, and uses the same categorization.

For new items, it asks me to bucket them according to the categories I've set up, but categories can be added to at any time. Check out [this screencast](https://share.cleanshot.com/wl2zwnGb) if you want to see it in action as I bucket an order that mixed groceries for meals, a 5 year old's batting helmet, WD40, and other essentials.

![Categorizing new items with dropdown selections](/images/posts/grocery-sorting-hat-3.jpeg)

For simplicity, it used a simple SQLite database locally.

After everything is categorized, it gives me an easy readout I can quickly use for splitting the transaction in YNAB, and I'm off to the next thing.

![Final categorized output ready for YNAB](/images/posts/grocery-sorting-hat-4.jpeg)

A couple of weeks ago I got tired of having to make sure the app was running locally to use it, so I fired up Claude code and asked it to help me get it up and running in Cloudflare workers with their D1 database which is an adaptation of sqlite.

Now, it's got its own little home on the web, hosted by cloudflare for free and is just a bookmark away every weekend.

Claude code helped me build its own little authentication + account system so nobody messes with my database, and technically other people can sign up for and use it for their own purposes, I'm just not sure why they would want to.

It messed some things up as part of the conversion, but with more back and forth with claude and some pasting of errors, we were good to go. I commit to git and push to github branches at working stopping points so I can go back at any time.

What low stakes "just for me" things are you vibe coding?
😄🤓🤖

---

[Join the conversation on LinkedIn](https://www.linkedin.com/posts/craigsturgis_vibecoding-youneedabudget-activity-7355316358617681920-Tmc9/)
