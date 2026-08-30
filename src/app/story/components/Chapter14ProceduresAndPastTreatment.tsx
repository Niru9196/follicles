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

export default function Chapter14ProceduresAndPastTreatment({ onComplete }: Props) {
  const { data, setProcedures, setSideEffectsPastTreatment } = useStory();
  const [procedureState, setProcedureState] = useState<Record<ProcedureName, { done: boolean | null; sessions?: '1to3' | '4to6' | 'over6'; helped?: boolean | null; other?: string }>>({
    prp: data.procedures.prp ?? { done: null },
    gfcOrIprf: data.procedures.gfcOrIprf ?? { done: null },
    stemCellsOrExosomes: data.procedures.stemCellsOrExosomes ?? { done: null },
    hairTransplant: data.procedures.hairTransplant ?? { done: null },
    other: data.procedures.other ?? { done: null },
  });
  const [pastTreatmentYesNo, setPastTreatmentYesNo] = useState<boolean | null>(data.sideEffectsPastTreatment.yesNo ?? null);
  const [description, setDescription] = useState(data.sideEffectsPastTreatment.description ?? '');
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const updateProcedure = (key: ProcedureName, patch: Partial<{ done: boolean | null; sessions?: '1to3' | '4to6' | 'over6'; helped?: boolean | null; other?: string }>) => {
    setProcedureState(prev => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
  };

  const rowKeyForProcedure = (item: { done: boolean | null; sessions?: '1to3' | '4to6' | 'over6'; helped?: boolean | null; other?: string }) => {
    return procedureRows.find(row => procedureState[row.key] === item)?.key;
  };

  const hasAnyProcedureAnswered = Object.values(procedureState).some(item => item.done !== null);
  const hasProcedureFollowUpsComplete = Object.values(procedureState).every(item => {
    if (item.done === null) return true;
    if (item.done === false) return true;
    if (!item.sessions) return false;
    if (item.helped === null || item.helped === undefined) return false;
    const rowKey = rowKeyForProcedure(item);
    if (rowKey === 'other') return !!item.other?.trim();
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
                    <div className="flex gap-3 flex-wrap">
                      <button onClick={() => updateProcedure(row.key, { done: true })} className="font-sans px-6 py-3" style={{ background: entry.done === true ? 'rgba(201,168,76,0.12)' : 'transparent', color: entry.done === true ? '#C9A84C' : '#A89880', border: `1px solid ${entry.done === true ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>Yes</button>
                      <button onClick={() => updateProcedure(row.key, { done: false, sessions: undefined, helped: undefined, other: undefined })} className="font-sans px-6 py-3" style={{ background: entry.done === false ? 'rgba(201,168,76,0.12)' : 'transparent', color: entry.done === false ? '#C9A84C' : '#A89880', border: `1px solid ${entry.done === false ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>No</button>
                    </div>
                  </div>

                  {entry.done && (
                    <div className="mt-5 space-y-5" style={{ animation: 'fadeInUp 0.5s ease' }}>
                      <div>
                        <p className="font-sans mb-3" style={{ color: '#F5F0E8' }}>Sessions</p>
                        <div className="flex gap-3 flex-wrap">
                          {procedureOptions.map(option => (
                            <button key={option.value} onClick={() => updateProcedure(row.key, { sessions: option.value })} className="font-sans px-4 py-3" style={{ background: entry.sessions === option.value ? 'rgba(201,168,76,0.12)' : 'transparent', color: entry.sessions === option.value ? '#C9A84C' : '#A89880', border: `1px solid ${entry.sessions === option.value ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>{option.label}</button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="font-sans mb-3" style={{ color: '#F5F0E8' }}>Helped?</p>
                        <div className="flex gap-3 flex-wrap">
                          <button onClick={() => updateProcedure(row.key, { helped: true })} className="font-sans px-6 py-3" style={{ background: entry.helped === true ? 'rgba(201,168,76,0.12)' : 'transparent', color: entry.helped === true ? '#C9A84C' : '#A89880', border: `1px solid ${entry.helped === true ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>Yes</button>
                          <button onClick={() => updateProcedure(row.key, { helped: false })} className="font-sans px-6 py-3" style={{ background: entry.helped === false ? 'rgba(201,168,76,0.12)' : 'transparent', color: entry.helped === false ? '#C9A84C' : '#A89880', border: `1px solid ${entry.helped === false ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>No</button>
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
            <div className="flex gap-3 flex-wrap mb-5">
              <button onClick={() => setPastTreatmentYesNo(true)} className="font-sans px-6 py-3" style={{ background: pastTreatmentYesNo === true ? 'rgba(201,168,76,0.12)' : 'transparent', color: pastTreatmentYesNo === true ? '#C9A84C' : '#A89880', border: `1px solid ${pastTreatmentYesNo === true ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>Yes</button>
              <button onClick={() => setPastTreatmentYesNo(false)} className="font-sans px-6 py-3" style={{ background: pastTreatmentYesNo === false ? 'rgba(201,168,76,0.12)' : 'transparent', color: pastTreatmentYesNo === false ? '#C9A84C' : '#A89880', border: `1px solid ${pastTreatmentYesNo === false ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>No</button>
            </div>
            {pastTreatmentYesNo && (
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Please describe" className="w-full max-w-xl p-4" style={{ background: 'rgba(245,240,232,0.02)', border: '1px solid rgba(168,152,128,0.3)', color: '#F5F0E8', borderRadius: '2px' }} />
            )}
          </div>

          {canContinue && (
            <div className="flex justify-center mt-10">
              <button onClick={handleContinue} className="font-sans font-medium px-10 py-5 transition-all duration-300" style={{ fontSize: 'clamp(16px, 2vw, 20px)', background: '#C9A84C', color: '#0A0A0F', border: 'none', borderRadius: '2px', cursor: 'pointer' }}>
                Continue →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
