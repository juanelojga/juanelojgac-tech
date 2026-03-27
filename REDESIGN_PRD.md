# Product Requirements Document: Premium Homepage Redesign

## 1. Executive Summary

- **Problem Statement**: The current JuaneloJGAC Tech homepage is functional but visually flat, static, and too safe. The hero is empty and unimpressive, services are buried below the fold, the header logo is too small, the footer is minimal, and the overall aesthetic communicates "generic corporate site" rather than "premium AI consultancy." The design fails to create a strong first impression or convey the high-end, modern AI expertise the company delivers.

- **Proposed Solution**: A complete visual and structural redesign transforming the homepage from a light, flat corporate page into a dark premium AI consultancy landing page with a cinematic animated hero, glassmorphism panels, layered depth, stronger service visibility above the fold, a redesigned AI assistant section, a rich footer, and polished motion design — while preserving the existing bilingual (EN/ES) architecture, AI consultant chat functionality, and Astro + React island stack.

- **Success Criteria**:
  - Time-to-first-service-visibility reduced to under 1 viewport scroll (services visible immediately below hero).
  - Lighthouse Performance score remains ≥ 90 after redesign.
  - Lighthouse Accessibility score remains ≥ 95 after redesign.
  - First Contentful Paint (FCP) stays at or below 1.5 seconds on 4G connections.
  - All existing E2E tests (desktop, mobile, tablet) pass after migration.
  - Full EN/ES bilingual parity maintained across all new sections and copy.
  - Social proof (trust metrics) visible within the hero without scrolling.

---

## 2. User Experience & Functionality

### User Personas

- **Startup Founders**: Need fast validation, rough scoping, and confidence that the agency can execute premium AI products.
- **SME Owners & Operators**: Want to automate workflows, modernize operations, or launch digital platforms — need immediate trust signals.
- **Technical / Product Leads**: Evaluate implementation capability, timeline, and visual sophistication — design quality signals technical quality.
- **Warm Prospects (Referrals / Social)**: Arrive with partial context — need a fast, impressive first impression that confirms credibility.
- **First-Time Visitors**: Land from search or ads — must understand what the company does, why it's credible, and how to engage within 5 seconds.

### User Stories

#### US-1: First Impression & Brand Perception

- As a first-time visitor, I want to see a visually impressive, dark premium landing page so that I immediately perceive JuaneloJGAC Tech as a high-end AI consultancy.
- **Acceptance Criteria**:
  - Hero section uses a dark gradient background with animated glowing elements.
  - Typography hierarchy is strong and confident (large bold headlines, clear subheadlines).
  - Overall page aesthetic communicates "premium SaaS / AI product studio."
  - No flat white sections or generic corporate design patterns.

#### US-2: Immediate Service Discovery

- As a potential client, I want to see what services are offered without significant scrolling so that I can quickly determine relevance.
- **Acceptance Criteria**:
  - A services preview strip with 5 cards appears directly below the hero.
  - Each card contains an icon, title, one-line description, and hover interaction.
  - Services visible with minimal scrolling from the hero viewport.

#### US-3: Trust & Credibility Above the Fold

- As a prospect evaluating agencies, I want to see credibility signals (project count, satisfaction rate, market coverage) in the hero so that I trust the company before scrolling.
- **Acceptance Criteria**:
  - Trust metrics (50+ Projects, 98% Satisfaction, US & LATAM) displayed below CTA row in the hero.
  - Numbers animate with a count-up effect when they enter the viewport.
  - Metrics styled as minimal stat blocks or glass cards.

#### US-4: Clear Engagement Path

- As a visitor ready to engage, I want prominent CTAs throughout the page so that I can book a consultation or explore services at any point.
- **Acceptance Criteria**:
  - Hero contains a primary CTA ("Book a Free Consultation") and secondary CTA ("Explore Services").
  - Final CTA section before footer provides another strong conversion opportunity.
  - Header contains a persistent CTA button.

#### US-5: Premium AI Assistant Experience

- As a visitor exploring services, I want the AI assistant section to feel like a sophisticated product experience so that I trust the company's AI capability.
- **Acceptance Criteria**:
  - Assistant section redesigned with glassmorphism, darker surfaces, stronger spacing.
  - Left panel provides curated navigation pathways, not rigid sidebar metadata.
  - Prompt chips styled as premium rounded elements with hover animations.
  - Existing chat functionality fully preserved.

#### US-6: Bilingual Seamless Experience

- As a Spanish-speaking visitor, I want the entire redesigned experience available in Spanish so that I can engage comfortably in my language.
- **Acceptance Criteria**:
  - All new sections, copy, and labels exist in both `en.json` and `es.json`.
  - Language switcher redesigned as a premium segmented control with pill style.
  - EN/ES switch accessible from the header on all viewport sizes.

#### US-7: Social Presence

- As a visitor verifying the company's legitimacy, I want to find social media links (GitHub, LinkedIn, Instagram) so that I can review the company's presence.
- **Acceptance Criteria**:
  - Social icons in footer with hover glow and accent color transition.
  - Optional secondary placement in header (desktop only).
  - Icons use consistent modern line style.

#### US-8: Responsive Premium Experience

- As a mobile visitor, I want the premium design to adapt cleanly to my device so that the experience remains polished and usable.
- **Acceptance Criteria**:
  - Hero stacks vertically: headline → CTAs → trust metrics → mockup visual.
  - Services use horizontal swipe or 2-column grid on mobile.
  - Header collapses to logo + hamburger (or compact CTA).
  - Assistant section stacks left panel above chat panel.
  - Footer columns stack cleanly with centered social icons.

#### US-9: Process Transparency

- As a prospect considering engagement, I want to understand the company's working process so that I feel confident in the delivery approach.
- **Acceptance Criteria**:
  - Process section with 4 steps: Discover → Design → Build → Optimize.
  - Each step includes icon, title, and short explanation.
  - Visual progression indicator (horizontal or vertical flow).
  - Step cards animate upward on scroll entry.

#### US-10: Rich Footer Experience

- As a visitor finishing the page, I want a structured footer with brand, navigation, trust notes, and social links so that the page ends with a polished, professional impression.
- **Acceptance Criteria**:
  - 4-column footer: Brand | Navigation | Trust Notes | Social.
  - Dark background slightly darker than main page.
  - Subtle top border or gradient line separator.
  - Copyright line at bottom.

### Non-Goals

- Full single-page application (SPA) behavior — the site remains SSG with React islands.
- Blog, case studies, or portfolio pages — this PRD covers the homepage only.
- CRM integration, analytics dashboard, or admin panels.
- Payment, invoicing, or contract workflows.
- Changes to the AI assistant's backend logic, system prompt, or API routing.
- Cross-session chat memory or user accounts.
- Video backgrounds, 3D WebGL scenes, or heavy JavaScript animation libraries.
- Search functionality or sitemap changes.

---

## 3. Technical Specifications

### 3.1 Architecture Overview

The redesign preserves the existing Astro v6 + React 19 + Tailwind CSS v4 architecture. No new frameworks, build tools, or backend infrastructure are introduced.

#### Page Structure (New)

```
index.astro / es.astro
├── Layout.astro
│   ├── RedesignedHeader.astro          (new)
│   ├── HeroSection.astro               (new — replaces ConsultantHero.astro)
│   │   └── HeroVisual.tsx              (new — React island for animated mockup)
│   │   └── TrustMetrics.tsx            (new — React island for count-up stats)
│   ├── ServicesPreview.astro           (new)
│   │   └── ServiceCard.tsx             (new — React island for hover interactions)
│   ├── ConsultantSection.astro         (redesigned — updated layout & styling)
│   │   └── ConsultantLayout.tsx        (redesigned — preserved functionality)
│   ├── ProcessSection.astro            (new)
│   ├── FinalCTA.astro                  (new)
│   └── RedesignedFooter.astro          (new — replaces ConsultantFooter.astro)
```

#### Data Flow

- **i18n**: All visible text sourced from `src/i18n/en.json` and `src/i18n/es.json`. Astro components import translations and pass them as props to React islands. No hard-coded UI text.
- **Content Provider**: Existing `StaticContentProvider` continues to source services, prompts, trust signals for the AI assistant section. New sections use i18n JSON directly.
- **Client Hydration**: React islands use `client:load` for interactive elements (navbar, count-up stats, hero visual, service card hover). `client:visible` for below-fold components where appropriate.

### 3.2 Design System Changes

#### Color System

| Token              | Current Value              | New Value                       | Purpose                           |
| ------------------ | -------------------------- | ------------------------------- | --------------------------------- |
| `--bg-primary`     | white (#ffffff)            | midnight navy (#07111F)         | Page background                   |
| `--bg-secondary`   | neutral-lightest (#f2f2f2) | dark blue slate (#0D1B2A)       | Section backgrounds               |
| `--bg-card`        | white                      | elevated blue surface (#11243A) | Card backgrounds                  |
| `--text-primary`   | neutral-darkest (#06020a)  | near white (#F8FAFC)            | Primary text                      |
| `--text-secondary` | neutral (#6b7280)          | muted cool gray-blue (#A7B4C6)  | Secondary text                    |
| `--accent-cyan`    | — (new)                    | #38BDF8                         | Primary accent, CTAs, highlights  |
| `--accent-teal`    | persian-green (#00a79d)    | #2DD4BF                         | Secondary accent                  |
| `--accent-violet`  | — (new)                    | #8B5CF6                         | Tertiary accent, decorative glows |
| `--accent-pink`    | — (new)                    | #EC4899                         | Optional subtle highlights        |

#### Typography Scale

| Element              | Current            | New                                                        |
| -------------------- | ------------------ | ---------------------------------------------------------- |
| Hero headline        | 2xl–4xl, Sora bold | 4xl–7xl, Sora 800, tighter line-height                     |
| Hero subheadline     | base–lg, Inter     | lg–xl, Inter 400, muted secondary color                    |
| Section headings     | —                  | 3xl–5xl, Sora 700                                          |
| Section micro-labels | —                  | xs uppercase, Inter 600, letter-spacing wide, accent color |
| Card titles          | —                  | lg, Sora 600                                               |
| Body text            | —                  | base, Inter 400                                            |

#### Spacing & Radius

| Element                  | Current          | New                                                        |
| ------------------------ | ---------------- | ---------------------------------------------------------- |
| Section vertical padding | py-6 to py-14    | py-16 to py-24 (lg: py-32)                                 |
| Card padding             | p-4              | p-6 to p-8                                                 |
| Card border radius       | rounded-lg (8px) | rounded-2xl (16px) to rounded-3xl (24px)                   |
| Card borders             | 1px solid        | subtle glow or 1px border with low opacity + glassmorphism |

### 3.3 New Tailwind Theme Tokens

Add to `src/styles/tailwind.css` under the `@theme` block:

```
--color-midnight: #07111F
--color-midnight-light: #0D1B2A
--color-midnight-surface: #11243A
--color-text-bright: #F8FAFC
--color-text-muted: #A7B4C6
--color-accent-cyan: #38BDF8
--color-accent-teal: #2DD4BF
--color-accent-violet: #8B5CF6
--color-accent-pink: #EC4899
```

### 3.4 Component Specifications

#### 3.4.1 Header (RedesignedHeader.astro)

**Behavior**:

- Transparent over hero with `position: sticky; top: 0; z-index: 50`.
- On scroll past hero: gains `backdrop-blur-xl` + slightly darker background + subtle bottom border glow.
- Scroll detection via a React island or vanilla JS `IntersectionObserver`.

**Layout**:

- Left: Logo at ~48–56px height (currently 32–40px). Link to home (`/` or `/es`).
- Center: Navigation links — Services (`#services`), Process (`#process`), About, Contact. Visible on `lg:` screens.
- Right: Social icons (GitHub, LinkedIn, Instagram) as line icons — visible on `lg:` screens. EN/ES pill switcher. Primary CTA button ("Book a Consultation") with gradient accent background.

**Mobile**:

- Logo left, hamburger right.
- Menu expands to full navigation + language switch + CTA.

#### 3.4.2 Hero Section (HeroSection.astro + React islands)

**Layout**: 2-column on `lg:` screens, stacked on mobile.

**Left Column**:

- Micro-label: uppercase, accent color, `"AI Consulting for Modern Businesses"`.
- Headline: `"Build Smarter Products, Automations, and AI Experiences"` — 4xl to 7xl, Sora 800, white.
- Subheadline: `"From AI integration and workflow automation to scalable web platforms and digital experiences, we help businesses turn complex ideas into practical systems."` — lg to xl, muted text.
- CTA row: Primary button (gradient, "Book a Free Consultation") + Secondary button (ghost/glass, "Explore Services").
- Trust metrics row: 3 stat blocks — "50+ Projects Delivered", "98% Client Satisfaction", "US & LATAM Clients Served". React island with count-up animation on viewport entry.

**Right Column** (React island — `HeroVisual.tsx`):

- Premium visual composition: floating AI assistant mockup panel, layered glass cards, glowing gradient shapes.
- CSS-only or lightweight JS animations: subtle float, parallax drift, shadow pulse.
- Background: radial gradient blurred orbs (cyan/teal/violet), optional subtle grid pattern, animated slow-moving light.

**Background**:

- Full-width dark gradient base (`midnight` → `midnight-light`).
- 2–3 blurred radial gradient orbs positioned absolutely with `mix-blend-mode` and slow CSS animation (`@keyframes float`).
- Optional subtle SVG grid or dot pattern at low opacity.

**Animation Sequence**:

1. Micro-label fades in (delay: 0ms).
2. Headline slides up + fades in (delay: 100ms).
3. Subheadline fades in (delay: 300ms).
4. CTAs slide up (delay: 500ms).
5. Trust metrics count up (delay: 700ms, triggered by `IntersectionObserver`).
6. Right-column visual floats continuously with subtle parallax.
7. Background orbs drift slowly on infinite loop.

#### 3.4.3 Services Preview (ServicesPreview.astro + ServiceCard.tsx)

**Layout**: Section with heading + 5-card responsive grid.

**Section Header**:

- Micro-label: `"Services"`.
- Heading: `"Solutions Designed for Growth"`.
- Subheading: `"Practical AI and digital solutions built to improve operations, accelerate delivery, and create measurable business impact."`.

**Card Grid**: 5 cards in a responsive grid (1-col mobile, 2-col `sm:`, 3-col `md:`, 5-col `lg:`).

**Service Cards** (5 total):

| #   | Title                       | Description                                                                                                   | Icon                   |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------- |
| 1   | Web Development             | Modern platforms, dashboards, and digital products built for speed, usability, and scale.                     | layout/window/code     |
| 2   | Workflow Automation         | Reduce manual work and streamline operations with tailored automations designed around your business.         | workflow/zap           |
| 3   | AI Integration & Consulting | Turn AI into a practical advantage with solutions aligned to real business goals and workflows.               | sparkles/brain/circuit |
| 4   | AI Marketing Studio         | Use AI-assisted creative systems to improve content production, campaigns, and digital brand presence.        | megaphone/trending     |
| 5   | Spatial Consultancy         | Explore new ways to improve environments, layouts, and experiences through intelligent design and technology. | cube/map/grid          |

**Card Design**:

- `bg-midnight-surface` with `border border-white/5`.
- `rounded-2xl`, `p-6`.
- Icon in accent color, title in Sora 600, description in muted text.
- Arrow indicator (`→`) at bottom right.

**Hover Interaction** (React island):

- Card lifts (`translateY(-4px)`), shadow intensifies.
- Border glows with accent color (`border-accent-cyan/30`).
- Icon shifts or scales subtly.
- Arrow slides right 4px.
- Transition: `300ms ease`.

**Scroll Animation**: Cards stagger-reveal on scroll entry (0ms, 100ms, 200ms, 300ms, 400ms delay).

#### 3.4.4 AI Assistant Section (ConsultantSection.astro — Redesign)

Preserves all existing chat functionality. Changes are visual and structural only.

**Visual Changes**:

- Container: `bg-midnight-surface` or `bg-midnight-light`, `rounded-3xl`, larger padding.
- Glassmorphism panels: `backdrop-blur-md bg-white/5 border border-white/10`.
- Softer borders, more spacing, darker premium container.
- Stronger hierarchy between sections.

**Left Panel Redesign**:

- Brand title + positioning statement.
- Quick pathway chips (curated navigation): "Grow revenue with AI", "Automate operations", "Build a digital platform", "Transform your marketing", "Get an AI strategy".
- Mini trust notes below: "Bilingual support", "Fast execution", "Tailored solutions".
- Existing CTA buttons preserved with updated styling.

**Right Panel Redesign**:

- Chat header with stronger visual hierarchy.
- Welcome message with premium typography.
- Prompt chips as premium rounded glass elements with hover glow.
- Input field with darker surface, modern rounded edges, accent focus ring.
- Existing chat logic, verification, error handling fully preserved.

#### 3.4.5 Process Section (ProcessSection.astro)

**Layout**: Section with 4-step horizontal flow (vertical on mobile).

**Section Header**:

- Micro-label: `"Process"`.
- Heading: `"A Clear Path from Idea to Execution"`.
- Subheading: `"We combine strategy, execution, and modern engineering to move from concept to delivery with confidence."`.

**Steps**:

| #   | Title    | Description                                                                                                  | Icon           |
| --- | -------- | ------------------------------------------------------------------------------------------------------------ | -------------- |
| 1   | Discover | We start by understanding your goals, business context, and technical challenges.                            | search/compass |
| 2   | Design   | We define the right solution, structure the experience, and align technology with business priorities.       | pen/layers     |
| 3   | Build    | We implement platforms, automations, and AI-powered experiences with quality and momentum.                   | code/hammer    |
| 4   | Optimize | We refine usability, performance, and long-term maintainability so your solution continues to deliver value. | chart/gauge    |

**Visual**: Connecting progression line between steps. Step cards animate upward on scroll entry.

#### 3.4.6 Final CTA Section (FinalCTA.astro)

**Layout**: Centered text block with strong visual presence.

**Content**:

- Heading: `"Let's Build Something Smarter"`.
- Subheading: `"From AI integration and workflow automation to modern digital platforms, we help businesses move from strategy to execution with clarity and speed."`.
- Primary CTA: "Book a Free Consultation".
- Secondary CTA: "Contact Us".
- Optional note: `"Tell us what you are building, what is slowing you down, or where AI could create leverage."`.

**Visual**: Stronger gradient background, elevated panel, glowing accent shapes, premium motion.

#### 3.4.7 Footer (RedesignedFooter.astro)

**Layout**: 4-column grid on `lg:`, stacked on mobile.

| Column      | Content                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------- |
| Brand       | Logo + `"AI-powered solutions for modern businesses"` + short paragraph                            |
| Navigation  | Services, Process, About, Contact, Privacy Policy                                                  |
| Trust Notes | Fully bilingual — EN/ES · Typical delivery — 4–12 weeks · Clean code approach · US & LATAM clients |
| Social      | GitHub, LinkedIn, Instagram icons with hover glow                                                  |

**Bottom Bar**: `© 2026 JuaneloJGAC Tech. All rights reserved.`

**Visual**: Background slightly darker than main page (`bg-midnight` or darker). Subtle top gradient line. Strong spacing and structure.

### 3.5 Integration Points

- **Existing AI Chat Backend**: No changes. `ChatAssistantService`, `ScopeEnforcer`, `StaticContentProvider`, OpenRouter client, Netlify function — all preserved.
- **Turnstile Verification**: Preserved in the assistant section.
- **Netlify Deployment**: Static output via `astro build`. No SSR changes. Netlify config unchanged.
- **Google Fonts**: Inter (body) + Sora (headings) remain — no new font dependencies.
- **Social Links**: GitHub (`https://github.com/juanelojga`), LinkedIn, Instagram — URLs to be confirmed by stakeholder. Open in new tab with `rel="noopener noreferrer"`.

### 3.6 Security & Privacy

- No new data collection, form submissions, or API endpoints introduced.
- Social links use `rel="noopener noreferrer"` and `target="_blank"`.
- All existing Turnstile, rate limiting, and scope enforcement remain unchanged.
- No third-party analytics or tracking scripts added in this scope.
- CSP headers in `netlify.toml` may need updates if new external resources are loaded (e.g., icon CDN) — validate post-implementation.

### 3.7 Performance Requirements

| Metric                   | Target         | Measurement                       |
| ------------------------ | -------------- | --------------------------------- |
| Lighthouse Performance   | ≥ 90           | Chrome DevTools Lighthouse        |
| Lighthouse Accessibility | ≥ 95           | Chrome DevTools Lighthouse        |
| First Contentful Paint   | ≤ 1.5s         | WebPageTest on 4G                 |
| Largest Contentful Paint | ≤ 2.5s         | WebPageTest on 4G                 |
| Cumulative Layout Shift  | < 0.1          | Chrome DevTools                   |
| Total JS bundle increase | < 15KB gzipped | Build output comparison           |
| Animation frame rate     | 60fps          | Chrome DevTools Performance panel |

**Performance Guidelines**:

- CSS animations preferred over JS for background effects (GPU-accelerated transforms and opacity).
- Count-up animation uses `requestAnimationFrame`, not interval-based.
- Hero visual uses CSS transforms + will-change for floating motion.
- No animation libraries (GSAP, Framer Motion) — CSS + vanilla JS + React state only.
- `IntersectionObserver` for scroll-triggered animations — no scroll event listeners.
- Images lazy-loaded except hero logo and visual (eager).
- SVG icons inline or from a lightweight icon set (Lucide or similar already in stack).

### 3.8 Accessibility Requirements

- All animations respect `prefers-reduced-motion: reduce` — disable motion, show static state.
- Color contrast ratios meet WCAG AA: text on dark backgrounds ≥ 4.5:1 for body, ≥ 3:1 for large text.
- All interactive elements have visible focus indicators with accent color.
- Social links include `aria-label` (e.g., `aria-label="GitHub"`).
- Navigation landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>` with aria-labels.
- Skip-to-content link preserved.
- Mobile hamburger menu accessible via keyboard.
- Count-up numbers include `aria-live="polite"` or final static value for screen readers.

---

## 4. i18n Content Contract

All new visible text must exist in both `src/i18n/en.json` and `src/i18n/es.json` with matching key structure.

### New i18n Namespaces Required

```
redesign.header.*          — nav links, CTA label, social aria-labels, language switch
redesign.hero.*            — micro-label, headline, subheadline, CTA labels, trust metrics
redesign.services.*        — section label, heading, subheading, card titles, card descriptions
redesign.process.*         — section label, heading, subheading, step titles, step descriptions
redesign.finalCta.*        — heading, subheading, CTA labels, optional note
redesign.footer.*          — brand statement, paragraph, nav labels, trust notes, copyright, social labels
```

### Copy Direction

**EN Headline**: "Build Smarter Products, Automations, and AI Experiences"
**ES Headline**: "Construya Productos, Automatizaciones y Experiencias de IA Más Inteligentes"

**EN Subheadline**: "From AI integration and workflow automation to scalable web platforms and digital experiences, we help businesses turn complex ideas into practical systems."
**ES Subheadline**: "Desde integración de IA y automatización de flujos de trabajo hasta plataformas web escalables y experiencias digitales, ayudamos a las empresas a convertir ideas complejas en sistemas prácticos."

Full copy for both languages is specified in the redesign brief and must be adapted during implementation phase content modeling.

---

## 5. Risks & Roadmap

### Phased Rollout

#### Phase 1: Design System & Content Model (Foundation)

- Define new Tailwind theme tokens (color, spacing, radius).
- Create all i18n keys in both languages.
- Define TypeScript interfaces for new component props.
- Update `tailwind.css` `@theme` block.
- **Deliverable**: Design system tokens active, all copy in translation files, prop interfaces locked.

#### Phase 2: Header & Footer Redesign

- Build `RedesignedHeader.astro` with scroll behavior (React island for state).
- Build `RedesignedFooter.astro` with 4-column layout.
- Add social icon components with hover interactions.
- Build premium EN/ES language switcher.
- Replace `ConsultantHeader.astro` and `ConsultantFooter.astro` in page files.
- **Deliverable**: New header and footer live on both language routes.

#### Phase 3: Hero Section

- Build `HeroSection.astro` with 2-column layout.
- Build `HeroVisual.tsx` React island with floating mockup and CSS animations.
- Build `TrustMetrics.tsx` React island with count-up animation.
- Create animated background (CSS gradients, blurred orbs, optional grid pattern).
- Implement staggered entrance animation sequence.
- Replace `ConsultantHero.astro` in page files.
- **Deliverable**: New cinematic hero live with animations and trust metrics.

#### Phase 4: Services Preview

- Build `ServicesPreview.astro` section.
- Build `ServiceCard.tsx` React island with hover interactions.
- Add service icons (inline SVG or icon component).
- Implement stagger-reveal scroll animation.
- Wire section into page between hero and consultant section.
- **Deliverable**: 5 service cards visible immediately below hero.

#### Phase 5: AI Assistant Section Visual Redesign

- Restyle `ConsultantSection.astro` and child components with dark premium aesthetic.
- Update `TrustPanel.tsx` layout: curated navigation pathways, mini trust notes.
- Update chat UI components: glassmorphism panels, premium prompt chips, darker surfaces.
- Preserve all existing chat functionality, verification, error handling.
- **Deliverable**: Assistant section matches new design language, all chat features intact.

#### Phase 6: Process Section & Final CTA

- Build `ProcessSection.astro` with 4-step flow.
- Build `FinalCTA.astro` with strong visual treatment.
- Implement scroll entrance animations for both sections.
- Wire sections into page order.
- **Deliverable**: Full page structure complete: Header → Hero → Services → Assistant → Process → Final CTA → Footer.

#### Phase 7: Animation Polish & Responsive Verification

- Verify all animations with `prefers-reduced-motion`.
- Polish mobile layouts across all sections.
- Test tablet breakpoints.
- Tune animation timing, easing, and staggering.
- Verify background effects performance (60fps target).
- **Deliverable**: Animations polished, responsive behavior verified across breakpoints.

#### Phase 8: Testing & Final Validation

- Update E2E tests for new page structure.
- Update component unit tests for redesigned components.
- Run `pnpm run astro:check` for TypeScript validation.
- Run `pnpm run lint:fix` and `pnpm run format`.
- Run Lighthouse audits for Performance and Accessibility.
- Run `pnpm run build` for production validation.
- Verify EN/ES parity across all new sections.
- **Deliverable**: All tests passing, build clean, audit scores meeting targets.

### Technical Risks

| Risk                                              | Likelihood | Impact | Mitigation                                                                                                         |
| ------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| CSS animation performance on low-end devices      | Medium     | Medium | Use GPU-accelerated properties only (transform, opacity). Test on throttled CPU. Respect `prefers-reduced-motion`. |
| Dark theme contrast accessibility failures        | Medium     | High   | Validate all text/background combinations against WCAG AA during development. Use Lighthouse accessibility audit.  |
| Hero visual complexity increasing bundle size     | Low        | Medium | Use CSS-only animations where possible. No animation libraries. Measure JS bundle delta against 15KB budget.       |
| Existing chat E2E tests breaking from DOM changes | High       | Medium | Run E2E suite after each structural change. Use data-testid attributes to decouple tests from styling.             |
| i18n key mismatches between EN and ES             | Medium     | Medium | Run i18n parity test after all copy additions. Validate symmetry before each phase completion.                     |
| Glassmorphism `backdrop-filter` browser support   | Low        | Low    | `backdrop-filter` supported in all modern browsers. Provide graceful fallback (solid background) via `@supports`.  |
| Hero background animation causing layout shift    | Low        | High   | Use `position: absolute` for all background elements. Set explicit dimensions. No layout-affecting animations.     |
| Social link URLs not confirmed                    | Medium     | Low    | Use placeholder `#` hrefs with `TODO` comments. Replace with real URLs before production deploy.                   |

### Dependencies

- **External**: Social media profile URLs (GitHub confirmed, LinkedIn and Instagram TBD).
- **Internal**: All existing V2 consultant phases (1–7) must be stable before redesign begins.
- **Design Assets**: Logo variation for dark backgrounds (may need transparent/white version). Current logo at `/public/assets/logo/logo.png` — verify it renders well on dark backgrounds.

### Decisions

- **Included**: Full visual redesign of homepage, new sections (services preview, process, final CTA), header and footer rebuild, dark premium color system, animation system, social links, i18n parity, responsive layouts, test updates.
- **Excluded**: Blog pages, case study pages, contact form, CRM integration, analytics instrumentation, backend chat changes, new API endpoints, user accounts, cross-session persistence.
- **Stack**: No new dependencies. Astro v6 + React 19 + Tailwind CSS v4 + existing icon approach. If an icon library is needed, prefer Lucide (lightweight, tree-shakeable) — confirm before adding.

---

## 6. Recommended Page Structure (Final)

```
1. Sticky Premium Header
   ├── Larger logo
   ├── Nav links (Services, Process, About, Contact)
   ├── Social icons (GitHub, LinkedIn, Instagram) — desktop only
   ├── EN/ES premium segmented switcher
   └── CTA button ("Book a Consultation")

2. Hero Section (2-column, animated)
   ├── Left: micro-label → headline → subheadline → CTA row → trust metrics
   ├── Right: floating AI mockup visual with glass cards and glowing shapes
   └── Background: dark gradient + animated blurred orbs + optional grid

3. Services Preview Strip
   └── 5 glass cards with icon, title, description, hover effect

4. AI Assistant / Consultation Section
   ├── Left: brand + curated pathways + mini trust notes
   └── Right: chat experience (preserved functionality, premium restyling)

5. Process Section
   └── 4 steps: Discover → Design → Build → Optimize

6. Final CTA Section
   └── Strong conversion block with gradient background

7. Rich Footer
   ├── Brand column
   ├── Navigation column
   ├── Trust notes column
   └── Social links column
```

---

## 7. Design Concept (One-Line)

**A premium, dark, animated AI consultancy landing page with high-end SaaS aesthetics, stronger service visibility, a cinematic hero experience, and polished motion design — transforming the homepage from functional-corporate to memorable-premium.**
