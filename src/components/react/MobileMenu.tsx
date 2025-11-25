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
  dropdownItems: DropdownItem[];
  consultButton: {
    label: string;
    href: string;
  };
}

export default function MobileMenu({ links, dropdownItems, consultButton }: MobileMenuProps) {
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
        setIsWorkDropdownOpen(false);
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
    setIsWorkDropdownOpen(false);
  };

  return (
    <div ref={menuRef} className="lg:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="flex flex-col items-center justify-center gap-1.5 p-2"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span
          className={`bg-scheme-text-primary block h-0.5 w-6 transition-all duration-300 ${
            isOpen ? "translate-y-2 rotate-45" : ""
          }`}
        ></span>
        <span
          className={`bg-scheme-text-primary block h-0.5 w-6 transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`bg-scheme-text-primary block h-0.5 w-6 transition-all duration-300 ${
            isOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        ></span>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 top-[84px] z-40 bg-black"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-[84px] right-0 z-50 h-[calc(100vh-84px)] w-80 transform bg-white shadow-xl transition-transform duration-300 ${
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
            <div className="flex flex-col">
              <button
                onClick={toggleWorkDropdown}
                className="font-inter text-regular text-scheme-text-primary flex items-center justify-between leading-[1.5] font-normal"
                aria-expanded={isWorkDropdownOpen}
              >
                <span>{links.work.label}</span>
                <div className="relative size-6 shrink-0">
                  <img
                    src="/assets/icons/chevron-down.svg"
                    alt=""
                    className={`block size-full max-w-none transition-transform duration-300 ${
                      isWorkDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Work Dropdown Items */}
              {isWorkDropdownOpen && (
                <div className="border-scheme-border mt-4 flex flex-col gap-4 border-l-2 pl-4">
                  {dropdownItems.map((item, index) => (
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
