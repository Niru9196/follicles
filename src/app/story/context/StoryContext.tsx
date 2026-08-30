'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Treatment {
  name: string;
  duration: string;
  effective: 'helped' | 'somewhat' | 'didnt' | null;
  sideEffects: string;
}

export interface Procedure {
  name: string;
  sessions: number;
  effective: boolean | null;
}

export interface StoryData {
  gender: 'male' | 'female' | null;
  ageOnset: number | null;
  patterns: string[];
  onsetType: 'gradual' | 'sudden' | null;
  triggers: string[];
  familyHistory: string[];
  healthConditions: string[];
  hormonalData: {
    regularCycle: boolean | null;
    pcos: boolean | null;
    pregnancyRelated: boolean | null;
  };
  treatments: Treatment[];
  habits: string[];
  procedures: Procedure[];
  samplePreference: 'saliva' | 'blood' | 'either' | null;
  consent: boolean | null;
}

interface StoryContextType {
  data: StoryData;
  setGender: (g: 'male' | 'female') => void;
  setAgeOnset: (age: number) => void;
  setPatterns: (p: string[]) => void;
  setOnsetType: (t: 'gradual' | 'sudden') => void;
  setTriggers: (t: string[]) => void;
  setFamilyHistory: (f: string[]) => void;
  setHealthConditions: (h: string[]) => void;
  setHormonalData: (h: Partial<StoryData['hormonalData']>) => void;
  setTreatments: (t: Treatment[]) => void;
  setHabits: (h: string[]) => void;
  setProcedures: (p: Procedure[]) => void;
  setSamplePreference: (s: 'saliva' | 'blood' | 'either') => void;
  setConsent: (c: boolean) => void;
}

const defaultData: StoryData = {
  gender: null,
  ageOnset: null,
  patterns: [],
  onsetType: null,
  triggers: [],
  familyHistory: [],
  healthConditions: [],
  hormonalData: { regularCycle: null, pcos: null, pregnancyRelated: null },
  treatments: [],
  habits: [],
  procedures: [],
  samplePreference: null,
  consent: null,
};

const StoryContext = createContext<StoryContextType | null>(null);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoryData>(defaultData);

  const setGender = (g: 'male' | 'female') => setData(d => ({ ...d, gender: g }));
  const setAgeOnset = (age: number) => setData(d => ({ ...d, ageOnset: age }));
  const setPatterns = (p: string[]) => setData(d => ({ ...d, patterns: p }));
  const setOnsetType = (t: 'gradual' | 'sudden') => setData(d => ({ ...d, onsetType: t }));
  const setTriggers = (t: string[]) => setData(d => ({ ...d, triggers: t }));
  const setFamilyHistory = (f: string[]) => setData(d => ({ ...d, familyHistory: f }));
  const setHealthConditions = (h: string[]) => setData(d => ({ ...d, healthConditions: h }));
  const setHormonalData = (h: Partial<StoryData['hormonalData']>) =>
    setData(d => ({ ...d, hormonalData: { ...d.hormonalData, ...h } }));
  const setTreatments = (t: Treatment[]) => setData(d => ({ ...d, treatments: t }));
  const setHabits = (h: string[]) => setData(d => ({ ...d, habits: h }));
  const setProcedures = (p: Procedure[]) => setData(d => ({ ...d, procedures: p }));
  const setSamplePreference = (s: 'saliva' | 'blood' | 'either') =>
    setData(d => ({ ...d, samplePreference: s }));
  const setConsent = (c: boolean) => setData(d => ({ ...d, consent: c }));

  return (
    <StoryContext.Provider
      value={{
        data,
        setGender,
        setAgeOnset,
        setPatterns,
        setOnsetType,
        setTriggers,
        setFamilyHistory,
        setHealthConditions,
        setHormonalData,
        setTreatments,
        setHabits,
        setProcedures,
        setSamplePreference,
        setConsent,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error('useStory must be used within StoryProvider');
  return ctx;
}
