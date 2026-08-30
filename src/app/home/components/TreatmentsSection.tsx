import React from 'react';
import AppImage from '@/components/ui/AppImage';

const treatments = [
{
  name: 'Low-Level Laser Therapy',
  tag: 'LLLT',
  description: 'Photobiomodulation at 650nm stimulates follicle metabolism and extends the anagen growth phase. Clinically validated for androgenetic and diffuse alopecia.',
  timeline: 'Noticeable at 12 weeks',
  progress: 40
},
{
  name: 'Nutrient Infusion Protocol',
  tag: 'Topical + Oral',
  description: 'Bespoke formulations — zinc, biotin, saw palmetto, and iron — dosed to your bloodwork deficiencies. Not shelf supplements. Clinician-specified concentrations.',
  timeline: 'Shedding reduces at 6–8 weeks',
  progress: 30
},
{
  name: 'Scalp Microbiome Therapy',
  tag: 'Scalp Health',
  description: 'Therapeutic scalp massage, steam treatment, and targeted actives rebalance sebum production, reduce inflammation, and restore the follicle environment.',
  timeline: 'Scalp health improves at 4 weeks',
  progress: 20
},
{
  name: 'PRP & Growth Factor Therapy',
  tag: 'Advanced',
  description: 'Platelet-rich plasma concentrates your own growth factors and delivers them directly to dormant follicles. Indicated for traction alopecia and patchy loss.',
  timeline: 'Regrowth visible at 8–16 weeks',
  progress: 50
}];


const timeline = [
{ month: 'Month 1', milestone: 'Shedding slows', detail: 'Follicle environment stabilises. The drain counts drop.' },
{ month: 'Month 2', milestone: 'Scalp health', detail: 'Inflammation reduces. Scalp feels less tender and tight.' },
{ month: 'Month 3', milestone: 'Baby hairs', detail: 'New growth emerges at hairline and crown. Fine, but there.' },
{ month: 'Month 5', milestone: 'Visible density', detail: 'Part line fills. Texture returns. Others start to notice.' },
{ month: 'Month 6', milestone: 'The hat goes', detail: 'You stop calculating the wind. You stop wearing the hat.' }];


export default function TreatmentsSection() {
  return (
    <section id="treatments" className="bg-evergreen py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-20">
          <div className="reveal-left">
            <div className="gold-rule" />
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-gold/60 mb-4">Treatment Protocols</p>
            <h2 className="font-serif text-birch leading-tight" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)' }}>
              Science-based.<br />
              <em className="text-gold/80">Not supplement-based.</em>
            </h2>
          </div>
          <div className="reveal-right delay-200">
            <p className="text-birch/60 font-light leading-relaxed text-lg">
              Every protocol is built from your diagnosis — not a menu. We don't prescribe minoxidil and wish you well. We match treatment to root cause, monitor response, and adjust.
            </p>
          </div>
        </div>

        {/* Treatment zigzag: image + cards alternating */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24">
          {/* Image */}
          <div className="zigzag-image rounded-2xl overflow-hidden reveal-left lg:row-span-2">
            <AppImage
              src="https://img.rocket.new/generatedImages/rocket_gen_img_1e43cb64e-1772078536519.png"
              alt="Trichologist applying laser hair therapy treatment to patient scalp in clinical setting"
              className="w-full h-full min-h-[500px] object-cover object-center"
              width={600}
              height={700} />
            
          </div>

          {/* Treatment cards */}
          <div className="space-y-4 reveal-right delay-200">
            {treatments?.map((t, i) =>
            <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs text-gold/60 font-medium tracking-wider uppercase">{t?.tag}</span>
                    <h4 className="font-serif text-birch text-lg mt-0.5">{t?.name}</h4>
                  </div>
                </div>
                <p className="text-birch/55 text-sm font-light leading-relaxed mb-3">{t?.description}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                    className="h-full bg-gold rounded-full transition-all duration-700 group-hover:opacity-100 opacity-60"
                    style={{ width: `${t?.progress}%` }} />
                  
                  </div>
                  <span className="text-xs text-gold/70 font-medium whitespace-nowrap">{t?.timeline}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Regrowth timeline */}
        <div id="outcomes" className="reveal-up">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-gold/60 mb-3">Realistic Expectations</p>
            <h3 className="font-serif text-birch text-2xl lg:text-3xl">
              Month by month, <em>what actually happens.</em>
            </h3>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-white/10" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {timeline?.map((t, i) =>
              <div key={i} className="relative flex flex-col items-start lg:items-center text-left lg:text-center">
                  {/* Node */}
                  <div className="w-4 h-4 rounded-full border-2 border-gold bg-evergreen mb-4 relative z-10 flex-shrink-0" />
                  <p className="text-gold text-xs font-medium tracking-wider uppercase mb-1">{t?.month}</p>
                  <p className="font-serif text-birch text-base mb-2">{t?.milestone}</p>
                  <p className="text-birch/45 text-xs font-light leading-relaxed">{t?.detail}</p>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="#book" className="btn-gold px-7 py-3.5 rounded-full text-sm inline-flex items-center gap-2">
              Start Your Protocol
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>);

}