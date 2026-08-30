'use client';
import React, { useEffect, useState } from 'react';
import { StoryProvider, useStory } from './context/StoryContext';
import ChapterNav from './components/ChapterNav';
import Chapter01Intro from './components/Chapter01Intro';
import Chapter02HairCycle from './components/Chapter02HairCycle';
import Chapter03GenderSelect from './components/Chapter03GenderSelect';
import Chapter04Patterns from './components/Chapter04Patterns';
import Chapter05Timeline from './components/Chapter05Timeline';
import Chapter06OnsetType from './components/Chapter06OnsetType';
import Chapter07Triggers from './components/Chapter07Triggers';
import Chapter09FamilyHistory from './components/Chapter09FamilyHistory';
import Chapter10HealthConditions from './components/Chapter10HealthConditions';
import Chapter11HormonalFemale from './components/Chapter11HormonalFemale';
import Chapter12Treatments from './components/Chapter12Treatments';
import Chapter13Habits from './components/Chapter13Habits';
import Chapter14ProceduresAndPastTreatment from './components/Chapter14ProceduresAndPastTreatment';
import Chapter15Consent from './components/Chapter15Consent';
import Chapter16Payoff from './components/Chapter16Payoff';

function StoryContent() {
  const { data, clearSavedIntake } = useStory();
  const [currentChapter, setCurrentChapter] = useState(-1);
  const [key, setKey] = useState(0);
  const [skipPersist, setSkipPersist] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('follicle_story_session');
      if (!raw) return;
      const parsed = JSON.parse(raw) as { currentChapter?: number };
      if (typeof parsed.currentChapter === 'number') {
        setCurrentChapter(parsed.currentChapter);
      }
    } catch {
      // ignore invalid local storage state and continue from the beginning
    }
  }, []);

  useEffect(() => {
    if (skipPersist || typeof window === 'undefined') return;
    const payload = { data, currentChapter, savedAt: Date.now() };
    window.localStorage.setItem('follicle_story_session', JSON.stringify(payload));
  }, [data, currentChapter, skipPersist]);

  const advance = () => setCurrentChapter(c => c + 1);
  const handleRestart = () => {
    setSkipPersist(true);
    clearSavedIntake();
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('follicle_story_session');
    }
    setKey(k => k + 1);
    setCurrentChapter(-1);
  };

  const chapters = [
    { id: 'cycle', component: <Chapter02HairCycle key="cycle" onComplete={advance} /> },
    { id: 'gender', component: <Chapter03GenderSelect key="gender" onComplete={advance} /> },
    { id: 'patterns', component: <Chapter04Patterns key="patterns" onComplete={advance} /> },
    { id: 'timeline', component: <Chapter05Timeline key="timeline" onComplete={advance} /> },
    { id: 'onset', component: <Chapter06OnsetType key="onset" onComplete={advance} /> },
    { id: 'triggers', component: <Chapter07Triggers key="triggers" onComplete={advance} /> },
    { id: 'family', component: <Chapter09FamilyHistory key="family" onComplete={advance} /> },
    { id: 'health', component: <Chapter10HealthConditions key="health" onComplete={advance} /> },
    ...(data?.gender === 'female'
      ? [{ id: 'hormonal', component: <Chapter11HormonalFemale key="hormonal" onComplete={advance} /> }]
      : []),
    { id: 'treatments', component: <Chapter12Treatments key="treatments" onComplete={advance} /> },
    { id: 'habits', component: <Chapter13Habits key="habits" onComplete={advance} /> },
    { id: 'procedures', component: <Chapter14ProceduresAndPastTreatment key="procedures" onComplete={advance} /> },
    { id: 'consent', component: <Chapter15Consent key="consent" onComplete={advance} /> },
    { id: 'payoff', component: <Chapter16Payoff key="payoff" onRestart={handleRestart} /> },
  ];

  const progressPercent = currentChapter < 0 ? 0 : Math.min(100, ((currentChapter + 1) / Math.max(1, chapters.length)) * 100);
  const navChapter = currentChapter < 0 ? 0 : Math.min(7, Math.max(0, currentChapter));

  return (
    <div key={key} style={{ background: '#0A0A0F', minHeight: '100vh' }}>
      <div
        style={{
          position: 'fixed',
          top: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 60,
          width: 'min(520px, calc(100vw - 32px))',
          padding: '12px 16px 10px',
          border: '1px solid rgba(201,168,76,0.2)',
          background: 'rgba(10,10,15,0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C9A84C' }}>
            Intake progress
          </span>
          <span style={{ fontSize: 12, color: '#F5F0E8' }}>{Math.round(progressPercent)}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: 'rgba(245,240,232,0.08)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #8B6F47, #C9A84C)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      <ChapterNav currentChapter={navChapter} totalChapters={7} />

      {currentChapter === -1 && <Chapter01Intro onBegin={advance} />}

      {currentChapter >= 0 && currentChapter < chapters.length && (
        <div style={{ animation: 'chapterIn 0.8s cubic-bezier(0.22,1,0.36,1)' }}>
          <style>{`
            @keyframes chapterIn {
              from { opacity: 0; transform: translateY(24px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          {chapters[currentChapter].component}
        </div>
      )}
    </div>
  );
}

export default function StoryPage() {
  return (
    <StoryProvider>
      <StoryContent />
    </StoryProvider>
  );
}
