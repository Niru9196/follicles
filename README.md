# Follicle

Follicle is a story-led hair and scalp intake experience built in Next.js with TypeScript. It is designed to make the patient feel like they are narrating their hair story, not checking boxes in a clinical form.

The app follows the PDF intake as the source of truth and produces a final structured summary that reflects the user’s actual answers.

## What the app does

- Walks the patient through a narrative, editorial flow
- Keeps the intake experience conversational instead of form-first
- Maintains a single canonical intake state for all questions
- Distinguishes missing answers from explicit answers such as “No” and “None of these”
- Validates answer consistency before completion
- Shows both the patient-facing hair story and the complete intake summary at the end

## Product principles

- Story-first UX over form-first UX
- No fake defaults or hidden assumptions
- Clear treatment of edge states such as explicit none, multi-select, and conditional follow-ups
- Final output should mirror the patient’s actual responses, not a guessed or normalized version
- Preserve a premium, calm, editorial feel without turning the journey into a medical checklist

## How to run it

Install dependencies:

```bash
npm install
```

Run the app in development mode:

```bash
npm run dev
```

Open the app in the browser at:

```text
http://localhost:4028
```

Other useful commands:

```bash
npm run type-check
npm run build
npm run start
```

## Hosting and live demo

This app is designed to deploy cleanly on Vercel with zero extra app-specific configuration. Vercel is the preferred hosting option because it works directly with the Next.js app, gives a live link without local setup, and matches the brief requirement for a working demo that does not require installation.

Live demo:

```text
https://follicles.vercel.app/
```

This satisfies the requirement for a live link that works without the user needing to install dependencies or run the app locally.

## Stack and technical choices

### Built in-house
- Next.js 15 with App Router
- TypeScript
- React 19
- Tailwind CSS for styling and layout
- Framer Motion for subtle motion and reveal patterns
- Custom story/intake logic in the app state layer

### Bought / third-party ecosystem
- Next.js framework and runtime
- Tailwind and utility styling dependencies
- Standard TypeScript tooling and ESLint config
- No premium AI provider or clinical SaaS subscription was required for this version

### AI / model choices
This version does not yet wire a real external model into the patient flow. The app currently uses a local, structured state model to drive the intake and final output. That was intentional: it keeps the product reliable, fast, and easy to reason about while preserving the PDF-backed intake structure.

Voice input is also implemented with the browser’s native Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) for short free-form moments in the flow, such as the opening hair-story prompt and other describe-it answers. This is a deliberate "build over buy" decision: the accuracy needs for short conversational phrases are low enough that the native browser API is sufficient, it is free, it runs entirely client-side with zero latency, and it avoids any external API keys or paid transcription service.

If this were expanded in a real production setup, the most logical next step would be:
- a secure backend service for storing and validating intake responses
- an LLM or structured extraction layer to transform the final data into clinician-friendly summaries
- optional model-based summarization for patient follow-up or internal review

For this build, the “model” was effectively the app’s own logic layer rather than an external LLM call. That kept the experience deterministic and aligned with the product requirement: the final output must represent patient answers accurately.

## What we tested and how we validated it

We validated the experience in the actual app, not with mock-heavy tests. The checks focused on real user behavior and real state transitions.

### Validation performed
- Manual story progression across chapters
- Gender-specific logic and conditional chapter rendering
- None-of-these / multi-select edge cases
- Smoking quantity follow-up logic
- Avoiding fake defaults and invalid empty states
- Final structured intake generation from the actual canonical state
- Type-checking and production build verification

### Real checks that mattered
- `null` means unanswered
- `true` / `false` means explicit yes/no
- `['none']` means an explicit none choice
- empty arrays are not treated as valid completed answers
- final summary must reflect actual patient selections

### Session persistence and autosave
- The app stores the patient’s in-progress session in local storage so a mid-intake interruption does not force a restart.
- When the page reloads, the app restores the prior chapter and data state automatically.
- This addresses the core abandonment problem: patients can leave mid-flow and resume without losing their work.

### Validation pass before completion
- Before the final payoff screen, the app runs a validation pass over the canonical state to confirm every non-conditional question has the expected shape and value before it is allowed to render as complete.
- This prevents the app from showing a “complete” intake if it is missing required data, inconsistent, or in an invalid edge-state combination.

### Manual branch testing coverage
- Male patient flow: menstrual and pregnancy follow-ups skip cleanly and do not show irrelevant fields.
- Female patient flow: both menstrual and pregnancy questions appear and are answered appropriately.
- Patient answering “None” to every multi-select: the app preserves explicit none states without collapsing them into empty or invalid arrays.
- Patient who declines voice and uses typed/tapped input: the app falls back to normal input without breaking the story flow.

### Commands run

```bash
npm run type-check
npm run build
```

Both checks were run successfully during the build verification pass.

## What is currently missing

The product is structurally working, but it still does not fully feel like a hair consultation experience yet. The main gaps are:

1. Hair-specific visual identity
   - The experience is more premium dark app than hair/scalp consultation.
   - It lacks clear visual cues tied to hairline, scalp, density, shedding, texture, and condition patterns.
   - There are not yet enough scalp- and hair-related illustrations or references to make the experience feel rooted in hair health.

2. Context-heavy comprehension
   - Some questions still require the user to read more than is ideal to understand what is being asked.
   - The patient may not immediately grasp the meaning of a section without guidance, visual context, or an explanatory illustration.

3. Natural flow at the section level
   - The flow is structured and functional, but more work is needed to make each chapter feel like a guided consultation rather than a sequence of text-heavy steps.
   - Many sections would benefit from a stronger narrative arc: visual cue, explanation, answer, continuation.

4. Lack of hair consultation tone
   - The app does not yet communicate the emotional and clinical tone of a real hair consultation.
   - It should feel calm, credible, and specific to hair health rather than generic digital onboarding.

5. Limited personalization
   - The app is mostly static in how it frames questions.
   - A next-step improvement is to adapt wording, examples, and pacing by age, gender, and patient context without losing medical consistency.

6. Missing contextual support assets
   - There is no strong set of section-specific SVGs, scalp diagrams, hairline illustrations, trigger visuals, or density references yet.
   - These assets would help patients understand the question before they answer it.

## What can change in one week

In one week, the app can be pushed much closer to the intended hair consultation feel without rebuilding the product from scratch.

1. Add hair-specific visuals and section contexts
   - Small scalp, shedding, density, and pattern SVGs in each section
   - Simple visual anchors for hairline, crown thinning, shedding timeline, trigger categories, and treatment types
   - More context-rich imagery to reduce reading effort

2. Improve each section’s natural flow
   - Each chapter can become more guided and less text-heavy
   - Introduce a simple structure: frame the problem visually, explain briefly, then ask the question
   - Keep the story-first feel while making the question easier to understand

3. Voice-led assistance and conversational guidance
   - Voice can be used as an additional layer to make the experience feel closer to a real hair consultation.
   - A patient could hear the question read aloud, respond naturally, or use voice prompts for certain sections.
   - This would reduce reading load, make the journey feel more human, and improve accessibility for users who prefer spoken guidance.

4. Improve comprehension without turning it into a form
   - Less dense text blocks
   - More conversational explanation before answer selection
   - Visual prompts that support understanding without feeling clinical or rigid

4. Personalization through adaptive copy
   - Use an LLM or rule-based logic to tailor wording and examples based on age, gender, or patient context
   - For example: different explanation style for a younger patient vs. an older patient, or different phrasing for male vs. female hair-loss patterns where appropriate
   - Personalization should be medically careful and not make the experience feel too scripted

5. Stronger premium hair-clinic design cues
   - Dark premium palette is fine, but it needs stronger hair-specific visual references
   - Add consultation-like elements such as hairline diagrams, scalp zone cues, and storytelling visuals that feel rooted in expertise

6. Voice-first and conversational UX enhancement
   - Add voice prompts where appropriate to make the intake feel like a consultation rather than a static screen-based form
   - Voice can help explain the rationale behind each question, especially for more complicated or sensitive topics
   - This should complement the visual design, not replace it

7. Make the experience feel more trustworthy and human
   - Add warmer, more natural microcopy
   - Emphasize reassurance and understanding rather than interrogation
   - Present the experience as a consultation journey, not a questionnaire

## Summary

The current app is a good foundation, but it still needs a stronger hair-specific identity, more contextual visual support, and a more natural consultation rhythm. With one focused week of work, the app can become significantly more interpretable, more emotionally aligned, and more convincing as a real hair consultation experience.

## Project structure highlights

- Story flow and sequencing: `src/app/story/page.tsx`
- Canonical intake state and validation: `src/app/story/context/StoryContext.tsx`
- Chapter components: `src/app/story/components/`
- Final story + structured summary screen: `src/app/story/components/Chapter16Payoff.tsx`

## Notes

This project is intentionally designed to feel like a guided story rather than a traditional questionnaire. The product and the data model are aligned around one principle: the patient should feel heard, and the final structured output should remain clinically faithful to their real answer set.

Voice has also been considered as a complementary layer in the product direction. It can make the consultation feel even more natural by reading questions aloud, guiding the user conversationally, and reducing text-heavy friction in a highly personal journey.
