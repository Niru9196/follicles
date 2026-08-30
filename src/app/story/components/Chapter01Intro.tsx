'use client';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  onBegin: () => void;
}

function HairStrand({ index }: { index: number }) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${5 + index * 7}%`,
    top: '-10%',
    width: '1.5px',
    height: `${120 + Math.sin(index) * 60}px`,
    background: `linear-gradient(180deg, transparent, rgba(201,168,76,${0.15 + (index % 4) * 0.08}), transparent)`,
    borderRadius: '50%',
    animation: `hairDrift ${8 + index * 1.3}s ease-in-out infinite`,
    animationDelay: `${index * 0.7}s`,
    transform: `rotate(${-8 + index * 2}deg)`,
  };
  return <div style={style} />;
}

export default function Chapter01Intro({ onBegin }: Props) {
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timers = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1800),
      setTimeout(() => setStep(3), 2800),
      setTimeout(() => setStep(4), 3800),
      setTimeout(() => setStep(5), 5000),
      setTimeout(() => setStep(6), 6200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const textStyle = (show: boolean, delay = 0): React.CSSProperties => ({
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0)' : 'translateY(24px)',
    filter: show ? 'blur(0)' : 'blur(6px)',
    transition: `opacity 1.2s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1.2s cubic-bezier(0.22,1,0.36,1) ${delay}ms, filter 1.2s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  });

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0A0A0F' }}
    >
      {/* Animated hair strands */}
      <style>{`
        @keyframes hairDrift {
          0%, 100% { transform: translateX(0) rotate(-6deg) scaleY(1); }
          33% { transform: translateX(12px) rotate(-2deg) scaleY(1.05); }
          66% { transform: translateX(-8px) rotate(-10deg) scaleY(0.97); }
        }
        @keyframes hairDriftAlt {
          0%, 100% { transform: translateX(0) rotate(4deg) scaleY(1); }
          50% { transform: translateX(-14px) rotate(8deg) scaleY(1.04); }
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <HairStrand key={i} index={i} />
        ))}
        {/* Radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div style={textStyle(step >= 1)}>
          <h1
            className="font-serif font-light tracking-tight leading-none mb-8"
            style={{
              fontSize: 'clamp(52px, 10vw, 108px)',
              color: '#F5F0E8',
              letterSpacing: '-0.02em',
            }}
          >
            YOUR HAIR<br />
            <span style={{ color: '#C9A84C', fontStyle: 'italic' }}>HAS A STORY.</span>
          </h1>
        </div>

        <div style={textStyle(step >= 2, 100)}>
          <p
            className="font-sans font-light mb-4"
            style={{ fontSize: 'clamp(20px, 3vw, 28px)', color: '#A89880' }}
          >
            Hair doesn&apos;t simply &ldquo;fall out.&rdquo;
          </p>
        </div>

        <div style={textStyle(step >= 3, 100)}>
          <p
            className="font-serif italic mb-6"
            style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: '#F5F0E8' }}
          >
            It changes.
          </p>
        </div>

        <div style={textStyle(step >= 4, 100)}>
          <p
            className="font-sans font-light mb-8"
            style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#A89880', lineHeight: 1.8 }}
          >
            Sometimes slowly.<br />
            Sometimes suddenly.<br />
            Sometimes after something else has changed.
          </p>
        </div>

        <div style={textStyle(step >= 5, 100)}>
          <p
            className="font-sans font-medium mb-12"
            style={{ fontSize: 'clamp(20px, 3vw, 28px)', color: '#E8D5B0' }}
          >
            Let&apos;s understand yours.
          </p>
        </div>

        <div style={textStyle(step >= 6, 100)}>
          <button
            onClick={onBegin}
            className="group relative inline-flex items-center gap-3 px-10 py-5 font-sans font-medium tracking-wide transition-all duration-500"
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: '#C9A84C',
              border: '1.5px solid rgba(201,168,76,0.5)',
              borderRadius: '2px',
              background: 'transparent',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.1)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#C9A84C';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.5)';
            }}
          >
            Explore my story
            <span
              className="transition-transform duration-300 group-hover:translate-x-1"
              style={{ fontSize: '20px' }}
            >
              →
            </span>
          </button>
          <p
            className="mt-4 font-sans"
            style={{ fontSize: '14px', color: 'rgba(168,152,128,0.6)' }}
          >
            About 5 minutes
          </p>
        </div>
      </div>

      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(transparent, #0A0A0F)' }}
      />
    </section>
  );
}
