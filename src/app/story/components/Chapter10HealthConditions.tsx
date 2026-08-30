'use client';
import React, { useEffect, useRef, useState } from 'react';
import { DiagnosedCondition, useStory } from '../context/StoryContext';

interface Props { onComplete: () => void; }

const conditions: Array<{ id: DiagnosedCondition; emoji: string; label: string; desc: string }> = [
  { id: 'pcos', emoji: '⚖️', label: 'PCOS or PCOD', desc: 'Polycystic ovary syndrome can influence hair and skin changes.' },
  { id: 'thyroid', emoji: '🦋', label: 'Thyroid disorder', desc: 'Thyroid disturbances can affect the hair growth cycle.' },
  { id: 'diabetes', emoji: '🍬', label: 'Diabetes', desc: 'Blood sugar levels can influence hair health.' },
  { id: 'autoimmune', emoji: '🛡️', label: 'Autoimmune disease', desc: 'Some autoimmune conditions affect hair follicles.' },
  { id: 'anemia', emoji: '🩸', label: 'Anemia', desc: 'Low iron can contribute to shedding and thinning.' },
  { id: 'none', emoji: '✓', label: 'None', desc: 'No diagnosed conditions apply.' },
];

export default function Chapter10HealthConditions({ onComplete }: Props) {
  const { data, setHealthConditions, setAcneOilySkinAdulthood, setExcessBodyFacialHairGrowth } = useStory();
  const [selected, setSelected] = useState<DiagnosedCondition[]>([]);
  const [noneSelected, setNoneSelected] = useState(false);
  const [acneAnswer, setAcneAnswer] = useState<boolean | null>(data.acneOilySkinAdulthood ?? false);
  const [hairGrowthAnswer, setHairGrowthAnswer] = useState<boolean | null>(data.excessBodyFacialHairGrowth ?? false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const visibleConditions = conditions.filter(condition => data.gender !== 'male' || condition.id !== 'pcos');

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (data.gender === 'male') {
      setSelected(prev => prev.filter(option => option !== 'pcos'));
      setNoneSelected(false);
    }
  }, [data.gender]);

  const toggle = (id: DiagnosedCondition) => {
    if (id === 'none') {
      setSelected([]);
      setNoneSelected(true);
      return;
    }
    setNoneSelected(false);
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleContinue = () => {
    const next: DiagnosedCondition[] = noneSelected ? ['none'] : selected;
    setHealthConditions(next);
    setAcneOilySkinAdulthood(acneAnswer ?? false);
    setExcessBodyFacialHairGrowth(hairGrowthAnswer ?? false);
    onComplete();
  };

  return (
    <section ref={ref} className="min-h-screen flex flex-col items-center justify-center px-6 py-24" style={{ background: '#0D0D14' }}>
      <div className="max-w-4xl mx-auto w-full">
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'all 1s cubic-bezier(0.22,1,0.36,1)' }}>
          <p className="font-sans text-sm tracking-widest mb-4" style={{ color: '#C9A84C' }}>WHAT MIGHT INFLUENCE IT</p>
          <h2 className="font-serif font-light mb-4" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#F5F0E8', lineHeight: 1.1 }}>
            Your body can sometimes<br />
            <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>tell part of the story.</span>
          </h2>
          <p className="font-sans mb-12" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A89880', lineHeight: 1.7 }}>
            Which of these diagnosed conditions apply?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8" style={{ opacity: visible ? 1 : 0, transition: 'opacity 1s ease 0.3s' }}>
          {visibleConditions.map((c, i) => {
            const isActive = noneSelected ? c.id === 'none' : selected.includes(c.id);
            return (
              <button key={c.id} onClick={() => toggle(c.id)} className="flex items-start gap-4 p-6 text-left transition-all duration-300" style={{ background: isActive ? 'rgba(201,168,76,0.1)' : 'rgba(245,240,232,0.03)', border: `1.5px solid ${isActive ? '#C9A84C' : 'rgba(245,240,232,0.08)'}`, borderRadius: '4px', cursor: 'pointer', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms`, minHeight: '100px' }}>
                <span style={{ fontSize: '32px', flexShrink: 0 }}>{c.emoji}</span>
                <div>
                  <p className="font-sans font-medium mb-1" style={{ fontSize: '18px', color: isActive ? '#C9A84C' : '#F5F0E8' }}>{c.label}</p>
                  <p className="font-sans" style={{ fontSize: '14px', color: '#A89880', lineHeight: 1.5 }}>{c.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-8 mt-8" style={{ opacity: visible ? 1 : 0, transition: 'opacity 1s ease 0.5s' }}>
          <div>
            <p className="font-sans font-medium mb-4" style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#F5F0E8' }}>Acne or oily skin in adulthood</p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => setAcneAnswer(true)} className="font-sans px-6 py-3" style={{ background: acneAnswer === true ? 'rgba(201,168,76,0.12)' : 'transparent', color: acneAnswer === true ? '#C9A84C' : '#A89880', border: `1px solid ${acneAnswer === true ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>Yes</button>
              <button onClick={() => setAcneAnswer(false)} className="font-sans px-6 py-3" style={{ background: acneAnswer === false ? 'rgba(201,168,76,0.12)' : 'transparent', color: acneAnswer === false ? '#C9A84C' : '#A89880', border: `1px solid ${acneAnswer === false ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>No</button>
            </div>
          </div>

          <div>
            <p className="font-sans font-medium mb-4" style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#F5F0E8' }}>Excess body or facial hair growth</p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => setHairGrowthAnswer(true)} className="font-sans px-6 py-3" style={{ background: hairGrowthAnswer === true ? 'rgba(201,168,76,0.12)' : 'transparent', color: hairGrowthAnswer === true ? '#C9A84C' : '#A89880', border: `1px solid ${hairGrowthAnswer === true ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>Yes</button>
              <button onClick={() => setHairGrowthAnswer(false)} className="font-sans px-6 py-3" style={{ background: hairGrowthAnswer === false ? 'rgba(201,168,76,0.12)' : 'transparent', color: hairGrowthAnswer === false ? '#C9A84C' : '#A89880', border: `1px solid ${hairGrowthAnswer === false ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>No</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8" style={{ opacity: visible ? 1 : 0, transition: 'opacity 1s ease 0.5s' }}>
          <button onClick={handleContinue} className="font-sans font-medium px-10 py-5 transition-all duration-300" style={{ fontSize: 'clamp(16px, 2vw, 20px)', background: '#C9A84C', color: '#0A0A0F', border: 'none', borderRadius: '2px', cursor: 'pointer' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#D4B96A'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#C9A84C'; }}>
            Continue →
          </button>
        </div>
      </div>
    </section>
  );
}
