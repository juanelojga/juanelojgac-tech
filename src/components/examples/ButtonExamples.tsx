import * as React from 'react';
import { Button } from '@/components/ui/button';

interface ButtonExamplesProps {
  translations: {
    title: string;
    primary: string;
    secondary: string;
    transparent: string;
    outline: string;
    ghost: string;
    link: string;
    destructive: string;
    sizes: string;
    small: string;
    default: string;
    large: string;
    extraLarge: string;
    description: string;
  };
}

/**
 * Button Examples showcasing the Dusty Pink → Purple gradient design
 * Demonstrates:
 * - Primary: Dusty Pink (#e34d88) → Purple (#8b5cf6) gradient with glow effects
 * - Secondary: Outlined variant with brand colors
 * - Transparent: Text-only for "Learn more", "Discover more", etc.
 * - Multiple sizes following 8px grid system
 * - WCAG 2.1 AA contrast compliance (4.5:1 minimum)
 * - Keyboard accessibility and ARIA support
 * - Bilingual support (EN/ES)
 */
export function ButtonExamples({ translations }: ButtonExamplesProps) {
  return (
    <div className="space-y-12 p-8 bg-gradient-to-br from-light-50 to-light-200">
      {/* Title */}
      <div className="space-y-2">
        <h2 className="font-heading text-4xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
          {translations.title}
        </h2>
        <p className="text-dark-400 font-body text-lg">{translations.description}</p>
      </div>

      {/* Featured Variants */}
      <div className="space-y-6">
        <h3 className="font-heading text-2xl font-semibold text-primary-600">
          Featured Variants
        </h3>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Primary Gradient Button */}
          <div className="space-y-3 p-6 bg-white rounded-lg shadow-md border border-primary-100">
            <h4 className="font-heading font-semibold text-primary-700">Primary Gradient</h4>
            <p className="text-sm text-dark-400">
              Dusty pink → purple gradient with white text. Features hover glow effect and gradient shift.
            </p>
            <Button variant="primary" className="w-full">
              {translations.primary}
            </Button>
            <div className="flex gap-2">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
          </div>

          {/* Secondary Outlined Button */}
          <div className="space-y-3 p-6 bg-white rounded-lg shadow-md border border-primary-100">
            <h4 className="font-heading font-semibold text-primary-700">Secondary Outlined</h4>
            <p className="text-sm text-dark-400">
              Outlined button with brand colors. Changes border and text color on hover.
            </p>
            <Button variant="secondary" className="w-full">
              {translations.secondary}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Small</Button>
              <Button variant="outline" size="lg">Large</Button>
            </div>
          </div>

          {/* Transparent Button */}
          <div className="space-y-3 p-6 bg-white rounded-lg shadow-md border border-primary-100">
            <h4 className="font-heading font-semibold text-primary-700">Transparent Text</h4>
            <p className="text-sm text-dark-400">
              Text-only button for "Learn more", "Discover more", etc. Underlines on hover.
            </p>
            <Button variant="transparent" className="w-full">
              {translations.transparent} →
            </Button>
            <div className="flex gap-2">
              <Button variant="transparent" size="sm">Small →</Button>
              <Button variant="transparent" size="lg">Large →</Button>
            </div>
          </div>
        </div>
      </div>

      {/* All Variants */}
      <div className="space-y-4">
        <h3 className="font-heading text-2xl font-semibold text-primary-600">
          All Variants
        </h3>
        <div className="flex flex-wrap gap-4 p-6 bg-white rounded-lg shadow-md">
          <Button variant="default">{translations.primary}</Button>
          <Button variant="secondary">{translations.secondary}</Button>
          <Button variant="outline">{translations.outline}</Button>
          <Button variant="transparent">{translations.transparent}</Button>
          <Button variant="ghost">{translations.ghost}</Button>
          <Button variant="link">{translations.link}</Button>
          <Button variant="destructive">{translations.destructive}</Button>
        </div>
      </div>

      {/* Size Variants */}
      <div className="space-y-4">
        <h3 className="font-heading text-2xl font-semibold text-primary-600">
          {translations.sizes}
        </h3>
        <div className="flex flex-wrap items-center gap-4 p-6 bg-white rounded-lg shadow-md">
          <Button size="sm" variant="primary">{translations.small}</Button>
          <Button size="default" variant="primary">{translations.default}</Button>
          <Button size="lg" variant="primary">{translations.large}</Button>
          <Button size="xl" variant="primary">{translations.extraLarge}</Button>
        </div>
      </div>

      {/* States Demo */}
      <div className="space-y-4">
        <h3 className="font-heading text-2xl font-semibold text-primary-600">
          States
        </h3>
        <div className="flex flex-wrap gap-4 p-6 bg-white rounded-lg shadow-md">
          <Button variant="primary">Normal</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="secondary">Normal</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </div>
        <p className="text-sm text-dark-400 px-6">
          Try hovering, focusing (Tab key), and clicking buttons to see gradient shifts and glow effects!
        </p>
      </div>
    </div>
  );
}
