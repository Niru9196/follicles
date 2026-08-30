'use client';

import React, { useState, useEffect } from 'react';
import AppLogo from '@/components/ui/AppLogo';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'How It Works', href: '#diagnosis' },
    { label: 'Treatments',   href: '#treatments' },
    { label: 'Outcomes',     href: '#outcomes' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-birch/95 backdrop-blur-md border-b border-moss/10 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <AppLogo
            size={32}
            iconName="SparklesIcon"
            text="Follicle"
            className="text-evergreen"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {links?.map(l => (
            <a
              key={l?.href}
              href={l?.href}
              className="text-sm font-medium text-moss hover:text-evergreen transition-colors duration-200 relative group"
            >
              {l?.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#book"
          className="hidden md:inline-flex btn-gold px-5 py-2.5 rounded-full text-sm"
        >
          Book Scalp Analysis
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-evergreen"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-birch/98 backdrop-blur-md border-t border-moss/10 px-6 pb-6 pt-4">
          {links?.map(l => (
            <a
              key={l?.href}
              href={l?.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-base font-medium text-evergreen border-b border-moss/10 last:border-0"
            >
              {l?.label}
            </a>
          ))}
          <a
            href="#book"
            onClick={() => setMenuOpen(false)}
            className="btn-gold mt-4 w-full text-center block py-3 rounded-full text-sm"
          >
            Book Scalp Analysis
          </a>
        </div>
      )}
    </header>
  );
}