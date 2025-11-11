---
description: Quickly generate a new Astro or React component with proper TypeScript types and Tailwind styling
---

# Create Component Command

Create a new component in `/src/components/` with:

1. **TypeScript interface** for props
2. **Tailwind CSS** styling (mobile-first)
3. **Semantic HTML** structure
4. **Accessibility** attributes (ARIA labels, alt text)
5. **Documentation comments** explaining the component

## Component Type

Ask the user: "Should this be an `.astro` component (static) or `.tsx` (interactive)?"

- Default to `.astro` unless interactivity is required
- Use React only for forms, modals, dynamic state

## Template

### Astro Component:
```astro
---
/**
 * ComponentName - Brief description
 * @example
 * <ComponentName title="Hello" />
 */

interface Props {
  title: string;
  subtitle?: string;
  className?: string;
}

const { title, subtitle, className = '' } = Astro.props;
---

<div class={`component-wrapper ${className}`}>
  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
    {title}
  </h2>
  {subtitle && (
    <p class="mt-2 text-gray-600 dark:text-gray-400">
      {subtitle}
    </p>
  )}
</div>
```

### React Component:
```tsx
import { useState } from 'react';

interface ComponentNameProps {
  initialValue?: string;
  onSubmit?: (value: string) => void;
}

export default function ComponentName({
  initialValue = '',
  onSubmit
}: ComponentNameProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="component-wrapper">
      {/* Component JSX */}
    </div>
  );
}
```

## Checklist

After creating the component:
- [ ] Props are fully typed
- [ ] Mobile-first Tailwind classes used
- [ ] Semantic HTML elements used
- [ ] Accessibility attributes added
- [ ] Component documented with JSDoc comment

> No unit test cases or linter commands should be executed.
