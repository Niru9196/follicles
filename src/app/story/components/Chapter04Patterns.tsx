'use client';
import React, { useEffect, useRef, useState } from 'react';
import { PatternOption, useStory } from '../context/StoryContext';

interface Props {
  onComplete: () => void;
}

const patterns = [
  {
    id: 'recedingHairline' as const,
    label: 'A changing hairline',
    desc: 'The front hairline gradually moves back',
    svg: (active: boolean) => (
      <svg viewBox="0 0 80 80" width="64" height="64">
        <ellipse cx="40" cy="40" rx="30" ry="34" fill="rgba(245,240,232,0.1)" stroke="rgba(245,240,232,0.3)" strokeWidth="1" />
        <path d="M18 32 Q25 18 40 16 Q55 18 62 32" fill="none" stroke={active ? '#C9A84C' : 'rgba(201,168,76,0.3)'} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M22 36 Q28 22 40 20 Q52 22 58 36" fill={active ? 'rgba(201,168,76,0.2)' : 'transparent'} />
      </svg>
    ),
  },
  {
    id: 'thinningAtCrown' as const,
    label: 'Thinning at the crown',
    desc: 'Hair thins at the top of the head',
    svg: (active: boolean) => (
      <svg viewBox="0 0 80 80" width="64" height="64">
        <ellipse cx="40" cy="40" rx="30" ry="34" fill="rgba(245,240,232,0.1)" stroke="rgba(245,240,232,0.3)" strokeWidth="1" />
        <ellipse cx="40" cy="30" rx="14" ry="12" fill={active ? 'rgba(201,168,76,0.25)' : 'rgba(201,168,76,0.08)'} stroke={active ? '#C9A84C' : 'rgba(201,168,76,0.2)'} strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'wideningPartLine' as const,
    label: 'A widening part',
    desc: 'The centre parting becomes more visible',
    svg: (active: boolean) => (
      <svg viewBox="0 0 80 80" width="64" height="64">
        <ellipse cx="40" cy="40" rx="30" ry="34" fill="rgba(245,240,232,0.1)" stroke="rgba(245,240,232,0.3)" strokeWidth="1" />
        <line x1="40" y1="10" x2="40" y2="55" stroke={active ? '#C9A84C' : 'rgba(201,168,76,0.3)'} strokeWidth={active ? '3' : '1.5'} strokeLinecap="round" />
        {active && <line x1="38" y1="10" x2="38" y2="55" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />}
        {active && <line x1="42" y1="10" x2="42" y2="55" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />}
      </svg>
    ),
  },
  {
    id: 'diffuseThinning' as const,
    label: 'Overall thinning',
    desc: 'Hair density reduces across the whole scalp',
    svg: (active: boolean) => (
      <svg viewBox="0 0 80 80" width="64" height="64">
        <ellipse cx="40" cy="40" rx="30" ry="34" fill={active ? 'rgba(201,168,76,0.12)' : 'rgba(245,240,232,0.06)'} stroke="rgba(245,240,232,0.3)" strokeWidth="1" />
        {[20, 30, 40, 50, 60].map((x, i) => (
          <line key={i} x1={x} y1="20" x2={x - 2} y2="55" stroke={active ? 'rgba(201,168,76,0.5)' : 'rgba(245,240,232,0.2)'} strokeWidth="1" strokeLinecap="round" />
        ))}
      </svg>
    ),
  },
  {
    id: 'patchyLoss' as const,
    label: 'Patchy loss',
    desc: 'A small area loses hair suddenly',
    svg: (active: boolean) => (
      <svg viewBox="0 0 80 80" width="64" height="64">
        <ellipse cx="40" cy="40" rx="30" ry="34" fill="rgba(245,240,232,0.1)" stroke="rgba(245,240,232,0.3)" strokeWidth="1" />
        <ellipse cx="52" cy="35" rx="10" ry="9" fill={active ? 'rgba(201,168,76,0.2)' : 'rgba(245,240,232,0.05)'} stroke={active ? '#C9A84C' : 'rgba(201,168,76,0.2)'} strokeWidth="1.5" strokeDasharray="3 2" />
      </svg>
    ),
  },
  {
    id: 'suddenExcessiveShedding' as const,
    label: 'Increased shedding',
    desc: 'More hair than usual coming out',
    svg: (active: boolean) => (
      <svg viewBox="0 0 80 80" width="64" height="64">
        <ellipse cx="40" cy="32" rx="24" ry="26" fill="rgba(245,240,232,0.1)" stroke="rgba(245,240,232,0.3)" strokeWidth="1" />
        {[
          [20, 58, 15, 72], [30, 60, 26, 75], [40, 62, 38, 78],
          [50, 60, 52, 75], [60, 58, 63, 72],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={active ? 'rgba(201,168,76,0.6)' : 'rgba(245,240,232,0.15)'} strokeWidth="1.5" strokeLinecap="round" />
        ))}
      </svg>
    ),
  },
];

export default function Chapter04Patterns({ onComplete }: Props) {
  const { setPatterns } = useStory();
  const [selected, setSelected] = useState<PatternOption[]>([]);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const toggle = (id: PatternOption) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    setPatterns(selected);
    onComplete();
  };

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
      style={{ background: '#0D0D14' }}
    >
      <div className="max-w-5xl mx-auto w-full">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'all 1s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <p className="font-sans text-sm tracking-widest mb-4" style={{ color: '#C9A84C' }}>
            YOUR PATTERN
          </p>
          <h2
            className="font-serif font-light mb-4"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#F5F0E8', lineHeight: 1.1 }}
          >
            There&apos;s more than one<br />
            <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>kind of hair loss.</span>
          </h2>
          <p className="font-sans mb-12" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A89880' }}>
            Which one feels familiar? <span style={{ color: 'rgba(168,152,128,0.6)', fontSize: '16px' }}>You can choose more than one.</span>
          </p>
        </div>

        {/* Bento grid */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.3s',
          }}
        >
          {patterns.map((p, i) => {
            const isActive = selected.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className="flex items-center gap-5 p-6 text-left transition-all duration-400"
                style={{
                  background: isActive ? 'rgba(201,168,76,0.1)' : 'rgba(245,240,232,0.03)',
                  border: `1.5px solid ${isActive ? '#C9A84C' : 'rgba(245,240,232,0.08)'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms`,
                  minHeight: '100px',
                }}
              >
                <div className="flex-shrink-0">{p.svg(isActive)}</div>
                <div>
                  <p
                    className="font-sans font-medium mb-1"
                    style={{ fontSize: '18px', color: isActive ? '#C9A84C' : '#F5F0E8' }}
                  >
                    {p.label}
                  </p>
                  <p className="font-sans" style={{ fontSize: '14px', color: '#A89880', lineHeight: 1.5 }}>
                    {p.desc}
                  </p>
                </div>
                {isActive && (
                  <div
                    className="ml-auto flex-shrink-0 flex items-center justify-center rounded-full"
                    style={{ width: 28, height: 28, background: '#C9A84C', color: '#0A0A0F', fontSize: '14px', fontWeight: 700 }}
                  >
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {selected.length > 0 && (
          <div
            className="mt-10 flex justify-center"
            style={{ animation: 'fadeInUp 0.5s ease' }}
          >
            <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
            <button
              onClick={handleContinue}
              className="font-sans font-medium px-10 py-5 transition-all duration-300"
              style={{
                fontSize: 'clamp(16px, 2vw, 20px)',
                background: '#C9A84C',
                color: '#0A0A0F',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#D4B96A'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#C9A84C'; }}
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
