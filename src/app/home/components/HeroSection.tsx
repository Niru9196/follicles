import React from 'react';
import AppImage from '@/components/ui/AppImage';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-evergreen">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2274&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          filter: 'brightness(0.35) saturate(0.6)',
          animation: 'scrollBlurHero linear both',
          animationTimeline: 'scroll()',
          animationRange: '0px 700px',
        }}
      />

      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(180deg, rgba(27,67,50,0.3) 0%, rgba(27,67,50,0.7) 60%, rgba(15,42,31,0.95) 100%)' }} />
      <div className="absolute inset-0 z-[2]" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(82,121,111,0.15) 0%, transparent 60%)' }} />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-20 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <div
              className="inline-flex items-center gap-2 mb-6"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
            >
              <span className="w-8 h-px bg-gold" />
              <span className="text-gold/80 text-xs font-medium tracking-[0.18em] uppercase">Trichology Clinic</span>
            </div>

            <h1
              className="font-serif text-birch leading-[0.88] tracking-tight mb-8"
              style={{
                fontSize: 'clamp(3.2rem, 7vw, 6.5rem)',
                animation: 'fadeInUp 1s ease-out 0.35s both',
              }}
            >
              Your scalp has<br />
              <em className="text-gold/90 not-italic">a story.</em><br />
              We read it.
            </h1>

            <p
              className="text-birch/70 text-lg font-light leading-relaxed max-w-lg mb-10"
              style={{ animation: 'fadeInUp 0.9s ease-out 0.55s both' }}
            >
              Trichologists who press magnified scopes against scalps, find the root cause of your hair loss, and build a regrowth protocol built for you — not a shelf of supplements.
            </p>

            <div className="flex flex-wrap gap-4" style={{ animation: 'fadeInUp 0.8s ease-out 0.7s both' }}>
              <a href="#book" className="btn-gold px-7 py-3.5 rounded-full text-sm inline-flex items-center gap-2">
                Book Your Scalp Analysis
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
              <a href="#guide" className="btn-outline-evergreen border-birch/30 text-birch/80 hover:bg-birch/10 hover:text-birch px-6 py-3.5 rounded-full text-sm inline-flex items-center gap-2">
                Free Hair Loss Guide
              </a>
            </div>

            <p className="mt-6 text-birch/40 text-xs font-light" style={{ animation: 'fadeInUp 0.8s ease-out 0.85s both' }}>
              In-clinic &amp; virtual consultations available · No referral needed
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end" style={{ animation: 'fadeInRight 1s ease-out 0.6s both' }}>
            <div className="testimonial-card rounded-2xl p-5 max-w-sm w-full float-card">
              <div className="relative rounded-xl overflow-hidden mb-4">
                <AppImage
                  src="https://img.rocket.new/generatedImages/rocket_gen_img_14bfbf199-1772078535809.png"
                  alt="Client crown showing visibly thickening hair after Follicle trichology treatment"
                  className="w-full h-48 object-cover object-top"
                  width={400}
                  height={192}
                />

                <div className="absolute bottom-3 right-3 scope-thumbnail rounded-lg overflow-hidden">
                  <AppImage
                    src="https://img.rocket.new/generatedImages/rocket_gen_img_15d7f6629-1772078534687.png"
                    alt="Microscopic trichoscope view of hair follicles during scalp analysis"
                    className="w-16 h-16 object-cover"
                    width={64}
                    height={64}
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <span className="concern-badge">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                    6 months post-analysis
                  </span>
                </div>
              </div>

              <blockquote className="mb-4">
                <p className="font-serif text-evergreen text-xl leading-snug italic">
                  &ldquo;I stopped wearing hats in June.&rdquo;
                </p>
              </blockquote>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-evergreen">Priya M., 34</p>
                  <p className="text-xs text-moss">Postpartum thinning · 6-month protocol</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)]?.map((_, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#C9A84C">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
        <span className="text-birch text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-birch/40 animate-pulse" />
      </div>
    </section>
  );
}