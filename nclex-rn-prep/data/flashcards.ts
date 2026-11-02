import type { Flashcard } from '@/types';

/** Starter nursing concept flashcards for offline study. */
export const FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-01',
    system: 'med-surg',
    front: 'Signs of left-sided heart failure',
    back: 'Pulmonary congestion: dyspnea, orthopnea, crackles, frothy sputum, decreased SpO₂. Left ventricle fails to pump → blood backs into lungs.',
  },
  {
    id: 'fc-02',
    system: 'med-surg',
    front: 'Cushing triad',
    back: 'Late sign of increased ICP: hypertension (widened pulse pressure), bradycardia, and irregular respirations. Requires immediate intervention.',
  },
  {
    id: 'fc-03',
    system: 'pharmacology',
    front: 'Therapeutic INR for warfarin (most indications)',
    back: 'Typically 2.0–3.0 for DVT/AF (mechanical valves often higher, e.g. 2.5–3.5). Monitor for bleeding; vitamin K is the antidote.',
  },
  {
    id: 'fc-04',
    system: 'pharmacology',
    front: 'Insulin peak — rapid-acting (lispro/aspart)',
    back: 'Onset ~15 min, peak ~1–2 hours, duration ~3–5 hours. Highest hypoglycemia risk around peak — ensure meal is available.',
  },
  {
    id: 'fc-05',
    system: 'maternity',
    front: 'APGAR components',
    back: 'Appearance (color), Pulse, Grimace (reflex), Activity (tone), Respiration. Scored 0–2 each at 1 and 5 minutes; ≤7 may need support/rescoring.',
  },
  {
    id: 'fc-06',
    system: 'maternity',
    front: 'Preeclampsia warning signs',
    back: 'New hypertension after 20 weeks with proteinuria or end-organ signs: severe HA, visual changes, RUQ pain, edema, hyperreflexia.',
  },
  {
    id: 'fc-07',
    system: 'psychiatric',
    front: 'SSRIs — key teaching',
    back: 'Therapeutic effect may take 2–6 weeks. Do not stop abruptly. Watch for serotonin syndrome and increased suicidal ideation early in treatment.',
  },
  {
    id: 'fc-08',
    system: 'psychiatric',
    front: 'Therapeutic communication — reflecting',
    back: 'Mirror the client’s feelings or words to show understanding and encourage elaboration (e.g., “You’re feeling overwhelmed by the diagnosis”).',
  },
  {
    id: 'fc-09',
    system: 'fundamentals',
    front: 'Fire safety — RACE',
    back: 'Rescue anyone in danger, Activate alarm, Contain (close doors), Extinguish/Evacuate. PASS for extinguisher: Pull, Aim, Squeeze, Sweep.',
  },
  {
    id: 'fc-10',
    system: 'fundamentals',
    front: 'Normal adult vital sign ranges (approx.)',
    back: 'Temp 36.5–37.5°C; HR 60–100; RR 12–20; BP ~120/80; SpO₂ ≥95% (chronic lung disease may have lower baseline).',
  },
  {
    id: 'fc-11',
    system: 'med-surg',
    front: 'Hypokalemia ECG / clinical cues',
    back: 'Muscle weakness, cramps, constipation; ECG: flattened T waves, U waves, dysrhythmias. Common with loop/thiazide diuretics.',
  },
  {
    id: 'fc-12',
    system: 'pharmacology',
    front: 'Opioid overdose triad',
    back: 'Pinpoint pupils (miosis), respiratory depression, and decreased LOC. Naloxone reverses opioids; support airway and breathing.',
  },
  {
    id: 'fc-13',
    system: 'fundamentals',
    front: 'Five rights of medication administration',
    back: 'Right patient, right drug, right dose, right route, right time — plus documentation, reason, response, and education as expanded rights.',
  },
  {
    id: 'fc-14',
    system: 'maternity',
    front: 'Lochia stages postpartum',
    back: 'Rubra (red, days 1–3), serosa (pink/brown, days 4–10), alba (yellow/white, up to ~6 weeks). Saturating a pad in ≤1 hour = hemorrhage concern.',
  },
];
