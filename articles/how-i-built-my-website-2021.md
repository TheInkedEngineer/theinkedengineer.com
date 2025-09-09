---
title: 'How I built my website - 2021 Version'
date: '2021-04-25'
description: 'A general overview of how I build my portfolio website in 2021 using Swift.'
---

#  How I built my website - 2021 Version

I finally got around to building my website. It serves as a contact card to the world, and a place where I can blog about tech, music and personal rants.
It will (maybe?) eventually include my app portfolio, but that is not a priority at the moment.

> All the code to my website is **open source** and can be found on <a href="https://github.com/TheInkedEngineer/portfolio" target="_blank">github</a>

## Alternatives

I used to write my articles on `Medium` but it's safe to say they done fucked up so bad, no one likes that platform anymore. 
Their paywall is awful, and no one actually gets to read what you want to share easily.

The top alternatives where:

1. **[world.hey.com](https://world.hey.com)** 

  A great solution if you're a less technical person, or all you're looking for is a blog to write down your ideas. It's super lightweight and a post is as easy as sending an email. 
  \
  \
  I did evaluate this option since I do own a `hey.com` email account, but there where two main problems: 
    - I wanted my landing page, and I might want to add a portfolio later. So hosting my blog there would've let to people leaving my website when reading an article. Or even worse, not knowing about it if I just share the URL of the article.
    - Lack of analytics.


2. **[GatsbyJS](https://www.gatsbyjs.com)**

Gatsby sounded like a viable solution. I read great things about it online, and it covered the issues I had with *world.hey.com*, but for those who don't know, [I hate Javascript](http://www.ihatejavascript.com).


## Technologies to build my website

I did not want to deal with HTML and Javascript. I'm not a big fan. I can manage, but if I can do without, I'd be happy.
This is where John Sundell's [Publish](https://github.com/JohnSundell/Publish), [Plot](https://github.com/JohnSundell/Plot), and [Ink](https://github.com/JohnSundell/Ink),
comes into play.
By using these 3 open-source frameworks I was able to create my website using only Swift and plain old CSS. 
That meant less duplicate code, less typos, faster load times (it's a static website) and easier to evolve.

The website is powered by a theme. Publish comes with a default `.foundation` theme but it is super easy to replace and create your own, which I did.
Once you create it, publishing a new article is super easy, you just add a *Markdown* file in the *Content* folder under the right section, build and voilà your full website code can be found it the `Output` folder alongside an `RSS` feed, and a `sitemap`.

Analytics is powered by [Plausible](https://plausible.io/).  It's a privacy focused open-source saas analytics. It provides anonymous analytics that would help me better the blog without jeopardizing people's privacy. 


## Deploying

I host my website on DigitalOcean. Once I run the project, and the static website is generated, I run a small script I wrote, that pushes the changes to my server instantly. 

To learn more on how this is done checkout [this article](../insights/deploy-a-website-using-git/) I wrote.
