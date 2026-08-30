'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useStory } from '../context/StoryContext';

interface Props {
  onComplete: () => void;
}

export default function Chapter15Consent({ onComplete }: Props) {
  const { setSamplePreference, setConsent } = useStory();
  const [sampleChoice, setSampleChoice] = useState<'saliva' | 'blood' | 'either' | null>(null);
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSample = (s: 'saliva' | 'blood' | 'either') => {
    setSampleChoice(s);
    setSamplePreference(s);
  };

  const handleConsent = (c: boolean) => {
    setConsentGiven(c);
    setConsent(c);
    setTimeout(() => onComplete(), 1000);
  };

  const sampleOptions = [
    { id: 'saliva' as const, emoji: '🧪', label: 'Saliva', desc: 'A simple swab' },
    { id: 'blood' as const, emoji: '🩸', label: 'Blood', desc: 'A small blood draw' },
    { id: 'either' as const, emoji: '↔️', label: 'Either', desc: "I\'m comfortable with either" },
  ];

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
      style={{ background: '#0D0D14' }}
    >
      <div className="max-w-3xl mx-auto w-full">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'all 1s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <p className="font-sans text-sm tracking-widest mb-4" style={{ color: '#C9A84C' }}>
            ONE LAST THING
          </p>
          <h2
            className="font-serif font-light mb-8"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#F5F0E8', lineHeight: 1.1 }}
          >
            One last thing.
          </h2>
          <p className="font-sans mb-12" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A89880', lineHeight: 1.7 }}>
            Your clinician may recommend collecting a small sample as part of your evaluation. This helps provide a more complete picture.
          </p>
        </div>

        {/* Sample options */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.3s',
          }}
        >
          {sampleOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleSample(opt.id)}
              className="flex flex-col items-center gap-4 p-8 transition-all duration-300"
              style={{
                background: sampleChoice === opt.id ? 'rgba(201,168,76,0.12)' : 'rgba(245,240,232,0.03)',
                border: `2px solid ${sampleChoice === opt.id ? '#C9A84C' : 'rgba(245,240,232,0.08)'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                minHeight: '160px',
              }}
            >
              <span style={{ fontSize: '40px' }}>{opt.emoji}</span>
              <div className="text-center">
                <p
                  className="font-sans font-medium mb-1"
                  style={{ fontSize: '20px', color: sampleChoice === opt.id ? '#C9A84C' : '#F5F0E8' }}
                >
                  {opt.label}
                </p>
                <p className="font-sans" style={{ fontSize: '14px', color: '#A89880' }}>
                  {opt.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Consent */}
        {sampleChoice && (
          <div
            style={{
              animation: 'fadeInUp 0.6s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
            <div
              className="p-8 mb-8"
              style={{
                background: 'rgba(245,240,232,0.03)',
                border: '1px solid rgba(245,240,232,0.08)',
                borderRadius: '4px',
              }}
            >
              <p className="font-sans font-medium mb-2" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#F5F0E8' }}>
                Are you comfortable consenting to sample collection and genetic analysis?
              </p>
              <p className="font-sans" style={{ fontSize: '14px', color: '#A89880' }}>
                Your data will be handled in accordance with applicable privacy regulations.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleConsent(true)}
                className="font-sans font-medium px-10 py-5 transition-all duration-300"
                style={{
                  fontSize: '18px',
                  background: consentGiven === true ? '#C9A84C' : 'transparent',
                  color: consentGiven === true ? '#0A0A0F' : '#C9A84C',
                  border: '1.5px solid rgba(201,168,76,0.5)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  minHeight: '60px',
                }}
              >
                Yes, I consent
              </button>
              <button
                onClick={() => handleConsent(false)}
                className="font-sans font-medium px-10 py-5 transition-all duration-300"
                style={{
                  fontSize: '18px',
                  background: consentGiven === false ? 'rgba(245,240,232,0.08)' : 'transparent',
                  color: '#A89880',
                  border: '1.5px solid rgba(168,152,128,0.3)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  minHeight: '60px',
                }}
              >
                No, not right now
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
