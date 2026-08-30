'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useStory } from '../context/StoryContext';

interface Props {
  onComplete: () => void;
}

const familyMembers = [
  { id: 'father', label: 'Father', x: 30, y: 20 },
  { id: 'mother', label: 'Mother', x: 70, y: 20 },
  { id: 'you', label: 'You', x: 50, y: 55, isCenter: true },
  { id: 'brother', label: 'Brother', x: 25, y: 85 },
  { id: 'sister', label: 'Sister', x: 75, y: 85 },
];

export default function Chapter09FamilyHistory({ onComplete }: Props) {
  const { setFamilyHistory } = useStory();
  const [selected, setSelected] = useState<string[]>([]);
  const [noneSelected, setNoneSelected] = useState(false);
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

  const toggle = (id: string) => {
    if (id === 'you') return;
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
    setFamilyHistory(selected);
    onComplete();
  };

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
      style={{ background: '#0A0A0F' }}
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
            Sometimes our hair story has<br />
            <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>a family chapter too.</span>
          </h2>
          <p className="font-sans mb-12" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A89880' }}>
            Does hair thinning or loss run in your family? Tap anyone it applies to.
          </p>
        </div>

        {/* Family tree */}
        <div
          className="flex justify-center mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.3s',
          }}
        >
          <div className="relative" style={{ width: '100%', maxWidth: '400px', height: '320px' }}>
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Parents to you */}
              <line x1="30" y1="28" x2="50" y2="52" stroke="rgba(201,168,76,0.2)" strokeWidth="0.5" />
              <line x1="70" y1="28" x2="50" y2="52" stroke="rgba(201,168,76,0.2)" strokeWidth="0.5" />
              {/* You to siblings */}
              <line x1="50" y1="63" x2="25" y2="82" stroke="rgba(201,168,76,0.2)" strokeWidth="0.5" />
              <line x1="50" y1="63" x2="75" y2="82" stroke="rgba(201,168,76,0.2)" strokeWidth="0.5" />
            </svg>

            {familyMembers.map(member => {
              const isActive = selected.includes(member.id);
              const isCenter = member.isCenter;
              return (
                <button
                  key={member.id}
                  onClick={() => toggle(member.id)}
                  className="absolute flex flex-col items-center gap-1 transition-all duration-300"
                  style={{
                    left: `${member.x}%`,
                    top: `${member.y}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: isCenter ? 'default' : 'pointer',
                    zIndex: 10,
                  }}
                >
                  <div
                    className="rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      width: isCenter ? 64 : 56,
                      height: isCenter ? 64 : 56,
                      background: isCenter
                        ? 'rgba(201,168,76,0.15)'
                        : isActive
                        ? 'rgba(201,168,76,0.2)'
                        : 'rgba(245,240,232,0.06)',
                      border: `2px solid ${isCenter ? '#C9A84C' : isActive ? '#C9A84C' : 'rgba(245,240,232,0.15)'}`,
                      boxShadow: isActive ? '0 0 16px rgba(201,168,76,0.3)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: isCenter ? '24px' : '20px' }}>
                      {isCenter ? '👤' : member.id === 'father' || member.id === 'brother' ? '👨' : '👩'}
                    </span>
                  </div>
                  <span
                    className="font-sans font-medium"
                    style={{
                      fontSize: '13px',
                      color: isActive ? '#C9A84C' : isCenter ? '#F5F0E8' : '#A89880',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {member.label}
                    {isActive && ' ✓'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* None button */}
        <div
          className="flex justify-center mb-8"
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
            None / Not applicable
          </button>
        </div>

        {(selected.length > 0 || noneSelected) && (
          <div className="flex justify-center">
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
