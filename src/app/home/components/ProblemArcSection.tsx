import React from 'react';
import AppImage from '@/components/ui/AppImage';

const anxieties = [
{
  icon: '🪮',
  label: 'The pillow check',
  description: 'Waking up and counting what came out overnight before you let yourself think about anything else.'
},
{
  icon: '💨',
  label: 'The wind dread',
  description: 'Calculating every route that keeps your part away from gusts. Rerouting your life around your hairline.'
},
{
  icon: '📸',
  label: 'The camera dodge',
  description: 'Turning down photos, angling away from overhead lights, wondering when it became this constant.'
},
{
  icon: '🚿',
  label: 'The drain moment',
  description: 'That pause in the shower. The clump on your fingers. The quiet arithmetic of what\'s left.'
}];


export default function ProblemArcSection() {
  return (
    <section className="bg-birch-warm py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="max-w-2xl mb-16 lg:mb-24 reveal-up">
          <div className="gold-rule" />
          <p className="text-xs font-medium tracking-[0.18em] uppercase text-moss mb-4">You know this feeling</p>
          <h2 className="font-serif text-evergreen leading-tight mb-6" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)' }}>
            The private arithmetic<br />
            <em>of hair loss.</em>
          </h2>
          <p className="text-moss text-lg font-light leading-relaxed">
            You've tried biotin. You've Googled at 2am. You've been told "it's just stress" by a GP who spent four minutes on your concern. What you haven't had yet is someone who actually looked.
          </p>
        </div>

        {/* Zigzag: image left, anxieties right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 lg:mb-28">
          <div className="zigzag-image rounded-2xl overflow-hidden reveal-left">
            <AppImage
              src="https://img.rocket.new/generatedImages/rocket_gen_img_178aa26c7-1772078536543.png"
              alt="Woman examining hair loss in bathroom mirror, tracing a widening part line"
              className="w-full h-[480px] object-cover object-center"
              width={600}
              height={480} />
            
          </div>

          <div className="reveal-right delay-200">
            <div className="space-y-6">
              {anxieties?.map((a, i) =>
              <div
                key={i}
                className="flex gap-4 p-5 rounded-xl bg-white/60 border border-moss/10 hover:border-moss/25 transition-colors">
                
                  <span className="text-2xl mt-0.5 flex-shrink-0">{a?.icon}</span>
                  <div>
                    <p className="font-serif text-evergreen text-lg mb-1">{a?.label}</p>
                    <p className="text-moss text-sm font-light leading-relaxed">{a?.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transition statement */}
        <div className="text-center max-w-3xl mx-auto reveal-up">
          <div className="section-divider mb-10" />
          <h3 className="font-serif text-evergreen text-2xl lg:text-3xl leading-snug mb-6">
            Hair loss is <em>not</em> one thing.<br />
            It needs someone who can tell the difference.
          </h3>
          <p className="text-moss font-light leading-relaxed mb-8">
            A trichologist spends your entire appointment on your scalp and hair — not your blood pressure, not your sinuses. Magnified scopes. Follicle-level data. A protocol that starts with your actual biology.
          </p>
          <a href="#book" className="btn-gold px-7 py-3.5 rounded-full text-sm inline-flex items-center gap-2">
            Book Your Scalp Analysis
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>

      </div>
    </section>);

}