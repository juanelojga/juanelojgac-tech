import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CardExamplesProps {
  translations: {
    title: string;
    cardTitle: string;
    cardDescription: string;
    cardContent: string;
    actionButton: string;
    secondaryButton: string;
  };
}

/**
 * Card Examples showcasing card components
 * Demonstrates:
 * - 8px border radius for cards
 * - Brand shadow system
 * - Proper spacing with 8px grid
 * - Typography hierarchy
 * - Bilingual support (EN/ES)
 */
export function CardExamples({ translations }: CardExamplesProps) {
  return (
    <div className="space-y-8 p-6">
      <h2 className="font-heading text-3xl font-bold text-primary">
        {translations.title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Card */}
        <Card>
          <CardHeader>
            <CardTitle>{translations.cardTitle}</CardTitle>
            <CardDescription>{translations.cardDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-body text-sm text-foreground">
              {translations.cardContent}
            </p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="default" size="sm">
              {translations.actionButton}
            </Button>
            <Button variant="outline" size="sm">
              {translations.secondaryButton}
            </Button>
          </CardFooter>
        </Card>

        {/* Card with Accent */}
        <Card className="border-accent">
          <CardHeader>
            <CardTitle className="text-accent">
              {translations.cardTitle}
            </CardTitle>
            <CardDescription>{translations.cardDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-body text-sm text-foreground">
              {translations.cardContent}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="accent" size="sm" className="w-full">
              {translations.actionButton}
            </Button>
          </CardFooter>
        </Card>

        {/* Card with Secondary */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>{translations.cardTitle}</CardTitle>
            <CardDescription>{translations.cardDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-body text-sm text-foreground">
              {translations.cardContent}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" size="sm" className="w-full">
              {translations.actionButton}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
