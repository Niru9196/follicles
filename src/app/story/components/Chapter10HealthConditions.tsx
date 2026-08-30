'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useStory } from '../context/StoryContext';

interface Props {
  onComplete: () => void;
}

const conditions = [
  {
    id: 'thyroid',
    emoji: '🦋',
    label: 'Thyroid',
    desc: 'Thyroid conditions can affect hair growth cycles',
  },
  {
    id: 'anaemia',
    emoji: '🩸',
    label: 'Blood / Anaemia',
    desc: 'Low iron is a common and treatable cause of hair loss',
  },
  {
    id: 'hormones',
    emoji: '⚖️',
    label: 'Hormones',
    desc: 'Hormonal imbalances can disrupt the hair cycle',
  },
  {
    id: 'diabetes',
    emoji: '🍬',
    label: 'Diabetes',
    desc: 'Blood sugar levels can influence hair health',
  },
  {
    id: 'immune',
    emoji: '🛡️',
    label: 'Immune system',
    desc: 'Some immune conditions affect hair follicles directly',
  },
];

export default function Chapter10HealthConditions({ onComplete }: Props) {
  const { setHealthConditions } = useStory();
  const [selected, setSelected] = useState<string[]>([]);
  const [noneSelected, setNoneSelected] = useState(false);
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

  const toggle = (id: string) => {
    setNoneSelected(false);
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleNone = () => {
    setSelected([]);
    setNoneSelected(true);
  };

  const handleContinue = () => {
    setHealthConditions(selected);
    onComplete();
  };

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
      style={{ background: '#0D0D14' }}
    >
      <div className="max-w-4xl mx-auto w-full">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'all 1s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <p className="font-sans text-sm tracking-widest mb-4" style={{ color: '#C9A84C' }}>
            WHAT MIGHT INFLUENCE IT
          </p>
          <h2
            className="font-serif font-light mb-4"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#F5F0E8', lineHeight: 1.1 }}
          >
            Your body can sometimes<br />
            <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>tell part of the story.</span>
          </h2>
          <p className="font-sans mb-4" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A89880', lineHeight: 1.7 }}>
            Some health conditions can be relevant when understanding hair changes.
          </p>
          <p className="font-sans mb-12" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#F5F0E8' }}>
            Has a doctor ever mentioned any of these in relation to you?
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.3s',
          }}
        >
          {conditions.map((c, i) => {
            const isActive = selected.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className="flex items-start gap-4 p-6 text-left transition-all duration-300"
                style={{
                  background: isActive ? 'rgba(201,168,76,0.1)' : 'rgba(245,240,232,0.03)',
                  border: `1.5px solid ${isActive ? '#C9A84C' : 'rgba(245,240,232,0.08)'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(16px)',
                  transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms`,
                  minHeight: '100px',
                }}
              >
                <span style={{ fontSize: '32px', flexShrink: 0 }}>{c.emoji}</span>
                <div>
                  <p
                    className="font-sans font-medium mb-1"
                    style={{ fontSize: '18px', color: isActive ? '#C9A84C' : '#F5F0E8' }}
                  >
                    {c.label}
                  </p>
                  <p className="font-sans" style={{ fontSize: '14px', color: '#A89880', lineHeight: 1.5 }}>
                    {c.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.5s',
          }}
        >
          <button
            onClick={handleNone}
            className="font-sans px-8 py-4 transition-all duration-300"
            style={{
              fontSize: '16px',
              color: noneSelected ? '#C9A84C' : '#A89880',
              border: `1px solid ${noneSelected ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`,
              borderRadius: '2px',
              background: noneSelected ? 'rgba(201,168,76,0.08)' : 'transparent',
              cursor: 'pointer',
              minHeight: '56px',
            }}
          >
            None / Not sure
          </button>

          {(selected.length > 0 || noneSelected) && (
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
          )}
        </div>
      </div>
    </section>
  );
}
