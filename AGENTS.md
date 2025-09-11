# AGENTS.md — UI + Code Rules for This Repo

Scope: Applies to the entire repository unless a more-specific AGENTS.md overrides it.

Purpose: Keep UI consistent by always using the design system, reusable components, and tokens already defined in this codebase.

## Core Principles
- Prefer reusable components over inline styling or one-off Tailwind classes.
- Always use tokens and utilities from `@/lib/design-system` and `@/lib/utils`.
- Constrain colors to brand tokens; avoid ad‑hoc hex values and non-brand Tailwind colors.
- Preserve intentional differences: brutalist Home typography and pink background on Hire Me are deliberate.

## Design System & Tokens
- Import typography/spacing tokens from `@/lib/design-system` (e.g., `typography`, `spacing`).
- Use `cn` from `@/lib/utils` for class composition.
- Opacity rules:
  - Decorative/background text: 30
  - Secondary text: 70
  - Primary text: 100
  - Disabled: 50

## Layout & Spacing
- Containers/sections: use `spacing.container` and `spacing.section`; do not hardcode `px`/`py` per page.
- Card padding:
  - Default: `p-6 md:p-8 lg:p-10`
  - Compact: `p-4 md:p-6`

## Typography
- Use the `Title` component for headings; select the right `as` and `variant` (e.g., `variant="card"`).
- Main titles: `text-5xl sm:text-6xl md:text-8xl font-black leading-tight` (implemented via `typography.title`).
- Subtitles: `text-lg sm:text-xl md:text-2xl font-medium leading-relaxed` (use `typography.subtitle`).
- Do not mix `font-extrabold`/`font-bold` for main titles; stick to `font-black` (except on Home per design).

## Components (Use, Don’t Rebuild)
- Card: `components/ui/card` with `variant: 'default' | 'compact' | 'hero'` and `interactive` flag.
- Button: `components/ui/button` with `variant: 'primary' | 'secondary' | 'ghost'` and `size: 'sm' | 'md' | 'lg'`; hover transitions ~300ms.
- Badge/Tag: `components/ui/badge` for status/tech; no bespoke tag styles.
- Toggle/Segmented: `components/segmented-switch`; do not create custom toggles.
- Animation wrappers: `EaseIn` for entrances and `TiltCard` for interactive cards (max tilt ≈ 6deg). Use them consistently.

## Color & Status
- Brand backgrounds: default `bg-brand-yellow`; use `bg-brand-pink` only for intentional sections (e.g., Hire Me).
- Cards: `bg-white border-4 border-brand-black hover:border-brand-pink`.
- Status badges:
  - Live: `bg-brand-black text-brand-yellow`
  - In Progress: `bg-brand-yellow text-brand-black`
  - Inactive: `bg-gray-200 text-gray-700`
  - Special: `bg-brand-pink text-brand-black`

## Borders, Radius, Shadows
- Border width: `border-4` for cards.
- Radius: `rounded-2xl md:rounded-3xl` for cards; `rounded-full` for buttons and badges.
- Shadows: default `shadow-lg`, hover `shadow-2xl`, elevated `shadow-xl` when needed.

## Animation & Timing
- Use `getAnimationDelay(index, 50, 200)` for lists and `getAnimationDelay(index, 75, 300)` for grids; `100, 300` for hero.
- `EaseIn` default duration ≈ 500ms; hover transitions ≈ 300ms.
- Respect `prefers-reduced-motion` and ensure keyboard/focus states.

## Accessibility & Semantics
- Maintain semantic heading hierarchy with `Title` and proper HTML tags.
- Ensure keyboard operability for interactive cards and controls.
- Check color contrast when pairing brand colors.

## Do / Don’t
- Do: reuse components, apply tokens, keep styles consistent across pages.
- Do: centralize new patterns into shared components.
- Don’t: introduce raw hex colors or non-brand Tailwind palettes.
- Don’t: hardcode padding/spacing where tokens/utilities exist.
- Don’t: create ad‑hoc buttons/cards/toggles.

## Exceptions (Intentional Design)
- Home page brutalist typography may deviate as designed.
- Hire Me page uses a pink background intentionally.

## References
- UI alignment plan: `UI_ALIGNMENT_PLAN.md`
- UI consistency analysis: `UI_CONSISTENCY_ANALYSIS.md`

When in doubt, follow these rules and the referenced docs; update shared components/utilities instead of adding page-specific styles.

