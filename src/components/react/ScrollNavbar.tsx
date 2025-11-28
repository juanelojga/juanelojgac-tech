import { useEffect, useState } from "react";

interface ScrollNavbarProps {
  children: React.ReactNode;
}

export default function ScrollNavbar({ children }: ScrollNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show glass effect after scrolling down past 50px
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [lastScrollY]);

  return (
    <div
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-500 ease-out md:top-4 md:right-4 md:left-4"
      style={{
        backdropFilter: isScrolled ? "blur(12px) saturate(180%)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(12px) saturate(180%)" : "none",
      }}
    >
      <div
        className="relative transition-all duration-500 md:rounded-full"
        style={{
          background: isScrolled ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 1)",
        }}
      >
        <div
          className={`absolute inset-x-0 bottom-0 h-px transition-opacity duration-500 ${
            isScrolled ? "opacity-100" : "opacity-30"
          }`}
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(6, 182, 212, 0.3) 50%, transparent)",
          }}
        />
        {children}
      </div>
    </div>
  );
}
