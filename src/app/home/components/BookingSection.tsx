'use client';

import React, { useState } from 'react';

type ConcernType = 'thinning' | 'patchy' | 'receding' | 'postpartum' | '';
type DurationOption = 'recent' | '3to6' | '6to12' | 'over1year' | '';
type FormatOption = 'clinic' | 'virtual' | '';

const concernOptions: { value: ConcernType; label: string; description: string; emoji: string }[] = [
  { value: 'thinning',  label: 'Diffuse thinning',    description: 'Overall density loss, wider part line', emoji: '🌿' },
  { value: 'patchy',    label: 'Patchy loss',          description: 'Circular or irregular bald patches',    emoji: '🔵' },
  { value: 'receding',  label: 'Receding hairline',    description: 'Temple or front hairline recession',    emoji: '📐' },
  { value: 'postpartum',label: 'Postpartum shedding',  description: 'Hair loss after pregnancy or birth',    emoji: '🌸' },
];

const durationOptions: { value: DurationOption; label: string }[] = [
  { value: 'recent',    label: 'Less than 3 months' },
  { value: '3to6',      label: '3 to 6 months' },
  { value: '6to12',     label: '6 months to 1 year' },
  { value: 'over1year', label: 'Over a year' },
];

const formatOptions: { value: FormatOption; label: string; detail: string }[] = [
  { value: 'clinic',  label: 'In-clinic',  detail: 'Trichoscope + full analysis · NYC / LA' },
  { value: 'virtual', label: 'Virtual',    detail: 'Video consultation + at-home kit' },
];

export default function BookingSection() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [concern,   setConcern]   = useState<ConcernType>('');
  const [duration,  setDuration]  = useState<DurationOption>('');
  const [format,    setFormat]    = useState<FormatOption>('');
  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  // PDF guide state
  const [guideEmail,     setGuideEmail]     = useState('');
  const [guideConcern,   setGuideConcern]   = useState('');
  const [guideSubmitted, setGuideSubmitted] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGuideSubmitted(true);
  };

  return (
    <section id="book" className="bg-birch-warm py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* ── Booking form ── */}
          <div className="reveal-left">
            <div className="gold-rule" />
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-moss mb-4">Book Your Analysis</p>
            <h2 className="font-serif text-evergreen leading-tight mb-3" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              The first appointment<br />
              <em>that actually looks.</em>
            </h2>
            <p className="text-moss font-light leading-relaxed mb-10">
              Three questions. That's all we need to match you with the right trichologist and prepare your consultation.
            </p>

            {!submitted ? (
              <form onSubmit={handleBookingSubmit}>
                {/* Progress bar */}
                <div className="flex gap-1.5 mb-10">
                  {[1, 2, 3].map(s => (
                    <div
                      key={s}
                      className={`flex-1 h-1 rounded-full transition-all duration-500 ${step > s ? 'bg-gold' : step === s ? 'bg-gold/60' : 'bg-moss/20'}`}
                    />
                  ))}
                </div>

                {/* Step 1: Concern */}
                {step === 1 && (
                  <div>
                    <p className="text-sm font-medium text-evergreen mb-4">
                      <span className="text-gold font-serif text-lg">01</span> &nbsp;What's your primary concern?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {concernOptions.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setConcern(opt.value)}
                          className={`form-option text-left p-4 rounded-xl ${concern === opt.value ? 'selected' : ''}`}
                        >
                          <span className="text-xl mb-2 block">{opt.emoji}</span>
                          <span className="block font-medium text-evergreen text-sm">{opt.label}</span>
                          <span className="block text-moss text-xs font-light mt-0.5">{opt.description}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      disabled={!concern}
                      onClick={() => setStep(2)}
                      className={`btn-gold px-6 py-3 rounded-full text-sm w-full flex items-center justify-center gap-2 ${!concern ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      Continue
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Step 2: Duration */}
                {step === 2 && (
                  <div>
                    <p className="text-sm font-medium text-evergreen mb-4">
                      <span className="text-gold font-serif text-lg">02</span> &nbsp;How long have you noticed it?
                    </p>
                    <div className="space-y-3 mb-8">
                      {durationOptions.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setDuration(opt.value)}
                          className={`form-option w-full text-left p-4 rounded-xl flex items-center justify-between ${duration === opt.value ? 'selected' : ''}`}
                        >
                          <span className="font-medium text-evergreen text-sm">{opt.label}</span>
                          {duration === opt.value && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)} className="btn-outline-evergreen px-5 py-3 rounded-full text-sm">Back</button>
                      <button
                        type="button"
                        disabled={!duration}
                        onClick={() => setStep(3)}
                        className={`btn-gold px-6 py-3 rounded-full text-sm flex-1 flex items-center justify-center gap-2 ${!duration ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        Continue
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Format + contact */}
                {step === 3 && (
                  <div>
                    <p className="text-sm font-medium text-evergreen mb-4">
                      <span className="text-gold font-serif text-lg">03</span> &nbsp;How would you like to consult?
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {formatOptions.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFormat(opt.value)}
                          className={`form-option text-left p-4 rounded-xl ${format === opt.value ? 'selected' : ''}`}
                        >
                          <span className="block font-medium text-evergreen text-sm">{opt.label}</span>
                          <span className="block text-moss text-xs font-light mt-1">{opt.detail}</span>
                        </button>
                      ))}
                    </div>
                    <div className="space-y-5 mb-8">
                      <div>
                        <label className="text-xs text-moss uppercase tracking-wider font-medium block mb-1">Full name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Your name"
                          required
                          className="field-input"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-moss uppercase tracking-wider font-medium block mb-1">Email address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="you@email.com"
                          required
                          className="field-input"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(2)} className="btn-outline-evergreen px-5 py-3 rounded-full text-sm">Back</button>
                      <button
                        type="submit"
                        disabled={!format || !name || !email}
                        className={`btn-gold px-6 py-3 rounded-full text-sm flex-1 flex items-center justify-center gap-2 ${(!format || !name || !email) ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        Book Scalp Analysis
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-moss/60 mt-3 font-light">No payment required to book. We'll confirm within 24 hours.</p>
                  </div>
                )}
              </form>
            ) : (
              <div className="p-8 rounded-2xl bg-evergreen/5 border border-evergreen/15 text-center">
                <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mx-auto mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="font-serif text-evergreen text-xl mb-2">Request received.</h3>
                <p className="text-moss font-light text-sm leading-relaxed">We'll confirm your scalp analysis appointment within 24 hours. Check your inbox — we'll send prep instructions so we can make the most of your time.</p>
              </div>
            )}
          </div>

          {/* ── PDF Guide secondary path ── */}
          <div id="guide" className="reveal-right delay-200">
            <div className="p-8 lg:p-10 rounded-2xl bg-evergreen border border-white/10 h-full flex flex-col justify-between">
              <div>
                <span className="concern-badge mb-6 inline-flex" style={{ background: 'rgba(201,168,76,0.1)', borderColor: 'rgba(201,168,76,0.3)', color: '#C9A84C' }}>
                  Free Resource
                </span>
                <h3 className="font-serif text-birch text-2xl lg:text-3xl leading-tight mb-4">
                  Not ready to book?<br />
                  <em className="text-gold/80">Start here.</em>
                </h3>
                <p className="text-birch/60 font-light leading-relaxed mb-6">
                  The <strong className="text-birch/80 font-medium">Hair Loss Pattern Guide</strong> — a plain-language PDF that maps your symptoms to likely causes, explains what a trichologist looks for, and tells you what questions to ask.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    '7 types of hair loss explained clearly',
                    'Symptom-to-cause mapping guide',
                    'What your scalp texture means',
                    'When to see a trichologist vs. GP',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm text-birch/70 font-light">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {!guideSubmitted ? (
                <form onSubmit={handleGuideSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-birch/50 uppercase tracking-wider font-medium block mb-1">Your main concern</label>
                    <select
                      value={guideConcern}
                      onChange={e => setGuideConcern(e.target.value)}
                      required
                      className="field-input"
                      style={{ color: guideConcern ? '#EAE2D6' : 'rgba(234,226,214,0.4)', borderBottomColor: 'rgba(234,226,214,0.2)' }}
                    >
                      <option value="" disabled>Select your concern</option>
                      {concernOptions.map(o => (
                        <option key={o.value} value={o.value} style={{ background: '#1B4332', color: '#EAE2D6' }}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-birch/50 uppercase tracking-wider font-medium block mb-1">Email address</label>
                    <input
                      type="email"
                      value={guideEmail}
                      onChange={e => setGuideEmail(e.target.value)}
                      placeholder="you@email.com"
                      required
                      className="field-input"
                      style={{ color: '#EAE2D6', borderBottomColor: 'rgba(234,226,214,0.2)' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!guideEmail || !guideConcern}
                    className={`btn-gold w-full py-3 rounded-full text-sm flex items-center justify-center gap-2 ${(!guideEmail || !guideConcern) ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    Send Me the Guide
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </button>
                  <p className="text-xs text-birch/35 font-light">No spam. Unsubscribe anytime.</p>
                </form>
              ) : (
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="font-serif text-birch text-lg mb-2">Guide on its way.</p>
                  <p className="text-birch/55 text-sm font-light">Check your inbox — and when you're ready, your first scalp analysis is waiting.</p>
                  <a href="#book" className="btn-gold mt-4 inline-flex px-5 py-2.5 rounded-full text-xs items-center gap-1.5">
                    Book When Ready
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}