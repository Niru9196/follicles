'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ProductName, ProductUsage, useStory } from '../context/StoryContext';

interface Props { onComplete: () => void; }

const productOptions: Array<{ key: ProductName; label: string; emoji: string }> = [
  { key: 'medicatedShampoos', label: 'Medicated shampoos', emoji: '🧴' },
  { key: 'hairOilsOrSerums', label: 'Hair oils or serums', emoji: '💧' },
  { key: 'topicalMinoxidil', label: 'Topical minoxidil', emoji: '✨' },
  { key: 'oralMinoxidil', label: 'Oral minoxidil', emoji: '💊' },
  { key: 'supplements', label: 'Supplements', emoji: '🌿' },
];

const durationOptions = [
  { label: 'Under 3 months', value: 'under3months' },
  { label: '3–6 months', value: '3to6months' },
  { label: 'Over 6 months', value: 'over6months' },
] as const;

export default function Chapter12Treatments({ onComplete }: Props) {
  const { setTreatments } = useStory();
  const [answers, setAnswers] = useState<Record<ProductName, ProductUsage>>({
    medicatedShampoos: { used: false },
    hairOilsOrSerums: { used: false },
    topicalMinoxidil: { used: false },
    oralMinoxidil: { used: false },
    supplements: { used: false },
  });
  const [current, setCurrent] = useState<ProductName>('medicatedShampoos');
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const currentProduct = productOptions.find(p => p.key === current)!;
  const currentEntry = answers[current];

  const updateProduct = (patch: Partial<ProductUsage>) => {
    const next = { ...answers, [current]: { ...answers[current], ...patch } };
    setAnswers(next);
  };

  const goNext = () => {
    const index = productOptions.findIndex(p => p.key === current);
    if (index < productOptions.length - 1) {
      setCurrent(productOptions[index + 1].key);
      return;
    }
    setTreatments(answers);
    onComplete();
  };

  return (
    <section ref={ref} className="min-h-screen flex flex-col items-center justify-center px-6 py-24" style={{ background: '#0D0D14' }}>
      <div className="max-w-4xl mx-auto w-full">
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'all 1s cubic-bezier(0.22,1,0.36,1)' }}>
          <p className="font-sans text-sm tracking-widest mb-4" style={{ color: '#C9A84C' }}>CURRENT HAIR CARE AND TREATMENTS</p>
          <h2 className="font-serif font-light mb-4" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#F5F0E8', lineHeight: 1.1 }}>
            Most people try something<br />
            <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>before they see a clinician.</span>
          </h2>
          <p className="font-sans mb-12" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A89880' }}>Which products have you used, for how long, and did they help?</p>
        </div>

        <div className="rounded border p-6 md:p-8" style={{ background: 'rgba(245,240,232,0.02)', borderColor: 'rgba(201,168,76,0.18)' }}>
          <div className="flex flex-wrap gap-2 mb-8">
            {productOptions.map((product, i) => {
              const isActive = product.key === current;
              return (
                <button key={product.key} onClick={() => setCurrent(product.key)} className="font-sans px-4 py-2 text-sm" style={{ background: isActive ? 'rgba(201,168,76,0.12)' : 'rgba(245,240,232,0.03)', color: isActive ? '#C9A84C' : '#A89880', border: `1px solid ${isActive ? '#C9A84C' : 'rgba(168,152,128,0.2)'}`, borderRadius: 999, cursor: 'pointer' }}>
                  {i + 1}. {product.label}
                </button>
              );
            })}
          </div>

          <div className="mb-8">
            <p className="font-sans font-medium mb-6" style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#F5F0E8' }}>
              {currentProduct.emoji} {currentProduct.label}
            </p>

            <div className="flex gap-4 flex-wrap mb-6">
              <button onClick={() => updateProduct({ used: true })} className="font-sans font-medium px-8 py-3 transition-all duration-300" style={{ fontSize: '16px', background: currentEntry.used ? 'rgba(201,168,76,0.12)' : 'transparent', color: currentEntry.used ? '#C9A84C' : '#A89880', border: `1.5px solid ${currentEntry.used ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>Yes</button>
              <button onClick={() => updateProduct({ used: false, duration: undefined, helped: undefined, sideEffects: undefined })} className="font-sans font-medium px-8 py-3 transition-all duration-300" style={{ fontSize: '16px', background: currentEntry.used === false ? 'rgba(201,168,76,0.12)' : 'transparent', color: currentEntry.used === false ? '#C9A84C' : '#A89880', border: `1.5px solid ${currentEntry.used === false ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>No</button>
            </div>

            {currentEntry.used && (
              <div className="space-y-6" style={{ animation: 'fadeInUp 0.5s ease' }}>
                <div>
                  <p className="font-sans mb-3" style={{ color: '#F5F0E8' }}>Duration</p>
                  <div className="flex gap-3 flex-wrap">
                    {durationOptions.map(option => (
                      <button key={option.value} onClick={() => updateProduct({ duration: option.value })} className="font-sans px-4 py-3" style={{ background: currentEntry.duration === option.value ? 'rgba(201,168,76,0.12)' : 'transparent', color: currentEntry.duration === option.value ? '#C9A84C' : '#A89880', border: `1px solid ${currentEntry.duration === option.value ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>{option.label}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-sans mb-3" style={{ color: '#F5F0E8' }}>Helped?</p>
                  <div className="flex gap-3 flex-wrap">
                    <button onClick={() => updateProduct({ helped: true })} className="font-sans px-6 py-3" style={{ background: currentEntry.helped === true ? 'rgba(201,168,76,0.12)' : 'transparent', color: currentEntry.helped === true ? '#C9A84C' : '#A89880', border: `1px solid ${currentEntry.helped === true ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>Yes</button>
                    <button onClick={() => updateProduct({ helped: false })} className="font-sans px-6 py-3" style={{ background: currentEntry.helped === false ? 'rgba(201,168,76,0.12)' : 'transparent', color: currentEntry.helped === false ? '#C9A84C' : '#A89880', border: `1px solid ${currentEntry.helped === false ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>No</button>
                  </div>
                </div>

                <div>
                  <p className="font-sans mb-3" style={{ color: '#F5F0E8' }}>Side effects?</p>
                  <div className="flex gap-3 flex-wrap">
                    <button onClick={() => updateProduct({ sideEffects: true })} className="font-sans px-6 py-3" style={{ background: currentEntry.sideEffects === true ? 'rgba(201,168,76,0.12)' : 'transparent', color: currentEntry.sideEffects === true ? '#C9A84C' : '#A89880', border: `1px solid ${currentEntry.sideEffects === true ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>Yes</button>
                    <button onClick={() => updateProduct({ sideEffects: false })} className="font-sans px-6 py-3" style={{ background: currentEntry.sideEffects === false ? 'rgba(201,168,76,0.12)' : 'transparent', color: currentEntry.sideEffects === false ? '#C9A84C' : '#A89880', border: `1px solid ${currentEntry.sideEffects === false ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>No</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8">
            <button onClick={goNext} className="font-sans font-medium px-10 py-5 transition-all duration-300" style={{ fontSize: 'clamp(16px, 2vw, 20px)', background: '#C9A84C', color: '#0A0A0F', border: 'none', borderRadius: '2px', cursor: 'pointer' }}>
              {current === productOptions[productOptions.length - 1].key ? 'Continue →' : 'Next product →'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
