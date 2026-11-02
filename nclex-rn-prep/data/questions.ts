import type { Question } from '@/types';

/**
 * Original NCLEX-style sample questions for offline practice.
 * Not affiliated with NCSBN; for study scaffolding only.
 */
export const QUESTIONS: Question[] = [
  {
    id: 'q-ms-01',
    system: 'med-surg',
    stem: 'A client with heart failure is prescribed furosemide. Which finding should the nurse report to the provider immediately?',
    choices: [
      'Urine output of 40 mL/hr for the past 2 hours',
      'Serum potassium of 2.9 mEq/L',
      'Blood pressure of 118/76 mm Hg',
      'Mild orthostatic dizziness when standing',
    ],
    correctIndex: 1,
    rationale:
      'Hypokalemia (K+ < 3.5 mEq/L) is a serious adverse effect of loop diuretics and can precipitate dysrhythmias. Report a potassium of 2.9 mEq/L promptly.',
  },
  {
    id: 'q-ms-02',
    system: 'med-surg',
    stem: 'A postoperative client develops sudden dyspnea, chest pain, and anxiety. Oxygen saturation drops to 88% on room air. Which action should the nurse take first?',
    choices: [
      'Encourage incentive spirometry',
      'Place the client in high Fowler position and apply oxygen',
      'Obtain a 12-lead ECG',
      'Notify the rapid response team after completing a full assessment',
    ],
    correctIndex: 1,
    rationale:
      'Acute respiratory distress suggests possible PE or other airway/breathing threat. Prioritize ABCs: upright positioning and supplemental oxygen before further diagnostics.',
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
      'Late decelerations indicate uteroplacental insufficiency. Immediate interventions include left lateral positioning, oxygen, IV fluid bolus, and stopping oxytocin if infusing, then notifying the provider.',
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
  },
  {
    id: 'q-ms-03',
    system: 'med-surg',
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
  },
];
