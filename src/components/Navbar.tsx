import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "../constants/navLinks";
import { routePreloaders } from "../constants/routeLoaders";
import Icon from "./Icon";

// Only start downloading a route's chunk after the user has hovered/focused
// the link for this long, so a quick pass over the menu doesn't fetch it.
const PRELOAD_DELAY_MS = 120;

const Navbar: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const preloadTimers = useRef(new Map<string, number>());
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu on Escape and return focus to the toggle button.
  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const schedulePreload = (to: string) => {
    const existing = preloadTimers.current.get(to);
    if (existing !== undefined) {
      window.clearTimeout(existing);
    }
    const timer = window.setTimeout(() => {
      void routePreloaders[to]?.();
      preloadTimers.current.delete(to);
    }, PRELOAD_DELAY_MS);
    preloadTimers.current.set(to, timer);
  };

  const cancelPreload = (to: string) => {
    const timer = preloadTimers.current.get(to);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      preloadTimers.current.delete(to);
    }
  };

  const isLinkActive = (linkTo: string) => {
    return (
      location.pathname === linkTo ||
      (linkTo === "/search" && location.pathname.startsWith("/image/"))
    );
  };

  const linkClasses = (active: boolean) =>
    `flex items-center gap-2 border-b-2 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
      active
        ? "border-safelight text-paper"
        : "border-transparent text-muted hover:text-paper"
    }`;

  return (
    <nav className="sticky top-0 z-20 border-b border-line bg-dark/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-8 w-8 items-center justify-center border border-gold text-gold">
            <Icon name="camera" />
          </span>
          <span className="font-display text-lg uppercase tracking-[0.08em] text-paper">
            Pixabay<span className="text-safelight">App</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.to);
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={() => schedulePreload(link.to)}
                  onMouseLeave={() => cancelPreload(link.to)}
                  onFocus={() => schedulePreload(link.to)}
                  onBlur={() => cancelPreload(link.to)}
                  className={linkClasses(active)}
                >
                  <Icon name={link.icon} className="text-safelight" />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          ref={menuButtonRef}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex h-9 w-9 items-center justify-center border border-line text-paper transition-colors hover:border-safelight hover:text-safelight md:hidden"
        >
          <Icon name={menuOpen ? "xmark" : "bars"} />
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-dark md:hidden animate-fade-in">
          <ul className="space-y-1 px-4 py-3">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.to);
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    onMouseEnter={() => schedulePreload(link.to)}
                    onMouseLeave={() => cancelPreload(link.to)}
                    onFocus={() => schedulePreload(link.to)}
                    onBlur={() => cancelPreload(link.to)}
                    className={`block ${linkClasses(active)}`}
                  >
                    <Icon name={link.icon} className="text-safelight" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
