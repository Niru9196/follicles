'use client';
import React, { useState, useEffect } from 'react';
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
import Chapter15Consent from './components/Chapter15Consent';
import Chapter16Payoff from './components/Chapter16Payoff';

function StoryContent() {
  const { data } = useStory();
  const [currentChapter, setCurrentChapter] = useState(-1); // -1 = intro
  const [key, setKey] = useState(0);

  const advance = () => setCurrentChapter(c => c + 1);

  const handleRestart = () => {
    setKey(k => k + 1);
    setCurrentChapter(-1);
  };

  // Build chapter list based on gender
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
    { id: 'consent', component: <Chapter15Consent key="consent" onComplete={advance} /> },
    { id: 'payoff', component: <Chapter16Payoff key="payoff" onRestart={handleRestart} /> },
  ];

  // Nav chapter index mapping (0-based groups)
  const navChapter = currentChapter < 0 ? 0
    : currentChapter < 2 ? 1
    : currentChapter < 4 ? 2
    : currentChapter < 6 ? 3
    : currentChapter < 9 ? 4
    : currentChapter < 11 ? 5
    : 6;

  return (
    <div key={key} style={{ background: '#0A0A0F', minHeight: '100vh' }}>
      <ChapterNav currentChapter={navChapter} totalChapters={7} />

      {currentChapter === -1 && (
        <Chapter01Intro onBegin={advance} />
      )}

      {currentChapter >= 0 && currentChapter < chapters?.length && (
        <div
          style={{
            animation: 'chapterIn 0.8s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <style>{`
            @keyframes chapterIn {
              from { opacity: 0; transform: translateY(24px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          {chapters?.[currentChapter]?.component}
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
