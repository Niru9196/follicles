'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useStory } from '../context/StoryContext';

interface Props {
  onComplete: () => void;
}

const triggerItems = [
  { id: 'stress', emoji: '😮‍💨', label: 'Stress' },
  { id: 'weight', emoji: '⚖️', label: 'Weight change' },
  { id: 'illness', emoji: '🤒', label: 'Illness or fever' },
  { id: 'surgery', emoji: '🏥', label: 'Surgery' },
  { id: 'environment', emoji: '🏠', label: 'New environment or water' },
  { id: 'medication', emoji: '💊', label: 'Medication change' },
  { id: 'none', emoji: '✓', label: 'None of these' },
];

const lifeEvents = ['Stress', 'Illness', 'Weight change', 'Surgery', 'Environment', 'Medication', 'Lifestyle'];

export default function Chapter07Triggers({ onComplete }: Props) {
  const { setTriggers } = useStory();
  const [selected, setSelected] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [timelineStep, setTimelineStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setTimelineStep(s => (s < lifeEvents.length - 1 ? s + 1 : s));
    }, 400);
    return () => clearInterval(interval);
  }, [visible]);

  const toggle = (id: string) => {
    if (id === 'none') {
      setSelected(['none']);
      return;
    }
    setSelected(prev => {
      const without = prev.filter(x => x !== 'none');
      return without.includes(id) ? without.filter(x => x !== id) : [...without, id];
    });
  };

  const handleContinue = () => {
    setTriggers(selected.filter(x => x !== 'none'));
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
            Sometimes something else<br />
            <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>changes first.</span>
          </h2>
          <p className="font-sans mb-12" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A89880', lineHeight: 1.7 }}>
            Hair changes sometimes follow a life event by weeks or even months.
          </p>
        </div>

        {/* Life timeline */}
        <div
          className="flex items-center gap-0 mb-16 overflow-x-auto pb-4"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.3s',
          }}
        >
          {lifeEvents.map((event, i) => (
            <React.Fragment key={i}>
              <div
                className="flex flex-col items-center flex-shrink-0"
                style={{
                  opacity: i <= timelineStep ? 1 : 0.1,
                  transform: i <= timelineStep ? 'translateY(0)' : 'translateY(8px)',
                  transition: `all 0.5s ease ${i * 100}ms`,
                }}
              >
                <div
                  className="rounded-full flex items-center justify-center mb-2"
                  style={{
                    width: 44,
                    height: 44,
                    background: i <= timelineStep ? 'rgba(201,168,76,0.15)' : 'rgba(245,240,232,0.05)',
                    border: `1px solid ${i <= timelineStep ? 'rgba(201,168,76,0.4)' : 'rgba(245,240,232,0.1)'}`,
                    fontSize: '18px',
                  }}
                >
                  {['😮‍💨', '🤒', '⚖️', '🏥', '🏠', '💊', '🌿'][i]}
                </div>
                <span className="font-sans text-center" style={{ fontSize: '11px', color: 'rgba(168,152,128,0.7)', maxWidth: '60px' }}>
                  {event}
                </span>
              </div>
              {i < lifeEvents.length - 1 && (
                <div
                  style={{
                    width: '24px',
                    height: '1px',
                    background: i < timelineStep ? 'rgba(201,168,76,0.3)' : 'rgba(245,240,232,0.1)',
                    flexShrink: 0,
                    transition: `background 0.5s ease ${i * 100}ms`,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.5s',
          }}
        >
          <p className="font-sans font-medium mb-8" style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#F5F0E8' }}>
            Thinking back over the last 6–12 months…
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {triggerItems.map((item, i) => {
              const isActive = selected.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className="flex flex-col items-center justify-center gap-3 p-6 transition-all duration-300"
                  style={{
                    background: isActive ? 'rgba(201,168,76,0.12)' : 'rgba(245,240,232,0.03)',
                    border: `1.5px solid ${isActive ? '#C9A84C' : 'rgba(245,240,232,0.08)'}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    minHeight: '120px',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(16px)',
                    transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms`,
                  }}
                >
                  <span style={{ fontSize: '32px' }}>{item.emoji}</span>
                  <span
                    className="font-sans font-medium text-center"
                    style={{ fontSize: '15px', color: isActive ? '#C9A84C' : '#F5F0E8', lineHeight: 1.3 }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {selected.length > 0 && (
            <div className="flex justify-center mt-10">
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
      </div>
    </section>
  );
}
