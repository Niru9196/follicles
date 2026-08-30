'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ProcedureName, useStory } from '../context/StoryContext';

interface Props { onComplete: () => void; }

const procedureRows: Array<{ key: ProcedureName; label: string }> = [
  { key: 'prp', label: 'PRP' },
  { key: 'gfcOrIprf', label: 'GFC or iPRF' },
  { key: 'stemCellsOrExosomes', label: 'Stem cells or exosomes' },
  { key: 'hairTransplant', label: 'Hair transplant' },
  { key: 'other', label: 'Other' },
];

type ProcedureEntry = { done: boolean | null; sessions?: '1to3' | '4to6' | 'over6'; helped?: boolean | null; other?: string };

// Small style helper — keeps the repeated selected/unselected button styling in one place
const optionButtonStyle = (selected: boolean) => ({
  background: selected ? 'rgba(201,168,76,0.12)' : 'transparent',
  color: selected ? '#C9A84C' : '#A89880',
  border: `1px solid ${selected ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`,
  borderRadius: '2px',
  cursor: 'pointer',
});

export default function Chapter14ProceduresAndPastTreatment({ onComplete }: Props) {
  const { data, setProcedures, setSideEffectsPastTreatment } = useStory();
  const [procedureState, setProcedureState] = useState<Record<ProcedureName, ProcedureEntry>>({
    prp: data.procedures.prp ?? { done: null },
    gfcOrIprf: data.procedures.gfcOrIprf ?? { done: null },
    stemCellsOrExosomes: data.procedures.stemCellsOrExosomes ?? { done: null },
    hairTransplant: data.procedures.hairTransplant ?? { done: null },
    other: data.procedures.other ?? { done: null },
  });
  const [pastTreatmentYesNo, setPastTreatmentYesNo] = useState<boolean | null>(data.sideEffectsPastTreatment.yesNo ?? null);
  const [description, setDescription] = useState(data.sideEffectsPastTreatment.description ?? '');
  const [listening, setListening] = useState(false);
  const [voiceHint, setVoiceHint] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Stop any in-flight recognition if the patient navigates away mid-listen
  useEffect(() => {
    return () => { recognitionRef.current?.stop(); };
  }, []);

  const updateProcedure = (key: ProcedureName, patch: Partial<ProcedureEntry>) => {
    setProcedureState(prev => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
  };

  const hasAnyProcedureAnswered = Object.values(procedureState).some(item => item.done !== null);
  const hasProcedureFollowUpsComplete = Object.entries(procedureState).every(([key, item]) => {
    if (item.done === null) return true;
    if (item.done === false) return true;
    if (!item.sessions) return false;
    if (item.helped === null || item.helped === undefined) return false;
    if (key === 'other') return !!item.other?.trim();
    return true;
  });
  const canContinue = hasAnyProcedureAnswered && hasProcedureFollowUpsComplete && pastTreatmentYesNo !== null &&
    (pastTreatmentYesNo === false || description.trim().length > 0);

  const handleContinue = () => {
    setProcedures(procedureState);
    setSideEffectsPastTreatment({ yesNo: pastTreatmentYesNo, description: description.trim() });
    onComplete();
  };

  const procedureOptions = [
    { label: '1-3', value: '1to3' as const },
    { label: '4-6', value: '4to6' as const },
    { label: 'Over 6', value: 'over6' as const },
  ];

  const handleVoiceDescription = () => {
    if (typeof window === 'undefined') return;

    // Tap again while listening = stop, rather than stacking a second recognition instance
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    type SpeechRecognitionCtor = new () => SpeechRecognitionLike;
    type SpeechRecognitionLike = {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: ((event: SpeechRecognitionEventLike) => void) | null;
      onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
      onend: (() => void) | null;
      start: () => void;
      stop: () => void;
    };
    type SpeechRecognitionEventLike = {
      results: ArrayLike<ArrayLike<{ transcript: string }>>;
    };
    type SpeechRecognitionErrorLike = {
      error: string;
    };

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // No alert() — fall back to the visible textarea silently, same as if the patient just typed
      setVoiceSupported(false);
      setVoiceHint("Voice isn't available in this browser — you can type instead.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-IN'; // Indian English / Hinglish accuracy
    recognition.continuous = false;
    recognition.interimResults = false;
    setVoiceHint('');
    setListening(true);

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || '')
        .join(' ')
        .trim();

      if (transcript) {
        setDescription(prev => (prev ? `${prev} ${transcript}` : transcript));
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorLike) => {
      setListening(false);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setVoiceHint('Mic access is off — you can type instead.');
      } else if (event.error === 'no-speech') {
        setVoiceHint("Didn't catch that — try again when ready.");
      } else {
        setVoiceHint('Something went wrong — try again, or type instead.');
      }
    };

    recognition.onend = () => setListening(false);
    recognition.start();
  };

  return (
    <section ref={ref} className="min-h-screen flex flex-col items-center justify-center px-6 py-24" style={{ background: '#0A0A0F' }}>
      <div className="max-w-5xl mx-auto w-full">
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'all 1s cubic-bezier(0.22,1,0.36,1)' }}>
          <p className="font-sans text-sm tracking-widest mb-4" style={{ color: '#C9A84C' }}>CURRENT HAIR CARE & TREATMENTS</p>
          <h2 className="font-serif font-light mb-4" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#F5F0E8', lineHeight: 1.1 }}>
            Past procedures can shape<br />
            <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>what is happening now.</span>
          </h2>
          <p className="font-sans mb-6" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A89880', lineHeight: 1.7 }}>
            Previous scalp treatments can sometimes cause irritation, stress the follicles, or affect how well your scalp responds to future care.
            We ask about these details so we can understand what has already been tried and avoid repeating approaches that may not be helping.
          </p>
        </div>

        <div className="space-y-8 mt-12" style={{ opacity: visible ? 1 : 0, transition: 'opacity 1s ease 0.4s' }}>
          <div className="space-y-6">
            <div className="rounded border p-5 mb-2" style={{ borderColor: 'rgba(201,168,76,0.2)', background: 'rgba(245,240,232,0.02)' }}>
              <p className="font-sans" style={{ color: '#F5F0E8', lineHeight: 1.7 }}>
                These answers help us understand whether past in-clinic care changed your scalp, affected shedding, or gave you a visible benefit.
              </p>
            </div>
            {procedureRows.map((row) => {
              const entry = procedureState[row.key];
              return (
                <div key={row.key} className="rounded border p-5" style={{ borderColor: 'rgba(201,168,76,0.2)', background: 'rgba(245,240,232,0.02)' }}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <p className="font-sans font-medium" style={{ fontSize: '20px', color: '#F5F0E8' }}>{row.label}</p>
                    <div className="flex gap-3 flex-wrap" role="group" aria-label={`${row.label} — done`}>
                      <button aria-pressed={entry.done === true} onClick={() => updateProcedure(row.key, { done: true })} className="font-sans px-6 py-3" style={optionButtonStyle(entry.done === true)}>Yes</button>
                      <button aria-pressed={entry.done === false} onClick={() => updateProcedure(row.key, { done: false, sessions: undefined, helped: undefined, other: undefined })} className="font-sans px-6 py-3" style={optionButtonStyle(entry.done === false)}>No</button>
                    </div>
                  </div>

                  {entry.done && (
                    <div className="mt-5 space-y-5" style={{ animation: 'fadeInUp 0.5s ease' }}>
                      <div>
                        <p className="font-sans mb-3" style={{ color: '#F5F0E8' }}>Sessions</p>
                        <div className="flex gap-3 flex-wrap" role="group" aria-label={`${row.label} — sessions`}>
                          {procedureOptions.map(option => (
                            <button key={option.value} aria-pressed={entry.sessions === option.value} onClick={() => updateProcedure(row.key, { sessions: option.value })} className="font-sans px-4 py-3" style={optionButtonStyle(entry.sessions === option.value)}>{option.label}</button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="font-sans mb-3" style={{ color: '#F5F0E8' }}>Helped?</p>
                        <div className="flex gap-3 flex-wrap" role="group" aria-label={`${row.label} — helped`}>
                          <button aria-pressed={entry.helped === true} onClick={() => updateProcedure(row.key, { helped: true })} className="font-sans px-6 py-3" style={optionButtonStyle(entry.helped === true)}>Yes</button>
                          <button aria-pressed={entry.helped === false} onClick={() => updateProcedure(row.key, { helped: false })} className="font-sans px-6 py-3" style={optionButtonStyle(entry.helped === false)}>No</button>
                        </div>
                      </div>

                      {row.key === 'other' && (
                        <div>
                          <p className="font-sans mb-3" style={{ color: '#F5F0E8' }}>Please specify</p>
                          <input value={entry.other ?? ''} onChange={e => updateProcedure(row.key, { other: e.target.value })} className="w-full max-w-md px-4 py-3" style={{ background: 'rgba(245,240,232,0.02)', border: '1px solid rgba(168,152,128,0.3)', color: '#F5F0E8', borderRadius: '2px' }} placeholder="Other procedure" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded border p-5" style={{ borderColor: 'rgba(201,168,76,0.2)', background: 'rgba(245,240,232,0.02)' }}>
            <p className="font-sans font-medium mb-4" style={{ fontSize: '20px', color: '#F5F0E8' }}>Side effects or poor response to past treatment</p>
            <div className="flex gap-3 flex-wrap mb-5" role="group" aria-label="Side effects or poor response">
              <button aria-pressed={pastTreatmentYesNo === true} onClick={() => setPastTreatmentYesNo(true)} className="font-sans px-6 py-3" style={optionButtonStyle(pastTreatmentYesNo === true)}>Yes</button>
              <button aria-pressed={pastTreatmentYesNo === false} onClick={() => setPastTreatmentYesNo(false)} className="font-sans px-6 py-3" style={optionButtonStyle(pastTreatmentYesNo === false)}>No</button>
            </div>
            {pastTreatmentYesNo && (
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center justify-between gap-3">
                  <label className="font-sans" style={{ color: '#A89880' }}>Describe what happened</label>
                  <button
                    type="button"
                    onClick={handleVoiceDescription}
                    className="font-sans px-4 py-2"
                    style={optionButtonStyle(listening)}
                  >
                    {listening ? 'Listening… tap to stop' : voiceSupported ? 'Use voice' : 'Type instead'}
                  </button>
                </div>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Please describe" className="w-full p-4" style={{ background: 'rgba(245,240,232,0.02)', border: '1px solid rgba(168,152,128,0.3)', color: '#F5F0E8', borderRadius: '2px' }} />
                {voiceHint && (
                  <p className="font-sans text-sm" style={{ color: '#A89880' }} role="status" aria-live="polite">{voiceHint}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-3 mt-10">
            {!canContinue && (
              <p className="font-sans text-sm" style={{ color: '#A89880' }}>
                Answer each procedure and the side-effects question to continue.
              </p>
            )}
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className="font-sans font-medium px-10 py-5 transition-all duration-300"
              style={{
                fontSize: 'clamp(16px, 2vw, 20px)',
                background: canContinue ? '#C9A84C' : 'rgba(201,168,76,0.25)',
                color: canContinue ? '#0A0A0F' : 'rgba(10,10,15,0.6)',
                border: 'none',
                borderRadius: '2px',
                cursor: canContinue ? 'pointer' : 'not-allowed',
              }}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}