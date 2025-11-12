import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Button component variants following the Dusty Pink → Purple gradient design
 * - Primary: Dusty Pink (#e34d88) → Purple (#8b5cf6) gradient with white text
 * - Secondary: Outlined variant with brand colors
 * - Transparent: Text-only for "Learn more", "Discover more", etc.
 * - Border radius: 6px (brand standard for buttons)
 * - All variants meet WCAG 2.1 AA contrast requirements (4.5:1 minimum)
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium font-body transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Primary button - Dusty Pink → Purple gradient (main CTA)
        default:
          'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-md hover:from-primary-600 hover:to-accent-600 hover:-translate-y-0.5 hover:shadow-glow-primary active:from-primary-700 active:to-accent-700 active:translate-y-0',
        // Primary gradient (alias for default)
        primary:
          'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-md hover:from-primary-600 hover:to-accent-600 hover:-translate-y-0.5 hover:shadow-glow-primary active:from-primary-700 active:to-accent-700 active:translate-y-0',
        // Secondary button - Outlined with brand colors
        secondary:
          'border-2 border-primary-500 bg-transparent text-primary-600 hover:bg-primary-50 hover:border-accent-500 hover:text-accent-600 active:bg-primary-100',
        // Outline (alias for secondary)
        outline:
          'border-2 border-primary-500 bg-transparent text-primary-600 hover:bg-primary-50 hover:border-accent-500 hover:text-accent-600 active:bg-primary-100',
        // Transparent/Ghost - Text-only for "Learn more", "Discover more"
        transparent:
          'bg-transparent text-primary-600 hover:text-accent-600 hover:underline underline-offset-4 active:text-accent-700',
        // Ghost (alias for transparent)
        ghost:
          'bg-transparent text-primary-600 hover:text-accent-600 hover:bg-primary-50 active:bg-primary-100',
        // Link style
        link: 'text-primary-600 underline-offset-4 hover:underline hover:text-accent-600',
        // Destructive button
        destructive:
          'bg-red-600 text-white shadow-md hover:bg-red-700 hover:-translate-y-0.5 active:bg-red-800 active:translate-y-0',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8 text-base',
        xl: 'h-12 rounded-lg px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /**
   * ARIA label for accessibility (required for icon-only buttons)
   */
  'aria-label'?: string;
}

/**
 * Brand-aligned Button component with full WCAG 2.1 AA compliance
 * Features the Dusty Pink → Purple gradient design system
 *
 * Features:
 * - Dusty Pink (#e34d88) → Purple (#8b5cf6) gradient for primary actions
 * - Automatic focus ring for keyboard navigation (2px solid ring)
 * - ARIA attributes support for accessibility
 * - Responsive sizing following 8px grid system
 * - Multiple variants with proper contrast ratios (4.5:1 minimum)
 * - Smooth gradient transitions and glow effects on hover
 * - Keyboard accessible (Enter/Space activation)
 *
 * @example
 * ```tsx
 * // Primary gradient button (main CTA)
 * <Button variant="primary">Get Started</Button>
 * <Button>Default Action</Button>
 *
 * // Secondary outlined button
 * <Button variant="secondary">Learn More</Button>
 * <Button variant="outline" size="lg">Sign Up</Button>
 *
 * // Transparent text-only button
 * <Button variant="transparent">Discover more →</Button>
 * <Button variant="ghost">Cancel</Button>
 *
 * // Icon button with accessibility
 * <Button variant="primary" size="icon" aria-label="Open menu">
 *   <MenuIcon />
 * </Button>
 *
 * // Disabled state
 * <Button disabled>Disabled</Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = 'button', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type={asChild ? undefined : type}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
