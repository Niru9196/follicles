'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useStory } from '../context/StoryContext';

interface Props {
  onComplete: () => void;
}

export default function Chapter06OnsetType({ onComplete }: Props) {
  const { setOnsetType } = useStory();
  const [selected, setSelected] = useState<'gradual' | 'sudden' | null>(null);
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

  const handleSelect = (type: 'gradual' | 'sudden') => {
    setSelected(type);
    setOnsetType(type);
    setTimeout(() => onComplete(), 1200);
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
            YOUR TIMELINE
          </p>
          <h2
            className="font-serif font-light mb-4"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#F5F0E8', lineHeight: 1.1 }}
          >
            Did it happen gradually,<br />
            <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>or all at once?</span>
          </h2>
          <p className="font-sans mb-16" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A89880' }}>
            Which feels closer to your experience?
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.3s',
          }}
        >
          {/* Gradual */}
          <button
            onClick={() => handleSelect('gradual')}
            className="flex flex-col items-center p-10 text-center transition-all duration-500"
            style={{
              background: selected === 'gradual' ? 'rgba(201,168,76,0.1)' : 'rgba(245,240,232,0.03)',
              border: `2px solid ${selected === 'gradual' ? '#C9A84C' : 'rgba(245,240,232,0.08)'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: selected === 'sudden' ? 0.3 : 1,
              minHeight: '280px',
            }}
          >
            {/* Gradual animation */}
            <div className="mb-8 relative" style={{ width: 160, height: 100 }}>
              <svg viewBox="0 0 160 100" width="160" height="100">
                {/* Head silhouettes at different densities */}
                {[0, 1, 2].map(i => (
                  <g key={i} transform={`translate(${i * 50}, 0)`}>
                    <ellipse cx="30" cy="50" rx="22" ry="26" fill="rgba(245,240,232,0.08)" stroke="rgba(245,240,232,0.2)" strokeWidth="1" />
                    {/* Hair density decreasing */}
                    {Array.from({ length: Math.max(1, 6 - i * 2) }).map((_, j) => (
                      <line
                        key={j}
                        x1={18 + j * 4}
                        y1="28"
                        x2={17 + j * 4}
                        y2="42"
                        stroke={`rgba(201,168,76,${0.7 - i * 0.2})`}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    ))}
                    {/* Year label */}
                    <text x="30" y="90" textAnchor="middle" fill="rgba(168,152,128,0.5)" fontSize="9" fontFamily="DM Sans">
                      {['Year 1', 'Year 2', 'Year 4'][i]}
                    </text>
                  </g>
                ))}
                {/* Arrow */}
                <line x1="52" y1="50" x2="58" y2="50" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
                <line x1="102" y1="50" x2="108" y2="50" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
              </svg>
            </div>
            <h3
              className="font-serif font-light mb-3"
              style={{ fontSize: 'clamp(24px, 3vw, 32px)', color: selected === 'gradual' ? '#C9A84C' : '#F5F0E8' }}
            >
              Gradual
            </h3>
            <p className="font-sans" style={{ fontSize: '16px', color: '#A89880' }}>
              Over months or years
            </p>
          </button>

          {/* Sudden */}
          <button
            onClick={() => handleSelect('sudden')}
            className="flex flex-col items-center p-10 text-center transition-all duration-500"
            style={{
              background: selected === 'sudden' ? 'rgba(201,168,76,0.1)' : 'rgba(245,240,232,0.03)',
              border: `2px solid ${selected === 'sudden' ? '#C9A84C' : 'rgba(245,240,232,0.08)'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: selected === 'gradual' ? 0.3 : 1,
              minHeight: '280px',
            }}
          >
            {/* Sudden animation */}
            <div className="mb-8 relative" style={{ width: 160, height: 100 }}>
              <svg viewBox="0 0 160 100" width="160" height="100">
                {/* Before */}
                <g transform="translate(0, 0)">
                  <ellipse cx="35" cy="50" rx="28" ry="32" fill="rgba(245,240,232,0.08)" stroke="rgba(245,240,232,0.2)" strokeWidth="1" />
                  {Array.from({ length: 8 }).map((_, j) => (
                    <line key={j} x1={18 + j * 4} y1="24" x2={17 + j * 4} y2="40" stroke="rgba(201,168,76,0.7)" strokeWidth="1.5" strokeLinecap="round" />
                  ))}
                  <text x="35" y="92" textAnchor="middle" fill="rgba(168,152,128,0.5)" fontSize="9" fontFamily="DM Sans">Before</text>
                </g>

                {/* Arrow */}
                <text x="80" y="54" textAnchor="middle" fill="rgba(201,168,76,0.5)" fontSize="16">→</text>

                {/* After — falling strands */}
                <g transform="translate(95, 0)">
                  <ellipse cx="30" cy="50" rx="28" ry="32" fill="rgba(245,240,232,0.08)" stroke="rgba(245,240,232,0.2)" strokeWidth="1" />
                  {Array.from({ length: 2 }).map((_, j) => (
                    <line key={j} x1={22 + j * 8} y1="24" x2={21 + j * 8} y2="38" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                  ))}
                  {/* Falling strands */}
                  {[[15, 55, 12, 72], [22, 58, 20, 74], [30, 60, 32, 76], [38, 57, 40, 73]].map(([x1, y1, x2, y2], i) => (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                  ))}
                  <text x="30" y="92" textAnchor="middle" fill="rgba(168,152,128,0.5)" fontSize="9" fontFamily="DM Sans">Weeks later</text>
                </g>
              </svg>
            </div>
            <h3
              className="font-serif font-light mb-3"
              style={{ fontSize: 'clamp(24px, 3vw, 32px)', color: selected === 'sudden' ? '#C9A84C' : '#F5F0E8' }}
            >
              Sudden shedding
            </h3>
            <p className="font-sans" style={{ fontSize: '16px', color: '#A89880' }}>
              Noticeable within weeks
            </p>
          </button>
        </div>
      </div>
    </section>
  );
}
