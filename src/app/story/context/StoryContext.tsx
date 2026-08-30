'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type DurationOption = 'under6months' | '6to12months' | 'over1year';
export type FamilyHistoryOption = 'father' | 'mother' | 'siblings' | 'noFamilyHistory';
export type PatternOption = 'recedingHairline' | 'thinningAtCrown' | 'wideningPartLine' | 'diffuseThinning' | 'patchyLoss' | 'suddenExcessiveShedding';
export type DiagnosedCondition = 'pcos' | 'thyroid' | 'diabetes' | 'autoimmune' | 'anemia' | 'none';
export type MenstrualCycleOption = 'regular' | 'irregular' | 'menopausal' | 'notApplicable';
export type PregnancyStatusOption = 'currentlyPregnant' | 'postpartumUnder1Year' | 'notApplicable';
export type SmokingQuantity = 'under5' | '5to10' | 'over10';
export type HairWashFrequency = 'daily' | 'alternateDays' | 'weekly';
export type ProductName = 'medicatedShampoos' | 'hairOilsOrSerums' | 'topicalMinoxidil' | 'oralMinoxidil' | 'supplements';
export type ProcedureName = 'prp' | 'gfcOrIprf' | 'stemCellsOrExosomes' | 'hairTransplant' | 'other';
export type Past6MonthsTrigger =
  | 'crashDietingOrMajorWeightLoss'
  | 'highStressOrEmotionalTrauma'
  | 'feverWithIllness'
  | 'recentSurgery'
  | 'changeInLocationWaterOrAirQuality';

export interface ProductUsage {
  used: boolean;
  duration?: 'under3months' | '3to6months' | 'over6months';
  helped?: boolean;
  sideEffects?: boolean;
}

export interface ProcedureUsage {
  done: boolean;
  sessions?: '1to3' | '4to6' | 'over6';
  helped?: boolean;
  other?: string;
}

export interface StoryData {
  gender: 'male' | 'female' | null;
  ageHairLossBegan: number | null;
  duration: DurationOption | null;
  familyHistory: FamilyHistoryOption[];
  pattern: PatternOption[];
  diagnosedConditions: DiagnosedCondition[];
  menstrualCycle: MenstrualCycleOption | null;
  pregnancyHairLoss: PregnancyStatusOption | null;
  acneOilySkinAdulthood: boolean | null;
  excessBodyFacialHairGrowth: boolean | null;
  past6Months: Past6MonthsTrigger[];
  habits: {
    smoking: { used: boolean; quantity?: SmokingQuantity };
    alcohol: boolean;
    hardWater: boolean;
    hairWashFrequency: HairWashFrequency | null;
    heatingOrStylingChemicals: boolean;
    salonTreatments: { used: boolean; treatments?: string[]; other?: string };
  };
  products: Record<ProductName, ProductUsage>;
  procedures: Record<ProcedureName, ProcedureUsage>;
  sideEffectsPastTreatment: { yesNo: boolean | null; description: string };
  sampleType: 'saliva' | 'blood' | 'either' | null;
  consentGeneticAnalysis: boolean | null;
  ageOnset: number | null;
  patterns: string[];
  onsetType: 'gradual' | 'sudden' | null;
  triggers: string[];
  healthConditions: string[];
  hormonalData: {
    regularCycle: boolean | null;
    pcos: boolean | null;
    pregnancyRelated: boolean | null;
  };
}

export interface StoryContextType {
  data: StoryData;
  setGender: (g: 'male' | 'female') => void;
  setAgeOnset: (age: number) => void;
  setDuration: (value: DurationOption | null) => void;
  setPatterns: (p: string[]) => void;
  setOnsetType: (t: 'gradual' | 'sudden') => void;
  setTriggers: (t: string[]) => void;
  setFamilyHistory: (f: FamilyHistoryOption[]) => void;
  setHealthConditions: (h: DiagnosedCondition[]) => void;
  setMenstrualCycle: (value: MenstrualCycleOption | null) => void;
  setPregnancyHairLoss: (value: PregnancyStatusOption | null) => void;
  setAcneOilySkinAdulthood: (value: boolean | null) => void;
  setExcessBodyFacialHairGrowth: (value: boolean | null) => void;
  setPast6Months: (value: Past6MonthsTrigger[]) => void;
  setHormonalData: (h: Partial<StoryData['hormonalData']>) => void;
  setTreatments: (t: Record<ProductName, ProductUsage>) => void;
  setHabits: (h: StoryData['habits']) => void;
  setProcedures: (p: Record<ProcedureName, ProcedureUsage>) => void;
  setSideEffectsPastTreatment: (value: StoryData['sideEffectsPastTreatment']) => void;
  setSamplePreference: (s: 'saliva' | 'blood' | 'either') => void;
  setConsent: (c: boolean) => void;
  clearSavedIntake: () => void;
}

export type RequiredIntakeTableRow =
  | string
  | {
      key: string;
      type: 'yesno' | 'single' | 'text';
      followup?: { key: string; type: 'text' | 'single'; options?: string[] };
      options?: string[];
    };

export type RequiredIntakeQuestion = {
  n: number;
  key: string;
  type: 'number' | 'single' | 'multi' | 'yesno' | 'table' | 'text';
  options?: string[];
  femaleOnly?: boolean;
  rows?: RequiredIntakeTableRow[];
  columns?: Array<{ key: string; type: string; options?: string[] }>;
  followup?: { key: string; type: 'text' | 'single'; options?: string[] };
};

export type RequiredIntakeSection = {
  id: string;
  title: string;
  questions: RequiredIntakeQuestion[];
};

export type RequiredIntakeResponse = {
  form: 'GenoRoot Hair & Scalp Intake';
  sections: RequiredIntakeSection[];
};

const mapDuration = (value: DurationOption | null): string | undefined => {
  switch (value) {
    case 'under6months': return 'Less than 6 months';
    case '6to12months': return '6-12 months';
    case 'over1year': return 'Over a year';
    default: return undefined;
  }
};

const mapFamilyHistory = (items: FamilyHistoryOption[]): string[] => {
  const labels: Record<FamilyHistoryOption, string> = {
    father: 'Father had hair loss',
    mother: 'Mother had hair loss',
    siblings: 'Siblings with thinning or baldness',
    noFamilyHistory: 'No known family history',
  };
  return items.map(item => labels[item]).filter(Boolean);
};

const mapPattern = (items: PatternOption[]): string[] => {
  const labels: Record<PatternOption, string> = {
    recedingHairline: 'Receding hairline',
    thinningAtCrown: 'Thinning at crown',
    wideningPartLine: 'Widening part line',
    diffuseThinning: 'Diffuse thinning',
    patchyLoss: 'Patchy loss',
    suddenExcessiveShedding: 'Sudden excessive shedding',
  };
  return items.map(item => labels[item]).filter(Boolean);
};

const mapDiagnosedConditions = (items: DiagnosedCondition[]): string[] => {
  const labels: Record<DiagnosedCondition, string> = {
    pcos: 'PCOS/PCOD',
    thyroid: 'Thyroid disorder',
    diabetes: 'Diabetes',
    autoimmune: 'Autoimmune disease',
    anemia: 'Anemia',
    none: 'None',
  };
  return items.map(item => labels[item]).filter(Boolean);
};

const mapMenstrualCycle = (value: MenstrualCycleOption | null): string | undefined => {
  switch (value) {
    case 'regular': return 'Regular';
    case 'irregular': return 'Irregular';
    case 'menopausal': return 'Menopausal';
    case 'notApplicable': return 'Not applicable';
    default: return undefined;
  }
};

const mapPregnancy = (value: PregnancyStatusOption | null): string | undefined => {
  switch (value) {
    case 'currentlyPregnant': return 'Currently pregnant';
    case 'postpartumUnder1Year': return 'Postpartum <1 year';
    case 'notApplicable': return 'Not applicable';
    default: return undefined;
  }
};

const mapTrigger = (items: Past6MonthsTrigger[]): string[] => {
  const labels: Record<Past6MonthsTrigger, string> = {
    crashDietingOrMajorWeightLoss: 'Crash dieting or major weight loss',
    highStressOrEmotionalTrauma: 'High stress or emotional trauma',
    feverWithIllness: 'Fever with illness (COVID, Dengue, Typhoid)',
    recentSurgery: 'Recent surgery',
    changeInLocationWaterOrAirQuality: 'Change in location/water/air quality',
  };
  return items.map(item => labels[item]).filter(Boolean);
};

const mapSmokingQuantity = (value?: SmokingQuantity): string | undefined => {
  switch (value) {
    case 'under5': return 'Mild <5/day';
    case '5to10': return 'Moderate 5-10/day';
    case 'over10': return 'Severe >10/day';
    default: return undefined;
  }
};

const mapHairWashFrequency = (value: HairWashFrequency | null): string | undefined => {
  switch (value) {
    case 'daily': return 'Daily';
    case 'alternateDays': return 'Alternate Days';
    case 'weekly': return 'Weekly';
    default: return undefined;
  }
};

const mapSampleType = (value: 'saliva' | 'blood' | 'either' | null): string | undefined => {
  if (!value) return undefined;
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export function buildRequiredIntakeResponse(data: StoryData): RequiredIntakeResponse {
  const questionsA: RequiredIntakeQuestion[] = [
    { n: 1, key: 'age_hair_loss_began', type: 'number' },
    { n: 2, key: 'duration', type: 'single', options: ['Less than 6 months', '6-12 months', 'Over a year'] },
    { n: 3, key: 'family_history', type: 'multi', options: mapFamilyHistory(data.familyHistory).length ? mapFamilyHistory(data.familyHistory) : ['Father had hair loss', 'Mother had hair loss', 'Siblings with thinning or baldness', 'No known family history'] },
    { n: 4, key: 'pattern', type: 'multi', options: mapPattern(data.pattern).length ? mapPattern(data.pattern) : ['Receding hairline', 'Thinning at crown', 'Widening part line', 'Diffuse thinning', 'Patchy loss', 'Sudden excessive shedding'] },
  ];

  const questionsB: RequiredIntakeQuestion[] = [
    { n: 5, key: 'diagnosed_conditions', type: 'multi', options: mapDiagnosedConditions(data.diagnosedConditions).length ? mapDiagnosedConditions(data.diagnosedConditions) : ['PCOS/PCOD', 'Thyroid disorder', 'Diabetes', 'Autoimmune disease', 'Anemia', 'None'] },
    { n: 6, key: 'menstrual_cycle', type: 'single', options: ['Regular', 'Irregular', 'Menopausal', 'Not applicable'], femaleOnly: true },
    { n: 7, key: 'pregnancy_related', type: 'single', options: ['Currently pregnant', 'Postpartum <1 year', 'Not applicable'], femaleOnly: true },
    { n: 8, key: 'adult_acne_oily_skin', type: 'yesno' },
    { n: 9, key: 'excess_body_facial_hair', type: 'yesno' },
  ];

  const questionsC: RequiredIntakeQuestion[] = [
    { n: 10, key: 'past_6_months', type: 'multi', options: mapTrigger(data.past6Months).length ? mapTrigger(data.past6Months) : ['Crash dieting or major weight loss', 'High stress or emotional trauma', 'Fever with illness (COVID, Dengue, Typhoid)', 'Recent surgery', 'Change in location/water/air quality'] },
    {
      n: 11,
      key: 'habits',
      type: 'table',
      rows: [
        {
          key: 'smoking',
          type: 'yesno',
          followup: {
            key: 'smoking_severity',
            type: 'single',
            options: ['Mild <5/day', 'Moderate 5-10/day', 'Severe >10/day'],
          },
        },
        { key: 'alcohol', type: 'yesno' },
        { key: 'hard_water', type: 'yesno' },
        { key: 'hair_wash_frequency', type: 'single', options: ['Daily', 'Alternate Days', 'Weekly'] },
        { key: 'heating_tools_styling_chemicals', type: 'yesno' },
        {
          key: 'salon_treatments',
          type: 'yesno',
          followup: { key: 'salon_treatment_detail', type: 'text' },
        },
      ],
      columns: [{ key: 'used', type: 'bool' }],
    },
  ];

  const questionsD: RequiredIntakeQuestion[] = [
    {
      n: 12,
      key: 'products',
      type: 'table',
      rows: ['OTC/Medicated Shampoos', 'Hair Oils/Serums', 'Topical Minoxidil', 'Oral Minoxidil', 'Supplements'],
      columns: [
        { key: 'used', type: 'bool' },
        { key: 'duration', type: 'single', options: ['<3mo', '3-6mo', '>6mo'] },
        { key: 'helped', type: 'yesno' },
        { key: 'side_effects', type: 'yesno' },
      ],
    },
    {
      n: 13,
      key: 'procedures',
      type: 'table',
      rows: ['PRP', 'GFC or iPRF', 'Stem Cells or Exosomes', 'Hair Transplant', 'Other'],
      columns: [
        { key: 'done', type: 'bool' },
        { key: 'sessions', type: 'single', options: ['1-3', '4-6', '>6'] },
        { key: 'helped', type: 'yesno' },
      ],
    },
    { n: 14, key: 'past_treatment_side_effects', type: 'yesno', followup: { key: 'describe', type: 'text' } },
  ];

  const questionsE: RequiredIntakeQuestion[] = [
    { n: 15, key: 'sample_type', type: 'single', options: ['Saliva', 'Blood', 'Either'] },
    { n: 16, key: 'consent', type: 'yesno' },
  ];

  return {
    form: 'GenoRoot Hair & Scalp Intake',
    sections: [
      { id: 'A', title: 'Personal & Family Hair Loss History', questions: questionsA },
      { id: 'B', title: 'Hormonal & Health Influences', questions: questionsB },
      { id: 'C', title: 'Lifestyle & Environmental Triggers', questions: questionsC },
      { id: 'D', title: 'Current Hair Care & Treatments', questions: questionsD },
      { id: 'E', title: 'Sample Collection & Consent', questions: questionsE },
    ],
  };
}

const createDefaultProducts = (): Record<ProductName, ProductUsage> => ({
  medicatedShampoos: { used: false },
  hairOilsOrSerums: { used: false },
  topicalMinoxidil: { used: false },
  oralMinoxidil: { used: false },
  supplements: { used: false },
});

const createDefaultProcedures = (): Record<ProcedureName, ProcedureUsage> => ({
  prp: { done: false },
  gfcOrIprf: { done: false },
  stemCellsOrExosomes: { done: false },
  hairTransplant: { done: false },
  other: { done: false },
});

export const defaultData: StoryData = {
  gender: null,
  ageHairLossBegan: null,
  duration: null,
  familyHistory: [],
  pattern: [],
  diagnosedConditions: [],
  menstrualCycle: null,
  pregnancyHairLoss: null,
  acneOilySkinAdulthood: null,
  excessBodyFacialHairGrowth: null,
  past6Months: [],
  habits: {
    smoking: { used: false },
    alcohol: false,
    hardWater: false,
    hairWashFrequency: null,
    heatingOrStylingChemicals: false,
    salonTreatments: { used: false, treatments: [] },
  },
  products: createDefaultProducts(),
  procedures: createDefaultProcedures(),
  sideEffectsPastTreatment: { yesNo: null, description: '' },
  sampleType: null,
  consentGeneticAnalysis: null,
  ageOnset: null,
  patterns: [],
  onsetType: null,
  triggers: [],
  healthConditions: [],
  hormonalData: { regularCycle: null, pcos: null, pregnancyRelated: null },
};

const StoryContext = createContext<StoryContextType | null>(null);
const STORAGE_KEY = 'genoroot-hair-intake-v1';

function loadPersistedData(): StoryData | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoryData>;
    return { ...defaultData, ...parsed };
  } catch {
    return null;
  }
}

export function validateIntake(data: StoryData): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (data.ageHairLossBegan === null) missing.push('Q1. Age when hair loss began');
  if (!data.duration) missing.push('Q2. Duration');
  if (data.familyHistory.length === 0) missing.push('Q3. Family history');
  if (data.pattern.length === 0) missing.push('Q4. Pattern');
  if (data.diagnosedConditions.length === 0) missing.push('Q5. Diagnosed conditions');

  if (data.gender === 'female') {
    if (!data.menstrualCycle) missing.push('Q6. Menstrual cycle');
    if (!data.pregnancyHairLoss) missing.push('Q7. Pregnancy-related hair loss');
  } else {
    if (data.menstrualCycle !== null || data.pregnancyHairLoss !== null) {
      // keep explicit N/A if a male path flows through; do not fail validation.
    }
  }

  if (data.acneOilySkinAdulthood === null) missing.push('Q8. Acne or oily skin in adulthood');
  if (data.excessBodyFacialHairGrowth === null) missing.push('Q9. Excess body or facial hair growth');
  if (data.past6Months.length === 0) missing.push('Q10. In the past 6 months');

  if (!data.habits.smoking.used && data.habits.smoking.quantity) {
    missing.push('Q11. Smoking quantity is inconsistent');
  }
  if (data.habits.smoking.used && !data.habits.smoking.quantity) {
    missing.push('Q11. Smoking quantity');
  }
  if (data.habits.alcohol === null || data.habits.alcohol === undefined) missing.push('Q11. Alcohol');
  if (data.habits.hardWater === null || data.habits.hardWater === undefined) missing.push('Q11. Hard water');
  if (!data.habits.hairWashFrequency) missing.push('Q11. Hair wash frequency');
  if (data.habits.heatingOrStylingChemicals === null || data.habits.heatingOrStylingChemicals === undefined) missing.push('Q11. Heating tools or styling chemicals');
  if (data.habits.salonTreatments.used === undefined || data.habits.salonTreatments.used === null) {
    missing.push('Q11. Salon treatments');
  }
  if (data.habits.salonTreatments.used && (!data.habits.salonTreatments.treatments || data.habits.salonTreatments.treatments.length === 0)) {
    missing.push('Q11. Salon treatment type');
  }

  (Object.keys(data.products) as ProductName[]).forEach(product => {
    const entry = data.products[product];
    if (entry.used === undefined || entry.used === null) {
      missing.push(`Q12. ${product} used`);
      return;
    }
    if (entry.used) {
      if (!entry.duration) missing.push(`Q12. ${product} duration`);
      if (entry.helped === undefined || entry.helped === null) missing.push(`Q12. ${product} helped`);
      if (entry.sideEffects === undefined || entry.sideEffects === null) missing.push(`Q12. ${product} side effects`);
    }
  });

  (Object.keys(data.procedures) as ProcedureName[]).forEach(procedure => {
    const entry = data.procedures[procedure];
    if (entry.done === undefined || entry.done === null) {
      missing.push(`Q13. ${procedure} done`);
      return;
    }
    if (entry.done) {
      if (!entry.sessions) missing.push(`Q13. ${procedure} sessions`);
      if (entry.helped === undefined || entry.helped === null) missing.push(`Q13. ${procedure} helped`);
      if (procedure === 'other' && (!entry.other || !entry.other.trim())) missing.push('Q13. Other procedure details');
    }
  });

  if (data.sideEffectsPastTreatment.yesNo === null) missing.push('Q14. Side effects or poor response to past treatment');
  if (data.sideEffectsPastTreatment.yesNo === true && !data.sideEffectsPastTreatment.description.trim()) {
    missing.push('Q14. Please describe');
  }

  if (!data.sampleType) missing.push('Q15. Preferred sample type');
  if (data.consentGeneticAnalysis === null) missing.push('Q16. Consent to sample collection and genetic analysis');

  if (data.familyHistory.includes('noFamilyHistory') && data.familyHistory.length > 1) {
    missing.push('Q3. Family history must not combine no known family history with other family members');
  }
  if (data.diagnosedConditions.includes('none') && data.diagnosedConditions.length > 1) {
    missing.push('Q5. Diagnosed conditions must not combine None with other diagnoses');
  }

  return { valid: missing.length === 0, missing };
}

export function StoryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoryData>(() => loadPersistedData() ?? defaultData);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data]);

  const clearSavedIntake = () => {
    setData(defaultData);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const setGender = (g: 'male' | 'female') =>
    setData(d => {
      const cleanedDiagnosedConditions =
        g === 'male' ? d.diagnosedConditions.filter(item => item !== 'pcos') : d.diagnosedConditions;

      return {
        ...d,
        gender: g,
        diagnosedConditions: cleanedDiagnosedConditions,
        healthConditions: cleanedDiagnosedConditions as unknown as string[],
        menstrualCycle: g === 'male' ? null : d.menstrualCycle,
        pregnancyHairLoss: g === 'male' ? null : d.pregnancyHairLoss,
        hormonalData: g === 'male' ? { regularCycle: null, pcos: null, pregnancyRelated: null } : d.hormonalData,
      };
    });

  const setAgeOnset = (age: number) => setData(d => ({ ...d, ageHairLossBegan: age, ageOnset: age }));
  const setDuration = (value: DurationOption | null) => setData(d => ({ ...d, duration: value }));
  const setPatterns = (p: string[]) => setData(d => ({ ...d, patterns: p, pattern: p as PatternOption[] }));
  const setOnsetType = (t: 'gradual' | 'sudden') => setData(d => ({ ...d, onsetType: t }));
  const setTriggers = (t: string[]) => setData(d => ({ ...d, triggers: t, past6Months: t as Past6MonthsTrigger[] }));
  const setFamilyHistory = (f: FamilyHistoryOption[]) => setData(d => ({ ...d, familyHistory: f }));
  const setHealthConditions = (h: DiagnosedCondition[]) => setData(d => ({ ...d, diagnosedConditions: h, healthConditions: h as unknown as string[] }));
  const setMenstrualCycle = (value: MenstrualCycleOption | null) => setData(d => ({ ...d, menstrualCycle: value }));
  const setPregnancyHairLoss = (value: PregnancyStatusOption | null) => setData(d => ({ ...d, pregnancyHairLoss: value }));
  const setAcneOilySkinAdulthood = (value: boolean | null) => setData(d => ({ ...d, acneOilySkinAdulthood: value }));
  const setExcessBodyFacialHairGrowth = (value: boolean | null) => setData(d => ({ ...d, excessBodyFacialHairGrowth: value }));
  const setPast6Months = (value: Past6MonthsTrigger[]) => setData(d => ({ ...d, past6Months: value }));
  const setHormonalData = (h: Partial<StoryData['hormonalData']>) =>
    setData(d => ({
      ...d,
      hormonalData: { ...d.hormonalData, ...h },
      menstrualCycle: h.regularCycle === true ? 'regular' : d.menstrualCycle,
      pregnancyHairLoss: h.pregnancyRelated === true ? 'currentlyPregnant' : d.pregnancyHairLoss,
    }));
  const setTreatments = (t: Record<ProductName, ProductUsage>) => setData(d => ({ ...d, products: t }));
  const setHabits = (h: StoryData['habits']) => setData(d => ({ ...d, habits: h }));
  const setProcedures = (p: Record<ProcedureName, ProcedureUsage>) => setData(d => ({ ...d, procedures: p }));
  const setSideEffectsPastTreatment = (value: StoryData['sideEffectsPastTreatment']) => setData(d => ({ ...d, sideEffectsPastTreatment: value }));
  const setSamplePreference = (s: 'saliva' | 'blood' | 'either') => setData(d => ({ ...d, sampleType: s }));
  const setConsent = (c: boolean) => setData(d => ({ ...d, consentGeneticAnalysis: c }));

  return (
    <StoryContext.Provider
      value={{
        data,
        setGender,
        setAgeOnset,
        setDuration,
        setPatterns,
        setOnsetType,
        setTriggers,
        setFamilyHistory,
        setHealthConditions,
        setMenstrualCycle,
        setPregnancyHairLoss,
        setAcneOilySkinAdulthood,
        setExcessBodyFacialHairGrowth,
        setPast6Months,
        setHormonalData,
        setTreatments,
        setHabits,
        setProcedures,
        setSideEffectsPastTreatment,
        setSamplePreference,
        setConsent,
        clearSavedIntake,
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
