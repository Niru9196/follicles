'use client';
import React, { useEffect, useRef, useState } from 'react';
import { MenstrualCycleOption, PregnancyStatusOption, useStory } from '../context/StoryContext';

interface Props { onComplete: () => void; }

export default function Chapter11HormonalFemale({ onComplete }: Props) {
  const { setMenstrualCycle, setPregnancyHairLoss } = useStory();
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState<MenstrualCycleOption | null>('regular');
  const [pregnancy, setPregnancy] = useState<PregnancyStatusOption | null>('notApplicable');
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const cycleOptions: Array<{ label: string; value: MenstrualCycleOption }> = [
    { label: 'Regular', value: 'regular' },
    { label: 'Irregular', value: 'irregular' },
    { label: 'Menopausal', value: 'menopausal' },
    { label: 'Not applicable', value: 'notApplicable' },
  ];

  const pregnancyOptions: Array<{ label: string; value: PregnancyStatusOption }> = [
    { label: 'Currently pregnant', value: 'currentlyPregnant' },
    { label: 'Postpartum under 1 year', value: 'postpartumUnder1Year' },
    { label: 'Not applicable', value: 'notApplicable' },
  ];

  const handleCycle = (value: MenstrualCycleOption) => {
    setCycle(value);
    setMenstrualCycle(value);
    setTimeout(() => setStep(1), 300);
  };

  const handlePregnancy = (value: PregnancyStatusOption) => {
    setPregnancy(value);
    setPregnancyHairLoss(value);
    setTimeout(() => onComplete(), 500);
  };

  return (
    <section ref={ref} className="min-h-screen flex flex-col items-center justify-center px-6 py-24" style={{ background: '#0A0A0F' }}>
      <div className="max-w-3xl mx-auto w-full">
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'all 1s cubic-bezier(0.22,1,0.36,1)' }}>
          <p className="font-sans text-sm tracking-widest mb-4" style={{ color: '#C9A84C' }}>WHAT MIGHT INFLUENCE IT</p>
          <h2 className="font-serif font-light mb-6" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#F5F0E8', lineHeight: 1.2 }}>
            For women, hormonal changes can be<br />
            <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>an important part of the picture.</span>
          </h2>
        </div>

        <div className="space-y-10 mt-12">
          <div>
            <p className="font-sans font-medium mb-6" style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#F5F0E8' }}>Menstrual cycle</p>
            <div className="flex gap-4 flex-wrap">
              {cycleOptions.map(option => (
                <button key={option.value} onClick={() => handleCycle(option.value)} className="font-sans font-medium px-6 py-4 transition-all duration-300" style={{ fontSize: '16px', background: cycle === option.value ? 'rgba(201,168,76,0.12)' : 'transparent', color: cycle === option.value ? '#C9A84C' : '#A89880', border: `1.5px solid ${cycle === option.value ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer', minHeight: '56px', minWidth: '140px' }}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {step >= 1 && (
            <div style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.22,1,0.36,1)' }}>
              <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
              <p className="font-sans font-medium mb-6" style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#F5F0E8' }}>Pregnancy-related hair loss</p>
              <div className="flex gap-4 flex-wrap">
                {pregnancyOptions.map(option => (
                  <button key={option.value} onClick={() => handlePregnancy(option.value)} className="font-sans font-medium px-6 py-4 transition-all duration-300" style={{ fontSize: '16px', background: pregnancy === option.value ? 'rgba(201,168,76,0.12)' : 'transparent', color: pregnancy === option.value ? '#C9A84C' : '#A89880', border: `1.5px solid ${pregnancy === option.value ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer', minHeight: '56px', minWidth: '180px' }}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
