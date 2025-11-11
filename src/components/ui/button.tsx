import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Button component variants following JuaneloJGAC Tech brand guidelines
 * - Primary: Deep Tech Blue (#0066cc) - 60% usage
 * - Secondary: Silver Gray (#8a8a8a) - 30% usage
 * - Accent: Teal Cyan (#00d9cc) - 10% usage
 * - Border radius: 6px (brand standard for buttons)
 * - All variants meet WCAG 2.1 AA contrast requirements
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium font-body transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Primary button - Deep Tech Blue (60% usage)
        default:
          'bg-primary text-primary-foreground shadow-brand hover:bg-primary/90 active:transform active:translate-y-0.5',
        // Destructive button
        destructive:
          'bg-destructive text-destructive-foreground shadow-brand hover:bg-destructive/90 active:transform active:translate-y-0.5',
        // Outline button - with primary border
        outline:
          'border-2 border-primary bg-background text-primary hover:bg-primary/10 active:bg-primary/20',
        // Secondary button - Silver Gray (30% usage)
        secondary:
          'bg-secondary text-secondary-foreground shadow-brand-sm hover:bg-secondary/80 active:transform active:translate-y-0.5',
        // Ghost button - minimal style
        ghost: 'hover:bg-accent/10 hover:text-accent active:bg-accent/20',
        // Link button
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80',
        // Accent button - Teal Cyan (10% usage - use sparingly)
        accent:
          'bg-accent text-accent-foreground shadow-brand hover:bg-accent/90 active:transform active:translate-y-0.5',
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
 *
 * Features:
 * - Automatic focus ring for keyboard navigation
 * - ARIA attributes support
 * - Responsive sizing following 8px grid system
 * - Brand color variants with proper contrast ratios
 * - Smooth animations following brand motion principles
 *
 * @example
 * ```tsx
 * <Button variant="default">Primary Action</Button>
 * <Button variant="accent">Call to Action</Button>
 * <Button variant="outline" size="sm">Secondary</Button>
 * <Button variant="ghost" size="icon" aria-label="Menu">
 *   <MenuIcon />
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
