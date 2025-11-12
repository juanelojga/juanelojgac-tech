import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DialogExamplesProps {
  translations: {
    title: string;
    openDialog: string;
    dialogTitle: string;
    dialogDescription: string;
    confirmButton: string;
    cancelButton: string;
  };
}

/**
 * Dialog (Modal) Examples showcasing modal components
 * Demonstrates:
 * - Full WCAG 2.1 AA accessibility compliance
 * - Keyboard navigation (ESC to close)
 * - Focus management
 * - Brand animations
 * - Bilingual support (EN/ES)
 */
export function DialogExamples({ translations }: DialogExamplesProps) {
  return (
    <div className="space-y-8 p-6">
      <h2 className="font-heading text-3xl font-bold text-primary">
        {translations.title}
      </h2>

      <div className="flex flex-wrap gap-4">
        {/* Basic Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">{translations.openDialog}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{translations.dialogTitle}</DialogTitle>
              <DialogDescription>
                {translations.dialogDescription}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">{translations.cancelButton}</Button>
              <Button variant="default">{translations.confirmButton}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Accent Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="accent">{translations.openDialog}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-accent">
                {translations.dialogTitle}
              </DialogTitle>
              <DialogDescription>
                {translations.dialogDescription}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost">{translations.cancelButton}</Button>
              <Button variant="accent">{translations.confirmButton}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
