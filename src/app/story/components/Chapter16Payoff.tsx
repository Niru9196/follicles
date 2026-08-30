'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useStory } from '../context/StoryContext';

interface Props {
  onRestart: () => void;
}

export default function Chapter16Payoff({ onRestart }: Props) {
  const { data, clearSavedIntake } = useStory();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const patternLabels: Record<string, string> = {
    hairline: 'a changing hairline',
    crown: 'thinning at the crown',
    part: 'a widening part',
    diffuse: 'overall thinning',
    patchy: 'patchy loss',
    shedding: 'increased shedding',
  };

  const triggerLabels: Record<string, string> = {
    stress: 'a stressful period',
    weight: 'weight change',
    illness: 'illness or fever',
    surgery: 'surgery',
    environment: 'an environmental change',
    medication: 'a medication change',
  };

  const familyLabels: Record<string, string> = {
    father: 'father',
    mother: 'mother',
    siblings: 'siblings',
    noFamilyHistory: 'no known family history',
  };

  const diagnosisLabels: Record<string, string> = {
    pcos: 'PCOS / PCOD',
    thyroid: 'thyroid disorder',
    diabetes: 'diabetes',
    autoimmune: 'autoimmune disease',
    anemia: 'anemia',
    none: 'no diagnosed conditions',
  };

  const productLabels: Record<string, string> = {
    medicatedShampoos: 'medicated shampoos',
    hairOilsOrSerums: 'hair oils or serums',
    topicalMinoxidil: 'topical minoxidil',
    oralMinoxidil: 'oral minoxidil',
    supplements: 'supplements',
  };

  const habitLabels: string[] = [];
  if (data.habits.smoking.used) habitLabels.push(`smoking (${data.habits.smoking.quantity ?? 'some'})`);
  if (data.habits.alcohol) habitLabels.push('alcohol use');
  if (data.habits.hardWater) habitLabels.push('hard water');
  if (data.habits.hairWashFrequency) habitLabels.push(`wash frequency: ${data.habits.hairWashFrequency}`);
  if (data.habits.heatingOrStylingChemicals) habitLabels.push('heat / styling chemicals');
  if (data.habits.salonTreatments.used) habitLabels.push('salon treatments');

  const triedProducts = Object.entries(data.products)
    .filter(([, value]) => value.used)
    .map(([key]) => productLabels[key] || key);

  const procedureLabels: Record<string, string> = {
    prp: 'PRP',
    gfcOrIprf: 'GFC / iPRF',
    stemCellsOrExosomes: 'stem cells / exosomes',
    hairTransplant: 'hair transplant',
    other: 'other in-clinic procedure',
  };

  const completedProcedures = Object.entries(data.procedures)
    .filter(([, value]) => value.done)
    .map(([key, value]) => {
      const label = procedureLabels[key] || key;
      const sessionDetail = value.sessions ? ` (${value.sessions})` : '';
      const helpedDetail = value.helped !== undefined ? `, ${value.helped ? 'helped' : 'did not help'}` : '';
      return `${label}${sessionDetail}${helpedDetail}`;
    });

  const sideEffectSummary = data.sideEffectsPastTreatment.yesNo === null
    ? null
    : data.sideEffectsPastTreatment.yesNo
      ? `past treatment had side effects or poor response${data.sideEffectsPastTreatment.description ? `: ${data.sideEffectsPastTreatment.description}` : ''}`
      : 'past treatment did not have side effects or a poor response';

  const storyLines: Array<{ text: React.ReactNode; show: boolean }> = [
    {
      text: data.gender ? (
        <>The selected pattern was <span style={{ color: '#C9A84C', fontWeight: 600 }}>{data.gender === 'male' ? 'male' : 'female'}</span>.</>
      ) : null,
      show: !!data.gender,
    },
    {
      text: data.ageOnset ? (
        <>You first noticed changes around <span style={{ color: '#C9A84C', fontWeight: 600 }}>{data.ageOnset}</span>.</>
      ) : null,
      show: !!data.ageOnset,
    },
    {
      text: data.duration ? (
        <>The hair loss has been ongoing for <span style={{ color: '#C9A84C', fontWeight: 600 }}>{data.duration === 'under6months' ? 'under 6 months' : data.duration === '6to12months' ? '6 to 12 months' : 'over a year'}</span>.</>
      ) : null,
      show: !!data.duration,
    },
    {
      text: data.patterns.length > 0 ? (
        <>You mainly noticed <span style={{ color: '#C9A84C', fontWeight: 600 }}>{data.patterns.map(p => patternLabels[p] || p).join(', ')}</span>.</>
      ) : null,
      show: data.patterns.length > 0,
    },
    {
      text: data.onsetType ? (
        <>It happened <span style={{ color: '#C9A84C', fontWeight: 600 }}>{data.onsetType === 'gradual' ? 'gradually, over time' : 'suddenly, within weeks'}</span>.</>
      ) : null,
      show: !!data.onsetType,
    },
    {
      text: data.triggers.length > 0 ? (
        <>You remember <span style={{ color: '#C9A84C', fontWeight: 600 }}>{data.triggers.map(t => triggerLabels[t] || t).join(' and ')}</span> around that time.</>
      ) : null,
      show: data.triggers.length > 0,
    },
    {
      text: data.familyHistory.length > 0 ? (
        <>Hair thinning is present in your <span style={{ color: '#C9A84C', fontWeight: 600 }}>{data.familyHistory.map(f => familyLabels[f] || f).join(' and ')}</span>.</>
      ) : null,
      show: data.familyHistory.length > 0,
    },
    {
      text: data.diagnosedConditions.length > 0 ? (
        <>You mentioned <span style={{ color: '#C9A84C', fontWeight: 600 }}>{data.diagnosedConditions.map(item => diagnosisLabels[item] || item).join(', ')}</span> as potentially relevant.</>
      ) : null,
      show: data.diagnosedConditions.length > 0,
    },
    {
      text: data.acneOilySkinAdulthood !== null ? (
        <>Acne or oily skin in adulthood: <span style={{ color: '#C9A84C', fontWeight: 600 }}>{data.acneOilySkinAdulthood ? 'yes' : 'no'}</span>.</>
      ) : null,
      show: data.acneOilySkinAdulthood !== null,
    },
    {
      text: data.excessBodyFacialHairGrowth !== null ? (
        <>Excess body or facial hair growth: <span style={{ color: '#C9A84C', fontWeight: 600 }}>{data.excessBodyFacialHairGrowth ? 'yes' : 'no'}</span>.</>
      ) : null,
      show: data.excessBodyFacialHairGrowth !== null,
    },
    {
      text: data.gender === 'female' && (data.menstrualCycle || data.pregnancyHairLoss) ? (
        <>Hormonal context includes <span style={{ color: '#C9A84C', fontWeight: 600 }}>{[data.menstrualCycle ? `cycle: ${data.menstrualCycle}` : null, data.pregnancyHairLoss ? `pregnancy: ${data.pregnancyHairLoss}` : null].filter(Boolean).join('; ')}</span>.</>
      ) : null,
      show: data.gender === 'female' && (!!data.menstrualCycle || !!data.pregnancyHairLoss),
    },
    {
      text: triedProducts.length > 0 ? (
        <>You&apos;ve tried <span style={{ color: '#C9A84C', fontWeight: 600 }}>{triedProducts.join(', ')}</span>.</>
      ) : null,
      show: triedProducts.length > 0,
    },
    {
      text: completedProcedures.length > 0 ? (
        <>Past in-clinic care includes <span style={{ color: '#C9A84C', fontWeight: 600 }}>{completedProcedures.join(', ')}</span>.</>
      ) : null,
      show: completedProcedures.length > 0,
    },
    {
      text: sideEffectSummary ? (
        <>This includes <span style={{ color: '#C9A84C', fontWeight: 600 }}>{sideEffectSummary}</span>.</>
      ) : null,
      show: !!sideEffectSummary,
    },
    {
      text: habitLabels.length > 0 ? (
        <>Lifestyle notes include <span style={{ color: '#C9A84C', fontWeight: 600 }}>{habitLabels.join(', ')}</span>.</>
      ) : null,
      show: habitLabels.length > 0,
    },
    {
      text: data.sampleType ? (
        <>Preferred sample type: <span style={{ color: '#C9A84C', fontWeight: 600 }}>{data.sampleType}</span>.</>
      ) : null,
      show: !!data.sampleType,
    },
    {
      text: data.consentGeneticAnalysis !== null ? (
        <>Consent status: <span style={{ color: '#C9A84C', fontWeight: 600 }}>{data.consentGeneticAnalysis ? 'consented' : 'not yet consented'}</span>.</>
      ) : null,
      show: data.consentGeneticAnalysis !== null,
    },
  ].filter(l => l.show);

  const lineStyle = (i: number): React.CSSProperties => ({
    opacity: step > i ? 1 : 0,
    transform: step > i ? 'translateY(0)' : 'translateY(16px)',
    transition: 'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)',
  });

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
    const timers = storyLines.map((_, index) =>
      setTimeout(() => setStep(index + 1), 400 + index * 700)
    );
    return () => timers.forEach(clearTimeout);
  }, [visible, storyLines.length]);

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden"
      style={{ background: '#0A0A0F' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 2s ease',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto w-full">
        {/* Title */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'all 1.2s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <h1
            className="font-serif font-light text-center mb-16"
            style={{
              fontSize: 'clamp(48px, 9vw, 96px)',
              color: '#F5F0E8',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            YOUR<br />
            <span style={{ color: '#C9A84C', fontStyle: 'italic' }}>HAIR STORY</span>
          </h1>
        </div>

        {/* Story lines */}
        <div className="space-y-6 mb-16">
          {storyLines.map((line, i) => (
            <p
              key={i}
              className="font-sans"
              style={{
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                color: '#F5F0E8',
                lineHeight: 1.7,
                ...lineStyle(i),
              }}
            >
              {line.text}
            </p>
          ))}

          {storyLines.length === 0 && step > 0 && (
            <p className="font-sans" style={{ fontSize: '20px', color: '#A89880', lineHeight: 1.7 }}>
              Your story has been noted. Your clinician will guide you through the details.
            </p>
          )}
        </div>

        {/* Conclusion */}
        <div
          style={{
            opacity: step >= Math.max(6, storyLines.length - 1) ? 1 : 0,
            transform: step >= Math.max(6, storyLines.length - 1) ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div
            className="mb-10 p-8"
            style={{
              background: 'rgba(201,168,76,0.06)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '4px',
            }}
          >
            <p
              className="font-serif font-light"
              style={{ fontSize: 'clamp(20px, 3vw, 28px)', color: '#E8D5B0', lineHeight: 1.5 }}
            >
              Your clinician now has the context they need.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={() => clearSavedIntake()}
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
              Continue to consultation →
            </button>
            <button
              onClick={onRestart}
              className="font-sans px-6 py-5 transition-all duration-300"
              style={{
                fontSize: '16px',
                color: '#A89880',
                border: '1px solid rgba(168,152,128,0.2)',
                borderRadius: '2px',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              Start over
            </button>
          </div>

          <p className="font-sans mt-6" style={{ fontSize: '14px', color: 'rgba(168,152,128,0.5)' }}>
            Your responses have been saved.
          </p>
        </div>
      </div>
    </section>
  );
}
