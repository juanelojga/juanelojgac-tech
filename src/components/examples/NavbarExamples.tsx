import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu, User, Settings, LogOut, HelpCircle } from 'lucide-react';

interface NavbarExamplesProps {
  translations: {
    title: string;
    menu: string;
    userMenu: string;
    profile: string;
    settings: string;
    help: string;
    logout: string;
    account: string;
  };
}

/**
 * Navbar Dropdown Examples showcasing navigation menus
 * Demonstrates:
 * - Keyboard navigation support
 * - ARIA attributes for accessibility
 * - Icon integration
 * - Keyboard shortcuts display
 * - Bilingual support (EN/ES)
 */
export function NavbarExamples({ translations }: NavbarExamplesProps) {
  return (
    <div className="space-y-8 p-6">
      <h2 className="font-heading text-3xl font-bold text-primary">
        {translations.title}
      </h2>

      <div className="flex flex-wrap gap-4">
        {/* Navigation Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label={translations.menu}>
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>{translations.menu}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>{translations.profile}</span>
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>{translations.settings}</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>{translations.help}</span>
              <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{translations.logout}</span>
              <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Account Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default">
              <User className="mr-2 h-4 w-4" />
              {translations.userMenu}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{translations.account}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span>{translations.profile}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>{translations.settings}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <span>{translations.logout}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
