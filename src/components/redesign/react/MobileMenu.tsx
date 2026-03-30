import { useCallback, useEffect, useRef, useState } from "react";

import { SOCIAL_LINKS } from "../../../lib/socialLinks";
import type { MobileMenuProps } from "../types";

export default function MobileMenu({
  navLinks,
  ctaLabel,
  menuLabel,
  closeMenuLabel,
  socialGithubLabel,
  socialLinkedinLabel,
  socialInstagramLabel,
  languageSwitchLabel,
  enUrl,
  esUrl,
  currentLang,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const focusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Focus the close button on open
    first.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    menu.addEventListener("keydown", handleTab);
    return () => menu.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      {/* Hamburger trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-label={menuLabel}
        className="text-text-muted hover:text-text-bright rounded-lg p-2 transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      {/* Full-screen overlay menu */}
      {isOpen && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label={menuLabel}
          className="bg-midnight/95 fixed inset-0 z-50 flex flex-col backdrop-blur-xl"
        >
          {/* Top bar: close button */}
          <div className="flex h-16 items-center justify-end px-4">
            <button
              type="button"
              onClick={close}
              aria-label={closeMenuLabel}
              className="text-text-muted hover:text-text-bright rounded-lg p-2 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-1 flex-col items-center justify-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.action) {
                    e.preventDefault();
                    close();
                    setTimeout(() => {
                      const target = document.getElementById("consultant");
                      if (target) target.scrollIntoView({ behavior: "smooth" });
                      window.dispatchEvent(
                        new CustomEvent("consultant:action", {
                          detail: { action: link.action },
                        })
                      );
                    }, 100);
                  } else {
                    close();
                  }
                }}
                className="text-text-bright font-sora hover:text-accent-cyan text-2xl font-semibold transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}

            {/* CTA */}
            <a
              href="https://calendly.com/juanelojga/one-on-one-meeting"
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="from-accent-cyan to-accent-teal text-midnight mt-4 rounded-xl bg-gradient-to-r px-8 py-4 text-base font-semibold transition-opacity duration-200 hover:opacity-90"
            >
              {ctaLabel}
            </a>
          </nav>

          {/* Bottom: Language + Social */}
          <div className="flex flex-col items-center gap-6 px-4 pb-8">
            {/* Language switcher */}
            <nav
              aria-label={languageSwitchLabel}
              className="flex items-center rounded-full border border-white/10 bg-white/5 p-0.5"
            >
              <a
                href={enUrl}
                aria-current={currentLang === "en" ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                  currentLang === "en"
                    ? "bg-accent-cyan/20 text-accent-cyan"
                    : "text-text-muted hover:text-text-bright"
                }`}
              >
                EN
              </a>
              <a
                href={esUrl}
                aria-current={currentLang === "es" ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                  currentLang === "es"
                    ? "bg-accent-cyan/20 text-accent-cyan"
                    : "text-text-muted hover:text-text-bright"
                }`}
              >
                ES
              </a>
            </nav>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={socialGithubLabel}
                className="text-text-muted hover:text-accent-cyan min-h-[44px] min-w-[44px] rounded-lg p-2.5 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={socialLinkedinLabel}
                className="text-text-muted hover:text-accent-cyan min-h-[44px] min-w-[44px] rounded-lg p-2.5 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={socialInstagramLabel}
                className="text-text-muted hover:text-accent-cyan min-h-[44px] min-w-[44px] rounded-lg p-2.5 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
