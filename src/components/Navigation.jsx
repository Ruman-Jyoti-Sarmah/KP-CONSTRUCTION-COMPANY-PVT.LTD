import { useEffect, useRef, useState } from "react";
import { brand, nav } from "../data/content.js";

function Wordmark() {
  return (
    <a href="#top" className="nav-brand group" data-cursor-label="Home" aria-label="KP Construction Company — home">
      <span className="nav-mark">
        <svg viewBox="0 0 26 26" width="19" height="19" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
            <path d="M6 20 L9.5 12 L13 16 L18 8.5 L22 20 Z" />
          </g>
          <rect x="5" y="3.5" width="12" height="2.4" fill="var(--bronze)" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="nav-name">{brand.legal.replace(" Pvt. Ltd.", "")}</span>
        <span className="nav-sub mt-0.5">{brand.suffix}</span>
      </span>
    </a>
  );
}

export default function Navigation() {
  const shellRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return undefined;
    const apply = () => {
      const y = window.scrollY ?? window.scrollTop ?? 0;
      if (y > 30) shell.classList.add("nav-scrolled");
      else shell.classList.remove("nav-scrolled");
    };
    apply();
    window.addEventListener("scroll", apply, { passive: true });
    return () => window.removeEventListener("scroll", apply);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
  }, [open]);

  return (
    <div ref={shellRef} className="nav-shell">
      <header className="nav-bar">
        <div className="nav-inner container-x">
          <Wordmark />

          <nav aria-label="Primary" className="nav-links">
            {nav.links.map((l) => (
              <a key={l.href} className="nav-link" href={l.href} data-cursor-label={l.label}>
                {l.label}
              </a>
            ))}
            <a href="#contact" className="nav-cta" data-cursor-label="Start project">
              <span className="bl">{nav.cta}</span>
              <span className="ba">→</span>
            </a>
          </nav>

          <button
            className="nav-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={`fixed inset-0 z-40 grid place-items-center bg-ivory transition-opacity duration-500 ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      >
        <nav className="flex flex-col gap-5 text-left" aria-label="Mobile">
          {nav.links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className="font-display text-4xl font-bold tracking-[-0.02em] text-charcoal hover:text-bronze"
              style={{ transitionDelay: `${i * 0.05}s` }}
              tabIndex={open ? 0 : -1}
            >
              <span className="text-sm align-super text-charcoal/40">{String(i + 1).padStart(2, "0")}</span> {l.label}
            </a>
          ))}
          <a href="#contact" tabIndex={open ? 0 : -1} className="btn btn-solid mt-4" onClick={() => setOpen(false)}>
            <span className="bl">{nav.cta}</span>
            <span className="ba">→</span>
          </a>
        </nav>
        <div className="absolute bottom-6 left-6 flex flex-col text-[0.7rem] text-charcoal/60">
          <span>{brand.email}</span>
          <span>{brand.label}</span>
        </div>
      </div>
    </div>
  );
}

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      {open ? (
        <path d="M6 6 L18 6 M6 18 L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <path d="M6 6 L18 6 M6 12 L18 12 M6 18 L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  );
}
