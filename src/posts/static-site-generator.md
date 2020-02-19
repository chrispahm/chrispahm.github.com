---
title: How to build a blog in less than 100 lines of code
preview: Despite the many options available for static site generators, I wasn't really convinced with any of them. All I wanted was a simple, easy to customize option. And I wanted to write it myself 😄
keywords:
  - Blog
  - JavaScript
  - Design
date: 'Feb 2020'
---

# How to build a blog in less than 100 lines of code

I've been thinking about writing a blog for quite some time. There are a couple of reasons that were motivating me to get started: One point was that I thought I should write down and comment on some of the code that I write, so I could get back to it at a later stage more easily, or just use it as a reference. A further reason was this wonderful conversation I had with [Vanessa Sochat](https://github.com/chrispahm/chartjs-plugin-dragdata/issues/23#issuecomment-512803640) (still makes me super happy to read!). And finally, I wanted to get better at writing!

As of right now, I'm painfully slow at writing, and to be honest, I don't like at all that much. Especially in the scientific context, I'm regularly procrastinating instead of just getting started with a manuscript. However, that is about to change! Well, at least I hope so, as I want to gain more writing practice when working on this blog 😄

Alright, so for writing a blog, you actually need to set-up a blog somewhere. My requirements were simple: I wanted to host it on GitHub pages, have the actual posts written in [Markdown](https://de.wikipedia.org/wiki/Markdown), and wanted as little setup/overhead as possible.

My first try was setting up [Jekyll](https://help.github.com/en/github/working-with-github-pages/setting-up-a-github-pages-site-with-jekyll) on GithHub pages. After deciding on the beautiful [Chalk](http://chalk.nielsenramon.com/) theme, I started following the documentation on how to get things up and running. 

[![Chalk](http://chalk.nielsenramon.com/assets/documentation/chalk-intro@2x-d0c0ee7141c3804d3a7c0db8992cbbb8248913a9f85923f1d3fa8343093978f0.png)](http://chalk.nielsenramon.com/)

The documentation is well written, however I was a little intimidated by its length. Install the software, prepare the git repo, understand local site testing, get to know how to add new posts/sites, read through the Chalk documentation to learn about customization. It all felt like a greater commitment than I initially intended. So after forking Chalk, I ended up not working on it for 3+ months.

Fast forward to a couple of weeks ago, the whole blog idea came up once again. Thinking about whether to continue work on the Jekyll based blog, I came to the conclusion that writing a static site generator myself shouldn't be all that hard. Conceptually, I thought that I would need a template `html` file, and a directory for my markdown posts. I also wanted to have a `projects` and an `about` page. Here, I thought writing these in `html` would be preferable, as that would give me more options on the individual styling than with parsed Markdown. Regarding the design, I wanted to closely stick to the wonderful blog by [Rasmus Andersson](https://rsms.me/). I especially love his [Inter typeface](https://rsms.me/inter/), which I plan to use on more upcoming projects.

![Blog setup](/assets/blog-setup.png)

The image above shows the actual file structure. The overarching `index.html`, containing the header and footer, as well as the content div's for the about and projects page are stored in the `template` folder. As mentioned earlier, the `posts` directory contains the Markdown files. And that's basically it! Sure, there is a top level `assets` folder where the `.css` and other static resources live, but all in all there is not much magic to the general setup. 

