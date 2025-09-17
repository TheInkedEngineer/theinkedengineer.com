---
title: 'Building My Website in 2025 Without Writing a Single Line of Code'
date: '2025-09-17'
description: 'A story of AI, design, and becoming a code reviewer instead of a coder.'
---

# Building My Website in 2025 Without Writing a Single Line of Code

**A story of AI, design, and becoming a code reviewer instead of a coder.**

## Introduction: The 2025 Web-Building Landscape

The way we build software has fundamentally changed. In 2025, AI is no longer a novelty; it’s a collaborator. But before we dive in, let's set expectations: there is a clear spectrum of what AI can and cannot build. You can’t ask it to create a full aviation control system, nor should you expect it to.

Even within the world of websites, complexity matters. Simple portfolios or marketing pages are now straightforward for AI to handle, and basic SaaS apps are achievable. But if you’re building a multi-tier platform with advanced services, you still need skilled engineers to drive architecture and make critical decisions.

This brings me to my thesis: it is entirely possible to build a beautiful, production-grade website without personally writing a single line of code. But—and this is the crucial part—it only works if you deeply understand how to guide the AI, simplify the problems you give it, and curate its output with an expert eye. This is the story of how I did just that.

## From Designer to Architect: The Starting Point

I’m a Staff iOS Engineer by trade. My days are spent in Xcode, building native apps manually. When it came to building my own portfolio website in the past, the experience was always frustrating. I once spent several days wrestling with CSS, only to settle for a design that was "good enough" rather than "amazing" simply because my web development skills couldn't keep up with my vision.

This time, I set a personal challenge: create my new website, without touching the keyboard to write code.

Everything started with design. I crafted the initial landing page in Figma, focusing on a bold, colorful, and pop-inspired theme. The palette was simple but vibrant: a bright yellow, a soft pink, and stark black text. This Figma file wasn't just a sketch; it was the blueprint for the entire project's visual identity. This time, I felt excited instead of defeated. I wasn’t fighting CSS anymore; I was purely focused on creativity and vision.

## Feeding the Vision to AI: From Design to Skeleton

With my Figma design complete, I turned to v0.app, a generative UI tool. I gave it my single landing page design and a clear set of instructions. My first prompt was specific, referencing my existing (and soon-to-be-replaced) website to provide context for the content:

> I want to build my new website, attached is how I started my design... I want to keep those main colors and have a fun, pop aesthetic. I want to include a page for my articles, which will be md files. Here is the current version: `https://theinkedengineer.com/articles`... and the projects section, which we need to enhance... and divide into iOS and Web Development sections... Be bold and creative.

The results were stunning. The AI nailed the color palette and the vibe I was going for. To be honest, it exceeded my expectations, especially with the blog page it generated. It took my single design and extrapolated a cohesive, multi-page structure that felt like a natural extension of my original vision. This process taught me a critical lesson right away: the clearer your inputs, the closer the AI gets to what you want on the first try.

## My Mantra for This Project

> “AI is only as smart as you are at making it dumb.”
>
> The less it has to guess, the better your results will be.

This isn’t magic. AI reflects the clarity of your instructions. The goal isn’t to throw vague, open-ended prompts at it and hope for brilliance. It’s to systematically remove ambiguity, breaking down complex problems into simple, well-defined steps.

When I asked it to “add a hire me page,” the output was generic and useless. That wasn’t the AI’s failure — it was mine. I hadn’t provided clear constraints or a vision.

The lesson: **make AI dumb, and it will make you unstoppable**.

## Becoming a Code Reviewer, Not a Code Writer

My role in this project evolved rapidly. I wasn't writing code; I was curating, reviewing, and directing AI-generated code. This is where my engineering background became essential. Without a fundamental knowledge of architecture, I couldn't have recognized when the AI was making suboptimal decisions.

For example, to maintain consistency, I knew we needed a design system. But instead of saying "create a scalable design system," I gave it a series of specific, architectural instructions:

> "We need to build a design system that is reusable. Let's start with defining our color tokens. Now, define a reusable Button component with primary, secondary, and tertiary variants that use these color tokens."

I guided it step-by-step, treating it like a junior developer who needed precise instructions. My job was to make the architectural decisions, and the AI’s job was to implement them. It's also critical to note that the AI will get things wrong. It will produce buggy code or make logical errors. My role was to catch those errors, explain to the AI *what* was wrong, and guide it toward a fix. Once fixed, I would review the new code to understand the solution, ensuring it aligned with the project's overall architecture. I was the architect and the quality gate, not the typist.

## Scaling Beyond the MVP

While this portfolio site doesn’t have multilingual support, I experimented with this on another project I’ll be sharing soon. I pushed the AI even further to implement multilingual support for English and Arabic, including right-to-left (RTL) layouts.

Normally, this would have taken me hours, if not days, of research and experimentation. Instead, I had the AI research best practices for me, present the options with pros and cons, and I simply chose the architecture—a lightweight, homegrown i18n solution that fit the project's scope perfectly. The AI then implemented the entire system—URL routing, static dictionaries, and RTL-variant styles with Tailwind—in less than two hours.

This process doesn't just save time on coding; it saves time on learning, while still ensuring you, the human, understand and approve the final solution.

## Key Lessons Learned

*   **Guidance Beats Generation:** The quality of the output is a direct result of the quality of your direction.
*   **Details Are Everything:** Precision in your prompts leads to better first drafts and dramatically fewer iterations.
*   **Review, Refactor, Own:** Never blindly trust AI. Take ownership of the final architecture. You are ultimately responsible for the code.
*   **AI is for Acceleration, Not Replacement:** This tool amplifies a skilled engineer's ability to execute. It needs direction and expert oversight.

## Final Result: What I Built

The journey from a single Figma file to a fully functional, deployed website has been transformative. The final site, built with a Next.js stack and deployed on Vercel, is exactly what I had envisioned: bold, modern, and personal. It’s a portfolio I am truly proud of, and it perfectly reflects where I am in my life and career.

This process felt completely different from traditional coding. It was less about the low-level mechanics of syntax and more about high-level strategy, design, and decision-making. I was able to bring my vision to life without getting bogged down in the CSS frustrations that held me back before.

## The Human Touch: Where AI Stops, Designers Begin

Even after the AI produced a functional release candidate, the job wasn't done. I collaborated with my partner, who has a strong design eye, to polish the final product. This is where the limits of AI became clear. It can build the scaffolding, but it can't perfect the soul.

We noticed small but crucial inconsistencies—font sizes that were slightly off, corner radii that didn't feel quite right. This observation is what pushed me to direct the AI to build a proper design system. Visually, the biggest change was the navigation menu. The AI had created a simple black bar, but my partner suggested a liquid, glass-like bar that allows the colorful background to show through. This small change elevated the entire feel of the site.

This collaboration proved that human creativity, taste, and an innate sense of user experience are irreplaceable. **AI can build the walls, but humans paint the murals**.

## The Future of Building With AI

So, what does this mean for engineers? First and foremost, AI is a coding buddy, not a replacement. Its role is to save time and accelerate execution.

The effectiveness of AI today heavily depends on the domain. It excels at web development because it has been trained on a vast ocean of public code and documentation. Mobile development, especially with newer frameworks and more closed ecosystems, is still a significant challenge for it.

For example, in my iOS work, I recently used an AI to build a macOS app MVP. The app worked, but when I reviewed the code, it was a mess. The AI didn’t clean up after itself, leaving unused variables and inefficient logic everywhere. My solution was to rebuild the app from scratch, using the AI’s messy code as a reference. I directed it to write repetitive or simple parts, which I then reviewed and refactored. In my native development work, its true power lies in documentation and analysis—it's brilliant at explaining what a large, unfamiliar file does.

Ultimately, AI gets its knowledge from what we humans have already built. To stay relevant, we must keep learning, growing, and writing the clean, high-quality code that will eventually train the next generation of AI. The bar for engineers is getting higher, shifting our roles from pure implementation to strategy, architecture, and review.

## Closing Thoughts

The journey of building my website has convinced me of one thing: the future of software development is a partnership between human creativity and AI scalability. It's now possible to build sophisticated projects without writing every line yourself, but this isn't an excuse for ignorance. It's an opportunity to elevate our roles.

Engineers will thrive not by competing with AI, but by learning to guide it. The core skill is no longer just writing code, but articulating a vision with such clarity that a machine can execute it. And so, I'll end with the thought that guided this entire process:

> “AI is only as smart as you are at making it dumb.”
>
> The less it has to guess, the better your results will be.