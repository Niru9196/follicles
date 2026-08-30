'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useStory, Treatment } from '../context/StoryContext';

interface Props {
  onComplete: () => void;
}

const treatmentOptions = [
  { id: 'shampoo', label: 'Medicated Shampoo', emoji: '🧴' },
  { id: 'oil', label: 'Hair Oil', emoji: '💧' },
  { id: 'serum', label: 'Hair Serum', emoji: '✨' },
  { id: 'minoxidil', label: 'Minoxidil', emoji: '💊' },
  { id: 'supplements', label: 'Supplements', emoji: '🌿' },
  { id: 'prp', label: 'PRP', emoji: '🩸' },
  { id: 'gfc', label: 'GFC / iPRF', emoji: '🔬' },
  { id: 'other', label: 'Other', emoji: '➕' },
];

export default function Chapter12Treatments({ onComplete }: Props) {
  const { setTreatments } = useStory();
  const [mode, setMode] = useState<'choose' | 'cards' | 'voice' | 'review'>('choose');
  const [selected, setSelected] = useState<string[]>([]);
  const [treatments, setTreatmentsLocal] = useState<Treatment[]>([]);
  const [currentTreatmentIndex, setCurrentTreatmentIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
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

  const toggleTreatment = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleShowMe = () => {
    setMode('cards');
  };

  const handleTellMe = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMode('cards');
      return;
    }
    setMode('voice');
    setListening(true);
    const recognition = new (SpeechRecognition as new () => { lang: string; onresult: (e: { results: { transcript: string }[][] }) => void; onerror: () => void; onend: () => void; start: () => void })();
    recognition.lang = 'en-US';
    recognition.onresult = (e: { results: { transcript: string }[][] }) => {
      const text = e.results[0][0].transcript.toLowerCase();
      setVoiceText(text);
      const parsed: Treatment[] = [];
      if (text.includes('minoxidil')) parsed.push({ name: 'Minoxidil', duration: '', effective: null, sideEffects: '' });
      if (text.includes('oil')) parsed.push({ name: 'Hair Oil', duration: '', effective: null, sideEffects: '' });
      if (text.includes('prp')) parsed.push({ name: 'PRP', duration: '', effective: null, sideEffects: '' });
      if (text.includes('gfc')) parsed.push({ name: 'GFC', duration: '', effective: null, sideEffects: '' });
      if (text.includes('shampoo')) parsed.push({ name: 'Medicated Shampoo', duration: '', effective: null, sideEffects: '' });
      if (text.includes('supplement')) parsed.push({ name: 'Supplements', duration: '', effective: null, sideEffects: '' });
      if (parsed.length > 0) {
        setTreatmentsLocal(parsed);
        setMode('review');
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const handleCardsNext = () => {
    const t: Treatment[] = selected.map(id => {
      const opt = treatmentOptions.find(o => o.id === id);
      return { name: opt?.label || id, duration: '', effective: null, sideEffects: '' };
    });
    setTreatmentsLocal(t);
    setMode('review');
    setCurrentTreatmentIndex(0);
  };

  const handleEffectiveness = (effective: 'helped' | 'somewhat' | 'didnt') => {
    const updated = [...treatments];
    updated[currentTreatmentIndex] = { ...updated[currentTreatmentIndex], effective };
    setTreatmentsLocal(updated);
    if (currentTreatmentIndex < treatments.length - 1) {
      setTimeout(() => setCurrentTreatmentIndex(i => i + 1), 500);
    } else {
      setTreatments(updated);
      setTimeout(() => onComplete(), 800);
    }
  };

  const handleSkip = () => {
    setTreatments([]);
    onComplete();
  };

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
      style={{ background: '#0D0D14' }}
    >
      <div className="max-w-4xl mx-auto w-full">
        {mode === 'choose' && (
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
              Most people try something<br />
              <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>before they see a clinician.</span>
            </h2>
            <p className="font-sans mb-12" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A89880' }}>
              What have you tried?
            </p>

            {/* Shelf illustration */}
            <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
              {treatmentOptions.map((t, i) => (
                <div
                  key={t.id}
                  className="flex flex-col items-center gap-2 flex-shrink-0"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms`,
                  }}
                >
                  <div
                    className="rounded flex items-center justify-center"
                    style={{
                      width: 56,
                      height: 72,
                      background: 'rgba(201,168,76,0.08)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      fontSize: '28px',
                    }}
                  >
                    {t.emoji}
                  </div>
                  <span className="font-sans text-center" style={{ fontSize: '11px', color: 'rgba(168,152,128,0.6)', maxWidth: '60px' }}>
                    {t.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleShowMe}
                className="flex items-center gap-3 px-8 py-5 font-sans font-medium transition-all duration-300"
                style={{
                  fontSize: '18px',
                  background: '#C9A84C',
                  color: '#0A0A0F',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  minHeight: '60px',
                }}
              >
                👆 Show me what I&apos;ve tried
              </button>
              <button
                onClick={handleTellMe}
                className="flex items-center gap-3 px-8 py-5 font-sans font-medium transition-all duration-300"
                style={{
                  fontSize: '18px',
                  color: '#C9A84C',
                  border: '1.5px solid rgba(201,168,76,0.4)',
                  borderRadius: '2px',
                  background: 'transparent',
                  cursor: 'pointer',
                  minHeight: '60px',
                }}
              >
                🎙 Tell me
              </button>
              <button
                onClick={handleSkip}
                className="font-sans px-6 py-5 transition-all duration-300"
                style={{
                  fontSize: '16px',
                  color: '#A89880',
                  border: '1px solid rgba(168,152,128,0.2)',
                  borderRadius: '2px',
                  background: 'transparent',
                  cursor: 'pointer',
                  minHeight: '60px',
                }}
              >
                I haven&apos;t tried anything
              </button>
            </div>
          </div>
        )}

        {mode === 'cards' && (
          <div>
            <h3 className="font-serif font-light mb-8" style={{ fontSize: 'clamp(24px, 4vw, 40px)', color: '#F5F0E8' }}>
              Select what you&apos;ve tried:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {treatmentOptions.map(t => {
                const isActive = selected.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTreatment(t.id)}
                    className="flex flex-col items-center gap-3 p-6 transition-all duration-300"
                    style={{
                      background: isActive ? 'rgba(201,168,76,0.12)' : 'rgba(245,240,232,0.03)',
                      border: `1.5px solid ${isActive ? '#C9A84C' : 'rgba(245,240,232,0.08)'}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      minHeight: '110px',
                    }}
                  >
                    <span style={{ fontSize: '32px' }}>{t.emoji}</span>
                    <span className="font-sans text-center" style={{ fontSize: '14px', color: isActive ? '#C9A84C' : '#F5F0E8' }}>
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-4">
              {selected.length > 0 && (
                <button
                  onClick={handleCardsNext}
                  className="font-sans font-medium px-10 py-5 transition-all duration-300"
                  style={{
                    fontSize: '18px',
                    background: '#C9A84C',
                    color: '#0A0A0F',
                    border: 'none',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
                  Continue →
                </button>
              )}
              <button onClick={handleSkip} className="font-sans px-6 py-5" style={{ fontSize: '16px', color: '#A89880', background: 'transparent', border: '1px solid rgba(168,152,128,0.2)', borderRadius: '2px', cursor: 'pointer' }}>
                Skip
              </button>
            </div>
          </div>
        )}

        {mode === 'voice' && (
          <div className="text-center">
            <div
              className="mx-auto mb-8 rounded-full flex items-center justify-center"
              style={{
                width: 120,
                height: 120,
                background: listening ? 'rgba(201,168,76,0.15)' : 'rgba(245,240,232,0.05)',
                border: `2px solid ${listening ? '#C9A84C' : 'rgba(245,240,232,0.1)'}`,
                animation: listening ? 'pulse 1.5s ease-in-out infinite' : 'none',
              }}
            >
              <style>{`@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0.4)} 50%{box-shadow:0 0 0 16px rgba(201,168,76,0)} }`}</style>
              <span style={{ fontSize: '48px' }}>🎙</span>
            </div>
            <p className="font-sans mb-4" style={{ fontSize: '20px', color: '#F5F0E8' }}>
              {listening ? 'Listening…' : 'Processing…'}
            </p>
            {voiceText && (
              <p className="font-sans" style={{ fontSize: '16px', color: '#A89880' }}>
                Heard: &ldquo;{voiceText}&rdquo;
              </p>
            )}
          </div>
        )}

        {mode === 'review' && treatments.length > 0 && (
          <div>
            <p className="font-sans text-sm tracking-widest mb-4" style={{ color: '#C9A84C' }}>
              HERE&apos;S WHAT I HEARD
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              {treatments.map((t, i) => (
                <div
                  key={i}
                  className="px-6 py-4"
                  style={{
                    background: i === currentTreatmentIndex ? 'rgba(201,168,76,0.15)' : 'rgba(245,240,232,0.05)',
                    border: `1.5px solid ${i === currentTreatmentIndex ? '#C9A84C' : 'rgba(245,240,232,0.1)'}`,
                    borderRadius: '4px',
                  }}
                >
                  <p className="font-sans font-medium" style={{ fontSize: '18px', color: i === currentTreatmentIndex ? '#C9A84C' : '#F5F0E8' }}>
                    {t.name}
                  </p>
                  {t.effective && (
                    <p className="font-sans text-sm mt-1" style={{ color: '#A89880' }}>
                      {t.effective === 'helped' ? '✓ Helped' : t.effective === 'somewhat' ? '~ Somewhat' : '✗ Didn\'t help'}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {currentTreatmentIndex < treatments.length && (
              <div>
                <p className="font-sans font-medium mb-6" style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#F5F0E8' }}>
                  Did <span style={{ color: '#C9A84C' }}>{treatments[currentTreatmentIndex].name}</span> help?
                </p>
                <div className="flex gap-4 flex-wrap">
                  {[
                    { label: 'Yes, it helped', value: 'helped' as const },
                    { label: 'Somewhat', value: 'somewhat' as const },
                    { label: "Didn't help", value: 'didnt' as const },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleEffectiveness(opt.value)}
                      className="font-sans font-medium px-8 py-4 transition-all duration-300"
                      style={{
                        fontSize: '16px',
                        color: '#A89880',
                        border: '1.5px solid rgba(168,152,128,0.3)',
                        borderRadius: '2px',
                        background: 'transparent',
                        cursor: 'pointer',
                        minHeight: '56px',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#C9A84C'; (e.currentTarget as HTMLButtonElement).style.color = '#C9A84C'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,152,128,0.3)'; (e.currentTarget as HTMLButtonElement).style.color = '#A89880'; }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
