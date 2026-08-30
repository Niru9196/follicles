'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useStory } from '../context/StoryContext';

interface Props {
  onComplete: () => void;
}

export default function Chapter05Timeline({ onComplete }: Props) {
  const { setAgeOnset } = useStory();
  const [age, setAge] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getAgeFromPosition = useCallback((clientX: number) => {
    if (!trackRef.current) return null;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(10 + ratio * 60); // 10 to 70
  }, []);

  const handleTrackInteraction = (clientX: number) => {
    const newAge = getAgeFromPosition(clientX);
    if (newAge !== null) setAge(newAge);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    handleTrackInteraction(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) handleTrackInteraction(e.clientX);
  };

  const handleMouseUp = () => { isDragging.current = false; };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleTrackInteraction(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleTrackInteraction(e.touches[0].clientX);
  };

  const handleConfirm = () => {
    if (age !== null) {
      setAgeOnset(age);
      setConfirmed(true);
      setTimeout(() => onComplete(), 1500);
    }
  };

  const handleVoice = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Please use the slider.');
      return;
    }
    const recognition = new (SpeechRecognition as new () => { lang: string; onresult: (e: { results: { transcript: string }[][] }) => void; onerror: () => void; onend: () => void; start: () => void })();
    recognition.lang = 'en-US';
    setListening(true);
    recognition.onresult = (e: { results: { transcript: string }[][] }) => {
      const text = e.results[0][0].transcript;
      setVoiceText(text);
      const match = text.match(/\d+/);
      if (match) {
        const parsed = parseInt(match[0]);
        if (parsed >= 5 && parsed <= 90) {
          setAge(parsed);
        }
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const ratio = age !== null ? (age - 10) / 60 : null;

  const markers = [10, 20, 30, 40, 50, 60, 70];

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
            YOUR TIMELINE
          </p>
          <h2
            className="font-serif font-light mb-4"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#F5F0E8', lineHeight: 1.1 }}
          >
            Every hair story<br />
            <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>starts somewhere.</span>
          </h2>
          <p className="font-sans mb-16" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A89880' }}>
            Think back to when you first noticed a change.
          </p>
        </div>

        {/* Age display */}
        <div
          className="text-center mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.3s',
          }}
        >
          {age !== null ? (
            <div>
              <p className="font-sans mb-2" style={{ fontSize: '18px', color: '#A89880' }}>Around</p>
              <p
                className="font-serif font-light"
                style={{ fontSize: 'clamp(72px, 14vw, 120px)', color: '#C9A84C', lineHeight: 1, letterSpacing: '-0.03em' }}
              >
                {age}
              </p>
            </div>
          ) : (
            <p className="font-sans" style={{ fontSize: '20px', color: 'rgba(168,152,128,0.4)' }}>
              Drag the timeline below
            </p>
          )}
        </div>

        {/* Timeline track */}
        <div
          ref={trackRef}
          className="relative select-none mb-6"
          style={{
            cursor: 'pointer',
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.4s',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {/* Track bar */}
          <div
            className="relative h-2 rounded-full"
            style={{ background: 'rgba(201,168,76,0.15)' }}
          >
            {/* Filled portion */}
            {ratio !== null && (
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  width: `${ratio * 100}%`,
                  background: 'linear-gradient(90deg, #8B6F47, #C9A84C)',
                  transition: 'width 0.1s ease',
                }}
              />
            )}

            {/* Handle */}
            {ratio !== null && (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"
                style={{
                  left: `${ratio * 100}%`,
                  width: 28,
                  height: 28,
                  background: '#C9A84C',
                  boxShadow: '0 0 0 4px rgba(201,168,76,0.2)',
                  transition: 'left 0.1s ease',
                }}
              />
            )}
          </div>

          {/* Markers */}
          <div className="flex justify-between mt-4">
            {markers.map(m => (
              <span
                key={m}
                className="font-sans"
                style={{
                  fontSize: '14px',
                  color: age !== null && Math.abs(age - m) < 5 ? '#C9A84C' : 'rgba(168,152,128,0.5)',
                  transition: 'color 0.3s ease',
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Voice option */}
        <div
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.5s',
          }}
        >
          <button
            onClick={handleVoice}
            className="flex items-center gap-3 px-6 py-4 font-sans transition-all duration-300"
            style={{
              fontSize: '16px',
              color: listening ? '#C9A84C' : '#A89880',
              border: `1px solid ${listening ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`,
              borderRadius: '2px',
              background: listening ? 'rgba(201,168,76,0.08)' : 'transparent',
              cursor: 'pointer',
              minHeight: '56px',
            }}
          >
            <span style={{ fontSize: '20px' }}>{listening ? '🔴' : '🎙'}</span>
            {listening ? 'Listening…' : "I'd rather tell you"}
          </button>

          {voiceText && (
            <p className="font-sans text-sm" style={{ color: '#A89880' }}>
              Heard: &ldquo;{voiceText}&rdquo;
            </p>
          )}
        </div>

        {age !== null && !confirmed && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleConfirm}
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
              Around {age} — got it →
            </button>
          </div>
        )}

        {confirmed && (
          <div className="flex justify-center mt-10">
            <p className="font-sans font-medium" style={{ fontSize: '24px', color: '#C9A84C' }}>
              Around {age} — got it. ✓
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
