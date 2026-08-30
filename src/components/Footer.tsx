import React from 'react';
import AppLogo from '@/components/ui/AppLogo';

export default function Footer() {
  return (
    <footer className="bg-evergreen-deep border-t border-white/10 py-16 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-10">
        {/* Brand + tagline */}
        <div className="max-w-xs">
          <AppLogo
            size={28}
            iconName="SparklesIcon"
            text="Follicle"
            className="text-birch"
          />
          <p className="mt-3 text-sm font-light text-birch/60 leading-relaxed">
            Trichology clinic. Microscopic scalp diagnosis. Regrowth protocols built one strand at a time.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-12 text-sm">
          <div className="flex flex-col gap-3">
            <a href="#diagnosis"  className="text-birch/70 hover:text-birch transition-colors font-medium">How It Works</a>
            <a href="#treatments" className="text-birch/70 hover:text-birch transition-colors font-medium">Treatments</a>
            <a href="#outcomes"   className="text-birch/70 hover:text-birch transition-colors font-medium">Outcomes</a>
          </div>
          <div className="flex flex-col gap-3">
            <a href="#book"    className="text-birch/70 hover:text-birch transition-colors font-medium">Book Analysis</a>
            <a href="#guide"   className="text-birch/70 hover:text-birch transition-colors font-medium">Free Guide</a>
            <a href="#contact" className="text-birch/70 hover:text-birch transition-colors font-medium">Contact</a>
          </div>
        </div>

        {/* Social */}
        <div className="flex gap-4">
          {['Instagram', 'Facebook']?.map(s => (
            <a key={s} href="#" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-birch/60 hover:text-birch hover:border-white/40 transition-all text-xs font-medium">
              {s?.[0]}
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-birch/40">
        <span>© 2026 Follicle Trichology Clinic. All rights reserved.</span>
        <div className="flex gap-5">
          <a href="#" className="hover:text-birch/70 transition-colors">Privacy</a>
          <a href="#" className="hover:text-birch/70 transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}