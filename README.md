# Follicle

A story-led hair and scalp intake experience built with Next.js and TypeScript.

This app is designed to feel like the patient is telling their hair story rather than filling out a traditional medical questionnaire. The intake follows the PDF as the source of truth and produces a complete structured summary at the end.

## What this app does

- Guides the patient through a narrative, editorial flow
- Preserves a conversational experience without turning the journey into a rigid form
- Keeps a canonical intake state in one place
- Distinguishes unanswered vs explicit answers, especially important for multi-select and negative cases like “None of these”
- Validates the final intake before completion
- Renders both the narrative story and the structured complete hair & scalp intake summary

## Core product principles

- Story-first UX over form-first UX
- No fake defaults or hidden assumptions
- Explicit representation for “none” and other edge states
- Canonical state as the single source of truth
- Final structured output must reflect the patient’s actual selections

## Key implementation areas

- Story flow and chapter sequencing: `src/app/story/page.tsx`
- Canonical intake state and validation: `src/app/story/context/StoryContext.tsx`
- Story chapters: `src/app/story/components/`
- Final payoff screen: `src/app/story/components/Chapter16Payoff.tsx`

## Local development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Open http://localhost:3000 in the browser.

## Validation and checks

Type-check the app:

```bash
npm run type-check
```

## Notes on data model

The app treats these states distinctly:

- `null` = unanswered
- `false` = explicitly answered “No”
- `true` = explicitly answered “Yes”
- `['none']` = explicitly answered “None of these”
- `[]` = not considered a valid completed answer for this question

This distinction is important so the final intake does not misread an explicit answer as missing data.
