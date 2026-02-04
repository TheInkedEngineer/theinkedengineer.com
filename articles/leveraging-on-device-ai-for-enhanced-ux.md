---
title: 'A New Chapter: Leaving Milan and Moving to Zurich'
date: '2026-02-05'
description: 'How Apple’s on-device foundation models change the way developers build, ship, and scale AI features.'
is_hidden: true
---

# Leveraging On-Device AI for Enhanced User Experience

The last few years of the AI boom have been defined by the "API Economy." Developers have become accustomed to a specific workflow: capture user intent, send it to a massive server-side model, pay a "token tax," and wait for a response. It is a model built on variable costs and the assumption that intelligence must be outsourced to a data center.

However, the landscape is shifting. While Apple Intelligence first arrived for users in iOS 18.2, the later introduction of the **Foundation Models framework (starting in iOS 26.0, iPadOS 26.0, and corresponding macOS releases)** has opened a new door for developers. We are entering the era of **On-Device AI**—a fundamental change in how we design, fund, and scale mobile experiences.

## The On-Device AI Opportunity: A Strategic Shift

On-device AI eliminates the three "invisible" taxes of traditional AI: **Direct Billing, Latency, and Privacy.** 

### No Per-Token Fees
From a developer’s operational perspective, on-device AI represents a move toward **no per-request billing**. While there is always a "cost" in terms of battery life, thermal impact, and Neural Engine cycles, there is no marginal API fee for generating text. This allows AI features to transition from "premium add-ons" to "standard capabilities" that can be integrated into the core user experience without scaling your monthly cloud bill.

### Privacy as a Competitive Advantage
On-device processing is the ultimate trust signal. For supported tasks, data never leaves the device, eliminating the need for complex data-processing agreements or third-party server logging. For developers, this simplifies regulatory compliance (GDPR/CCPA) and offers a "privacy-first" marketing angle that resonates with modern users.

### Toward Offline-First Intelligence
While not all system features are universal, on-device models enable a future where "smart" features—like text transformation, data extraction, and summarization—remain functional even when a user is in Airplane Mode or has an unstable connection.

## What You Can Build: Practical Use Cases

The foundation models integrated into the OS—typically in the 3-billion-parameter range—are specialized foundation models. They excel at short-form content generation and structured text transformation.

### Content Generation Examples
1.  **Personalized Messaging:** A fitness app generating motivational messages based on a user's recent workout history stored in HealthKit.
2.  **Smart Summarization:** Condensing a specific message thread or a brief document into 2-3 actionable bullet points.
3.  **Dynamic Title Generation:** Analyzing the first few lines of a note or voice memo to suggest a concise, 3-word title automatically.

The possibilities are infinite. For our AI week at GetYourGuide I leveraged Apple Intelligence and prompt engineering to build a POC for voice based search.

### What Makes a Good Prompt?
On-device models require explicit "guardrails." Because the model is smaller than a server-side giant, you must be the "director." A successful prompt should include:
*   **Role Definition:** "You are a professional editor."
*   **Input Boundaries:** "Use ONLY the provided text."
*   **Hard Constraints:** "Maximum 20 words. No greetings."
*   **Style Guidance:** "Use a supportive but professional tone."

### What NOT to Build
*   **Long-form Content:** Do not expect a local model to write a 1,000-word essay; it is optimized for concise, high-utility outputs.
*   **Real-time Chat Interfaces:** While performance is high, there is still perceptible generation time that may feel sluggish for continuous, "human-like" chatting.
*   **Tasks Requiring Real-Time External Knowledge:** The model does not know today's weather or stock prices unless you provide that data within the context.

## Technical Constraints: The 4,096-Token Reality

Understanding the limitations of on-device models is crucial for setting realistic expectations. As outlined in **Apple’s technical notes (including TN3193)**, the context window is your primary constraint.

### The Session Window
The on-device foundation model typically utilizes a **4,096-token context window per session**. 
*   **Shared Space:** It is vital to remember that this window is shared. Both your **input prompt** and the **model's generated response** contribute to this 4,096-token limit.
*   **Management:** If your prompt is 3,500 tokens long, the model only has about 500 tokens left to generate a response before hitting the ceiling.

### Latency and UX
Generation speed is not instantaneous. While Apple’s Neural Engine (ANE) is incredibly fast, generation time is often on the order of several hundred milliseconds to a few seconds, depending on the device and the output length. 
*   **UX Strategy:** Always use shimmer effects, progress indicators, or background processing to ensure the app feels responsive during the "thinking" phase.

### Non-Deterministic Output
Identical prompts can yield slightly different results. Developers should focus on testing for the **structure and quality** of the output rather than expecting a literal string-match every time.

## Speech Recognition Integration: The Voice Pipeline

Combining the **Speech Framework** with the **Foundation Models framework** creates a powerful, private, voice-driven experience.

**The Pipeline:**
1.  **CAPTURE:** Use `SFSpeechRecognizer` to transcribe audio locally. (Note: On-device support is language and device-dependent).
2.  **EXTRACT:** Use an AI prompt to turn messy spoken text into structured data (e.g., removing "uhms" and "ahhs").
3.  **GENERATE:** Pass that structured data into a final prompt to create a polished response or execute an app action.

**Example:** A user says, "I've got... uh... chicken and some rice." The AI extracts `["chicken", "rice"]` and suggests, "How about a simple chicken congee?"

## Overcoming Limits: The Chaining Strategy

If your task exceeds the **4,096-token session window**, you must use **Prompt Chaining**. This involves breaking a complex task into smaller, sequential steps.

**The Pattern:**
1.  **Step 1 (Chunking):** Split a long document into 1,000-token sections and summarize each.
2.  **Step 2 (Theming):** Combine those summaries into a new prompt to identify main themes.
3.  **Step 3 (Action):** Use the themes to generate a final recommendation.

While this increases total processing time and battery impact, it is the most effective way to handle data that exceeds the native session limits.

## Prompt Engineering: Treating Prompts as Code

With on-device AI, **the prompt is a first-class citizen of your codebase.** It should be versioned, tested, and structured with the same rigor as your Swift logic.

### A Structured Prompt Template:
*   **ROLE:** Define the AI identity.
*   **CONTEXT:** List exactly what's available (be minimal to save tokens).
*   **GOAL:** Define the specific output required.
*   **HARD RULES:** List non-negotiable constraints (e.g., "No bullet points").
*   **OUTPUT:** Define the format.


## Privacy and Trust: The Strategic Edge

On-device processing isn't just a technical detail; it's a marketing differentiator.
*   **No Server Logs:** You can truthfully tell users: "We never see your data."
*   **Regulatory Advantage:** GDPR and CCPA compliance is simplified when sensitive data never leaves the hardware.
*   **Airplane Mode:** Your app remains "smart" even without a data connection.

## When NOT to Use On-Device AI

Honest assessment prevents poor user experiences. Do not use on-device AI if:
1.  **Accuracy is Mission-Critical:** For medical or financial calculations, use deterministic code.
2.  **You Need Live Data:** The model doesn't know the news unless you provide it.
3.  **Hardware is a Barrier:** Currently, Apple Intelligence requires compatible hardware, including **iPhone 15 Pro, the iPhone 16 series or later, and M-series iPads and Macs**. You must have a fallback or "graceful degradation" plan for users on older devices.

## The Future Implications

The shift toward on-device AI is a democratization of intelligence. We are moving toward a world where every app has a basic level of "reasoning" built-in.

**Key Questions for Product Teams:**
*   **Differentiation:** If every app can summarize text for free, what unique data does *your* app have that makes the AI more useful?
*   **Prompt Engineering:** Does your team have the skill set to manage a library of local prompt templates?
*   **Hybrid Logic:** When should you escalate a task from the local model to a more powerful server-side API?

## Conclusion: Practical Next Steps

The era of on-device AI is a strategic shift from "AI as a Service" to "AI as a Utility." To stay ahead:

1.  **Audit Existing Features:** Identify "low-hanging fruit" like title generation or short-form summarization.
2.  **Experiment with the Framework:** Use the **Foundation Models framework** in the iOS 26.0+ SDKs to test prompts on physical hardware.
3.  **Manage Your Window:** Design your prompts to fit comfortably within the **4,096-token session window**.
4.  **Embrace Privacy:** Make on-device processing a core part of your brand’s value proposition.

By moving the "brain" of the app onto the device, we aren't just saving on API costs—we are building faster, more private, and more resilient software.