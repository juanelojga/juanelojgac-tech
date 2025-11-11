import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Card component following JuaneloJGAC Tech brand guidelines
 * - Border radius: 8px (brand standard for cards)
 * - Subtle shadows: light for light mode, deeper for dark mode
 * - Proper contrast ratios for WCAG 2.1 AA compliance
 * - 8px grid system for spacing
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-brand transition-shadow duration-200 hover:shadow-brand-lg',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

/**
 * CardHeader component - typically contains title and description
 * Uses 24px (3 units) padding for consistent spacing
 */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

/**
 * CardTitle component - uses Poppins font family (brand heading font)
 * Semantic heading with proper hierarchy
 */
const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'font-heading text-2xl font-semibold leading-none tracking-tight text-primary',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

/**
 * CardDescription component - uses Inter font family (brand body font)
 * Muted color for visual hierarchy
 */
const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('font-body text-sm text-muted-foreground', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

/**
 * CardContent component - main content area
 * Uses 24px padding (3 units) with no top padding to align with header
 */
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

/**
 * CardFooter component - typically contains actions
 * Uses flexbox for action alignment
 */
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
