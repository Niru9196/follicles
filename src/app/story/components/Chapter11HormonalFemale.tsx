'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useStory } from '../context/StoryContext';

interface Props {
  onComplete: () => void;
}

export default function Chapter11HormonalFemale({ onComplete }: Props) {
  const { setHormonalData } = useStory();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ regularCycle: boolean | null; pcos: boolean | null; pregnancyRelated: boolean | null }>({
    regularCycle: null,
    pcos: null,
    pregnancyRelated: null,
  });
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

  const questions = [
    { key: 'regularCycle', question: 'Is your menstrual cycle regular?' },
    { key: 'pcos', question: 'Has a doctor ever mentioned PCOS or PCOD?' },
    { key: 'pregnancyRelated', question: 'Did your hair change during or after a pregnancy?' },
  ];

  const handleAnswer = (key: string, value: boolean | null) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    if (step < questions.length - 1) {
      setTimeout(() => setStep(s => s + 1), 600);
    } else {
      setHormonalData(updated);
      setTimeout(() => onComplete(), 800);
    }
  };

  const AnswerButton = ({ label, value, questionKey }: { label: string; value: boolean | null; questionKey: string }) => {
    const currentAnswer = answers[questionKey as keyof typeof answers];
    const isSelected = currentAnswer === value;
    return (
      <button
        onClick={() => handleAnswer(questionKey, value)}
        className="font-sans font-medium px-8 py-4 transition-all duration-300"
        style={{
          fontSize: '18px',
          background: isSelected ? 'rgba(201,168,76,0.15)' : 'transparent',
          color: isSelected ? '#C9A84C' : '#A89880',
          border: `1.5px solid ${isSelected ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`,
          borderRadius: '2px',
          cursor: 'pointer',
          minHeight: '56px',
          minWidth: '120px',
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
      style={{ background: '#0A0A0F' }}
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
            WHAT MIGHT INFLUENCE IT
          </p>
          <h2
            className="font-serif font-light mb-6"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#F5F0E8', lineHeight: 1.2 }}
          >
            For women, hormonal changes can be<br />
            <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>an important part of the picture.</span>
          </h2>
          <p className="font-sans mb-16" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A89880', lineHeight: 1.7 }}>
            Hormonal changes — from cycles, pregnancy, or conditions like PCOS — can influence the hair-growth cycle.
          </p>
        </div>

        {/* Subtle calendar/cycle visual */}
        <div
          className="flex justify-center mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.3s',
          }}
        >
          <svg viewBox="0 0 200 60" width="200" height="60">
            {Array.from({ length: 28 }).map((_, i) => (
              <circle
                key={i}
                cx={8 + (i % 14) * 14}
                cy={i < 14 ? 20 : 40}
                r={i === 0 || i === 14 ? 6 : 4}
                fill={i < 14 ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.15)'}
                stroke={i === 0 || i === 14 ? '#C9A84C' : 'none'}
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>

        {/* Progressive questions */}
        <div className="space-y-10">
          {questions.slice(0, step + 1).map((q, i) => (
            <div
              key={q.key}
              style={{
                opacity: visible ? 1 : 0,
                animation: i === step ? 'fadeInUp 0.6s cubic-bezier(0.22,1,0.36,1)' : 'none',
              }}
            >
              <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
              <p
                className="font-sans font-medium mb-6"
                style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#F5F0E8' }}
              >
                {q.question}
              </p>
              <div className="flex gap-4 flex-wrap">
                <AnswerButton label="Yes" value={true} questionKey={q.key} />
                <AnswerButton label="No" value={false} questionKey={q.key} />
                <AnswerButton label="Not sure" value={null} questionKey={q.key} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
