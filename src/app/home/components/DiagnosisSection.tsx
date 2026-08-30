import React from 'react';
import AppImage from '@/components/ui/AppImage';

const steps = [
{
  number: '01',
  title: 'Trichoscopic mapping',
  body: 'A digital scalp microscope magnifies your follicles up to 70×. We see miniaturisation patterns, sebum plugs, inflammation markers, and follicle density — the exact data that determines whether your loss is temporary or structural.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_155c6233e-1772078535697.png",
  imageAlt: 'Trichoscope digital microscope pressed against scalp showing magnified follicle view during clinical examination',
  badge: 'Clinical Tool',
  imageLeft: false
},
{
  number: '02',
  title: 'Root-cause analysis',
  body: 'Hair loss is a symptom, not a diagnosis. We investigate the upstream causes: hormonal shifts, nutritional deficiencies, scalp microbiome imbalance, autoimmune triggers, and genetic predisposition — capturing over 800 underlying indicators.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a98e3933-1772078536475.png",
  imageAlt: 'Trichologist reviewing scalp analysis results with patient, discussing hair follicle health data on screen',
  badge: 'Diagnostic Process',
  imageLeft: true
},
{
  number: '03',
  title: 'Plain-language findings',
  body: 'You leave knowing exactly what type of loss you have, what\'s causing it, and what your realistic regrowth timeline looks like. No vague "stress and diet" — specific causes, specific protocols.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b4171048-1772078537024.png",
  imageAlt: 'Trichologist explaining hair loss findings to patient using clear diagrams and personalised scalp report',
  badge: 'Your Report',
  imageLeft: false
}];


export default function DiagnosisSection() {
  return (
    <section id="diagnosis" className="bg-birch py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 reveal-up">
          <div className="flex justify-center mb-4">
            <div className="gold-rule mx-auto" style={{ width: 48 }} />
          </div>
          <p className="text-xs font-medium tracking-[0.18em] uppercase text-moss mb-4">The Follicle Method</p>
          <h2 className="font-serif text-evergreen leading-tight mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>
            "Let me look" —<br />
            <em>not "have you tried."</em>
          </h2>
          <p className="text-moss font-light leading-relaxed text-lg">
            Every consultation begins with a trichoscope and ends with answers. Here's how we read what your scalp is telling us.
          </p>
        </div>

        {/* Zigzag steps */}
        <div className="space-y-24 lg:space-y-32">
          {steps?.map((step, idx) =>
          <div
            key={idx}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${step?.imageLeft ? '' : 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1'}`}>
            
              {/* Image */}
              <div className={`zigzag-image rounded-2xl overflow-hidden ${step?.imageLeft ? 'reveal-left' : 'reveal-right'}`}>
                <div className="relative">
                  <AppImage
                  src={step?.image}
                  alt={step?.imageAlt}
                  className="w-full h-[400px] lg:h-[480px] object-cover"
                  width={600}
                  height={480} />
                
                  <div className="absolute top-4 left-4">
                    <span className="concern-badge">{step?.badge}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{ background: 'linear-gradient(to top, rgba(27,67,50,0.3), transparent)' }} />
                </div>
              </div>

              {/* Copy */}
              <div className={step?.imageLeft ? 'reveal-right delay-200' : 'reveal-left delay-200'}>
                <div className="flex items-start gap-4 mb-5">
                  <span className="font-serif text-gold/60 text-4xl font-light leading-none">{step?.number}</span>
                  <div className="pt-1">
                    <h3 className="font-serif text-evergreen mb-4" style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)', lineHeight: 1.15 }}>
                      {step?.title}
                    </h3>
                    <p className="text-moss font-light leading-relaxed text-base lg:text-lg">
                      {step?.body}
                    </p>
                  </div>
                </div>

                {/* Micro-detail callout */}
                {idx === 0 &&
              <div className="mt-6 p-4 rounded-xl bg-evergreen/5 border border-evergreen/10">
                    <p className="text-xs text-moss font-medium uppercase tracking-wider mb-2">What we see under the scope</p>
                    <div className="flex flex-wrap gap-2">
                      {['Follicle miniaturisation', 'Inflammation markers', 'Sebum plugging', 'Density mapping', 'Shaft diameter']?.map((tag) =>
                  <span key={tag} className="text-xs bg-birch border border-moss/20 text-moss px-2.5 py-1 rounded-full">{tag}</span>
                  )}
                    </div>
                  </div>
              }

                {idx === 1 &&
              <div className="mt-6 grid grid-cols-2 gap-4">
                    {[
                { label: 'Indicators tested', value: '800+' },
                { label: 'Avg. consultation', value: '60 min' }]?.
                map((stat) =>
                <div key={stat?.label} className="p-4 rounded-xl bg-evergreen/5 border border-evergreen/10 text-center">
                        <p className="font-serif text-evergreen text-2xl mb-1">{stat?.value}</p>
                        <p className="text-xs text-moss font-light">{stat?.label}</p>
                      </div>
                )}
                  </div>
              }
              </div>
            </div>
          )}
        </div>

      </div>
    </section>);

}