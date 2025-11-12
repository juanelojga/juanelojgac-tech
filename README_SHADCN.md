# shadcn/ui Integration - Quick Start

## Overview

shadcn/ui has been successfully integrated into the JuaneloJGAC Tech Astro project with full brand alignment, accessibility compliance (WCAG 2.1 AA), and bilingual support (EN/ES).

## 🎨 Brand Integration

All components follow the brand guidelines:
- **Colors**: Deep Tech Blue (#0066cc), Teal Cyan (#00d9cc), Silver Gray (#8a8a8a)
- **60/30/10 Rule**: Primary (60%), Secondary (30%), Accent (10%)
- **Typography**: Poppins (headings), Inter (body), Space Grotesk (accents)
- **Spacing**: 8px grid system
- **Border Radius**: 6-8px

## 📦 Installed Components

### Button (`/src/components/ui/button.tsx`)
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default">Primary</Button>
<Button variant="accent">Call to Action</Button>
<Button variant="outline" size="lg">Secondary</Button>
```

### Card (`/src/components/ui/card.tsx`)
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>
```

### Dialog/Modal (`/src/components/ui/dialog.tsx`)
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

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

### Dropdown Menu (`/src/components/ui/dropdown-menu.tsx`)
```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## 🌐 Demo Pages (Development Only)

View the live examples in development mode:
- **English**: `/en/components-demo`
- **Spanish**: `/es/components-demo`

**Note**: These pages are only accessible in development environment (`npm run dev`). In production builds, they return a 404 to prevent exposing internal component documentation.

## 🧪 Testing

All components include:
- ✅ Visual regression tests
- ✅ Accessibility tests (WCAG 2.1 AA)
- ✅ Keyboard navigation tests
- ✅ Responsive design tests
- ✅ Bilingual support tests

Run tests:
```bash
npm run test:components       # Component tests
npm run test:accessibility    # Accessibility tests
npm run test:visual          # Visual regression tests
```

## 🎯 Key Features

### Accessibility (WCAG 2.1 AA)
- ✅ Automatic focus management
- ✅ ARIA attributes
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Minimum 4.5:1 contrast ratios
- ✅ Focus rings on all interactive elements

### Dark Mode
Toggle dark mode by adding the `dark` class to the `<html>` element:
```javascript
document.documentElement.classList.toggle('dark');
```

### Responsive Design
All components are mobile-first and responsive:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Bilingual Support (EN/ES)
Translation files located in `/src/i18n/ui-components.ts`:
```typescript
import { uiComponentTranslations } from '@/i18n/ui-components';
const t = uiComponentTranslations['en']; // or 'es'
```

## 📁 File Structure

```
src/
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── index.ts           # Centralized exports
│   └── examples/              # Example implementations
│       ├── ButtonExamples.tsx
│       ├── CardExamples.tsx
│       ├── DialogExamples.tsx
│       └── NavbarExamples.tsx
├── lib/
│   └── utils.ts              # cn() utility function
├── i18n/
│   └── ui-components.ts      # Translations (EN/ES)
└── styles/
    └── global.css            # Global styles + CSS variables
```

## 🔧 Configuration Files

- `components.json` - shadcn/ui configuration
- `tailwind.config.mjs` - Tailwind with CSS variables and dark mode
- `tsconfig.json` - TypeScript path aliases (@/*)
- `astro.config.mjs` - React integration

## 🎨 Color System

All components use CSS variables from `global.css`:

```css
/* Light Mode */
--primary: 0 102 204         /* Deep Tech Blue */
--secondary: 138 138 138     /* Silver Gray */
--accent: 0 217 204          /* Teal Cyan */
--background: 248 248 248    /* Off-White */
--foreground: 45 45 45       /* Charcoal */

/* Dark Mode */
--primary: 51 135 255        /* Lighter blue */
--accent: 27 195 199         /* Adjusted teal */
--background: 27 27 29       /* Charcoal dark */
--foreground: 248 248 248    /* Off-White */
```

## 📚 Documentation

Complete documentation available in:
- `/docs/SHADCN_UI_INTEGRATION.md` - Full integration guide

## 🚀 Next Steps

To add more shadcn/ui components:

1. Install the Radix UI primitive (if needed):
```bash
npm install @radix-ui/react-[component-name]
```

2. Create the component in `/src/components/ui/`
3. Use brand colors and CSS variables
4. Add ARIA attributes for accessibility
5. Create examples in `/src/components/examples/`
6. Add tests in `/tests/ui/`
7. Update translations in `/src/i18n/ui-components.ts`

## 💡 Tips

- Use `client:load` directive in Astro for React components
- All colors use `hsl(var(--color-name))` format
- Focus rings automatically applied via `focus-visible`
- Dark mode colors auto-adjust for proper contrast
- Follow 8px grid system for spacing (p-1, p-2, p-3, etc.)
- Button border radius: 6px (rounded-md)
- Card border radius: 8px (rounded-lg)

## 📞 Support

For issues or questions:
- Check `/docs/SHADCN_UI_INTEGRATION.md`
- Review example implementations in `/src/components/examples/`
- View demo pages at `/en/components-demo` and `/es/components-demo`

---

**Built with**: Astro + React + shadcn/ui + Tailwind CSS + Radix UI
