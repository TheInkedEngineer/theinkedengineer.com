# CLAUDE.md - Project Guidelines & Rules

## Project Overview
**The Inked Engineer** - A modern NextJS portfolio website showcasing Firas's work and articles.

## Collaboration Rules

### Core Development Principles
1. **Use best practices for React and NextJS** as per versions in package.json
2. **No inline styling** - Use Tailwind utilities and CSS modules only
3. **Quality and documentation over everything** - Prioritize clean, maintainable code
4. **Push back when I say something wrong** - Provide constructive feedback on questionable decisions
5. **Ultra think over speed** - Thorough analysis before implementation

## Tech Stack

### Core Framework
- **Next.js**: 15.2.4 (App Router)
- **React**: 19
- **TypeScript**: 5

### Styling & UI
- **Tailwind CSS**: v4.1.9
- **shadcn/ui**: Component library
- **Radix UI**: Primitive components
- **Lucide React**: Icons
- **next-themes**: Theme management

### Key Dependencies
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **date-fns**: Date utilities
- **Recharts**: Data visualization
- **Sonner**: Toast notifications

## Code Standards

### Component Structure
```typescript
// Use Server Components by default
export default function ComponentName() {
  // Component logic
}

// Client Components only when needed
"use client"
import { useState } from "react"

export default function ClientComponent() {
  // Client-side logic
}
```

### Styling Conventions
- **Primary**: Tailwind utility classes
- **Custom styles**: CSS modules or global CSS with proper class naming
- **No inline styles**: `style={{}}` is prohibited
- **Mobile-first**: Design and implement for mobile, then enhance for desktop
- **Responsive**: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)

### File Organization
```
app/
├── globals.css          # Global styles and CSS variables
├── layout.tsx          # Root layout
├── page.tsx           # Home page
├── articles/          # Articles section
├── projects/          # Projects section
components/
├── ui/               # shadcn/ui components
├── navigation.tsx    # Navigation components
├── mobile-*.tsx     # Mobile-specific components
lib/
├── utils.ts         # Utility functions
├── markdown.ts      # Markdown processing
hooks/
├── use-*.ts        # Custom React hooks
```

### TypeScript Guidelines
- Use strict TypeScript configuration
- Define proper interfaces for props and data structures
- Leverage Next.js built-in types
- Use Zod for runtime validation

## Design System

### Color Palette
```css
:root {
  --yellow: #f4d35e;    /* Primary brand color */
  --pink: #f8c0c8;      /* Accent color */
  --black: #000000;     /* Text color */
}
```

### Typography
- **Primary Font**: Inter (system font stack)
- **Mobile-first sizing**: Use `clamp()` for responsive typography
- **Line heights**: Optimized for readability on all devices

### Responsive Breakpoints
- **Mobile**: < 768px (default)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Performance & Accessibility

### Performance
- Optimize images with Next.js Image component
- Use Server Components for static content
- Implement proper loading states
- Minimize client-side JavaScript

### Accessibility
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- High contrast mode support
- Reduced motion preferences
- Minimum touch target sizes (44px) on mobile

## Development Workflow

### Scripts
```json
{
  "dev": "next dev",           // Development server
  "build": "next build",       // Production build
  "start": "next start",       // Production server
  "lint": "next lint"          // ESLint checking
}
```

### Quality Checks
- Run `npm run lint` before committing
- Test on multiple device sizes
- Verify accessibility with screen readers
- Check performance with Lighthouse

## Architecture Decisions

### App Router Usage
- Leveraging Next.js 13+ App Router
- Server Components by default
- Client Components only when necessary (interactivity, hooks, browser APIs)

### State Management
- React Hook Form for form state
- Local state with `useState` for simple cases
- No global state management needed currently

### Styling Architecture
- Tailwind CSS v4 with custom theme
- CSS-in-JS avoided per project rules
- Custom CSS for complex animations and layouts
- Mobile-first responsive design approach

## Project Location
```
/Users/theinkedengineer/Downloads/inked-engineer-website/
```

## Important Notes
- **This is a mobile-first design** - Always start with mobile implementation
- **Animations**: Complex CSS animations for background elements
- **Navigation**: Custom mobile-optimized navigation system
- **Theme**: Custom design system with yellow/pink/black color scheme
- **Content**: Portfolio site with articles and projects sections

## Common Commands
```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

---

*Last updated: August 2025*
*Remember: Quality and thoughtful implementation over quick fixes*