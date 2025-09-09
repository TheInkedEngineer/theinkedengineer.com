# UI Alignment Implementation Plan

## Overview
This document outlines a comprehensive, phased approach to align UI components across the portfolio while preserving intentional design choices (like the pink hire-me page).

---

## 🎯 Goals
1. Create a consistent design system across all pages
2. Maintain the unique brand identity and creative flair
3. Preserve intentional design choices (pink hire-me page)
4. Improve maintainability and scalability
5. Ensure responsive consistency across all breakpoints

---

## 📊 Phase 1: Typography Standardization
**Priority: HIGH** | **Effort: Medium** | **Impact: High**

### 1.1 Heading Hierarchy Standardization

#### Current Issues:
- Mixed font weights: `font-extrabold` (home) vs `font-black` (other pages)
- Inconsistent responsive breakpoints
- Varying line heights

#### Actions Required:

**Main Page Titles:**
```tsx
// FROM (varies by page):
- Home: text-[10vw] font-extrabold
- Projects: text-6xl md:text-8xl font-black
- Insights: text-5xl sm:text-6xl md:text-8xl font-black
- Hire Me: text-6xl md:text-8xl font-black
- Article: text-4xl md:text-6xl font-black

// TO (standardized):
All pages: text-5xl sm:text-6xl md:text-8xl font-black leading-tight
```

**Subtitles/Descriptions:**
```tsx
// FROM (varies):
- Projects: text-xl md:text-2xl font-medium
- Insights: text-lg sm:text-xl md:text-2xl font-medium leading-relaxed
- Hire Me: text-xl md:text-2xl leading-relaxed

// TO (standardized):
All pages: text-lg sm:text-xl md:text-2xl font-medium leading-relaxed
```

**Files to Update:**
- [x] `/app/page.tsx` - Update home page typography (keep brutalist style but standardize weights)
- [x] `/app/projects/page.tsx` - Add sm: breakpoint
- [ ] `/app/insights/page.tsx` - Already correct, use as reference
- [x] `/app/hire-me/page.tsx` - Add font-medium to subtitle
- [x] `/app/insights/[slug]/page.tsx` - Increase title size to match

### 1.2 Text Opacity Standardization

#### Current Issues:
- Home page: `opacity-24` and `opacity-50`
- Other pages: `opacity-100`
- Inconsistent hover states

#### Actions Required:
```tsx
// Standardize opacity values:
- Decorative/Background text: opacity-30
- Secondary text: opacity-70
- Primary text: opacity-100
- Disabled state: opacity-50
```

**Files to Update:**
- [x] `/app/page.tsx` - Change opacity-24 to opacity-30, opacity-50 to opacity-70

---

## 📦 Phase 2: Spacing & Container Standardization
**Priority: HIGH** | **Effort: Low** | **Impact: Medium**

### 2.1 Container Padding Standardization

#### Current Issues:
- Insights: `px-4 md:px-6`
- Projects: `px-6`
- No consistency in container usage

#### Actions Required:
```tsx
// Standardized container pattern:
<div className="container mx-auto px-4 sm:px-6 lg:px-8">

// Standardized section padding:
<section className="py-12 md:py-16 lg:py-20">
```

**Files to Update:**
- [x] `/app/projects/page.tsx` - Add responsive padding
- [x] `/app/insights/page.tsx` - Add lg:px-8
- [x] `/app/hire-me/page.tsx` - Update to use container pattern
- [x] `/app/insights/[slug]/page.tsx` - Standardize container usage

### 2.2 Card Padding Standardization

#### Current Issues:
- Project cards: `p-8`
- Article cards: `p-6 md:p-8 lg:p-12`
- Talk cards: `p-6`
- Skill cards: `p-8`

#### Actions Required:
```tsx
// Standard card padding:
<div className="p-6 md:p-8 lg:p-10">

// Compact card padding (for smaller cards):
<div className="p-4 md:p-6">
```

**Files to Update:**
- [x] `/app/projects/page.tsx` - Update project cards
- [x] `/components/insights/insights-switcher.tsx` - Standardize article and talk cards
- [x] `/app/hire-me/page.tsx` - Update skill cards

---

## 🎨 Phase 3: Component Consistency
**Priority: MEDIUM** | **Effort: High** | **Impact: High**

### 3.1 Card Component Standardization

#### Current Issues:
- Different border radius approaches
- Inconsistent shadow usage
- Mixed hover states

#### Actions Required:

**Create Reusable Card Component:**
```tsx
// components/ui/card.tsx
interface CardProps {
  variant?: 'default' | 'compact' | 'hero'
  interactive?: boolean
  className?: string
}

// Variants:
- default: bg-white border-4 border-brand-black hover:border-brand-pink rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl p-6 md:p-8 lg:p-10
- compact: Same borders/shadows but p-4 md:p-6
- hero: For CTA sections with special styling
```

**Files to Update:**
- [x] Create `/components/ui/card.tsx`
- [x] Update all pages to use Card component
- [x] Remove inline card styling

### 3.2 Button Component Creation

#### Current Issues:
- Inline button styling everywhere
- Inconsistent padding and radius
- Different hover states

#### Actions Required:

**Create Button Component:**
```tsx
// components/ui/button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

// Variants:
- primary: bg-brand-yellow text-brand-black hover:bg-brand-black hover:text-brand-yellow
- secondary: bg-brand-black text-brand-yellow hover:bg-brand-pink
- ghost: bg-transparent border-2 border-current

// Sizes:
- sm: px-4 py-2 text-sm
- md: px-6 py-3 text-base
- lg: px-8 py-4 text-lg
```

**Files to Update:**
- [x] Create `/components/ui/button.tsx`
- [x] Replace all inline button styling
- [x] Ensure consistent hover transitions (300ms)

---

## 🎭 Phase 4: Animation & Interaction Alignment
**Priority: MEDIUM** | **Effort: Medium** | **Impact: Medium**

### 4.1 Animation Delay Standardization

#### Current Issues:
- Projects: `Math.min(index * 60, 180)`
- Insights: `Math.min(index * 40, 160)`
- Talks: `Math.min(index * 120, 240)`

#### Actions Required:
```tsx
// Standardized delay calculation:
const getAnimationDelay = (index: number, multiplier = 50, max = 200) => {
  return Math.min(index * multiplier, max)
}

// Usage:
- List items: getAnimationDelay(index, 50, 200)
- Grid items: getAnimationDelay(index, 75, 300)
- Hero elements: getAnimationDelay(index, 100, 300)
```

**Files to Update:**
- [x] Create utility function in `/lib/utils.ts`
- [x] `/app/projects/page.tsx` - Use standard delays
- [x] `/components/insights/insights-switcher.tsx` - Standardize delays

### 4.2 TiltCard Usage Expansion

#### Current Issues:
- Only used on Projects and Insights
- Missing from Hire Me skill cards
- Inconsistent interaction feedback

#### Actions Required:
```tsx
// Add TiltCard to all interactive cards:
- Skill cards on Hire Me page
- Any clickable card component
- Keep consistent maxTiltDeg (6deg)
```

**Files to Update:**
- [x] `/app/hire-me/page.tsx` - Add TiltCard to skill cards
- [x] Review other interactive elements

---

## 🏷️ Phase 5: Badge & Tag Standardization
**Priority: LOW** | **Effort: Low** | **Impact: Low**

### 5.1 Status Badge Colors

#### Current Issues:
- Using non-brand colors (green-500, yellow-500, blue-500)
- Inconsistent with design system

#### Actions Required:
```tsx
// Use brand colors only:
- Active/Live: bg-brand-black text-brand-yellow
- In Progress: bg-brand-yellow text-brand-black
- Inactive: bg-gray-200 text-gray-700
- Special: bg-brand-pink text-brand-black
```

**Files to Update:**
- [x] `/app/projects/page.tsx` - Update status badge colors

### 5.2 Tech Tag Consistency

#### Current Issues:
- Currently consistent but could be componentized

#### Actions Required:
```tsx
// Create Badge component:
interface BadgeProps {
  variant?: 'default' | 'outline' | 'solid'
  size?: 'sm' | 'md'
}
```

**Files to Update:**
- [x] Create `/components/ui/badge.tsx`
- [x] Update project tech tags to use Badge

---

## 🔧 Phase 6: Utility & Helper Creation
**Priority: LOW** | **Effort: Medium** | **Impact: High (long-term)**

### 6.1 Create Design System Constants

Status: Implemented in `/lib/design-system.ts`. Pages refactored to consume constants. Added section/title variants: `sectionTitleLg`, `sectionTitleMd`, `sectionTitleSm`, `cardTitle`, `cardTitleResponsive` and applied across Projects, Insights, Article, and Hire Me pages.

### 6.2 Create Composition Utilities

Status: Already exists as `cn` in `/lib/utils.ts`.

---

## 📋 Phase 7: Final Review & Documentation
**Priority: LOW** | **Effort: Low** | **Impact: Medium**

### 7.1 Component Documentation

- [ ] Document all new components with examples
- [ ] Create Storybook or similar for component library
- [ ] Update CLAUDE.md with new design system rules

### 7.2 Quality Checks

- [ ] Verify all responsive breakpoints work correctly
- [ ] Test all hover/focus states
- [ ] Ensure accessibility standards are met
- [ ] Check animations with prefers-reduced-motion
- [ ] Validate color contrast ratios

---

## 🚀 Implementation Order

### Week 1: Foundation (Phases 1-2)
1. Typography standardization (Phase 1)
2. Spacing & container standardization (Phase 2)
3. Test and verify changes

### Week 2: Components (Phase 3)
1. Create Card component
2. Create Button component  
3. Refactor existing pages to use components
4. Test component integration

### Week 3: Polish (Phases 4-5)
1. Animation standardization (Phase 4)
2. Badge & tag updates (Phase 5)
3. Interaction improvements

### Week 4: Documentation (Phases 6-7)
1. Create design system utilities
2. Document all changes
3. Final testing and QA

---

## ✅ Success Metrics

1. **Consistency Score**: 95%+ UI elements following design system
2. **Component Reuse**: 80%+ of UI using shared components
3. **Responsive Coverage**: 100% of components work on all breakpoints
4. **Performance**: No degradation in Lighthouse scores
5. **Maintainability**: 50% reduction in CSS duplication

---

## ⚠️ Important Notes

1. **Preserve intentional differences**:
   - Pink background on hire-me page
   - Brutalist typography on home page
   - Glass morphism on navigation

2. **Test after each phase**:
   - Mobile responsiveness
   - Cross-browser compatibility
   - Animation performance
   - Accessibility standards

3. **Rollback plan**:
   - Git commit after each phase
   - Keep old components until new ones are verified
   - Document any breaking changes

---

*This plan ensures systematic UI alignment while preserving the portfolio's unique character and intentional design choices.*
