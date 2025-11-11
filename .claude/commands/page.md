---
description: Create a new bilingual page with proper layout, SEO, and routing
---

# Create Page Command

Generate a new page in `/src/pages/` with:

1. **Both language versions** (EN + ES)
2. **Layout wrapper** (using existing or new layout)
3. **SEO meta tags** (title, description, Open Graph)
4. **Proper TypeScript** types
5. **Mobile-responsive** structure

## Page Structure

```
src/pages/
├── en/
│   └── [page-name].astro
└── es/
    └── [page-name].astro
```

## Template

### English Version (`/src/pages/en/[page-name].astro`):
```astro
---
import Layout from '@/layouts/Layout.astro';

const meta = {
  title: 'Page Title | Juan Elogac',
  description: 'Page description for SEO',
  lang: 'en',
};
---

<Layout {...meta}>
  <main class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-6">
      Page Heading
    </h1>

    <section class="prose lg:prose-xl">
      <!-- Page content -->
    </section>
  </main>
</Layout>
```

### Spanish Version (`/src/pages/es/[page-name].astro`):
```astro
---
import Layout from '@/layouts/Layout.astro';

const meta = {
  title: 'Título de Página | Juan Elogac',
  description: 'Descripción de página para SEO',
  lang: 'es',
};
---

<Layout {...meta}>
  <main class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-6">
      Encabezado de Página
    </h1>

    <section class="prose lg:prose-xl">
      <!-- Contenido de página -->
    </section>
  </main>
</Layout>
```

## SEO Checklist

After creating the page:
- [ ] Both EN and ES versions created
- [ ] Unique title and description per language
- [ ] Proper heading hierarchy (h1 → h6)
- [ ] Mobile-responsive layout
- [ ] Images have alt text
- [ ] Links have descriptive text

## Routing

Pages will be accessible at:
- English: `https://yoursite.com/en/[page-name]`
- Spanish: `https://yoursite.com/es/[page-name]`

> No unit test cases or linter commands should be executed.
