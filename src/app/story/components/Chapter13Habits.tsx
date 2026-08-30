'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useStory } from '../context/StoryContext';

interface Props {
  onComplete: () => void;
}

const habitItems = [
  { id: 'smoking', emoji: '🚬', label: 'Smoking' },
  { id: 'alcohol', emoji: '🍷', label: 'Alcohol' },
  { id: 'washing', emoji: '🚿', label: 'Daily hair washing' },
  { id: 'heat', emoji: '🔥', label: 'Heat styling' },
  { id: 'chemical', emoji: '🧪', label: 'Chemical treatments' },
  { id: 'salon', emoji: '✂️', label: 'Regular salon treatments' },
  { id: 'stress', emoji: '😰', label: 'High stress' },
  { id: 'sleep', emoji: '😴', label: 'Poor sleep' },
];

const daySteps = [
  { emoji: '☀️', label: 'Morning' },
  { emoji: '💼', label: 'Work' },
  { emoji: '🏋️', label: 'Gym' },
  { emoji: '🚿', label: 'Shower' },
  { emoji: '💇', label: 'Styling' },
  { emoji: '🌙', label: 'Night' },
];

export default function Chapter13Habits({ onComplete }: Props) {
  const { setHabits } = useStory();
  const [selected, setSelected] = useState<string[]>([]);
  const [noneSelected, setNoneSelected] = useState(false);
  const [dayStep, setDayStep] = useState(0);
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

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setDayStep(s => (s + 1) % daySteps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [visible]);

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
    setHabits(selected);
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
            TREATMENTS
          </p>
          <h2
            className="font-serif font-light mb-4"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#F5F0E8', lineHeight: 1.1 }}
          >
            A few things<br />
            <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>about your day.</span>
          </h2>
        </div>

        {/* Animated day cycle */}
        <div
          className="flex items-center justify-center gap-3 mb-12 overflow-x-auto pb-2"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.3s',
          }}
        >
          {daySteps.map((step, i) => (
            <React.Fragment key={i}>
              <div
                className="flex flex-col items-center gap-2 flex-shrink-0 transition-all duration-500"
                style={{
                  opacity: i === dayStep ? 1 : 0.3,
                  transform: i === dayStep ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: 52,
                    height: 52,
                    background: i === dayStep ? 'rgba(201,168,76,0.15)' : 'rgba(245,240,232,0.05)',
                    border: `1px solid ${i === dayStep ? '#C9A84C' : 'rgba(245,240,232,0.1)'}`,
                    fontSize: '22px',
                  }}
                >
                  {step.emoji}
                </div>
                <span className="font-sans" style={{ fontSize: '11px', color: i === dayStep ? '#C9A84C' : 'rgba(168,152,128,0.5)' }}>
                  {step.label}
                </span>
              </div>
              {i < daySteps.length - 1 && (
                <div style={{ width: '16px', height: '1px', background: 'rgba(201,168,76,0.2)', flexShrink: 0 }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.4s',
          }}
        >
          {habitItems.map((item, i) => {
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
                  minHeight: '110px',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(16px)',
                  transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms`,
                }}
              >
                <span style={{ fontSize: '32px' }}>{item.emoji}</span>
                <span
                  className="font-sans font-medium text-center"
                  style={{ fontSize: '14px', color: isActive ? '#C9A84C' : '#F5F0E8', lineHeight: 1.3 }}
                >
                  {item.label}
                </span>
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
            None of these
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
