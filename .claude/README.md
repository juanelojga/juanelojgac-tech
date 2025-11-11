# Claude Configuration for juanelojgac-webpage

This directory contains configuration files that help Claude AI understand your project context and coding preferences.

## Files

### `project.md`
Project overview, tech stack, structure, and features. This gives Claude the big picture of what you're building.

### `rules.md`
Comprehensive coding guidelines, naming conventions, do's and don'ts, and workflow patterns. This ensures consistent code quality.

## How to Use

When working with Claude, it will automatically read these files to understand:
- Your project architecture (Astro + TypeScript + TailwindCSS)
- Coding standards (component hierarchy, naming conventions)
- Development constraints (no auto-testing, no linting)
- Design patterns (mobile-first, i18n support)

## Custom Commands (Optional)

You can create custom commands in `.claude/commands/` directory:

```bash
.claude/
├── commands/
│   ├── component.md    # Quick component generation
│   ├── page.md         # New page scaffolding
│   └── i18n.md         # Add translation keys
```

## Updating Configuration

As your project evolves, update these files to reflect:
- New integrations or dependencies
- Updated design tokens (colors, fonts)
- Additional coding rules or patterns
- Project-specific conventions

## Quick Reference

**Ask Claude to:**
- "Create a new Astro component for [feature]"
- "Add i18n support for [section]"
- "Optimize [component] for mobile"
- "Add SEO meta tags to [page]"
- "Refactor [component] to use Tailwind"

Claude will follow the rules defined here automatically.

## Notes

- These files are version controlled (committed to git)
- They serve as living documentation for your project
- Update them as your requirements change
- They help maintain consistency across development sessions
