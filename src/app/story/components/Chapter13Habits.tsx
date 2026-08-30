'use client';
import React, { useEffect, useRef, useState } from 'react';
import { HairWashFrequency, SmokingQuantity, useStory } from '../context/StoryContext';

interface Props { onComplete: () => void; }

const smokingOptions: Array<{ label: string; value: SmokingQuantity }> = [
  { label: 'Under 5 a day', value: 'under5' },
  { label: '5–10 a day', value: '5to10' },
  { label: 'Over 10 a day', value: 'over10' },
];

const hairWashOptions: Array<{ label: string; value: HairWashFrequency }> = [
  { label: 'Daily', value: 'daily' },
  { label: 'Alternate days', value: 'alternateDays' },
  { label: 'Weekly', value: 'weekly' },
];

const salonOptions = ['Keratin', 'Rebonding', 'Smoothening', 'Other'];

export default function Chapter13Habits({ onComplete }: Props) {
  const { setHabits } = useStory();
  const [smokingUsed, setSmokingUsed] = useState<boolean | null>(null);
  const [smokingQuantity, setSmokingQuantity] = useState<SmokingQuantity | null>(null);
  const [alcohol, setAlcohol] = useState<boolean | null>(null);
  const [hardWater, setHardWater] = useState<boolean | null>(null);
  const [hairWashFrequency, setHairWashFrequency] = useState<HairWashFrequency | null>(null);
  const [heatingOrStylingChemicals, setHeatingOrStylingChemicals] = useState<boolean | null>(null);
  const [salonTreatmentsUsed, setSalonTreatmentsUsed] = useState<boolean | null>(null);
  const [salonSelections, setSalonSelections] = useState<string[]>([]);
  const [salonOther, setSalonOther] = useState('');
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const toggleSalon = (value: string) => {
    setSalonSelections(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const questionOrder = [
    'smoking',
    'alcohol',
    'hardWater',
    'hairWashFrequency',
    'heatingOrStylingChemicals',
    'salonTreatments',
  ] as const;

  const answered = {
    smoking: smokingUsed !== null && (smokingUsed === false || smokingQuantity !== null),
    alcohol: alcohol !== null,
    hardWater: hardWater !== null,
    hairWashFrequency: hairWashFrequency !== null,
    heatingOrStylingChemicals: heatingOrStylingChemicals !== null,
    salonTreatments:
      salonTreatmentsUsed !== null &&
      (salonTreatmentsUsed === false || salonSelections.length > 0) &&
      (salonTreatmentsUsed === false || !salonSelections.includes('Other') || salonOther.trim().length > 0),
  };

  const currentQuestionIndex = questionOrder.findIndex(question => !answered[question]);
  const currentQuestion = currentQuestionIndex === -1 ? 'done' : questionOrder[currentQuestionIndex];

  useEffect(() => {
    if (currentQuestion !== 'done') return;

    const timer = setTimeout(() => {
      setHabits({
        smoking: {
          used: smokingUsed,
          quantity: smokingUsed === true ? smokingQuantity ?? null : null,
        },
        alcohol,
        hardWater,
        hairWashFrequency,
        heatingOrStylingChemicals,
        salonTreatments: {
          used: salonTreatmentsUsed,
          treatments: salonTreatmentsUsed === true ? salonSelections : [],
          other: salonTreatmentsUsed === true && salonSelections.includes('Other') ? salonOther : undefined,
        },
      });
      onComplete();
    }, 350);

    return () => clearTimeout(timer);
  }, [currentQuestion, smokingUsed, smokingQuantity, alcohol, hardWater, hairWashFrequency, heatingOrStylingChemicals, salonTreatmentsUsed, salonSelections, salonOther, setHabits, onComplete]);

  return (
    <section ref={ref} className="min-h-screen flex flex-col items-center justify-center px-6 py-24" style={{ background: '#0A0A0F' }}>
      <div className="max-w-4xl mx-auto w-full">
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'all 1s cubic-bezier(0.22,1,0.36,1)' }}>
          <p className="font-sans text-sm tracking-widest mb-4" style={{ color: '#C9A84C' }}>C · LIFESTYLE AND ENVIRONMENTAL TRIGGERS</p>
          <h2 className="font-serif font-light mb-4" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#F5F0E8', lineHeight: 1.1 }}>
            A few things<br />
            <span style={{ fontStyle: 'italic', color: '#C9A84C' }}>about your day.</span>
          </h2>
        </div>

        <div className="space-y-8 mt-12" style={{ opacity: visible ? 1 : 0, transition: 'opacity 1s ease 0.4s' }}>
          {currentQuestion === 'smoking' && (
            <div>
              <p className="font-sans font-medium mb-3" style={{ fontSize: '20px', color: '#F5F0E8' }}>Smoking</p>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => { setSmokingUsed(true); setSmokingQuantity(null); }} className="font-sans px-6 py-3" style={{ background: smokingUsed === true ? 'rgba(201,168,76,0.12)' : 'transparent', color: smokingUsed === true ? '#C9A84C' : '#A89880', border: `1px solid ${smokingUsed === true ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>Yes</button>
                <button onClick={() => { setSmokingUsed(false); setSmokingQuantity(null); }} className="font-sans px-6 py-3" style={{ background: smokingUsed === false ? 'rgba(201,168,76,0.12)' : 'transparent', color: smokingUsed === false ? '#C9A84C' : '#A89880', border: `1px solid ${smokingUsed === false ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>No</button>
              </div>
              {smokingUsed && (
                <div className="mt-4 flex gap-3 flex-wrap">
                  {smokingOptions.map(option => (
                    <button key={option.value} onClick={() => setSmokingQuantity(option.value)} className="font-sans px-4 py-3" style={{ background: smokingQuantity === option.value ? 'rgba(201,168,76,0.12)' : 'transparent', color: smokingQuantity === option.value ? '#C9A84C' : '#A89880', border: `1px solid ${smokingQuantity === option.value ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>{option.label}</button>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentQuestion === 'alcohol' && (
            <div>
              <p className="font-sans font-medium mb-3" style={{ fontSize: '20px', color: '#F5F0E8' }}>Alcohol</p>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => setAlcohol(true)} className="font-sans px-6 py-3" style={{ background: alcohol === true ? 'rgba(201,168,76,0.12)' : 'transparent', color: alcohol === true ? '#C9A84C' : '#A89880', border: `1px solid ${alcohol === true ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>Yes</button>
                <button onClick={() => setAlcohol(false)} className="font-sans px-6 py-3" style={{ background: alcohol === false ? 'rgba(201,168,76,0.12)' : 'transparent', color: alcohol === false ? '#C9A84C' : '#A89880', border: `1px solid ${alcohol === false ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>No</button>
              </div>
            </div>
          )}

          {currentQuestion === 'hardWater' && (
            <div>
              <p className="font-sans font-medium mb-3" style={{ fontSize: '20px', color: '#F5F0E8' }}>Hard water for hair wash</p>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => setHardWater(true)} className="font-sans px-6 py-3" style={{ background: hardWater === true ? 'rgba(201,168,76,0.12)' : 'transparent', color: hardWater === true ? '#C9A84C' : '#A89880', border: `1px solid ${hardWater === true ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>Yes</button>
                <button onClick={() => setHardWater(false)} className="font-sans px-6 py-3" style={{ background: hardWater === false ? 'rgba(201,168,76,0.12)' : 'transparent', color: hardWater === false ? '#C9A84C' : '#A89880', border: `1px solid ${hardWater === false ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>No</button>
              </div>
            </div>
          )}

          {currentQuestion === 'hairWashFrequency' && (
            <div>
              <p className="font-sans font-medium mb-3" style={{ fontSize: '20px', color: '#F5F0E8' }}>Hair wash frequency</p>
              <div className="flex gap-3 flex-wrap">
                {hairWashOptions.map(option => (
                  <button key={option.value} onClick={() => setHairWashFrequency(option.value)} className="font-sans px-5 py-3" style={{ background: hairWashFrequency === option.value ? 'rgba(201,168,76,0.12)' : 'transparent', color: hairWashFrequency === option.value ? '#C9A84C' : '#A89880', border: `1px solid ${hairWashFrequency === option.value ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>{option.label}</button>
                ))}
              </div>
            </div>
          )}

          {currentQuestion === 'heatingOrStylingChemicals' && (
            <div>
              <p className="font-sans font-medium mb-3" style={{ fontSize: '20px', color: '#F5F0E8' }}>Heating tools or styling chemicals</p>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => setHeatingOrStylingChemicals(true)} className="font-sans px-6 py-3" style={{ background: heatingOrStylingChemicals === true ? 'rgba(201,168,76,0.12)' : 'transparent', color: heatingOrStylingChemicals === true ? '#C9A84C' : '#A89880', border: `1px solid ${heatingOrStylingChemicals === true ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>Yes</button>
                <button onClick={() => setHeatingOrStylingChemicals(false)} className="font-sans px-6 py-3" style={{ background: heatingOrStylingChemicals === false ? 'rgba(201,168,76,0.12)' : 'transparent', color: heatingOrStylingChemicals === false ? '#C9A84C' : '#A89880', border: `1px solid ${heatingOrStylingChemicals === false ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>No</button>
              </div>
            </div>
          )}

          {currentQuestion === 'salonTreatments' && (
            <div>
              <p className="font-sans font-medium mb-3" style={{ fontSize: '20px', color: '#F5F0E8' }}>Salon treatments</p>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => setSalonTreatmentsUsed(true)} className="font-sans px-6 py-3" style={{ background: salonTreatmentsUsed === true ? 'rgba(201,168,76,0.12)' : 'transparent', color: salonTreatmentsUsed === true ? '#C9A84C' : '#A89880', border: `1px solid ${salonTreatmentsUsed === true ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>Yes</button>
                <button onClick={() => setSalonTreatmentsUsed(false)} className="font-sans px-6 py-3" style={{ background: salonTreatmentsUsed === false ? 'rgba(201,168,76,0.12)' : 'transparent', color: salonTreatmentsUsed === false ? '#C9A84C' : '#A89880', border: `1px solid ${salonTreatmentsUsed === false ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>No</button>
              </div>
              {salonTreatmentsUsed && (
                <div className="mt-4 space-y-4">
                  <div className="flex gap-3 flex-wrap">
                    {salonOptions.map(option => (
                      <button key={option} onClick={() => toggleSalon(option)} className="font-sans px-4 py-3" style={{ background: salonSelections.includes(option) ? 'rgba(201,168,76,0.12)' : 'transparent', color: salonSelections.includes(option) ? '#C9A84C' : '#A89880', border: `1px solid ${salonSelections.includes(option) ? '#C9A84C' : 'rgba(168,152,128,0.3)'}`, borderRadius: '2px', cursor: 'pointer' }}>{option}</button>
                    ))}
                  </div>
                  {salonSelections.includes('Other') && (
                    <input value={salonOther} onChange={e => setSalonOther(e.target.value)} placeholder="Please specify" className="w-full max-w-md px-4 py-3" style={{ background: 'rgba(245,240,232,0.02)', border: '1px solid rgba(168,152,128,0.3)', color: '#F5F0E8', borderRadius: '2px' }} />
                  )}
                </div>
              )}
            </div>
          )}

          {currentQuestion === 'done' && (
            <div className="flex justify-center mt-4">
              <p className="font-sans" style={{ color: '#A89880', fontSize: '16px' }}>Saving your details…</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
