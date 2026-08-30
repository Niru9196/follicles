'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useStory } from '../context/StoryContext';

interface Props {
  onComplete: () => void;
}

function MaleFigure({ selected, hovered }: { selected: boolean; hovered: boolean }) {
  return (
    <svg viewBox="0 0 160 280" width="160" height="280">
      {/* Body */}
      <ellipse cx="80" cy="50" rx="28" ry="32" fill="rgba(245,240,232,0.15)" stroke="rgba(245,240,232,0.4)" strokeWidth="1.5" />
      <rect x="52" y="78" width="56" height="80" rx="8" fill="rgba(245,240,232,0.1)" stroke="rgba(245,240,232,0.3)" strokeWidth="1.5" />
      <rect x="30" y="82" width="22" height="60" rx="8" fill="rgba(245,240,232,0.08)" stroke="rgba(245,240,232,0.25)" strokeWidth="1.5" />
      <rect x="108" y="82" width="22" height="60" rx="8" fill="rgba(245,240,232,0.08)" stroke="rgba(245,240,232,0.25)" strokeWidth="1.5" />
      <rect x="58" y="158" width="20" height="70" rx="8" fill="rgba(245,240,232,0.08)" stroke="rgba(245,240,232,0.25)" strokeWidth="1.5" />
      <rect x="82" y="158" width="20" height="70" rx="8" fill="rgba(245,240,232,0.08)" stroke="rgba(245,240,232,0.25)" strokeWidth="1.5" />

      {/* Hair on head */}
      <ellipse cx="80" cy="30" rx="26" ry="18" fill="rgba(201,168,76,0.3)" stroke="rgba(201,168,76,0.5)" strokeWidth="1" />

      {/* Receding hairline highlight */}
      <path
        d="M54 32 Q60 20 80 18 Q100 20 106 32"
        fill="none"
        stroke={selected || hovered ? '#C9A84C' : 'rgba(201,168,76,0.2)'}
        strokeWidth="2.5"
        strokeDasharray={selected ? '0' : '4 3'}
        style={{ transition: 'all 0.5s ease' }}
      />

      {/* Temple thinning */}
      <ellipse
        cx="56"
        cy="38"
        rx="8"
        ry="6"
        fill={selected || hovered ? 'rgba(201,168,76,0.25)' : 'transparent'}
        stroke={selected || hovered ? '#C9A84C' : 'transparent'}
        strokeWidth="1"
        style={{ transition: 'all 0.5s ease' }}
      />
      <ellipse
        cx="104"
        cy="38"
        rx="8"
        ry="6"
        fill={selected || hovered ? 'rgba(201,168,76,0.25)' : 'transparent'}
        stroke={selected || hovered ? '#C9A84C' : 'transparent'}
        strokeWidth="1"
        style={{ transition: 'all 0.5s ease' }}
      />

      {/* Crown thinning */}
      <ellipse
        cx="80"
        cy="22"
        rx="10"
        ry="8"
        fill={selected || hovered ? 'rgba(201,168,76,0.3)' : 'transparent'}
        stroke={selected || hovered ? '#C9A84C' : 'transparent'}
        strokeWidth="1.5"
        style={{ transition: 'all 0.5s ease' }}
      />

      {/* Selection glow */}
      {selected && (
        <ellipse cx="80" cy="140" rx="75" ry="135" fill="none" stroke="#C9A84C" strokeWidth="2" opacity="0.4" />
      )}
    </svg>
  );
}

function FemaleFigure({ selected, hovered }: { selected: boolean; hovered: boolean }) {
  return (
    <svg viewBox="0 0 160 280" width="160" height="280">
      {/* Body */}
      <ellipse cx="80" cy="50" rx="28" ry="32" fill="rgba(245,240,232,0.15)" stroke="rgba(245,240,232,0.4)" strokeWidth="1.5" />
      <path d="M52 78 Q40 120 45 158 L115 158 Q120 120 108 78 Z" fill="rgba(245,240,232,0.1)" stroke="rgba(245,240,232,0.3)" strokeWidth="1.5" />
      <rect x="28" y="82" width="20" height="58" rx="8" fill="rgba(245,240,232,0.08)" stroke="rgba(245,240,232,0.25)" strokeWidth="1.5" />
      <rect x="112" y="82" width="20" height="58" rx="8" fill="rgba(245,240,232,0.08)" stroke="rgba(245,240,232,0.25)" strokeWidth="1.5" />
      <rect x="58" y="158" width="18" height="70" rx="8" fill="rgba(245,240,232,0.08)" stroke="rgba(245,240,232,0.25)" strokeWidth="1.5" />
      <rect x="84" y="158" width="18" height="70" rx="8" fill="rgba(245,240,232,0.08)" stroke="rgba(245,240,232,0.25)" strokeWidth="1.5" />

      {/* Hair - longer */}
      <path d="M52 40 Q50 80 55 100" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="3" strokeLinecap="round" />
      <path d="M108 40 Q110 80 105 100" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="80" cy="28" rx="28" ry="20" fill="rgba(201,168,76,0.25)" stroke="rgba(201,168,76,0.4)" strokeWidth="1" />

      {/* Widening part */}
      <line
        x1="80"
        y1="14"
        x2="80"
        y2="42"
        stroke={selected || hovered ? '#C9A84C' : 'rgba(201,168,76,0.2)'}
        strokeWidth={selected || hovered ? '2.5' : '1'}
        style={{ transition: 'all 0.5s ease' }}
      />

      {/* Diffuse thinning overlay */}
      {(selected || hovered) && (
        <>
          <ellipse cx="65" cy="26" rx="10" ry="8" fill="rgba(201,168,76,0.15)" />
          <ellipse cx="95" cy="26" rx="10" ry="8" fill="rgba(201,168,76,0.15)" />
          <ellipse cx="80" cy="20" rx="12" ry="8" fill="rgba(201,168,76,0.2)" />
        </>
      )}

      {/* Selection glow */}
      {selected && (
        <ellipse cx="80" cy="140" rx="75" ry="135" fill="none" stroke="#C9A84C" strokeWidth="2" opacity="0.4" />
      )}
    </svg>
  );
}

export default function Chapter03GenderSelect({ onComplete }: Props) {
  const { setGender } = useStory();
  const [selected, setSelected] = useState<'male' | 'female' | null>(null);
  const [hoveredMale, setHoveredMale] = useState(false);
  const [hoveredFemale, setHoveredFemale] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
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

  const handleSelect = (g: 'male' | 'female') => {
    setSelected(g);
    setGender(g);
    setConfirmed(true);
    setTimeout(() => onComplete(), 1800);
  };

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
      style={{ background: '#0A0A0F' }}
    >
      <div className="max-w-5xl mx-auto w-full text-center">
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
            Hair loss doesn&apos;t look<br />
            <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>the same on everyone.</span>
          </h2>
          <p className="font-sans mb-16" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A89880' }}>
            Which looks more like you?
          </p>
        </div>

        <div
          className="flex flex-col sm:flex-row gap-8 justify-center items-center"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.4s',
          }}
        >
          {/* Male */}
          <button
            onClick={() => handleSelect('male')}
            onMouseEnter={() => setHoveredMale(true)}
            onMouseLeave={() => setHoveredMale(false)}
            className="flex flex-col items-center gap-4 p-8 transition-all duration-500"
            style={{
              background: selected === 'male' ? 'rgba(201,168,76,0.08)' : 'transparent',
              border: `2px solid ${selected === 'male' ? '#C9A84C' : hoveredMale ? 'rgba(201,168,76,0.4)' : 'rgba(245,240,232,0.1)'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: selected === 'female' ? 0.3 : 1,
              transform: selected === 'male' ? 'scale(1.03)' : 'scale(1)',
              minWidth: '200px',
            }}
          >
            <MaleFigure selected={selected === 'male'} hovered={hoveredMale} />
            <div>
              <p className="font-sans font-medium" style={{ fontSize: '18px', color: '#F5F0E8' }}>Male pattern</p>
              <p className="font-sans text-sm mt-1" style={{ color: '#A89880' }}>Hairline · Temples · Crown</p>
            </div>
          </button>

          {/* Female */}
          <button
            onClick={() => handleSelect('female')}
            onMouseEnter={() => setHoveredFemale(true)}
            onMouseLeave={() => setHoveredFemale(false)}
            className="flex flex-col items-center gap-4 p-8 transition-all duration-500"
            style={{
              background: selected === 'female' ? 'rgba(201,168,76,0.08)' : 'transparent',
              border: `2px solid ${selected === 'female' ? '#C9A84C' : hoveredFemale ? 'rgba(201,168,76,0.4)' : 'rgba(245,240,232,0.1)'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: selected === 'male' ? 0.3 : 1,
              transform: selected === 'female' ? 'scale(1.03)' : 'scale(1)',
              minWidth: '200px',
            }}
          >
            <FemaleFigure selected={selected === 'female'} hovered={hoveredFemale} />
            <div>
              <p className="font-sans font-medium" style={{ fontSize: '18px', color: '#F5F0E8' }}>Female pattern</p>
              <p className="font-sans text-sm mt-1" style={{ color: '#A89880' }}>Part · Diffuse · Overall thinning</p>
            </div>
          </button>
        </div>

        {confirmed && (
          <div
            className="mt-10 font-sans font-medium"
            style={{
              fontSize: '24px',
              color: '#C9A84C',
              animation: 'fadeInUp 0.6s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
            Got it. ✓
          </div>
        )}
      </div>
    </section>
  );
}
