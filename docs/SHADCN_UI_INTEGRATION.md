# shadcn/ui Integration Guide

Complete integration of shadcn/ui with JuaneloJGAC Tech brand guidelines in Astro.

## Overview

This integration provides a complete set of accessible, brand-aligned UI components built on:
- **shadcn/ui**: Industry-standard component library
- **Radix UI**: Unstyled, accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **React**: Component framework (via @astrojs/react)

## Features

✅ **Brand Alignment**
- Deep Tech Blue (#0066cc) - Primary (60%)
- Silver Gray (#8a8a8a) - Secondary (30%)
- Teal Cyan (#00d9cc) - Accent (10%)
- Typography: Poppins (headings), Inter (body), Space Grotesk (accents)
- 8px grid system for spacing
- 6-8px border radius

✅ **Accessibility (WCAG 2.1 AA)**
- Automatic focus management
- ARIA attributes on all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Minimum 4.5:1 contrast ratios

✅ **Dark Mode**
- Class-based dark mode toggle
- Proper contrast in both modes
- Smooth transitions

✅ **Bilingual Support (EN/ES)**
- Translation files for all components
- Locale-specific routes
- RTL-ready structure

✅ **Responsive Design**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1400px)
- Touch-friendly targets (minimum 44px)

## Directory Structure

```
src/
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx          # Button component
│   │   ├── card.tsx            # Card component
│   │   ├── dialog.tsx          # Modal/Dialog component
│   │   └── dropdown-menu.tsx   # Dropdown menu component
│   └── examples/               # Example implementations
│       ├── ButtonExamples.tsx
│       ├── CardExamples.tsx
│       ├── DialogExamples.tsx
│       └── NavbarExamples.tsx
├── lib/
│   └── utils.ts               # Utility functions (cn)
├── i18n/
│   └── ui-components.ts       # Component translations
├── pages/
│   ├── en/
│   │   └── components-demo.astro
│   └── es/
│       └── components-demo.astro
└── styles/
    └── globals.css            # Global styles and CSS variables
```

## Components

### Button

Brand-aligned button with multiple variants and sizes.

**Variants:**
- `default` - Primary button (Deep Tech Blue)
- `secondary` - Secondary button (Silver Gray)
- `accent` - Accent button (Teal Cyan)
- `outline` - Outlined button
- `ghost` - Minimal button
- `link` - Link-styled button
- `destructive` - Destructive action button

**Sizes:**
- `sm` - Small (36px height)
- `default` - Default (40px height)
- `lg` - Large (44px height)
- `xl` - Extra large (48px height)
- `icon` - Square icon button (40x40px)

**Usage:**
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default">Primary Action</Button>
<Button variant="accent" size="lg">Call to Action</Button>
<Button variant="outline">Secondary</Button>
```

### Card

Content container with consistent spacing and brand styling.

**Sub-components:**
- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title (uses Poppins)
- `CardDescription` - Description (uses Inter)
- `CardContent` - Main content area
- `CardFooter` - Footer with actions

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dialog (Modal)

Accessible modal dialog with focus management.

**Features:**
- Automatic focus trap
- ESC key to close
- Click outside to close
- Smooth animations
- ARIA attributes

**Usage:**
```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Dropdown Menu

Accessible dropdown menu for navigation and actions.

**Features:**
- Keyboard navigation (Arrow keys, Enter, ESC)
- Typeahead support
- Nested menus
- Checkboxes and radio items
- Keyboard shortcuts display

**Usage:**
```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Color System

### CSS Variables

All components use CSS variables defined in `src/styles/globals.css`:

**Light Mode:**
```css
--background: 248 248 248    /* Off-White */
--foreground: 45 45 45       /* Charcoal */
--primary: 0 102 204         /* Deep Tech Blue */
--secondary: 138 138 138     /* Silver Gray */
--accent: 0 217 204          /* Teal Cyan */
```

**Dark Mode:**
```css
--background: 27 27 29       /* Charcoal Dark */
--foreground: 248 248 248    /* Off-White */
--primary: 51 135 255        /* Lighter Blue */
--secondary: 163 163 163     /* Lighter Gray */
--accent: 27 195 199         /* Adjusted Teal */
```

### Usage in Components

```tsx
// Use CSS variable classes
<div className="bg-primary text-primary-foreground" />
<div className="bg-accent text-accent-foreground" />

// Or use brand color utilities
<div className="bg-primary-500 text-white" />
```

## Typography

### Font Families

- **Headings:** Poppins (Bold)
- **Body:** Inter (Regular)
- **Accents:** Space Grotesk (Medium)

### Classes

```css
.font-heading  /* Poppins */
.font-body     /* Inter */
.font-accent   /* Space Grotesk */
```

## Spacing System

8px base unit grid:

```css
p-1    /* 8px */
p-2    /* 16px */
p-3    /* 24px */
p-4    /* 32px */
p-6    /* 48px */
p-8    /* 64px */
```

## Accessibility

### Focus Rings

All interactive elements have visible focus indicators:

```tsx
focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

### ARIA Attributes

Components automatically include proper ARIA attributes:
- `role="dialog"` for modals
- `role="menu"` for dropdowns
- `aria-label` for icon buttons
- `aria-describedby` for descriptions

### Keyboard Navigation

All components support:
- Tab navigation
- Enter/Space for activation
- ESC for closing
- Arrow keys for lists/menus

## Testing

### Visual Regression Tests

```bash
npm run test:visual
```

Captures screenshots for:
- All component variants
- Light and dark modes
- English and Spanish
- Multiple viewport sizes

### Accessibility Tests

```bash
npm run test:accessibility
```

Tests for:
- WCAG 2.1 AA compliance
- Color contrast ratios
- Keyboard navigation
- Screen reader support
- ARIA attributes

### Component Tests

```bash
npm run test:components
```

Tests for:
- Component rendering
- Interactive behaviors
- State management
- Event handling

## Bilingual Support

### Translation Files

Located in `src/i18n/ui-components.ts`:

```typescript
export const uiComponentTranslations = {
  en: { /* English translations */ },
  es: { /* Spanish translations */ }
};
```

### Usage

```tsx
import { uiComponentTranslations } from '@/i18n/ui-components';

const t = uiComponentTranslations['en'];
<Button>{t.buttons.primary}</Button>
```

## Dark Mode

### Toggle Dark Mode

```typescript
// Add 'dark' class to html element
document.documentElement.classList.toggle('dark');
```

### CSS

```css
.dark {
  /* Dark mode CSS variables */
}
```

## Adding New Components

1. Install Radix UI primitive (if needed):
```bash
npm install @radix-ui/react-[component-name]
```

2. Create component in `src/components/ui/`:
```tsx
// Use cn() utility for className merging
import { cn } from '@/lib/utils';

// Follow brand color scheme
// Use CSS variables
// Add ARIA attributes
// Support dark mode
```

3. Create example in `src/components/examples/`:
```tsx
// Add bilingual support
// Show all variants
// Demonstrate usage
```

4. Add tests in `tests/ui/`:
```typescript
// Visual regression
// Accessibility checks
// Component behavior
```

5. Update translations in `src/i18n/ui-components.ts`

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Astro React Integration](https://docs.astro.build/en/guides/integrations-guide/react/)

## Demo (Development Only)

Visit the live demo in development mode:
- English: `/en/components-demo`
- Spanish: `/es/components-demo`

**Important**: These demo pages are only accessible when running `npm run dev`. They are automatically excluded from production builds to prevent exposing internal component documentation. Attempting to access these routes in production will return a 404 error.

## Support

For issues or questions, please refer to the main project documentation or create an issue in the repository.
