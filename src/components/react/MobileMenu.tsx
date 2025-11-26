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

interface MobileMenuProps {
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

export default function MobileMenu({ links, workDropdownItems, consultButton }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isWorkDropdownOpen, setIsWorkDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsWorkDropdownOpen(false); // Close dropdown when menu closes
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
      // Prevent body scroll when menu is open
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
      {/* Hamburger/Close Button */}
      <button onClick={toggleMenu} aria-label="Toggle menu" aria-expanded={isOpen}>
        {isOpen ? (
          <XMarkIcon className="text-scheme-text-primary h-6 w-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="text-scheme-text-primary h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 top-[60px] z-40 bg-black"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-[60px] right-0 z-50 h-[calc(100vh-60px)] w-80 transform bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-6">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-6">
            <a
              href={links.services.href}
              onClick={handleLinkClick}
              className="font-inter text-regular text-scheme-text-primary leading-[1.5] font-normal transition-opacity hover:opacity-70"
            >
              {links.services.label}
            </a>

            <a
              href={links.about.href}
              onClick={handleLinkClick}
              className="font-inter text-regular text-scheme-text-primary leading-[1.5] font-normal transition-opacity hover:opacity-70"
            >
              {links.about.label}
            </a>

            {/* Work Dropdown */}
            <div className="flex flex-col gap-3">
              <button
                onClick={toggleWorkDropdown}
                className="font-inter text-regular text-scheme-text-primary flex items-center justify-between leading-[1.5] font-normal transition-opacity hover:opacity-70"
                aria-expanded={isWorkDropdownOpen}
              >
                <span>{links.work.label}</span>
                <img
                  src="/assets/icons/chevron-down.svg"
                  alt=""
                  className={`size-6 transition-transform duration-300 ${isWorkDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isWorkDropdownOpen && (
                <div className="ml-4 flex flex-col gap-3 border-l-2 border-gray-200 pl-4">
                  {workDropdownItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      onClick={handleLinkClick}
                      className="font-inter text-regular text-scheme-text-primary leading-[1.5] font-normal transition-opacity hover:opacity-70"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Consult Button */}
          <div className="mt-auto pt-6">
            <a
              href={consultButton.href}
              onClick={handleLinkClick}
              className="border-tarawera bg-tarawera flex w-full items-center justify-center gap-2 rounded-full border border-solid px-5 py-3"
            >
              <span className="font-inter text-regular leading-[1.5] font-medium text-white">
                {consultButton.label}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
