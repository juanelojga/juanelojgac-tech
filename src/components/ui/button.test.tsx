import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Button, buttonVariants } from './button';

/**
 * Unit tests for Button component
 * Tests rendering, variants, props, accessibility, and user interactions
 */
describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with default variant', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    it('should render as a child component when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      const link = screen.getByRole('link', { name: /link button/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });

    it('should render children correctly', () => {
      render(
        <Button>
          <span>Icon</span>
          Text
        </Button>
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render primary variant with gradient classes', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('from-primary-500');
      expect(button.className).toContain('to-accent-500');
    });

    it('should render default variant (same as primary)', () => {
      render(<Button variant="default">Default</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('from-primary-500');
      expect(button.className).toContain('to-accent-500');
    });

    it('should render secondary variant with border', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('border-2');
      expect(button.className).toContain('border-primary-500');
      expect(button.className).toContain('bg-transparent');
    });

    it('should render outline variant (alias for secondary)', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('border-2');
      expect(button.className).toContain('border-primary-500');
    });

    it('should render transparent variant', () => {
      render(<Button variant="transparent">Learn more</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
      expect(button.className).toContain('text-primary-600');
    });

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
      expect(button.className).toContain('text-primary-600');
    });

    it('should render link variant', () => {
      render(<Button variant="link">Link</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('text-primary-600');
      expect(button.className).toContain('underline-offset-4');
    });

    it('should render destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-red-600');
      expect(button.className).toContain('text-white');
    });
  });

  describe('Sizes', () => {
    it('should render default size', () => {
      render(<Button size="default">Default Size</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-10');
      expect(button.className).toContain('px-4');
    });

    it('should render small size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-9');
      expect(button.className).toContain('px-3');
    });

    it('should render large size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-11');
      expect(button.className).toContain('px-8');
    });

    it('should render extra large size', () => {
      render(<Button size="xl">Extra Large</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-12');
      expect(button.className).toContain('px-10');
    });

    it('should render icon size', () => {
      render(
        <Button size="icon" aria-label="Menu">
          M
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-10');
      expect(button.className).toContain('w-10');
    });
  });

  describe('Props and Attributes', () => {
    it('should accept and apply custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('custom-class');
    });

    it('should handle disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button.className).toContain('disabled:pointer-events-none');
      expect(button.className).toContain('disabled:opacity-50');
    });

    it('should handle onClick events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      const button = screen.getByRole('button');
      button.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not fire onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );
      const button = screen.getByRole('button');
      button.click();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should accept type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should default to button type', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible name from text content', () => {
      render(<Button>Accessible Button</Button>);
      expect(screen.getByRole('button', { name: /accessible button/i })).toBeInTheDocument();
    });

    it('should accept aria-label prop', () => {
      render(<Button aria-label="Custom label">Icon</Button>);
      const button = screen.getByRole('button', { name: /custom label/i });
      expect(button).toHaveAttribute('aria-label', 'Custom label');
    });

    it('should require aria-label for icon-only buttons', () => {
      render(
        <Button size="icon" aria-label="Menu icon">
          ☰
        </Button>
      );
      expect(screen.getByRole('button', { name: /menu icon/i })).toBeInTheDocument();
    });

    it('should have focus-visible styles', () => {
      render(<Button>Focus Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('focus-visible:outline-none');
      expect(button.className).toContain('focus-visible:ring-2');
      expect(button.className).toContain('focus-visible:ring-primary-500');
    });

    it('should accept additional ARIA attributes', () => {
      render(
        <Button aria-describedby="description" aria-pressed="false">
          Toggle
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'description');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Button Variants Function', () => {
    it('should generate correct classes for default variant', () => {
      const classes = buttonVariants({ variant: 'default', size: 'default' });
      expect(classes).toContain('from-primary-500');
      expect(classes).toContain('to-accent-500');
      expect(classes).toContain('h-10');
    });

    it('should generate correct classes for secondary variant', () => {
      const classes = buttonVariants({ variant: 'secondary', size: 'lg' });
      expect(classes).toContain('border-2');
      expect(classes).toContain('border-primary-500');
      expect(classes).toContain('h-11');
    });

    it('should generate correct classes for transparent variant', () => {
      const classes = buttonVariants({ variant: 'transparent', size: 'sm' });
      expect(classes).toContain('bg-transparent');
      expect(classes).toContain('text-primary-600');
      expect(classes).toContain('h-9');
    });
  });

  describe('Hover and Active States', () => {
    it('should have hover transition classes', () => {
      render(<Button variant="primary">Hover Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('transition-all');
      expect(button.className).toContain('duration-300');
      expect(button.className).toContain('hover:from-primary-600');
      expect(button.className).toContain('hover:to-accent-600');
    });

    it('should have active state classes', () => {
      render(<Button variant="primary">Active Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('active:from-primary-700');
      expect(button.className).toContain('active:to-accent-700');
    });

    it('should have glow effect on hover for primary variant', () => {
      render(<Button variant="primary">Glow Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('hover:shadow-glow-primary');
    });

    it('should have translate effect on hover', () => {
      render(<Button variant="primary">Translate Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('hover:-translate-y-0.5');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(<Button></Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should handle multiple class names', () => {
      render(<Button className="class1 class2 class3">Multiple Classes</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('class1');
      expect(button.className).toContain('class2');
      expect(button.className).toContain('class3');
    });

    it('should forward ref correctly', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Ref Test</Button>);
      expect(ref).toHaveBeenCalled();
    });
  });
});
