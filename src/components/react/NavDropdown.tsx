import { useEffect, useRef, useState } from "react";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
}

export default function NavDropdown({ label, items }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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

  return (
    <div ref={dropdownRef} className="relative flex flex-col items-start">
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
          <img src="/assets/icons/chevron-down.svg" alt="" className="block size-full max-w-none" />
        </div>
      </button>

      {isOpen && (
        <div className="rounded-small border-scheme-border absolute top-8 left-0 border border-solid bg-white">
          <div className="font-inter text-regular text-scheme-text-primary box-border flex flex-col gap-4 overflow-clip rounded-[inherit] p-6 leading-[1.5] font-normal">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="relative w-full shrink-0 transition-opacity hover:opacity-70"
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
