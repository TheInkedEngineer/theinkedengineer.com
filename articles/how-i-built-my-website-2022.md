---
title: 'How I built my website - 2022 Version'
date: '2022-01-03'
description: 'In 2022 I decided to rebuild my website, this time, using actual web technologies. Here is what I chose, and why.'
---

# How I built my website - 2022 Version

Last year, in 2021 I built my website using `Swift` and Vanilla CSS, and you can read about the libraries that enabled me to use `Swift` [here](how-i-built-my-website-2021). It was a fun experience, and if all you want is to build a blog and don't want to invest in learning anything other than `Swift` (which is wrong, by the way), then by all means use those libraries. However, note that the resources to learn are scarce and what you can do is very limited.

This year however, in 2022, I re-wrote the whole website using the latest hot technologies -- [Next.js](http://nextjs.org), [TailwindCSS](http://tailwindcss.com) and deployed using [Vercel](https://vercel.com/). Here is what I learned.

## TailwindCSS is beautiful

One thing I don't like about web development is having to adapt to different browsers, and screen sizes and user settings, stuff you don't usually have to deal with, at least not to the same extent when doing iOS development. CSS has always been something I don't understand, or never really needed to, yet every time I wanted to center a div, hell broke loose. `TailwindCSS` makes all this super easy and intuitive. I only had to write the css for the code syntax (more on that later) but other than that I wrote 0 CSS. TailwindCSS offers a customizable configuration to override their default values, and even there I only had to override the font-family (I used a custom one), the colors and 3 default font sizes (to map them to the design I had prepared). Other than that, everything was just out of the box.
I fully recommend it. It will be my default choice moving forward. It is super well documented, yet so intuitive you barely have to look to the documentation to begin with.

## Nextjs is a nice abstraction over REACT

Next.js is a feature-rich REACT framework. Yes, you read that right. A framework for the framework. They define it in the following manner "Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more. No config needed." And boy did it live up to that description. I've worked a bit with react building [fattiicazzituoi.it](https://fattiicazzituoi.it) and it was OK - I hate `Javascript`, remember? - but Next.js takes that experience an extra notch building customizable abstractions on top of react. 

My favorite features are:
 - `Hybrid` rendering: the same Next.js app can have some pages that are statically rendered, and others that are server-side rendered. This is great to have. It enables flexibility and speed at the same time.
 - `File-System routing`: It basically creates automatic routes using folders and files structures under the `/pages` directory. You can still customize it if you need, but you won't.
 - `Fast Refresh`

And it's loaded with many more features. It definitely has a bright future and I highly recommend it since it supports Typescript out of the box.

## Markdown support with JS is not good

Maybe I was lucky, but the sole experience I had with a Markdown renderer was with [Ink](https://github.com/JohnSundell/Ink) that is written in `Swift` and worked great on the previous version of my website. But now that I migrated to `Javascript`, I had to find an alternative. There were quite a few out there, and they all had one thing in common. They are NOT as good. Especially when it comes to code rendering. Ink was built with code in mind, so it renders it really nice with custom classes and all, none of the JS parses did so nicely. I had to write several hacks to make it work properly. And even then, it's not smooth. I can't have codeblocks that are not highlighted for instance, because the `no-highlight` markdown derivative is not parsed.

I am seriously pondering writing my own parser in Typescript at this point. Not that my backlog of to do projects is infinite. 
Bottom line, this was the only point where I was about to abandon the whole migration and stick with the `Swift` stack, but I didn't, apparently.

## Vercel is magic

Vercel, together with Google and ~Facebook~ Meta, built `Next.js`. Vercel is one of the hottest tech companies out there now. But other than its clout, Vercel offers stupid fast way to get your application online.
It literally took me 2 min, including creating the account and migrating the DNS. It is stupid fast and easy. So much so, I'm not sure what else it offers, but I know it offers around just from digging around their website a bit. Compared to previous experiences of maintaining own server (DigitalOcean) or using AWS (Is there anything more complicated to use out there?) this felt so nice to use. Especially having used `Next.js` to build my web app. Still, Vercel works with 30+ frameworks. It provides you a `.vercel` public `URL` or you can add your own custom domain. 

All this for FREE. Yes, you read that right.

## Javascript is still trash

Anyone who knows me, knows I'm open to learning new technologies and languages. I have worked with several languages and frameworks, they all had their pros and cons, except `Javascript`. It's just awful. Mind you I had very little logic to write with `Javascript` but still the syntax, experience and approach is all awful. I can't fathom the fact the whole internet is built on top of `Javascript`.

Typescript looks promising, and I'll probably re-write the whole thing in Typescript again. I just wanted to give `Javascript` a chance, with an open mind, but no I still [hate Javascript](http://www.ihatejavascript.com).

## Plausible still amazing

I love [Plausible](https://plausible.io). A privacy based analytics system. It's GDPR conformant so no annoying banners to show, and you get all you need to understand your website, without invading your visitor's privacy. I just love it.

## Was all this necessary?

Absolutely not. I just wanted to learn new stuff. I have several projects I want to build, and they require some sort of web development so I used my own website as a starting point to learn these new technologies, and I love most of the stuff about them. It's better to use the right tool for the right job then to find shortcuts. So all you react native developers out there, pick up the `Swift` book and learn how to actually write an iOS app :).
