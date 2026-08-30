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
  | 'changeInLocationWaterOrAirQuality'
  | 'none';

export interface ProductUsage {
  used: boolean | null;
  duration?: 'under3months' | '3to6months' | 'over6months';
  helped?: boolean | null;
  sideEffects?: boolean | null;
}

export interface ProcedureUsage {
  done: boolean | null;
  sessions?: '1to3' | '4to6' | 'over6';
  helped?: boolean | null;
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
    smoking: { used: boolean | null; quantity?: SmokingQuantity | null };
    alcohol: boolean | null;
    hardWater: boolean | null;
    hairWashFrequency: HairWashFrequency | null;
    heatingOrStylingChemicals: boolean | null;
    salonTreatments: { used: boolean | null; treatments?: string[]; other?: string };
  };
  products: Record<ProductName, ProductUsage>;
  procedures: Record<ProcedureName, ProcedureUsage>;
  sideEffectsPastTreatment: { yesNo: boolean | null; description: string };
  sampleType: 'saliva' | 'blood' | 'either' | null;
  consentGeneticAnalysis: boolean | null;
  onsetType: 'gradual' | 'sudden' | null;
}

export interface StoryContextType {
  data: StoryData;
  setGender: (g: 'male' | 'female') => void;
  setAgeOnset: (age: number) => void;
  setDuration: (value: DurationOption | null) => void;
  setPatterns: (p: PatternOption[]) => void;
  setOnsetType: (t: 'gradual' | 'sudden') => void;
  setTriggers: (t: Past6MonthsTrigger[]) => void;
  setFamilyHistory: (f: FamilyHistoryOption[]) => void;
  setHealthConditions: (h: DiagnosedCondition[]) => void;
  setMenstrualCycle: (value: MenstrualCycleOption | null) => void;
  setPregnancyHairLoss: (value: PregnancyStatusOption | null) => void;
  setAcneOilySkinAdulthood: (value: boolean | null) => void;
  setExcessBodyFacialHairGrowth: (value: boolean | null) => void;
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
    none: 'None of these',
  };
  return items.map(item => labels[item]).filter(Boolean);
};

const mapSmokingQuantity = (value?: SmokingQuantity | null): string | undefined => {
  switch (value) {
    case 'under5': return 'Under 5 a day';
    case '5to10': return '5–10 a day';
    case 'over10': return 'Over 10 a day';
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

export type IntakeAnswer = {
  number: number;
  question: string;
  answer: string | string[] | Record<string, unknown>;
};

export type CompletedIntake = {
  questions: IntakeAnswer[];
};

export function buildCompletedIntake(data: StoryData): CompletedIntake {
  const productLabels: Record<ProductName, string> = {
    medicatedShampoos: 'Medicated shampoos',
    hairOilsOrSerums: 'Hair oils or serums',
    topicalMinoxidil: 'Topical minoxidil',
    oralMinoxidil: 'Oral minoxidil',
    supplements: 'Supplements',
  };

  const procedureLabels: Record<ProcedureName, string> = {
    prp: 'PRP',
    gfcOrIprf: 'GFC or iPRF',
    stemCellsOrExosomes: 'Stem cells or exosomes',
    hairTransplant: 'Hair transplant',
    other: 'Other',
  };

  const productAnswer = (Object.keys(data.products) as ProductName[]).reduce<Record<string, unknown>>((acc, key) => {
    const entry = data.products[key];
    acc[productLabels[key]] = {
      used: entry.used,
      duration: entry.duration ? {
        under3months: 'Under 3 months',
        '3to6months': '3–6 months',
        over6months: 'Over 6 months',
      }[entry.duration] : null,
      helped: entry.helped,
      sideEffects: entry.sideEffects,
    };
    return acc;
  }, {});

  const procedureAnswer = (Object.keys(data.procedures) as ProcedureName[]).reduce<Record<string, unknown>>((acc, key) => {
    const entry = data.procedures[key];
    acc[procedureLabels[key]] = {
      done: entry.done,
      sessions: entry.sessions ? {
        '1to3': '1–3',
        '4to6': '4–6',
        over6: 'Over 6',
      }[entry.sessions] : null,
      helped: entry.helped,
      other: entry.other ?? null,
    };
    return acc;
  }, {});

  const questions: IntakeAnswer[] = [
    { number: 1, question: 'Age when hair loss began', answer: data.ageHairLossBegan !== null ? String(data.ageHairLossBegan) : 'Not answered' },
    { number: 2, question: 'Duration', answer: mapDuration(data.duration) ?? 'Not answered' },
    { number: 3, question: 'Family history', answer: data.familyHistory.length ? data.familyHistory.map(item => mapFamilyHistory([item])[0]) : 'Not answered' },
    { number: 4, question: 'Pattern', answer: data.pattern.length ? data.pattern.map(item => mapPattern([item])[0]) : 'Not answered' },
    { number: 5, question: 'Diagnosed conditions', answer: data.diagnosedConditions.length ? data.diagnosedConditions.map(item => mapDiagnosedConditions([item])[0]) : 'Not answered' },
    { number: 6, question: 'Menstrual cycle', answer: data.gender === 'female' ? mapMenstrualCycle(data.menstrualCycle) ?? 'Not answered' : 'Not applicable' },
    { number: 7, question: 'Pregnancy-related hair loss', answer: data.gender === 'female' ? mapPregnancy(data.pregnancyHairLoss) ?? 'Not answered' : 'Not applicable' },
    { number: 8, question: 'Acne or oily skin in adulthood', answer: data.acneOilySkinAdulthood === null ? 'Not answered' : data.acneOilySkinAdulthood ? 'Yes' : 'No' },
    { number: 9, question: 'Excess body or facial hair growth', answer: data.excessBodyFacialHairGrowth === null ? 'Not answered' : data.excessBodyFacialHairGrowth ? 'Yes' : 'No' },
    { number: 10, question: 'In the past 6 months', answer: data.past6Months.length ? data.past6Months.map(item => mapTrigger([item])[0]) : 'Not answered' },
    { number: 11, question: 'Habits', answer: {
      smoking: data.habits.smoking.used === null ? 'Not answered' : data.habits.smoking.used ? { used: 'Yes', quantity: mapSmokingQuantity(data.habits.smoking.quantity) ?? 'Not answered' } : 'No',
      alcohol: data.habits.alcohol === null ? 'Not answered' : data.habits.alcohol ? 'Yes' : 'No',
      hardWater: data.habits.hardWater === null ? 'Not answered' : data.habits.hardWater ? 'Yes' : 'No',
      hairWashFrequency: data.habits.hairWashFrequency ? mapHairWashFrequency(data.habits.hairWashFrequency) : 'Not answered',
      heatingOrStylingChemicals: data.habits.heatingOrStylingChemicals === null ? 'Not answered' : data.habits.heatingOrStylingChemicals ? 'Yes' : 'No',
      salonTreatments: data.habits.salonTreatments.used === null ? 'Not answered' : data.habits.salonTreatments.used ? {
        used: 'Yes',
        treatments: data.habits.salonTreatments.treatments ?? [],
        other: data.habits.salonTreatments.other ?? null,
      } : 'No',
    } },
    { number: 12, question: 'Products', answer: productAnswer },
    { number: 13, question: 'Procedures', answer: procedureAnswer },
    { number: 14, question: 'Side effects or poor response to past treatment', answer: data.sideEffectsPastTreatment.yesNo === null ? 'Not answered' : data.sideEffectsPastTreatment.yesNo ? { yes: true, description: data.sideEffectsPastTreatment.description || null } : 'No' },
    { number: 15, question: 'Preferred sample type', answer: data.sampleType ? data.sampleType.charAt(0).toUpperCase() + data.sampleType.slice(1) : 'Not answered' },
    { number: 16, question: 'Consent to sample collection and genetic analysis', answer: data.consentGeneticAnalysis === null ? 'Not answered' : data.consentGeneticAnalysis ? 'Yes' : 'No' },
  ];

  return { questions };
}

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
            options: ['Under 5 a day', '5–10 a day', 'Over 10 a day'],
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
  medicatedShampoos: { used: null },
  hairOilsOrSerums: { used: null },
  topicalMinoxidil: { used: null },
  oralMinoxidil: { used: null },
  supplements: { used: null },
});

const createDefaultProcedures = (): Record<ProcedureName, ProcedureUsage> => ({
  prp: { done: null },
  gfcOrIprf: { done: null },
  stemCellsOrExosomes: { done: null },
  hairTransplant: { done: null },
  other: { done: null },
});

const STORAGE_KEY = 'follicle_story_session';

const readStoredSession = (): { data: StoryData; currentChapter: number } | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { data?: StoryData; currentChapter?: number };
    if (!parsed || typeof parsed !== 'object') return null;

    return {
      data: {
        ...defaultData,
        ...parsed.data,
        habits: { ...defaultData.habits, ...(parsed.data?.habits ?? {}) },
        products: { ...createDefaultProducts(), ...(parsed.data?.products ?? {}) },
        procedures: { ...createDefaultProcedures(), ...(parsed.data?.procedures ?? {}) },
        sideEffectsPastTreatment: {
          ...defaultData.sideEffectsPastTreatment,
          ...(parsed.data?.sideEffectsPastTreatment ?? {}),
        },
      },
      currentChapter: typeof parsed.currentChapter === 'number' ? parsed.currentChapter : -1,
    };
  } catch {
    return null;
  }
};

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
    smoking: { used: null },
    alcohol: null,
    hardWater: null,
    hairWashFrequency: null,
    heatingOrStylingChemicals: null,
    salonTreatments: { used: null, treatments: [] },
  },
  products: createDefaultProducts(),
  procedures: createDefaultProcedures(),
  sideEffectsPastTreatment: { yesNo: null, description: '' },
  sampleType: null,
  consentGeneticAnalysis: null,
  onsetType: null,
};

const StoryContext = createContext<StoryContextType | null>(null);

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
  if (data.past6Months.includes('none') && data.past6Months.length > 1) {
    missing.push('Q10. In the past 6 months must not combine “None of these” with other triggers');
  }

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
  const [data, setData] = useState<StoryData>(() => {
    const stored = readStoredSession();
    return stored?.data ?? defaultData;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, currentChapter: -1, savedAt: Date.now() }));
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
        menstrualCycle: g === 'male' ? null : d.menstrualCycle,
        pregnancyHairLoss: g === 'male' ? null : d.pregnancyHairLoss,
      };
    });

  const setAgeOnset = (age: number) => setData(d => ({ ...d, ageHairLossBegan: age }));
  const setDuration = (value: DurationOption | null) => setData(d => ({ ...d, duration: value }));
  const setPatterns = (p: PatternOption[]) => setData(d => ({ ...d, pattern: p }));
  const setOnsetType = (t: 'gradual' | 'sudden') => setData(d => ({ ...d, onsetType: t }));
  const setTriggers = (t: Past6MonthsTrigger[]) => setData(d => ({ ...d, past6Months: t }));
  const setFamilyHistory = (f: FamilyHistoryOption[]) => setData(d => ({ ...d, familyHistory: f }));
  const setHealthConditions = (h: DiagnosedCondition[]) => setData(d => ({ ...d, diagnosedConditions: h }));
  const setMenstrualCycle = (value: MenstrualCycleOption | null) => setData(d => ({ ...d, menstrualCycle: value }));
  const setPregnancyHairLoss = (value: PregnancyStatusOption | null) => setData(d => ({ ...d, pregnancyHairLoss: value }));
  const setAcneOilySkinAdulthood = (value: boolean | null) => setData(d => ({ ...d, acneOilySkinAdulthood: value }));
  const setExcessBodyFacialHairGrowth = (value: boolean | null) => setData(d => ({ ...d, excessBodyFacialHairGrowth: value }));
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
