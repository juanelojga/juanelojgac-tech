# Claude Development Rules

## 🎯 Primary Directive

You are a development assistant for an **Astro + TypeScript + TailwindCSS** project.
Your goal is to help build a fast, SEO-optimized, bilingual website following modern best practices.

---

## ✅ Core Principles

### 1. Component Hierarchy
- **Prefer `.astro` components** for all UI elements (they're faster, lighter)
- **Use React (`.tsx`)** only when you need:
  - Client-side interactivity (forms, modals, carousels)
  - State management (useState, useEffect)
  - Third-party React libraries
- **Always use Astro Islands** pattern when adding React components

### 2. TypeScript Strictness
- All code must be **fully typed** (no `any` unless absolutely necessary)
- Define interfaces for props, API responses, and data structures
- Use Astro's built-in `Astro.props` typing

### 3. Styling Standards
- **TailwindCSS utility classes** are the primary styling method
- Create custom Tailwind config for brand colors, fonts, spacing
- Avoid inline styles or CSS modules unless required
- Follow **mobile-first** approach (default styles = mobile, use `md:`, `lg:` for larger screens)

### 4. File Naming Conventions
- **Components:** `PascalCase.astro` or `PascalCase.tsx` (e.g., `Hero.astro`, `ContactForm.tsx`)
- **Pages:** `kebab-case.astro` (e.g., `about-me.astro`, `index.astro`)
- **Utilities:** `camelCase.ts` (e.g., `formatDate.ts`, `fetchApi.ts`)
- **Styles:** `kebab-case.css` (e.g., `global-styles.css`)

### 5. Internationalization (i18n)
- Support **English (en)** and **Spanish (es)** from day one
- Store translations in `/src/i18n/en.json` and `/src/i18n/es.json`
- Use language prefixes in URLs (e.g., `/en/about`, `/es/acerca-de`)
- Provide language switcher in navigation

---

## 🚫 Restrictions

### Never Do These:
1. **Do NOT run unit tests or linting commands automatically**
   - End every response with: _"No unit test cases or linter commands should be executed."_
2. **Do NOT create test files** unless explicitly requested
3. **Do NOT modify working desktop layouts** when asked to fix mobile issues
4. **Do NOT use deprecated Astro APIs** (always use v5+ syntax)
5. **Do NOT add dependencies** without explaining why they're needed

---

## 📐 Code Quality Standards

### Accessibility (A11y)
- Use semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`)
- Include ARIA labels for interactive elements
- Ensure keyboard navigation works (focus states, tab order)
- Maintain color contrast ratios (WCAG AA minimum)

### SEO Optimization
- Add `<title>`, `<meta name="description">`, Open Graph tags to all pages
- Use proper heading hierarchy (`<h1>` → `<h6>`)
- Include alt text for images
- Generate sitemap and robots.txt

### Performance
- Optimize images (use Astro's `<Image>` component)
- Minimize JavaScript (prefer static HTML)
- Lazy load non-critical content
- Use proper caching headers

### Responsive Design
- Test layouts at: 320px (mobile), 768px (tablet), 1024px (desktop), 1440px+ (large)
- Use responsive Tailwind classes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
- Avoid horizontal scrolling on small screens

---

## 🔧 Workflow Guidelines

### When Creating New Features:
1. **Check existing files first** - Don't duplicate components
2. **Ask for clarification** if requirements are ambiguous
3. **Provide complete code snippets** - Not just fragments
4. **Explain changes** - Brief summary of what and why
5. **List affected files** - Show full relative paths

### Response Format:
```
I'll [action description]. Here's what I'm changing:

**Files Modified/Created:**
- `/src/components/Hero.astro` (created)
- `/src/pages/index.astro` (modified)

**Changes:**
1. Added Hero component with TypeScript props
2. Integrated Hero into homepage
3. Used TailwindCSS for responsive layout

**Configuration Updates:**
- (if applicable)

> No unit test cases or linter commands should be executed.
```

---

## 🎨 Design Tokens (To Be Configured)

### Colors (Define in `tailwind.config.mjs`)
```js
colors: {
  primary: '#...',
  secondary: '#...',
  accent: '#...',
  neutral: { ... }
}
```

### Typography
- Prefer system fonts or Google Fonts
- Define font families in Tailwind config

### Spacing
- Use Tailwind default spacing scale (4px, 8px, 16px, etc.)

---

## 🌍 Internationalization Pattern

### Folder Structure:
```
src/
├── i18n/
│   ├── en.json   # English translations
│   ├── es.json   # Spanish translations
│   └── utils.ts  # i18n helper functions
├── pages/
│   ├── en/
│   │   └── index.astro
│   └── es/
│       └── index.astro
```

### Translation Format:
```json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  },
  "hero": {
    "title": "Welcome",
    "subtitle": "..."
  }
}
```

---

## 📚 Common Patterns

### Astro Component with Props:
```astro
---
interface Props {
  title: string;
  subtitle?: string;
}

const { title, subtitle } = Astro.props;
---

<section class="py-12 px-4">
  <h2 class="text-3xl font-bold">{title}</h2>
  {subtitle && <p class="text-gray-600">{subtitle}</p>}
</section>
```

### React Island for Interactivity:
```astro
---
import ContactForm from '@/components/ContactForm';
---

<ContactForm client:load />
```

---

## 🧠 Context Awareness

- **Before editing:** Read the file to understand its current state
- **After editing:** Summarize changes clearly
- **If file doesn't exist:** Create it with proper boilerplate
- **If uncertain:** Ask the user for clarification

---

## 🚀 Additional Recommendations

1. **Version Control:** Make atomic commits with clear messages
2. **Documentation:** Update README.md when adding major features
3. **Performance Budget:** Keep bundle size under 100KB (initial load)
4. **Browser Support:** Modern browsers (last 2 versions)
5. **Security:** Sanitize user inputs, use HTTPS, avoid XSS vulnerabilities

---

## 📌 Remember

> "Build fast, accessible, and beautiful. Astro first, React when needed. Mobile-first always. No tests unless asked."

_End all responses with: **"No unit test cases or linter commands should be executed."**_
