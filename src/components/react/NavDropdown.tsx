import { useEffect, useRef, useState } from "react";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
  isMobile?: boolean;
}

export default function NavDropdown({ label, items, isMobile = false }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Desktop: hover behavior
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="relative flex flex-col items-start"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center gap-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="font-inter text-regular text-scheme-text-primary leading-[1.5] font-normal text-nowrap whitespace-pre">
          {label}
        </span>
        <div className="relative size-6 shrink-0">
          <img
            src="/assets/icons/chevron-down.svg"
            alt=""
            className={`block size-full max-w-none transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {isOpen && (
        <div
          className={`rounded-small border-scheme-border absolute left-0 z-50 border border-solid bg-white shadow-lg ${
            isMobile ? "top-full mt-2" : "top-full"
          }`}
        >
          <div className="font-inter text-regular text-scheme-text-primary box-border flex flex-col gap-4 overflow-clip rounded-[inherit] p-6 leading-[1.5] font-normal">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                onClick={closeDropdown}
                className="relative w-full shrink-0 whitespace-nowrap transition-opacity hover:opacity-70"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
