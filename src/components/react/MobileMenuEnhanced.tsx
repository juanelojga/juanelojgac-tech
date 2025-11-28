import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

interface NavLink {
  label: string;
  href: string;
}

interface DropdownItem {
  label: string;
  href: string;
}

interface MobileMenuEnhancedProps {
  links: {
    services: NavLink;
    about: NavLink;
    work: NavLink;
  };
  workDropdownItems: DropdownItem[];
  consultButton: {
    label: string;
    href: string;
  };
}

export default function MobileMenuEnhanced({
  links,
  workDropdownItems,
  consultButton,
}: MobileMenuEnhancedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isWorkDropdownOpen, setIsWorkDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsWorkDropdownOpen(false);
  };

  const toggleWorkDropdown = () => {
    setIsWorkDropdownOpen(!isWorkDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="lg:hidden">
      {/* Enhanced Hamburger/Close Button */}
      <button
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        className="relative z-50 p-2 transition-transform duration-500 hover:scale-110 active:scale-95"
      >
        <div className="relative size-6">
          <Bars3Icon
            className={`text-scheme-text-primary absolute inset-0 size-6 transition-all duration-500 ${
              isOpen ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
            }`}
            aria-hidden="true"
          />
          <XMarkIcon
            className={`text-tarawera absolute inset-0 size-6 transition-all duration-500 ${
              isOpen ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
            }`}
            aria-hidden="true"
          />
        </div>
      </button>

      {/* Enhanced Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 top-[60px] z-40 bg-black transition-all duration-500 ${
          isOpen ? "opacity-40 backdrop-blur-sm" : "pointer-events-none opacity-0"
        }`}
        onClick={toggleMenu}
      />

      {/* Enhanced Mobile Menu with Glass Effect */}
      <div
        className={`fixed top-[60px] right-0 z-50 h-[calc(100vh-60px)] w-[85vw] max-w-sm transform transition-all duration-700 ease-out ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.12)",
        }}
      >
        <div className="flex h-full flex-col p-8">
          {/* Navigation Links with Staggered Animation */}
          <nav className="flex flex-col gap-8">
            <a
              href={links.services.href}
              onClick={handleLinkClick}
              className="font-inter group text-scheme-text-primary hover:text-tarawera relative text-lg leading-[1.5] font-medium transition-all duration-500 hover:translate-x-2"
              style={{
                animationDelay: isOpen ? "100ms" : "0ms",
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateX(0)" : "translateX(20px)",
              }}
            >
              {links.services.label}
              <span className="bg-tarawera absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"></span>
            </a>

            <a
              href={links.about.href}
              onClick={handleLinkClick}
              className="font-inter group text-scheme-text-primary hover:text-tarawera relative text-lg leading-[1.5] font-medium transition-all duration-500 hover:translate-x-2"
              style={{
                animationDelay: isOpen ? "200ms" : "0ms",
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateX(0)" : "translateX(20px)",
              }}
            >
              {links.about.label}
              <span className="bg-tarawera absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"></span>
            </a>

            {/* Work Dropdown */}
            <div
              className="flex flex-col gap-4"
              style={{
                animationDelay: isOpen ? "300ms" : "0ms",
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateX(0)" : "translateX(20px)",
              }}
            >
              <button
                onClick={toggleWorkDropdown}
                className="font-inter group text-scheme-text-primary hover:text-tarawera flex items-center justify-between text-lg leading-[1.5] font-medium transition-all duration-500"
                aria-expanded={isWorkDropdownOpen}
              >
                <span>{links.work.label}</span>
                <img
                  src="/assets/icons/chevron-down.svg"
                  alt=""
                  className={`size-5 transition-all duration-500 ${
                    isWorkDropdownOpen ? "rotate-180 opacity-100" : "rotate-0 opacity-60"
                  }`}
                />
              </button>

              <div
                className={`border-tarawera/30 ml-6 flex flex-col gap-4 overflow-hidden border-l-2 pl-6 transition-all duration-500 ${
                  isWorkDropdownOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {workDropdownItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    onClick={handleLinkClick}
                    className="font-inter text-scheme-text-primary hover:text-tarawera text-base leading-[1.5] font-normal transition-all duration-300 hover:translate-x-1"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </nav>

          {/* Enhanced Consult Button */}
          <div
            className="mt-auto pt-8"
            style={{
              animationDelay: isOpen ? "400ms" : "0ms",
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <a
              href={consultButton.href}
              onClick={handleLinkClick}
              className="group border-tarawera bg-tarawera relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border-2 border-solid px-6 py-4 shadow-lg transition-all duration-500 hover:scale-105 hover:bg-transparent hover:shadow-xl active:scale-95"
            >
              <span className="font-inter group-hover:text-tarawera relative z-10 text-base leading-[1.5] font-semibold text-white transition-colors duration-500">
                {consultButton.label}
              </span>
              <div className="absolute inset-0 origin-left scale-x-0 transform bg-white transition-transform duration-500 group-hover:scale-x-100"></div>
            </a>
          </div>

          {/* Decorative gradient at bottom */}
          <div
            className="pointer-events-none absolute right-0 bottom-0 left-0 h-32"
            style={{
              background: "linear-gradient(to top, rgba(6, 182, 212, 0.05), transparent)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
