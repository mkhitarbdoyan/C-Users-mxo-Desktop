import { PrismaClient, type Difficulty, type NursingSystem } from '@prisma/client';

const prisma = new PrismaClient();

type SeedQuestion = {
  id: string;
  system: NursingSystem;
  stem: string;
  choices: [string, string, string, string];
  correctIndex: number;
  rationale: string;
  imageUrl?: string | null;
  difficulty: Difficulty;
};

type SeedFlashcard = {
  id: string;
  system: NursingSystem;
  front: string;
  back: string;
  difficulty: Difficulty;
};

const QUESTIONS: SeedQuestion[] = [
  {
    id: 'q-ms-01',
    system: 'med_surg',
    stem: 'A client with heart failure is prescribed furosemide. Which finding should the nurse report to the provider immediately?',
    choices: [
      'Urine output of 40 mL/hr for the past 2 hours',
      'Serum potassium of 2.9 mEq/L',
      'Blood pressure of 118/76 mm Hg',
      'Mild orthostatic dizziness when standing',
    ],
    correctIndex: 1,
    rationale:
      'Hypokalemia (K+ < 3.5 mEq/L) is a serious adverse effect of loop diuretics and can precipitate dysrhythmias. A potassium of 2.9 mEq/L should be reported promptly because low potassium increases the risk of ventricular ectopy and digoxin toxicity if the client is also on cardiac glycosides. Mild orthostasis and a urine output of 40 mL/hr can be expected early after diuresis and are less urgent than a critically low potassium.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    difficulty: 'medium',
  },
  {
    id: 'q-ms-02',
    system: 'med_surg',
    stem: 'A postoperative client develops sudden dyspnea, chest pain, and anxiety. Oxygen saturation drops to 88% on room air. Which action should the nurse take first?',
    choices: [
      'Encourage incentive spirometry',
      'Place the client in high Fowler position and apply oxygen',
      'Obtain a 12-lead ECG',
      'Notify the rapid response team after completing a full assessment',
    ],
    correctIndex: 1,
    rationale:
      'Acute respiratory distress suggests possible pulmonary embolism or another immediate airway/breathing threat. Prioritize ABCs: place the client upright and apply supplemental oxygen before diagnostics such as ECG. Calling for help is important, but oxygenation and positioning should begin immediately while additional support is obtained. Incentive spirometry is for atelectasis prevention, not acute desaturation with chest pain.',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80',
    difficulty: 'hard',
  },
  {
    id: 'q-ph-01',
    system: 'pharmacology',
    stem: 'Before administering digoxin to an adult client, which assessment finding would cause the nurse to hold the dose and notify the provider?',
    choices: [
      'Apical pulse of 52 beats/min',
      'Blood pressure of 132/84 mm Hg',
      'Serum digoxin level of 1.0 ng/mL',
      'Mild ankle edema',
    ],
    correctIndex: 0,
    rationale:
      'Hold digoxin for an apical pulse below 60 beats/min in adults (per facility protocol) and notify the provider — bradycardia may indicate digoxin toxicity or excess effect.',
    difficulty: 'easy',
  },
  {
    id: 'q-ph-02',
    system: 'pharmacology',
    stem: 'A client is started on warfarin after a DVT. Which teaching point is most important?',
    choices: [
      'Take an extra dose if a dose is missed earlier the same day',
      'Avoid all leafy green vegetables permanently',
      'Use a soft toothbrush and report unusual bleeding or bruising',
      'Stop the medication when swelling in the leg resolves',
    ],
    correctIndex: 2,
    rationale:
      'Warfarin increases bleeding risk. Clients should use soft toothbrushes, avoid injury, and report bleeding. Vitamin K intake should stay consistent, not eliminated; therapy is usually continued as prescribed.',
    difficulty: 'medium',
  },
  {
    id: 'q-mat-01',
    system: 'maternity',
    stem: 'A laboring client at 39 weeks has a fetal heart rate baseline of 140 with late decelerations. Which nursing action is the priority?',
    choices: [
      'Encourage the client to push with contractions',
      'Reposition the client to the left lateral side and administer oxygen',
      'Increase the oxytocin infusion rate',
      'Prepare for immediate forceps delivery without notifying the provider',
    ],
    correctIndex: 1,
    rationale:
      'Late decelerations indicate uteroplacental insufficiency and fetal hypoxia risk. Immediate intrauterine resuscitation includes left lateral positioning to improve uterine perfusion, supplemental oxygen, an IV fluid bolus, and stopping oxytocin if it is infusing, then notifying the provider. Encouraging pushing or increasing oxytocin can worsen decelerations. Instrumental delivery is a provider decision after stabilization measures.',
    imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80',
    difficulty: 'hard',
  },
  {
    id: 'q-mat-02',
    system: 'maternity',
    stem: 'A postpartum client 2 hours after vaginal delivery saturates a perineal pad in 15 minutes and feels lightheaded. What should the nurse do first?',
    choices: [
      'Assist the client to the bathroom to void',
      'Massage the uterine fundus and assess lochia',
      'Document findings and reassess in 30 minutes',
      'Encourage oral fluids and rest',
    ],
    correctIndex: 1,
    rationale:
      'Pad saturation in ≤15 minutes with lightheadedness suggests postpartum hemorrhage. Fundal massage and assessment of tone/lochia are immediate first actions while calling for help.',
    difficulty: 'medium',
  },
  {
    id: 'q-psy-01',
    system: 'psychiatric',
    stem: 'A client with major depression says, “There’s no point in living anymore.” Which response by the nurse is most appropriate?',
    choices: [
      '“Things will look better tomorrow.”',
      '“You shouldn’t feel that way; you have so much to live for.”',
      '“Are you thinking about harming yourself?”',
      '“Let’s talk about something more positive.”',
    ],
    correctIndex: 2,
    rationale:
      'Directly assessing suicidal ideation is a safety priority. Vague reassurance or changing the subject can miss risk and invalidate the client’s feelings.',
    difficulty: 'easy',
  },
  {
    id: 'q-psy-02',
    system: 'psychiatric',
    stem: 'A client with schizophrenia is pacing and speaking loudly to unseen people. Which intervention is best initially?',
    choices: [
      'Argue that the voices are not real',
      'Isolate the client in a locked room immediately',
      'Acknowledge the client’s experience and offer a quiet, lower-stimulus environment',
      'Administer PRN medication without assessment',
    ],
    correctIndex: 2,
    rationale:
      'Validate the client’s experience without reinforcing delusions, reduce stimuli, and assess for distress/safety. Confrontation and premature isolation can escalate agitation.',
    difficulty: 'medium',
  },
  {
    id: 'q-fun-01',
    system: 'fundamentals',
    stem: 'When caring for a client on contact precautions for C. difficile, which PPE practice is correct?',
    choices: [
      'Use alcohol-based hand rub after removing gloves',
      'Wear a gown and gloves and wash hands with soap and water after care',
      'Only wear a surgical mask when entering the room',
      'Leave the room with gloves on to dispose of linen in the hallway',
    ],
    correctIndex: 1,
    rationale:
      'C. difficile spores are not reliably killed by alcohol rubs. Contact precautions require gown and gloves; hand hygiene with soap and water after care.',
    difficulty: 'easy',
  },
  {
    id: 'q-fun-02',
    system: 'fundamentals',
    stem: 'The nurse is preparing to administer an intramuscular injection of 2 mL to an adult. Which site is preferred?',
    choices: [
      'Dorsogluteal muscle',
      'Deltoid muscle for all volumes over 1 mL',
      'Ventrogluteal muscle',
      'Abdomen using the Z-track method only',
    ],
    correctIndex: 2,
    rationale:
      'The ventrogluteal site is preferred for IM injections in adults because it is away from major nerves and vessels. The dorsogluteal site is no longer recommended.',
    difficulty: 'medium',
  },
  {
    id: 'q-ms-03',
    system: 'med_surg',
    stem: 'A client with type 1 diabetes has a blood glucose of 52 mg/dL and is diaphoretic but alert. Which action should the nurse take first?',
    choices: [
      'Administer glucagon IM',
      'Give 15 g of a fast-acting carbohydrate',
      'Call a code blue',
      'Document and recheck in one hour',
    ],
    correctIndex: 1,
    rationale:
      'For conscious hypoglycemic clients, treat with ~15 g fast-acting carbohydrate (rule of 15), then recheck. Glucagon is for severe hypoglycemia with altered consciousness.',
    difficulty: 'easy',
  },
  {
    id: 'q-ph-03',
    system: 'pharmacology',
    stem: 'A client taking lisinopril reports a persistent dry cough. What is the nurse’s best action?',
    choices: [
      'Reassure that the cough is unrelated to the medication',
      'Instruct the client to stop the medication today',
      'Notify the provider; an ACE inhibitor–related cough may require a switch',
      'Increase the dose to overcome tolerance to the side effect',
    ],
    correctIndex: 2,
    rationale:
      'A dry cough is a known ACE inhibitor adverse effect. The provider may switch to an ARB. Clients should not stop antihypertensives without guidance or increase the dose.',
    difficulty: 'medium',
  },
];

const FLASHCARDS: SeedFlashcard[] = [
  {
    id: 'fc-01',
    system: 'med_surg',
    front: 'Signs of left-sided heart failure',
    back: 'Pulmonary congestion: dyspnea, orthopnea, crackles, frothy sputum, decreased SpO₂. Left ventricle fails to pump → blood backs into lungs.',
    difficulty: 'easy',
  },
  {
    id: 'fc-02',
    system: 'med_surg',
    front: 'Cushing triad',
    back: 'Late sign of increased ICP: hypertension (widened pulse pressure), bradycardia, and irregular respirations. Requires immediate intervention.',
    difficulty: 'medium',
  },
  {
    id: 'fc-03',
    system: 'pharmacology',
    front: 'Therapeutic INR for warfarin (most indications)',
    back: 'Typically 2.0–3.0 for DVT/AF (mechanical valves often higher, e.g. 2.5–3.5). Monitor for bleeding; vitamin K is the antidote.',
    difficulty: 'medium',
  },
  {
    id: 'fc-04',
    system: 'pharmacology',
    front: 'Insulin peak — rapid-acting (lispro/aspart)',
    back: 'Onset ~15 min, peak ~1–2 hours, duration ~3–5 hours. Highest hypoglycemia risk around peak — ensure meal is available.',
    difficulty: 'hard',
  },
  {
    id: 'fc-05',
    system: 'maternity',
    front: 'APGAR components',
    back: 'Appearance (color), Pulse, Grimace (reflex), Activity (tone), Respiration. Scored 0–2 each at 1 and 5 minutes; ≤7 may need support/rescoring.',
    difficulty: 'easy',
  },
  {
    id: 'fc-06',
    system: 'maternity',
    front: 'Preeclampsia warning signs',
    back: 'New hypertension after 20 weeks with proteinuria or end-organ signs: severe HA, visual changes, RUQ pain, edema, hyperreflexia.',
    difficulty: 'medium',
  },
  {
    id: 'fc-07',
    system: 'psychiatric',
    front: 'SSRIs — key teaching',
    back: 'Therapeutic effect may take 2–6 weeks. Do not stop abruptly. Watch for serotonin syndrome and increased suicidal ideation early in treatment.',
    difficulty: 'medium',
  },
  {
    id: 'fc-08',
    system: 'psychiatric',
    front: 'Therapeutic communication — reflecting',
    back: 'Mirror the client’s feelings or words to show understanding and encourage elaboration (e.g., “You’re feeling overwhelmed by the diagnosis”).',
    difficulty: 'easy',
  },
  {
    id: 'fc-09',
    system: 'fundamentals',
    front: 'Fire safety — RACE',
    back: 'Rescue anyone in danger, Activate alarm, Contain (close doors), Extinguish/Evacuate. PASS for extinguisher: Pull, Aim, Squeeze, Sweep.',
    difficulty: 'easy',
  },
  {
    id: 'fc-10',
    system: 'fundamentals',
    front: 'Normal adult vital sign ranges (approx.)',
    back: 'Temp 36.5–37.5°C; HR 60–100; RR 12–20; BP ~120/80; SpO₂ ≥95% (chronic lung disease may have lower baseline).',
    difficulty: 'easy',
  },
  {
    id: 'fc-11',
    system: 'med_surg',
    front: 'Hypokalemia ECG / clinical cues',
    back: 'Muscle weakness, cramps, constipation; ECG: flattened T waves, U waves, dysrhythmias. Common with loop/thiazide diuretics.',
    difficulty: 'medium',
  },
  {
    id: 'fc-12',
    system: 'pharmacology',
    front: 'Opioid overdose triad',
    back: 'Pinpoint pupils (miosis), respiratory depression, and decreased LOC. Naloxone reverses opioids; support airway and breathing.',
    difficulty: 'easy',
  },
  {
    id: 'fc-13',
    system: 'fundamentals',
    front: 'Five rights of medication administration',
    back: 'Right patient, right drug, right dose, right route, right time — plus documentation, reason, response, and education as expanded rights.',
    difficulty: 'easy',
  },
  {
    id: 'fc-14',
    system: 'maternity',
    front: 'Lochia stages postpartum',
    back: 'Rubra (red, days 1–3), serosa (pink/brown, days 4–10), alba (yellow/white, up to ~6 weeks). Saturating a pad in ≤1 hour = hemorrhage concern.',
    difficulty: 'medium',
  },
];

async function main() {
  for (const q of QUESTIONS) {
    await prisma.question.upsert({
      where: { id: q.id },
      create: {
        id: q.id,
        system: q.system,
        stem: q.stem,
        choices: q.choices,
        correctIndex: q.correctIndex,
        rationale: q.rationale,
        imageUrl: q.imageUrl ?? null,
        difficulty: q.difficulty,
      },
      update: {
        system: q.system,
        stem: q.stem,
        choices: q.choices,
        correctIndex: q.correctIndex,
        rationale: q.rationale,
        imageUrl: q.imageUrl ?? null,
        difficulty: q.difficulty,
      },
    });
  }

  for (const card of FLASHCARDS) {
    await prisma.flashcard.upsert({
      where: { id: card.id },
      create: card,
      update: {
        system: card.system,
        front: card.front,
        back: card.back,
        difficulty: card.difficulty,
      },
    });
  }

  console.log(`Seeded ${QUESTIONS.length} questions and ${FLASHCARDS.length} flashcards.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
