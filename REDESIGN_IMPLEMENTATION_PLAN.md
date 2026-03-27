# Premium Homepage Redesign — Detailed Implementation Plan

**Project**: JuaneloJGAC Tech Premium Homepage Redesign
**Goal**: Transform the homepage from a light, flat corporate page into a dark premium AI consultancy landing page with cinematic hero, glassmorphism panels, layered depth, service visibility above the fold, process section, final CTA, rich footer, and polished motion design — while preserving bilingual (EN/ES) architecture, AI consultant chat, and the Astro + React island stack.
**Team**: 1 AI-assisted developer (solo)
**Constraints**: No new dependencies (unless Lucide icons confirmed). Astro v6 + React 19 + Tailwind CSS v4. All visible text bilingual. Lighthouse Performance ≥ 90, Accessibility ≥ 95. JS bundle increase < 15KB gzipped. 60fps animations. CSS + vanilla JS + React state only (no GSAP/Framer Motion).

---

## Current State Summary

- **Pages**: `src/pages/index.astro` (EN), `src/pages/es.astro` (ES) — both import `Layout`, `ConsultantHeader`, `ConsultantHero`, `ConsultantSection`, `ConsultantFooter`
- **Layout**: `src/layouts/Layout.astro` — includes `<Seo>`, Google Fonts, skip-to-content link, `<main id="main-content">`
- **Header**: `ConsultantHeader.astro` — white background, logo (h-8/h-10), EN/ES language toggle only, no nav links, no CTA, no social icons
- **Hero**: `ConsultantHero.astro` — `bg-tarawera`, centered single-column, 2xl–4xl headline, basic CTA ("Start a Conversation")
- **Section**: `ConsultantSection.astro` — full AI chat section with `ConsultantLayout.tsx` React island, `bg-neutral-lightest`
- **Footer**: `ConsultantFooter.astro` — minimal, white bg, copyright + contact + privacy links
- **i18n**: `src/i18n/en.json` and `es.json` — namespaces: `seo.*`, `chat.*`, `consultant.header.*`, `consultant.hero.*`, `consultant.footer.*`
- **Tailwind**: `src/styles/tailwind.css` — existing tokens for brand colors (tarawera, persian-green, coral, purple-heart), neutrals, chat UI tokens, font definitions (Inter, Sora)
- **Tests**: 929 unit tests (Vitest), E2E tests (Playwright) for desktop/mobile/tablet, AstroContainer-based component tests
- **Branch**: `feat/phase-1` off `main` — all V2 phases (1–7) complete

---

## Milestones

| #   | Milestone                                  | Success Criteria                                                                                               |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| 1   | Foundation — Design System & Content Model | New Tailwind tokens active, all i18n keys in both languages, TypeScript interfaces defined, build passes       |
| 2   | Header & Footer Redesign                   | New header with nav/social/CTA/scroll behavior live, new footer with 4-column layout live, both EN/ES          |
| 3   | Hero Section                               | Cinematic 2-column hero with animated visual, trust metrics count-up, staggered entrance, background orbs      |
| 4   | Services Preview                           | 5-card responsive grid below hero with hover interactions, scroll-reveal, icons                                |
| 5   | AI Assistant Visual Redesign               | ConsultantSection restyled with dark premium aesthetic, glassmorphism panels, all chat functionality preserved |
| 6   | Process Section & Final CTA                | 4-step process flow + strong CTA section wired into page, scroll animations                                    |
| 7   | Animation Polish & Responsive              | All animations respect `prefers-reduced-motion`, mobile/tablet responsive verified, 60fps, timing tuned        |
| 8   | Testing & Final Validation                 | E2E tests updated, unit tests passing, Lighthouse audit meeting targets, build clean, EN/ES parity verified    |

---

## Dependencies Visualization

```
Phase 1 (Foundation) ──────────────────────────────────────────────┐
  │                                                                │
  ├──> Phase 2 (Header & Footer) ──> Phase 3 (Hero) ──┐           │
  │                                                     │           │
  ├──> Phase 4 (Services Preview) ←────────────────────┘           │
  │                                                                │
  ├──> Phase 5 (AI Assistant Visual) ← Phase 1 only               │
  │                                                                │
  ├──> Phase 6 (Process + Final CTA) ← Phase 1 only               │
  │                                                                │
  └──> Phase 7 (Animation Polish) ← Phases 2–6 all complete       │
                │                                                   │
                └──> Phase 8 (Testing & Validation) ← Phase 7 ────┘
```

**Critical Path**: Phase 1 → Phase 2 → Phase 3 → Phase 7 → Phase 8

**Parallelizable**: Phases 4, 5, and 6 can run in parallel once Phase 1 is complete (no inter-dependencies). Phase 4 ordering on page depends on Phase 3 for placement context, but component work is independent.

---

## Phase 1: Design System & Content Model (Foundation)

### 1.1 — Add new Tailwind theme tokens to `src/styles/tailwind.css`

**File**: `src/styles/tailwind.css`

Add inside the `@theme { }` block, after existing tokens:

```css
/* ─── Redesign – Dark Premium Palette ─── */
--color-midnight: #07111f;
--color-midnight-light: #0d1b2a;
--color-midnight-surface: #11243a;
--color-text-bright: #f8fafc;
--color-text-muted: #a7b4c6;
--color-accent-cyan: #38bdf8;
--color-accent-teal: #2dd4bf;
--color-accent-violet: #8b5cf6;
--color-accent-pink: #ec4899;
```

**Done Criteria**: `pnpm run build` passes. New tokens available in Tailwind classes (e.g., `bg-midnight`, `text-text-bright`, `border-accent-cyan`).

### 1.2 — Define TypeScript interfaces for new component props

**File**: `src/components/redesign/types.ts` (new)

Interfaces to define:

- `RedesignedHeaderProps` — `{ lang: Language }`
- `HeroSectionProps` — `{ lang: Language }`
- `HeroVisualProps` — `{}` (pure visual, no props or minimal animation config)
- `TrustMetricsProps` — `{ metrics: TrustMetric[] }` where `TrustMetric = { value: string; label: string; numericValue?: number }`
- `ServiceCardProps` — `{ icon: React.ReactNode; title: string; description: string; index: number }`
- `ServicesPreviewProps` — `{ lang: Language }` (Astro) / React: `{ services: ServiceCardData[]; sectionLabel: string; heading: string; subheading: string }`
- `ProcessStepProps` — `{ step: number; icon: React.ReactNode; title: string; description: string }`
- `FinalCTAProps` — `{ lang: Language }`
- `RedesignedFooterProps` — `{ lang: Language }`

**Done Criteria**: File compiles with `pnpm run astro:check`. All interfaces have explicit field types, no `any`.

### 1.3 — Create all i18n keys in both languages

**Files**: `src/i18n/en.json`, `src/i18n/es.json`

Add the `redesign` top-level namespace with these sub-namespaces:

#### `redesign.header`

| Key                    | EN                    | ES                       |
| ---------------------- | --------------------- | ------------------------ |
| `navServices`          | Services              | Servicios                |
| `navProcess`           | Process               | Proceso                  |
| `navAbout`             | About                 | Nosotros                 |
| `navContact`           | Contact               | Contacto                 |
| `ctaLabel`             | Book a Consultation   | Agendar Consulta         |
| `logoAlt`              | JuaneloJGAC Tech logo | Logo de JuaneloJGAC Tech |
| `languageSwitchLabel`  | Language              | Idioma                   |
| `menuLabel`            | Menu                  | Menú                     |
| `closeMenuLabel`       | Close menu            | Cerrar menú              |
| `socialGithubLabel`    | GitHub                | GitHub                   |
| `socialLinkedinLabel`  | LinkedIn              | LinkedIn                 |
| `socialInstagramLabel` | Instagram             | Instagram                |

#### `redesign.hero`

| Key                 | EN                                                                                                                                                           | ES                                                                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `microLabel`        | AI Consulting for Modern Businesses                                                                                                                          | Consultoría IA para Empresas Modernas                                                                                                                                                               |
| `headline`          | Build Smarter Products, Automations, and AI Experiences                                                                                                      | Construya Productos, Automatizaciones y Experiencias de IA Más Inteligentes                                                                                                                         |
| `subheadline`       | From AI integration and workflow automation to scalable web platforms and digital experiences, we help businesses turn complex ideas into practical systems. | Desde integración de IA y automatización de flujos de trabajo hasta plataformas web escalables y experiencias digitales, ayudamos a las empresas a convertir ideas complejas en sistemas prácticos. |
| `ctaPrimary`        | Book a Free Consultation                                                                                                                                     | Agendar Consulta Gratis                                                                                                                                                                             |
| `ctaSecondary`      | Explore Services                                                                                                                                             | Explorar Servicios                                                                                                                                                                                  |
| `trustProjects`     | Projects Delivered                                                                                                                                           | Proyectos Entregados                                                                                                                                                                                |
| `trustSatisfaction` | Client Satisfaction                                                                                                                                          | Satisfacción del Cliente                                                                                                                                                                            |
| `trustMarkets`      | US & LATAM Clients Served                                                                                                                                    | Clientes en EE.UU. y LATAM                                                                                                                                                                          |

#### `redesign.services`

| Key                | EN                                                                                                                          | ES                                                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `sectionLabel`     | Services                                                                                                                    | Servicios                                                                                                                           |
| `heading`          | Solutions Designed for Growth                                                                                               | Soluciones Diseñadas para el Crecimiento                                                                                            |
| `subheading`       | Practical AI and digital solutions built to improve operations, accelerate delivery, and create measurable business impact. | Soluciones prácticas de IA y digitales creadas para mejorar operaciones, acelerar entregas y generar impacto medible en el negocio. |
| `card1Title`       | Web Development                                                                                                             | Desarrollo Web                                                                                                                      |
| `card1Description` | Modern platforms, dashboards, and digital products built for speed, usability, and scale.                                   | Plataformas modernas, dashboards y productos digitales creados para velocidad, usabilidad y escala.                                 |
| `card2Title`       | Workflow Automation                                                                                                         | Automatización de Flujos                                                                                                            |
| `card2Description` | Reduce manual work and streamline operations with tailored automations designed around your business.                       | Reduzca trabajo manual y optimice operaciones con automatizaciones diseñadas para su negocio.                                       |
| `card3Title`       | AI Integration & Consulting                                                                                                 | Integración IA y Consultoría                                                                                                        |
| `card3Description` | Turn AI into a practical advantage with solutions aligned to real business goals and workflows.                             | Convierta la IA en una ventaja práctica con soluciones alineadas a los objetivos reales de su negocio.                              |
| `card4Title`       | AI Marketing Studio                                                                                                         | Studio de Marketing con IA                                                                                                          |
| `card4Description` | Use AI-assisted creative systems to improve content production, campaigns, and digital brand presence.                      | Use sistemas creativos asistidos por IA para mejorar producción de contenido, campañas y presencia digital.                         |
| `card5Title`       | Spatial Consultancy                                                                                                         | Consultoría Espacial                                                                                                                |
| `card5Description` | Explore new ways to improve environments, layouts, and experiences through intelligent design and technology.               | Explore nuevas formas de mejorar entornos, distribuciones y experiencias a través del diseño inteligente y la tecnología.           |

#### `redesign.process`

| Key                | EN                                                                                                           | ES                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `sectionLabel`     | Process                                                                                                      | Proceso                                                                                                                 |
| `heading`          | A Clear Path from Idea to Execution                                                                          | Un Camino Claro de la Idea a la Ejecución                                                                               |
| `subheading`       | We combine strategy, execution, and modern engineering to move from concept to delivery with confidence.     | Combinamos estrategia, ejecución e ingeniería moderna para avanzar del concepto a la entrega con confianza.             |
| `step1Title`       | Discover                                                                                                     | Descubrir                                                                                                               |
| `step1Description` | We start by understanding your goals, business context, and technical challenges.                            | Comenzamos entendiendo sus objetivos, contexto de negocio y desafíos técnicos.                                          |
| `step2Title`       | Design                                                                                                       | Diseñar                                                                                                                 |
| `step2Description` | We define the right solution, structure the experience, and align technology with business priorities.       | Definimos la solución adecuada, estructuramos la experiencia y alineamos la tecnología con las prioridades del negocio. |
| `step3Title`       | Build                                                                                                        | Construir                                                                                                               |
| `step3Description` | We implement platforms, automations, and AI-powered experiences with quality and momentum.                   | Implementamos plataformas, automatizaciones y experiencias potenciadas con IA con calidad y agilidad.                   |
| `step4Title`       | Optimize                                                                                                     | Optimizar                                                                                                               |
| `step4Description` | We refine usability, performance, and long-term maintainability so your solution continues to deliver value. | Refinamos usabilidad, rendimiento y mantenibilidad a largo plazo para que su solución continúe generando valor.         |

#### `redesign.finalCta`

| Key            | EN                                                                                                                                                  | ES                                                                                                                                                                                 |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heading`      | Let's Build Something Smarter                                                                                                                       | Construyamos Algo Más Inteligente                                                                                                                                                  |
| `subheading`   | From AI integration and workflow automation to modern digital platforms, we help businesses move from strategy to execution with clarity and speed. | Desde integración de IA y automatización de flujos hasta plataformas digitales modernas, ayudamos a las empresas a pasar de la estrategia a la ejecución con claridad y velocidad. |
| `ctaPrimary`   | Book a Free Consultation                                                                                                                            | Agendar Consulta Gratis                                                                                                                                                            |
| `ctaSecondary` | Contact Us                                                                                                                                          | Contáctenos                                                                                                                                                                        |
| `note`         | Tell us what you are building, what is slowing you down, or where AI could create leverage.                                                         | Cuéntenos qué está construyendo, qué lo está frenando o dónde la IA podría crear ventaja.                                                                                          |

#### `redesign.footer`

| Key              | EN                                                                                                                                  | ES                                                                                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `brandStatement` | AI-powered solutions for modern businesses                                                                                          | Soluciones potenciadas con IA para empresas modernas                                                                                                  |
| `brandParagraph` | We help startups and SMEs turn complex ideas into practical systems through AI integration, automation, and modern web development. | Ayudamos a startups y pymes a convertir ideas complejas en sistemas prácticos a través de integración de IA, automatización y desarrollo web moderno. |
| `navLabel`       | Navigation                                                                                                                          | Navegación                                                                                                                                            |
| `navServices`    | Services                                                                                                                            | Servicios                                                                                                                                             |
| `navProcess`     | Process                                                                                                                             | Proceso                                                                                                                                               |
| `navAbout`       | About                                                                                                                               | Nosotros                                                                                                                                              |
| `navContact`     | Contact                                                                                                                             | Contacto                                                                                                                                              |
| `navPrivacy`     | Privacy Policy                                                                                                                      | Política de Privacidad                                                                                                                                |
| `trustLabel`     | Why Work With Us                                                                                                                    | Por Qué Trabajar Con Nosotros                                                                                                                         |
| `trustBilingual` | Fully bilingual — EN/ES                                                                                                             | Totalmente bilingüe — EN/ES                                                                                                                           |
| `trustDelivery`  | Typical delivery — 4–12 weeks                                                                                                       | Entrega típica — 4–12 semanas                                                                                                                         |
| `trustCode`      | Clean code approach                                                                                                                 | Enfoque de código limpio                                                                                                                              |
| `trustMarkets`   | US & LATAM clients                                                                                                                  | Clientes en EE.UU. y LATAM                                                                                                                            |
| `socialLabel`    | Social                                                                                                                              | Social                                                                                                                                                |
| `copyright`      | © 2026 JuaneloJGAC Tech. All rights reserved.                                                                                       | © 2026 JuaneloJGAC Tech. Todos los derechos reservados.                                                                                               |

**Done Criteria**: Both JSON files parse without errors. All keys match symmetrically between EN and ES. `pnpm run build` passes.

### 1.4 — Create the `src/components/redesign/` directory structure

```
src/components/redesign/
├── types.ts                    ← TypeScript interfaces (task 1.2)
├── RedesignedHeader.astro      ← (Phase 2)
├── RedesignedFooter.astro      ← (Phase 2)
├── HeroSection.astro           ← (Phase 3)
├── ServicesPreview.astro       ← (Phase 4)
├── ProcessSection.astro        ← (Phase 6)
├── FinalCTA.astro              ← (Phase 6)
└── react/
    ├── HeroVisual.tsx          ← (Phase 3)
    ├── TrustMetrics.tsx        ← (Phase 3)
    ├── ServiceCard.tsx         ← (Phase 4)
    ├── ScrollNavbar.tsx        ← (Phase 2 — header scroll behavior)
    └── SocialIcons.tsx         ← (Phase 2 — hover glow icons)
```

**Done Criteria**: Directory exists. `types.ts` compiles. Structure documented.

### 1.5 — Add CSS animation keyframes for the redesign

**File**: `src/styles/tailwind.css` (or a new `src/styles/redesign-animations.css` imported from Layout)

Keyframes to define:

- `@keyframes float` — slow vertical drift (translateY ±10px over 6s, infinite)
- `@keyframes glow-pulse` — opacity 0.4 → 0.8 → 0.4 over 4s, infinite
- `@keyframes fade-in-up` — opacity 0→1, translateY 20px→0, 600ms ease-out
- `@keyframes orb-drift` — slow position drift for background orbs, 20s infinite
- `@keyframes count-up` — (handled in JS via requestAnimationFrame, no CSS keyframe needed)

Also add:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Done Criteria**: Keyframes defined, `prefers-reduced-motion` media query in place, build passes.

### Phase 1 Effort Summary

| Task                               | Effort | Depends On | Done Criteria                            |
| ---------------------------------- | ------ | ---------- | ---------------------------------------- |
| 1.1 Tailwind tokens                | 1h     | —          | Build passes, tokens usable in classes   |
| 1.2 TypeScript interfaces          | 1h     | —          | `astro:check` passes, no `any`           |
| 1.3 i18n keys (EN + ES)            | 2h     | —          | JSON valid, symmetric keys, build passes |
| 1.4 Directory structure            | 0.5h   | 1.2        | Directory exists, types.ts compiles      |
| 1.5 CSS keyframes + reduced motion | 1h     | —          | Keyframes defined, media query in place  |

**Total Phase 1**: ~5.5 hours

---

## Phase 2: Header & Footer Redesign

### 2.1 — Build `RedesignedHeader.astro`

**File**: `src/components/redesign/RedesignedHeader.astro`

**Structure**:

```html
<header class="sticky top-0 z-50 transition-all duration-300" id="redesigned-header">
  <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:h-20 lg:px-8">
    <!-- Left: Logo (48-56px height) -->
    <!-- Center (lg:): Nav links — Services, Process, About, Contact (anchor links) -->
    <!-- Right: Social icons (lg:), EN/ES pill switcher, CTA button -->
  </div>
</header>
```

**Key Implementation Details**:

- **Transparent on hero**: Initial state has no background, transparent over hero gradient
- **Scroll state**: Use `IntersectionObserver` on the hero section. When hero leaves viewport, add backdrop-blur-xl + `bg-midnight/80` + subtle border-bottom glow (`border-b border-accent-cyan/10`)
- **Scroll detection approach**: Inline `<script>` in the Astro component using `IntersectionObserver` on `#hero-section`. Toggle a `data-scrolled` attribute on the header. CSS handles visual transitions via `[data-scrolled]` selector. No React island needed for this.
- **Nav links**: Anchor-based (`#services`, `#process`, `#contact`). Styled: `text-text-muted hover:text-text-bright transition-colors`. Hidden below `lg:`
- **Social icons**: Inline SVG (GitHub, LinkedIn, Instagram). `text-text-muted hover:text-accent-cyan transition-colors`. Hidden below `lg:`
- **Language switcher**: Pill-style segmented control. Active pill: `bg-accent-cyan/20 text-accent-cyan`. Inactive: `text-text-muted hover:text-text-bright`
- **CTA button**: `bg-gradient-to-r from-accent-cyan to-accent-teal text-midnight font-semibold rounded-lg px-5 py-2.5`
- **Logo**: `h-12 lg:h-14 w-auto` — larger than current (h-8/h-10). Verify logo renders well on dark background.

**Done Criteria**: Header renders on both EN/ES pages. Transparent on hero, blurs on scroll. Nav links, social icons, language switch, CTA all functional. Mobile shows logo + hamburger.

### 2.2 — Build mobile menu for header

**Approach**: Extend existing mobile menu pattern or build a new one. The current site uses `MobileMenuEnhanced.tsx` (React island).

**Implementation**:

- React island `MobileMenu.tsx` in `src/components/redesign/react/`
- Triggered by hamburger button (visible below `lg:`)
- Full-screen overlay with `bg-midnight/95 backdrop-blur-xl`
- Contains: nav links, language switch, CTA button, social icons
- Animated: slide-down or fade-in
- Focus trap when open. Escape key closes. `aria-expanded` on trigger.

**Done Criteria**: Hamburger opens menu. All nav items accessible by keyboard. Close on Escape. Smooth animation. Focus trap works.

### 2.3 — Build `RedesignedFooter.astro`

**File**: `src/components/redesign/RedesignedFooter.astro`

**Structure**:

```html
<footer class="bg-midnight border-t border-white/5 pt-16 pb-8 lg:pt-24">
  <div class="mx-auto max-w-7xl px-4 lg:px-8">
    <!-- 4-column grid (lg:grid-cols-4, stacked on mobile) -->
    <div class="grid gap-10 lg:grid-cols-4">
      <!-- Col 1: Brand — Logo + statement + paragraph -->
      <!-- Col 2: Navigation — Services, Process, About, Contact, Privacy -->
      <!-- Col 3: Trust Notes — 4 bullet items -->
      <!-- Col 4: Social — 3 icon links with hover glow -->
    </div>
    <!-- Bottom bar: copyright -->
    <div class="mt-12 border-t border-white/5 pt-6 text-center">
      <p class="text-text-muted text-sm">© 2026 JuaneloJGAC Tech...</p>
    </div>
  </div>
</footer>
```

**Key Implementation Details**:

- **Brand column**: Logo image (white/light variant?), `text-text-bright` brand statement, `text-text-muted` paragraph
- **Navigation column**: Heading (`text-text-bright font-semibold text-sm uppercase tracking-wider`), links styled as `text-text-muted hover:text-text-bright`
- **Trust notes column**: Same heading style, 4 items with subtle icon or bullet prefix
- **Social column**: Heading, 3 SVG icon links. Base: `text-text-muted`. Hover: `text-accent-cyan` with subtle glow (`filter: drop-shadow(0 0 6px var(--color-accent-cyan))`)
- **Social links**: `target="_blank" rel="noopener noreferrer"` + `aria-label`
- **Responsive**: On mobile, columns stack. Social icons center-aligned. On `sm:`, Navigation + Trust Notes side-by-side (2-col). On `lg:`, full 4-col.

**Done Criteria**: Footer renders on both EN/ES pages. All 4 columns display correctly. Social links open in new tab. Copyright displays. Responsive stacking works.

### 2.4 — Wire header and footer into page files

**Files**: `src/pages/index.astro`, `src/pages/es.astro`

**Changes**:

- Replace `ConsultantHeader` import with `RedesignedHeader` from `../components/redesign/RedesignedHeader.astro`
- Replace `ConsultantFooter` import with `RedesignedFooter` from `../components/redesign/RedesignedFooter.astro`
- Keep old components intact (do not delete) for rollback safety

**Done Criteria**: Both pages render with new header and footer. Old components still exist in codebase. Build passes.

### 2.5 — Update Layout.astro body background

**File**: `src/layouts/Layout.astro`

Change `<body>` to use dark background: `<body class="bg-midnight text-text-bright">`

Update skip-to-content link styling for dark theme: `focus:bg-accent-cyan focus:text-midnight`

**Done Criteria**: Page background is dark. Skip-to-content link remains functional and visible on focus.

### Phase 2 Effort Summary

| Task                       | Effort | Depends On | Done Criteria                                |
| -------------------------- | ------ | ---------- | -------------------------------------------- |
| 2.1 Header component       | 3h     | Phase 1    | Renders on both pages, scroll behavior works |
| 2.2 Mobile menu            | 2h     | 2.1        | Hamburger, overlay, focus trap, animation    |
| 2.3 Footer component       | 2h     | Phase 1    | 4-column layout, social links, responsive    |
| 2.4 Wire into pages        | 0.5h   | 2.1, 2.3   | Both pages render with new header/footer     |
| 2.5 Layout dark background | 0.5h   | Phase 1    | Dark body bg, skip-link updated              |

**Total Phase 2**: ~8 hours

---

## Phase 3: Hero Section

### 3.1 — Build `HeroSection.astro`

**File**: `src/components/redesign/HeroSection.astro`

**Structure**:

```html
<section
  id="hero-section"
  class="from-midnight to-midnight-light relative overflow-hidden bg-gradient-to-b py-20 lg:py-32"
>
  <!-- Background orbs (absolute positioned, z-0) -->
  <div class="absolute inset-0 z-0">
    <div class="orb orb-cyan"></div>
    <!-- Blurred radial gradient -->
    <div class="orb orb-teal"></div>
    <div class="orb orb-violet"></div>
    <!-- Optional: subtle grid pattern SVG at low opacity -->
  </div>

  <!-- Content (z-10) -->
  <div class="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
    <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <!-- Left column: text content -->
      <div>
        <!-- Micro-label -->
        <!-- Headline (h1) -->
        <!-- Subheadline (p) -->
        <!-- CTA row -->
        <!-- Trust metrics (React island) -->
      </div>
      <!-- Right column: visual (React island) -->
      <div class="hidden lg:block">
        <HeroVisual client:load />
      </div>
    </div>
  </div>
</section>
```

**Key Implementation Details**:

- **Micro-label**: `text-accent-cyan text-xs font-semibold uppercase tracking-[0.2em]`
- **Headline**: `font-sora text-4xl font-extrabold tracking-tight text-text-bright sm:text-5xl lg:text-6xl xl:text-7xl` with tighter line-height (`leading-[1.1]`)
- **Subheadline**: `text-text-muted text-lg lg:text-xl mt-6 max-w-xl`
- **CTA row**: Two buttons side by side. Primary: gradient `bg-gradient-to-r from-accent-cyan to-accent-teal text-midnight font-semibold rounded-xl px-8 py-4`. Secondary: ghost — `border border-white/20 text-text-bright hover:bg-white/5 rounded-xl px-8 py-4`
- **Background orbs**: 3 absolutely positioned `div`s with large width/height (300-500px), blurred (`blur-[120px]`), low opacity (0.15-0.3), radial gradients, animated with `@keyframes orb-drift`. Use `mix-blend-mode: screen` or `normal`.
- **Staggered entrance**: Use CSS animation-delay on each element. Apply `animate-fade-in-up` class with incremental `animation-delay` via inline style (0ms, 100ms, 300ms, 500ms, 700ms).
- **ID for IntersectionObserver**: `id="hero-section"` — header scroll detection observes this element.
- **Responsive**: On mobile, right column hidden or simplified. Left column takes full width. CTAs stack vertically on `sm:` and below.

**Done Criteria**: Hero renders with dark gradient, animated orbs, text hierarchy, CTAs, and trust metrics. Staggered entrance plays on load.

### 3.2 — Build `HeroVisual.tsx` React island

**File**: `src/components/redesign/react/HeroVisual.tsx`

**Visual Composition (CSS-only animations)**:

- A floating glass panel mimicking an AI chat interface (simplified mockup)
- Layered glass cards at slight rotations overlapping
- Glowing gradient accent shapes behind the cards
- All animated with CSS transforms:
  - Main panel: `@keyframes float` (translateY ±10px, 6s, infinite)
  - Accent cards: slight counter-rotation float (8s cycle)
  - Glow shapes: slow pulse (`@keyframes glow-pulse`)

**Implementation Approach**:

- Pure CSS animation — no JS state needed for visual motion
- `will-change: transform` on animated elements for GPU acceleration
- Glassmorphism: `bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl`
- Respect `prefers-reduced-motion`: wrap animations in `motion-safe:animate-*` or use media query check

**Done Criteria**: Visual renders on desktop. Floats smoothly at 60fps. Respects `prefers-reduced-motion`. No JS bundle impact (CSS-only animation via className).

### 3.3 — Build `TrustMetrics.tsx` React island

**File**: `src/components/redesign/react/TrustMetrics.tsx`

**Props**:

```ts
interface TrustMetric {
  numericValue: number; // The number to count up to (50, 98)
  suffix: string; // "+" or "%"
  label: string; // "Projects Delivered"
}
interface TrustMetricsProps {
  metrics: TrustMetric[];
}
```

**Implementation**:

- Use `IntersectionObserver` to detect when the component enters the viewport
- Count-up via `requestAnimationFrame`: animate from 0 to `numericValue` over ~1.5s with ease-out
- Each metric: display number + suffix above label text
- Styling: `text-3xl lg:text-4xl font-bold text-text-bright` for number, `text-text-muted text-sm` for label
- `aria-live="polite"` on the container or render final static value in a `<span class="sr-only">` for screen readers
- Third metric ("US & LATAM") is text-only, no count-up — handle as special case (no numericValue, show text directly)
- `prefers-reduced-motion`: skip animation, show final values immediately

**Done Criteria**: Metrics animate count-up when scrolled into view. Screen reader accessible. Static values for reduced motion. No layout shift during animation.

### 3.4 — Create background orb CSS styles

**File**: `src/styles/tailwind.css` or inline in `HeroSection.astro` `<style>`

```css
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.2;
  will-change: transform;
}
.orb-cyan {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #38bdf8, transparent);
  top: 10%;
  right: 20%;
  animation: orb-drift 20s ease-in-out infinite;
}
.orb-teal {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #2dd4bf, transparent);
  bottom: 20%;
  left: 10%;
  animation: orb-drift 25s ease-in-out infinite reverse;
}
.orb-violet {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #8b5cf6, transparent);
  top: 40%;
  left: 50%;
  animation: orb-drift 22s ease-in-out infinite 5s;
}
```

**Done Criteria**: Orbs visible behind hero content. Slow drift animation. No layout shift. GPU-accelerated.

### 3.5 — Replace hero in page files

**Files**: `src/pages/index.astro`, `src/pages/es.astro`

Replace `ConsultantHero` with `HeroSection` from redesign folder.

**Done Criteria**: Both pages render new hero. Build passes.

### Phase 3 Effort Summary

| Task                    | Effort | Depends On      | Done Criteria                                   |
| ----------------------- | ------ | --------------- | ----------------------------------------------- |
| 3.1 HeroSection.astro   | 3h     | Phase 1         | Dark gradient hero with text hierarchy and CTAs |
| 3.2 HeroVisual.tsx      | 3h     | 1.5 (keyframes) | Floating glass panel, 60fps, reduced motion     |
| 3.3 TrustMetrics.tsx    | 2h     | Phase 1         | Count-up animation, a11y, reduced motion        |
| 3.4 Background orbs CSS | 1h     | 1.5             | Orbs visible, animated, no layout shift         |
| 3.5 Wire into pages     | 0.5h   | 3.1–3.4         | Both pages render new hero                      |

**Total Phase 3**: ~9.5 hours

---

## Phase 4: Services Preview

### 4.1 — Build `ServicesPreview.astro`

**File**: `src/components/redesign/ServicesPreview.astro`

**Structure**:

```html
<section id="services" class="bg-midnight-light py-20 lg:py-32">
  <div class="mx-auto max-w-7xl px-4 lg:px-8">
    <!-- Section header -->
    <div class="mb-16 text-center">
      <span class="text-accent-cyan text-xs font-semibold tracking-[0.2em] uppercase">
        {t.sectionLabel}
      </span>
      <h2 class="font-sora text-text-bright mt-3 text-3xl font-bold lg:text-5xl">{t.heading}</h2>
      <p class="text-text-muted mx-auto mt-4 max-w-2xl text-lg">{t.subheading}</p>
    </div>
    <!-- Card grid -->
    <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {services.map((service, i) => (
      <ServiceCard client:visible {...service} index="{i}" />
      ))}
    </div>
  </div>
</section>
```

**Done Criteria**: Section renders with header + 5 cards. Responsive grid works at all breakpoints.

### 4.2 — Build `ServiceCard.tsx` React island

**File**: `src/components/redesign/react/ServiceCard.tsx`

**Props**:

```ts
interface ServiceCardProps {
  icon: string; // Icon identifier (to select SVG)
  title: string;
  description: string;
  index: number; // For stagger delay
}
```

**Implementation**:

- Card: `bg-midnight-surface border border-white/5 rounded-2xl p-6 transition-all duration-300`
- Hover: `hover:-translate-y-1 hover:border-accent-cyan/30 hover:shadow-lg hover:shadow-accent-cyan/5`
- Icon: Inline SVG component, `text-accent-cyan w-8 h-8 mb-4`
- Title: `font-sora text-lg font-semibold text-text-bright mt-2`
- Description: `text-text-muted text-sm mt-2 leading-relaxed`
- Arrow: `→` at bottom right, `text-text-muted group-hover:text-accent-cyan group-hover:translate-x-1 transition-all`
- Scroll reveal: Use `IntersectionObserver` — on entry, apply `animate-fade-in-up` with `animation-delay: ${index * 100}ms`
- `prefers-reduced-motion`: Skip scroll reveal, show immediately

**Icon Approach**:

- Define 5 inline SVG icons as a `Record<string, JSX.Element>` map inside the component or a shared icon utility
- Icons: Code/Window (web dev), Zap (automation), Sparkles (AI), Megaphone (marketing), Cube (spatial)
- No external icon library dependency

**Done Criteria**: 5 cards render with icons, hover lifts, stagger reveal, arrow slides. Reduced motion falls back to static. No external dependencies.

### Phase 4 Effort Summary

| Task                      | Effort | Depends On | Done Criteria                          |
| ------------------------- | ------ | ---------- | -------------------------------------- |
| 4.1 ServicesPreview.astro | 2h     | Phase 1    | Section with header + grid rendered    |
| 4.2 ServiceCard.tsx       | 3h     | 1.2, 1.5   | Cards with icons, hover, scroll reveal |

**Total Phase 4**: ~5 hours

---

## Phase 5: AI Assistant Section Visual Redesign

### 5.1 — Restyle `ConsultantSection.astro`

**File**: `src/components/ConsultantSection.astro`

**Changes**:

- Outer section: Change from `bg-neutral-lightest py-8 lg:py-10` → `bg-midnight py-16 lg:py-24`
- Inner container: Add `rounded-3xl bg-midnight-surface border border-white/5 p-6 lg:p-10`
- All child styling adjustments happen in the React components below

**Done Criteria**: Section has dark premium container. No chat functionality broken.

### 5.2 — Restyle `TrustPanel.tsx` (left panel)

**File**: `src/components/react/TrustPanel.tsx`

**Visual Changes** (keep all existing props and functionality):

- Background: `bg-midnight-light` → glassmorphism panel `bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl`
- Title: `text-text-bright font-sora`
- Tagline: `text-text-muted`
- Service items: darker surfaces, subtle hover glow
- Outcome prompts: Styled as premium rounded glass chips — `bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent-cyan/30 text-text-bright rounded-xl`
- Trust signals: `text-text-muted` with subtle accent icon
- CTA buttons: Primary matches hero CTA gradient. Secondary: ghost style.
- Collapse/expand controls updated for dark theme

**Done Criteria**: Left panel matches dark premium aesthetic. All existing functionality (service clicks, outcome prompts, collapse, CTAs) works unchanged. EN/ES content displays correctly.

### 5.3 — Restyle chat UI components

**Files**: Multiple files in `src/components/react/chat/`

Target components and changes:

- **ChatContainer.tsx**: Header bg → `bg-midnight-surface`. Welcome text → `text-text-bright`. Overall container → dark surfaces
- **ChatMessage.tsx**: User bubble → `bg-accent-cyan text-midnight`. Assistant bubble → `bg-white/5 text-text-bright border border-white/10`. Timestamps → `text-text-muted`
- **ChatInput.tsx**: Input bg → `bg-midnight border border-white/10 text-text-bright`. Focus ring → `focus:border-accent-cyan focus:ring-accent-cyan/30`. Placeholder → `text-text-muted`. Send button → accent gradient
- **PromptChips / GroupedPromptChips**: Chips → `bg-white/5 border border-white/10 text-text-bright hover:bg-white/10 hover:border-accent-cyan/30 rounded-xl`
- **TypingIndicator**: Dots → `bg-text-muted`

**Critical constraint**: Only change Tailwind classes and visual tokens. Do NOT modify state management, API calls, error handling, verification flow, or any functional logic.

**Done Criteria**: Chat UI matches dark premium aesthetic. All chat flows work: send message, receive response, error states, retry, typing indicator, prompt chips, follow-ups, verification. EN/ES content correct.

### 5.4 — Update chat UI design tokens in `tailwind.css`

**File**: `src/styles/tailwind.css`

Update the existing `/* ─── Chat UI Tokens ─── */` section to use new dark palette values:

```css
--color-chat-bubble-user: #38bdf8; /* accent-cyan */
--color-chat-bubble-user-text: #07111f; /* midnight */
--color-chat-bubble-assistant: #ffffff0d; /* white/5 */
--color-chat-bubble-assistant-text: #f8fafc; /* text-bright */
--color-chat-panel-bg: #11243a; /* midnight-surface */
--color-chat-panel-sidebar-bg: #0d1b2a; /* midnight-light */
--color-chat-panel-header-bg: #11243a; /* midnight-surface */
--color-chat-panel-header-text: #f8fafc; /* text-bright */
--color-chat-panel-input-bg: #07111f; /* midnight */
--color-chat-chip-bg: #ffffff0d; /* white/5 */
--color-chat-chip-text: #f8fafc; /* text-bright */
--color-chat-chip-border: #ffffff1a; /* white/10 */
--color-chat-chip-hover-bg: #ffffff1a; /* white/10 */
--color-chat-chip-hover-border: #38bdf84d; /* accent-cyan/30 */
--color-chat-input-border: #ffffff1a; /* white/10 */
--color-chat-input-focus-border: #38bdf8; /* accent-cyan */
--color-chat-input-focus-ring: #38bdf833; /* accent-cyan/20 */
--color-chat-input-placeholder: #a7b4c6; /* text-muted */
--color-chat-cta-primary: #38bdf8; /* accent-cyan */
--color-chat-cta-primary-hover: #0ea5e9; /* slightly darker cyan */
--color-chat-cta-primary-text: #07111f; /* midnight */
```

**Done Criteria**: Token values updated. If chat components reference these tokens, they auto-update. If hardcoded Tailwind classes, update in 5.3.

### Phase 5 Effort Summary

| Task                          | Effort | Depends On | Done Criteria                              |
| ----------------------------- | ------ | ---------- | ------------------------------------------ |
| 5.1 ConsultantSection restyle | 1h     | Phase 1    | Dark container, no broken functionality    |
| 5.2 TrustPanel restyle        | 2h     | 5.1        | Dark premium left panel, all features work |
| 5.3 Chat UI restyle           | 3h     | 5.1, 5.4   | Dark chat UI, all flows work               |
| 5.4 Chat token updates        | 1h     | Phase 1    | Token values updated                       |

**Total Phase 5**: ~7 hours

---

## Phase 6: Process Section & Final CTA

### 6.1 — Build `ProcessSection.astro`

**File**: `src/components/redesign/ProcessSection.astro`

**Structure**:

```html
<section id="process" class="bg-midnight py-20 lg:py-32">
  <div class="mx-auto max-w-7xl px-4 lg:px-8">
    <!-- Section header (same pattern as services) -->
    <!-- 4-step grid/flow -->
    <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Step 1: Discover -->
      <!-- Step 2: Design -->
      <!-- Step 3: Build -->
      <!-- Step 4: Optimize -->
    </div>
  </div>
</section>
```

**Step Card Design**:

- Step number: `text-accent-cyan text-sm font-semibold`
- Icon: Inline SVG, `text-accent-cyan w-10 h-10`
- Title: `font-sora text-xl font-semibold text-text-bright mt-4`
- Description: `text-text-muted text-sm mt-2 leading-relaxed`
- Card: `bg-midnight-surface border border-white/5 rounded-2xl p-8`
- Connecting line: On `lg:`, a horizontal SVG/CSS line or dashed border connecting cards. Hidden on mobile.

**Scroll Animation**:

- Cards animate upward on scroll entry (same `IntersectionObserver` + `animate-fade-in-up` pattern as service cards)
- Stagger delay: 0ms, 150ms, 300ms, 450ms

**Implementation Options**:

- Option A: Static Astro component with inline `<script>` for scroll animation (simpler, no React)
- Option B: React island for the card grid (consistent with ServiceCard pattern)
- **Recommendation**: Option A — process section is static content, no interactive state needed. Use Astro `<script>` with `IntersectionObserver` for scroll reveal.

**Done Criteria**: 4-step process renders with icons, titles, descriptions. Connecting progression line visible on desktop. Scroll animation works. Responsive stacking on mobile.

### 6.2 — Build `FinalCTA.astro`

**File**: `src/components/redesign/FinalCTA.astro`

**Structure**:

```html
<section
  class="from-midnight to-midnight-light relative overflow-hidden bg-gradient-to-b py-20 lg:py-32"
>
  <!-- Background accent shapes (subtle glowing orbs, smaller) -->
  <div class="relative z-10 mx-auto max-w-3xl px-4 text-center lg:px-8">
    <h2 class="font-sora text-text-bright text-3xl font-bold lg:text-5xl">{t.heading}</h2>
    <p class="text-text-muted mx-auto mt-6 max-w-xl text-lg">{t.subheading}</p>
    <div class="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
      <!-- Primary CTA button (gradient) -->
      <!-- Secondary CTA button (ghost) -->
    </div>
    <p class="text-text-muted mt-8 text-sm italic">{t.note}</p>
  </div>
</section>
```

**Visual Treatment**:

- Subtle background orbs (reuse orb pattern from hero, smaller and less prominent)
- Optional: elevated glass panel behind the content (`bg-white/5 backdrop-blur-sm border border-white/5 rounded-3xl p-12`)
- CTA buttons match hero styling
- Scroll entrance animation for the whole block

**Done Criteria**: CTA section renders with heading, subheading, two buttons, note text. Gradient background. EN/ES content. Responsive.

### 6.3 — Wire new sections into page files

**Files**: `src/pages/index.astro`, `src/pages/es.astro`

**Final page order**:

```astro
<Layout lang="en">
  <RedesignedHeader lang="en" />
  <HeroSection lang="en" />
  <ServicesPreview lang="en" />
  <ConsultantSection lang="en" />
  <ProcessSection lang="en" />
  <FinalCTA lang="en" />
  <RedesignedFooter lang="en" />
</Layout>
```

**Done Criteria**: Full page structure complete. All sections render in correct order. Build passes. Both EN/ES pages consistent.

### Phase 6 Effort Summary

| Task                     | Effort | Depends On           | Done Criteria                                  |
| ------------------------ | ------ | -------------------- | ---------------------------------------------- |
| 6.1 ProcessSection.astro | 3h     | Phase 1              | 4-step flow, connecting line, scroll animation |
| 6.2 FinalCTA.astro       | 2h     | Phase 1              | CTA block, gradient bg, responsive             |
| 6.3 Wire into pages      | 1h     | 6.1, 6.2, Phases 2-5 | Full page order correct, build passes          |

**Total Phase 6**: ~6 hours

---

## Phase 7: Animation Polish & Responsive Verification

### 7.1 — Verify `prefers-reduced-motion` across all sections

**Scope**: Every animated element in the redesign

**Checklist**:

- [ ] Hero background orbs: stop drifting, show static position
- [ ] Hero entrance stagger: all elements visible immediately, no animation
- [ ] HeroVisual floating: show static composition
- [ ] TrustMetrics count-up: show final values immediately
- [ ] Service cards scroll reveal: show all cards immediately
- [ ] Service card hover: allow reduced transitions (keep color changes, disable transform)
- [ ] Process section scroll reveal: show all steps immediately
- [ ] Final CTA entrance: show immediately
- [ ] Header scroll transition: keep functional (opacity allowed), minimize motion
- [ ] Mobile menu animation: show/hide without slide animation

**Testing Method**: Chrome DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`

**Done Criteria**: All elements visible and functional with reduced motion. No "invisible until animated" bugs.

### 7.2 — Polish mobile layouts (320px – 767px)

**Checklist for each section**:

- [ ] **Header**: Logo + hamburger visible. No horizontal overflow.
- [ ] **Hero**: Single column. Headline readable (text-4xl adequate?). CTAs stack vertically. Trust metrics row wraps or stacks. HeroVisual hidden (lg:block).
- [ ] **Services**: 1-column grid on smallest, 2-column on sm:. Cards have adequate padding/touch targets.
- [ ] **Consultant Section**: Panel stacks above chat. All chat functionality works. Input field full width.
- [ ] **Process**: 1-column stacked. Connecting line hidden.
- [ ] **Final CTA**: Centered text. CTAs stack on small screens.
- [ ] **Footer**: Columns stack. Social icons centered. Adequate spacing.

**Testing**: Browser DevTools responsive mode at 320px, 375px, 414px, 768px.

**Done Criteria**: No horizontal scroll. No text overflow. Touch targets ≥ 44px. Readable at all widths.

### 7.3 — Polish tablet layouts (768px – 1023px)

**Checklist**:

- [ ] **Header**: Navigation visible or hidden (design choice — if hidden, hamburger). CTA visible.
- [ ] **Hero**: May still be single column or start 2-column. HeroVisual may be hidden at this breakpoint.
- [ ] **Services**: 2 or 3 column grid.
- [ ] **Consultant**: Side-by-side or stacked depending on breakpoint.
- [ ] **Process**: 2-column grid (2 rows of 2).
- [ ] **Footer**: 2-column grid (Brand + Nav on one row, Trust + Social on next).

**Done Criteria**: Tablet layout is polished, no awkward spacing. Visual hierarchy clear.

### 7.4 — Tune animation timing and easing

**Scope**: Fine-tune all animation durations, delays, and easing curves for premium feel.

**Guidelines**:

- Entrance animations: 500-800ms with `ease-out`
- Hover transitions: 200-300ms with `ease`
- Background drift: 15-25s with `ease-in-out`
- Count-up: ~1.5s with custom easing (ease-out)
- Stagger intervals: 80-150ms between items

**Done Criteria**: Animations feel smooth, intentional, premium. No jarring or too-fast transitions.

### 7.5 — Performance verification

**Checks**:

- [ ] Chrome DevTools Performance panel: verify 60fps during hero animation
- [ ] Check `will-change` is applied to animated elements
- [ ] Verify no forced reflows from animation (only transform/opacity)
- [ ] Check JS bundle size delta: `pnpm run build` → compare asset sizes before/after
- [ ] Verify total new JS < 15KB gzipped
- [ ] All background orbs use `position: absolute` (no layout impact)
- [ ] Images still lazy-loaded where appropriate

**Done Criteria**: 60fps confirmed. Bundle within budget. No layout-triggering animations.

### Phase 7 Effort Summary

| Task                            | Effort | Depends On | Done Criteria                          |
| ------------------------------- | ------ | ---------- | -------------------------------------- |
| 7.1 Reduced motion verification | 2h     | Phases 2-6 | All elements accessible without motion |
| 7.2 Mobile polish               | 2h     | Phases 2-6 | No overflow, readable, touchable       |
| 7.3 Tablet polish               | 1.5h   | Phases 2-6 | Tablet layout polished                 |
| 7.4 Animation timing            | 1.5h   | Phases 2-6 | Smooth, premium feel                   |
| 7.5 Performance check           | 1h     | Phases 2-6 | 60fps, bundle budget met               |

**Total Phase 7**: ~8 hours

---

## Phase 8: Testing & Final Validation

### 8.1 — Update E2E tests for new page structure

**Files**: `e2e/consultant-desktop.spec.ts`, `e2e/consultant-mobile.spec.ts`, `e2e/consultant-tablet.spec.ts`

**New tests needed**:

- Header: logo visible, nav links present (desktop), CTA button visible, scroll behavior (blurs on scroll), language switch works
- Hero: headline visible, CTAs clickable, trust metrics display, micro-label visible
- Services: section visible, 5 cards rendered, card titles match i18n
- Process: section visible, 4 steps rendered
- Final CTA: heading visible, buttons clickable
- Footer: 4 columns rendered (desktop), social links present, copyright visible
- EN/ES parity: all sections render in Spanish on `/es`

**Approach**: Add `data-testid` attributes to new components for stable selectors. Use existing test patterns from `e2e/helpers/`.

**Done Criteria**: All new E2E tests pass on desktop, mobile, tablet. Existing non-structural tests still pass.

### 8.2 — Update unit tests

**Files**: `src/components/__tests__/`, `src/components/redesign/__tests__/` (new)

**Tests to create/update**:

- `RedesignedHeader.test.ts` — renders with logo, nav links, CTA, lang switch for EN/ES
- `RedesignedFooter.test.ts` — renders with 4 columns, social links, copyright for EN/ES
- `HeroSection.test.ts` — renders headline, subheadline, CTAs, trust metrics for EN/ES
- `ServicesPreview.test.ts` — renders section header + 5 cards for EN/ES
- `ProcessSection.test.ts` — renders 4 steps for EN/ES
- `FinalCTA.test.ts` — renders heading, CTAs for EN/ES
- `PageShellComposition.test.ts` — update to reference new header/hero/footer components

**Done Criteria**: All unit tests pass. Coverage not reduced.

### 8.3 — Run validation pipeline

**Commands**:

```sh
pnpm run astro:check    # TypeScript — 0 errors
pnpm run lint:fix       # ESLint — 0 errors
pnpm run format         # Prettier
pnpm test               # Vitest — all pass
pnpm run build          # Production build — clean
```

**Done Criteria**: All commands pass with 0 errors. Build output clean.

### 8.4 — Lighthouse audits

**Tools**: Chrome DevTools Lighthouse

**Targets**:

- Performance: ≥ 90
- Accessibility: ≥ 95
- Best Practices: ≥ 90
- SEO: ≥ 90

**Post-audit fixes**:

- Fix any contrast issues flagged
- Add missing `alt` text or `aria-label`
- Optimize any oversized assets
- Address any FCP/LCP issues

**Done Criteria**: All Lighthouse scores at or above targets. No critical accessibility violations.

### 8.5 — EN/ES parity verification

**Check**: Every section renders correctly in both languages. No missing translations. No layout breakage from longer Spanish text.

**Method**: Visual comparison of EN and ES pages at desktop + mobile. Automated check: grep for TODO/placeholder text in translation files.

**Done Criteria**: Full EN/ES parity. No missing keys. No layout issues from translation length.

### Phase 8 Effort Summary

| Task                    | Effort | Depends On | Done Criteria              |
| ----------------------- | ------ | ---------- | -------------------------- |
| 8.1 E2E test updates    | 4h     | Phase 7    | All E2E tests pass         |
| 8.2 Unit test updates   | 3h     | Phase 7    | All unit tests pass        |
| 8.3 Validation pipeline | 1h     | 8.1, 8.2   | 0 errors across all checks |
| 8.4 Lighthouse audits   | 2h     | 8.3        | Scores at or above targets |
| 8.5 EN/ES parity        | 1h     | 8.3        | Full bilingual parity      |

**Total Phase 8**: ~11 hours

---

## Risks & Mitigation

| Risk                                                 | Impact | Probability | Mitigation                                                                                                                                                                                                           |
| ---------------------------------------------------- | ------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CSS animation performance on low-end devices         | Medium | Medium      | Use GPU-accelerated properties only (transform, opacity). Test on throttled CPU. `prefers-reduced-motion` fallback.                                                                                                  |
| Dark theme contrast accessibility failures           | High   | Medium      | Validate all text/bg combos against WCAG AA during dev. Use Lighthouse a11y audit. Proposed palette already checked: `#A7B4C6` on `#07111F` = ~7.5:1 ratio (passes AA). `#F8FAFC` on `#11243A` = ~13:1 (passes AAA). |
| Hero visual complexity increasing bundle size        | Medium | Low         | CSS-only animations. No animation libraries. Measure JS bundle delta every phase.                                                                                                                                    |
| Existing chat E2E tests breaking from DOM changes    | Medium | High        | Run E2E suite after each structural change. Use `data-testid` attributes. Only change Tailwind classes in Phase 5, not DOM structure.                                                                                |
| i18n key mismatches between EN and ES                | Medium | Medium      | Define all keys in Phase 1 before any component work. Run symmetry check.                                                                                                                                            |
| `backdrop-filter` browser support for glassmorphism  | Low    | Low         | Supported in all modern browsers. Add `@supports` fallback with solid `bg-midnight-surface` background.                                                                                                              |
| Hero background orbs causing layout shift            | High   | Low         | All orb elements `position: absolute`. No layout-affecting animations. Set explicit dimensions.                                                                                                                      |
| Social link URLs not confirmed (LinkedIn, Instagram) | Low    | Medium      | Use `#` placeholder with TODO comment. Replace before production deploy.                                                                                                                                             |
| Logo rendering on dark background                    | Medium | Medium      | Test current logo early (Phase 2). If poor contrast, create white/transparent variant.                                                                                                                               |
| Longer Spanish text breaking card layouts            | Medium | Medium      | Design cards with flexible height. Use `line-clamp` if needed. Test ES layout at each phase.                                                                                                                         |

---

## Resource Allocation

| Phase                         | Effort Estimate | Cumulative |
| ----------------------------- | --------------- | ---------- |
| Phase 1: Foundation           | ~5.5h           | 5.5h       |
| Phase 2: Header & Footer      | ~8h             | 13.5h      |
| Phase 3: Hero Section         | ~9.5h           | 23h        |
| Phase 4: Services Preview     | ~5h             | 28h        |
| Phase 5: AI Assistant Restyle | ~7h             | 35h        |
| Phase 6: Process + Final CTA  | ~6h             | 41h        |
| Phase 7: Animation Polish     | ~8h             | 49h        |
| Phase 8: Testing & Validation | ~11h            | 60h        |
| **Total**                     | **~60 hours**   |            |

With 20% buffer for unknowns: **~72 hours**.

---

## Decisions Log

| Decision                                                                        | Rationale                                                                                                                                           |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| No new dependencies                                                             | PRD constraint. Inline SVG icons instead of Lucide. CSS animations instead of GSAP/Framer.                                                          |
| CSS `IntersectionObserver` via `<script>` over React islands for scroll effects | Header scroll state and scroll-reveal animations are presentation-only. No React state needed. Reduces JS bundle.                                   |
| Keep old components intact                                                      | Rollback safety. Old `ConsultantHeader/Hero/Footer` remain in codebase until redesign is validated.                                                 |
| New components in `src/components/redesign/` folder                             | Avoid naming conflicts. Clear separation from existing components. No risk of breaking current code during development.                             |
| Static Astro for ProcessSection & FinalCTA                                      | No client interactivity needed. Pure SSG for performance. Scroll animations via inline `<script>`.                                                  |
| React islands for HeroVisual, TrustMetrics, ServiceCard                         | These need client-side interactivity: animation state, IntersectionObserver hooks, hover interactions in React's reconciliation model.              |
| `client:visible` for ServiceCard                                                | Below fold — no need to hydrate on page load. Saves initial hydration cost.                                                                         |
| `client:load` for header scroll behavior                                        | Needs to be active immediately when page loads to handle scroll position.                                                                           |
| Dark theme chat tokens overwrite existing tokens                                | Chat components reference design tokens. Updating token values automatically updates all components using them, minimizing code changes in Phase 5. |

---

## New Files Created (Complete List)

| File                                             | Phase | Type                                                      |
| ------------------------------------------------ | ----- | --------------------------------------------------------- |
| `src/components/redesign/types.ts`               | 1     | TypeScript interfaces                                     |
| `src/components/redesign/RedesignedHeader.astro` | 2     | Astro component                                           |
| `src/components/redesign/react/MobileMenu.tsx`   | 2     | React island                                              |
| `src/components/redesign/react/SocialIcons.tsx`  | 2     | React component (optional — could be inline SVG in Astro) |
| `src/components/redesign/RedesignedFooter.astro` | 2     | Astro component                                           |
| `src/components/redesign/HeroSection.astro`      | 3     | Astro component                                           |
| `src/components/redesign/react/HeroVisual.tsx`   | 3     | React island                                              |
| `src/components/redesign/react/TrustMetrics.tsx` | 3     | React island                                              |
| `src/components/redesign/ServicesPreview.astro`  | 4     | Astro component                                           |
| `src/components/redesign/react/ServiceCard.tsx`  | 4     | React island                                              |
| `src/components/redesign/ProcessSection.astro`   | 6     | Astro component                                           |
| `src/components/redesign/FinalCTA.astro`         | 6     | Astro component                                           |
| `src/components/redesign/__tests__/*.test.ts`    | 8     | Unit tests                                                |

**Existing files modified**:

| File                                                    | Phase   | Change                                               |
| ------------------------------------------------------- | ------- | ---------------------------------------------------- |
| `src/styles/tailwind.css`                               | 1, 5    | Add tokens, update chat tokens, add keyframes        |
| `src/i18n/en.json`                                      | 1       | Add `redesign.*` namespace                           |
| `src/i18n/es.json`                                      | 1       | Add `redesign.*` namespace                           |
| `src/pages/index.astro`                                 | 2, 3, 6 | Replace header/hero/footer imports, add new sections |
| `src/pages/es.astro`                                    | 2, 3, 6 | Same as index.astro                                  |
| `src/layouts/Layout.astro`                              | 2       | Dark body background                                 |
| `src/components/ConsultantSection.astro`                | 5       | Restyle outer container                              |
| `src/components/react/TrustPanel.tsx`                   | 5       | Restyle for dark theme                               |
| `src/components/react/chat/*.tsx`                       | 5       | Restyle for dark theme                               |
| `src/components/__tests__/PageShellComposition.test.ts` | 8       | Update references                                    |
| `e2e/consultant-desktop.spec.ts`                        | 8       | Add new section tests                                |
| `e2e/consultant-mobile.spec.ts`                         | 8       | Add new section tests                                |
| `e2e/consultant-tablet.spec.ts`                         | 8       | Add new section tests                                |

---

## Validation Checkpoints

Run after each phase completion:

```sh
pnpm run astro:check    # TypeScript — 0 errors
pnpm run lint:fix       # ESLint
pnpm run format         # Prettier
pnpm run build          # Production build
pnpm test               # Unit tests
```

After Phases 7-8, additionally:

```sh
# E2E tests (requires dev server running)
pnpm run dev &
npx playwright test
```

---

## Success Metrics (Post-Launch)

| Metric                   | Target         | Measurement        |
| ------------------------ | -------------- | ------------------ |
| Lighthouse Performance   | ≥ 90           | Chrome DevTools    |
| Lighthouse Accessibility | ≥ 95           | Chrome DevTools    |
| First Contentful Paint   | ≤ 1.5s         | WebPageTest 4G     |
| Largest Contentful Paint | ≤ 2.5s         | WebPageTest 4G     |
| Cumulative Layout Shift  | < 0.1          | Chrome DevTools    |
| JS bundle increase       | < 15KB gzipped | Build output       |
| Animation frame rate     | 60fps          | Performance panel  |
| Unit tests passing       | 100%           | Vitest             |
| E2E tests passing        | 100%           | Playwright         |
| EN/ES parity             | Complete       | Manual + automated |
