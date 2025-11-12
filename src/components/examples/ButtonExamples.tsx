import * as React from 'react';
import { Button } from '@/components/ui/button';

interface ButtonExamplesProps {
  translations: {
    title: string;
    primary: string;
    secondary: string;
    accent: string;
    outline: string;
    ghost: string;
    link: string;
    destructive: string;
    sizes: string;
    small: string;
    default: string;
    large: string;
    extraLarge: string;
  };
}

/**
 * Button Examples showcasing all variants and sizes
 * Demonstrates:
 * - Brand color variants (60/30/10 rule)
 * - Multiple sizes following 8px grid
 * - WCAG 2.1 AA compliance
 * - Bilingual support (EN/ES)
 */
export function ButtonExamples({ translations }: ButtonExamplesProps) {
  return (
    <div className="space-y-8 p-6">
      {/* Title */}
      <h2 className="font-heading text-3xl font-bold text-primary">
        {translations.title}
      </h2>

      {/* Variants Section */}
      <div className="space-y-4">
        <h3 className="font-heading text-xl font-semibold text-primary">
          Variants
        </h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">{translations.primary}</Button>
          <Button variant="secondary">{translations.secondary}</Button>
          <Button variant="accent">{translations.accent}</Button>
          <Button variant="outline">{translations.outline}</Button>
          <Button variant="ghost">{translations.ghost}</Button>
          <Button variant="link">{translations.link}</Button>
          <Button variant="destructive">{translations.destructive}</Button>
        </div>
      </div>

      {/* Sizes Section */}
      <div className="space-y-4">
        <h3 className="font-heading text-xl font-semibold text-primary">
          {translations.sizes}
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">{translations.small}</Button>
          <Button size="default">{translations.default}</Button>
          <Button size="lg">{translations.large}</Button>
          <Button size="xl">{translations.extraLarge}</Button>
        </div>
      </div>
    </div>
  );
}
