'use client';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  onComplete: () => void;
}

const phases = [
  {
    id: 'anagen',
    label: 'ANAGEN',
    sublabel: 'Growth Phase',
    desc: 'The hair actively grows from the follicle. This phase lasts 2–7 years.',
    color: '#C9A84C',
    hairHeight: 80,
  },
  {
    id: 'catagen',
    label: 'CATAGEN',
    sublabel: 'Transition Phase',
    desc: 'Growth slows. The follicle begins to shrink. Lasts about 2–3 weeks.',
    color: '#8B6F47',
    hairHeight: 50,
  },
  {
    id: 'telogen',
    label: 'TELOGEN',
    sublabel: 'Resting Phase',
    desc: 'The hair rests and eventually detaches. Lasts around 3 months.',
    color: '#52796F',
    hairHeight: 30,
  },
  {
    id: 'exogen',
    label: 'EXOGEN',
    sublabel: 'Shedding & Renewal',
    desc: 'The old hair sheds and a new cycle begins. 50–100 hairs shed daily is normal.',
    color: '#A89880',
    hairHeight: 10,
  },
];

function FollicleIllustration({ phase }: { phase: number }) {
  const p = phases[phase];
  return (
    <svg viewBox="0 0 120 200" width="120" height="200" style={{ overflow: 'visible' }}>
      {/* Scalp surface */}
      <ellipse cx="60" cy="100" rx="50" ry="12" fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.2)" strokeWidth="1" />

      {/* Follicle bulb */}
      <ellipse
        cx="60"
        cy={120}
        rx={12}
        ry={8}
        fill="rgba(201,168,76,0.15)"
        stroke={p.color}
        strokeWidth="1.5"
        style={{ transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)' }}
      />

      {/* Follicle shaft */}
      <rect
        x="56"
        y={120 - p.hairHeight}
        width="8"
        height={p.hairHeight}
        rx="4"
        fill={p.color}
        style={{ transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)' }}
      />

      {/* Hair strand above scalp */}
      {phase < 3 && (
        <rect
          x="58"
          y={100 - (p.hairHeight - 20)}
          width="4"
          height={Math.max(0, p.hairHeight - 20)}
          rx="2"
          fill={p.color}
          opacity={phase === 2 ? 0.4 : 0.9}
          style={{ transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)' }}
        />
      )}

      {/* Falling strands for exogen */}
      {phase === 3 && (
        <>
          <line x1="40" y1="95" x2="35" y2="130" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="55" y1="90" x2="48" y2="125" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="70" y1="92" x2="75" y2="128" stroke="rgba(201,168,76,0.35)" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}

      {/* Phase indicator dots */}
      {phases.map((ph, i) => (
        <circle
          key={i}
          cx={20 + i * 27}
          cy={185}
          r={i === phase ? 5 : 3}
          fill={i === phase ? ph.color : 'rgba(201,168,76,0.2)'}
          style={{ transition: 'all 0.4s ease' }}
        />
      ))}
    </svg>
  );
}

export default function Chapter02HairCycle({ onComplete }: Props) {
  const [activePhase, setActivePhase] = useState(0);
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

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setActivePhase(p => (p + 1) % 4);
    }, 2200);
    return () => clearInterval(interval);
  }, [visible]);

  const ph = phases[activePhase];

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
      style={{ background: '#0D0D14' }}
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Heading */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'all 1s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <p className="font-sans text-sm tracking-widest mb-4" style={{ color: '#C9A84C' }}>
            THE BASICS
          </p>
          <h2
            className="font-serif font-light mb-6"
            style={{ fontSize: 'clamp(36px, 6vw, 64px)', color: '#F5F0E8', lineHeight: 1.1 }}
          >
            What actually happens<br />
            <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>when we lose hair?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-12">
          {/* Follicle animation */}
          <div
            className="flex flex-col items-center"
            style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 1s ease 0.3s',
            }}
          >
            <div
              className="relative flex items-center justify-center rounded-full mb-8"
              style={{
                width: 220,
                height: 220,
                background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
                border: '1px solid rgba(201,168,76,0.1)',
              }}
            >
              <FollicleIllustration phase={activePhase} />
            </div>

            {/* Phase tabs */}
            <div className="flex gap-2 flex-wrap justify-center">
              {phases.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhase(i)}
                  className="px-4 py-2 font-sans text-xs tracking-widest transition-all duration-300"
                  style={{
                    background: i === activePhase ? 'rgba(201,168,76,0.15)' : 'transparent',
                    border: `1px solid ${i === activePhase ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`,
                    color: i === activePhase ? '#C9A84C' : 'rgba(168,152,128,0.6)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text content */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(24px)',
              transition: 'all 1s cubic-bezier(0.22,1,0.36,1) 0.4s',
            }}
          >
            <div
              key={activePhase}
              style={{
                animation: 'fadeInUp 0.6s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
              <h3
                className="font-serif font-light mb-2"
                style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: ph.color }}
              >
                {ph.sublabel}
              </h3>
              <p className="font-sans mb-8" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A89880', lineHeight: 1.7 }}>
                {ph.desc}
              </p>
            </div>

            <div className="space-y-6 mt-8">
              <p className="font-sans" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#F5F0E8', lineHeight: 1.7 }}>
                Losing 50–100 hairs a day is{' '}
                <span style={{ color: '#C9A84C' }}>completely normal.</span>
              </p>
              <p className="font-sans" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A89880', lineHeight: 1.7 }}>
                The interesting part is what happens when that balance shifts.
              </p>
              <p className="font-sans font-medium" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#E8D5B0', lineHeight: 1.7 }}>
                And that shift can look very different from person to person.
              </p>
            </div>

            <button
              onClick={onComplete}
              className="mt-10 font-sans font-medium px-8 py-4 transition-all duration-300"
              style={{
                fontSize: 'clamp(16px, 2vw, 18px)',
                color: '#C9A84C',
                border: '1px solid rgba(201,168,76,0.4)',
                borderRadius: '2px',
                background: 'transparent',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
