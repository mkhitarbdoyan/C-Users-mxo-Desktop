import type { TopicCategory } from '@/types';

export type TopicCondition = {
  id: string;
  name: string;
  /** One-line clinical snapshot. */
  summary: string;
  /** High-yield cues / pathophysiology shortcuts. */
  keyPoints: string[];
  /** Priority nursing actions. */
  nursingPriorities: string[];
};

export type TopicGuide = {
  id: TopicCategory;
  label: string;
  blurb: string;
  conditions: TopicCondition[];
};

export const TOPIC_GUIDES: TopicGuide[] = [
  {
    id: 'cardiac',
    label: 'Cardiac',
    blurb: 'Heart failure, ACS, dysrhythmias, and perfusion priorities.',
    conditions: [
      {
        id: 'hf',
        name: 'Heart failure',
        summary: 'Pump failure → congestion (left = lungs, right = body) and low perfusion.',
        keyPoints: [
          'Left-sided: dyspnea, orthopnea, crackles, frothy sputum.',
          'Right-sided: edema, JVD, weight gain, ascites.',
          'Watch K+ closely with loop diuretics (e.g., furosemide).',
        ],
        nursingPriorities: [
          'Oxygen, upright positioning, daily weights, I&O.',
          'Report hypokalemia, sudden weight gain, worsening dyspnea.',
        ],
      },
      {
        id: 'acs',
        name: 'Acute coronary syndrome',
        summary: 'Myocardial ischemia from coronary occlusion — time = muscle.',
        keyPoints: [
          'Chest pain/pressure, diaphoresis, nausea, dyspnea; atypical in women/diabetics.',
          'MONA-BASH style orders vary by protocol; prioritize ABCs and ECG.',
        ],
        nursingPriorities: [
          '12-lead ECG, oxygen if hypoxic, IV access, continuous monitoring.',
          'Prepare for reperfusion pathway per facility protocol.',
        ],
      },
    ],
  },
  {
    id: 'respiratory',
    label: 'Respiratory',
    blurb: 'Airway, oxygenation, PE, and acute breathing emergencies.',
    conditions: [
      {
        id: 'pe',
        name: 'Pulmonary embolism',
        summary: 'Sudden dyspnea, chest pain, anxiety, desaturation — ABC emergency.',
        keyPoints: [
          'Risk: DVT, surgery, immobility, estrogen, cancer.',
          'Do not delay oxygen for lengthy assessment.',
        ],
        nursingPriorities: [
          'High Fowler + oxygen, call for help / rapid response as needed.',
          'Monitor SpO₂, vitals; anticipate CT/ABG and anticoagulation orders.',
        ],
      },
      {
        id: 'asthma-copd',
        name: 'Asthma / COPD exacerbation',
        summary: 'Airway obstruction with wheeze, prolonged expiration, accessory use.',
        keyPoints: [
          'Silent chest = ominous (severe obstruction).',
          'Bronchodilators + steroids; avoid sedating until airway secure.',
        ],
        nursingPriorities: [
          'Sit upright, oxygen to target SpO₂, nebulizers as ordered.',
          'Reassess work of breathing and peak flow when appropriate.',
        ],
      },
    ],
  },
  {
    id: 'neuro',
    label: 'Neuro',
    blurb: 'Stroke, ICP, seizures, and neurologic assessment cues.',
    conditions: [
      {
        id: 'stroke',
        name: 'Acute ischemic stroke',
        summary: 'Sudden focal deficit — last known well time drives treatment window.',
        keyPoints: [
          'BE-FAST: Balance, Eyes, Face, Arm, Speech, Time.',
          'NPO until swallow screen; protect airway.',
        ],
        nursingPriorities: [
          'Activate stroke protocol; CT before thrombolysis decisions.',
          'Frequent neuro checks; control BP per protocol.',
        ],
      },
      {
        id: 'icp',
        name: 'Increased ICP',
        summary: 'Rising pressure threatens perfusion — early cues beat late herniation signs.',
        keyPoints: [
          'Early: headache, vomiting, altered LOC, pupil changes.',
          'Late: Cushing triad (↑ SBP, ↓ HR, irregular respirations).',
        ],
        nursingPriorities: [
          'HOB ~30°, head midline, avoid clustering care / Valsalva.',
          'Report declining LOC or new pupil asymmetry immediately.',
        ],
      },
    ],
  },
  {
    id: 'pharmacology',
    label: 'Pharmacology',
    blurb: 'High-alert meds, adverse effects, and safe administration.',
    conditions: [
      {
        id: 'digoxin',
        name: 'Digoxin',
        summary: 'Cardiac glycoside — hold for bradycardia; toxicity risk with hypokalemia.',
        keyPoints: [
          'Check apical pulse; hold if <60/min (adult, per protocol).',
          'Toxicity: anorexia, N/V, visual changes, dysrhythmias.',
        ],
        nursingPriorities: [
          'Apical pulse 1 full minute before dose.',
          'Monitor K+ and digoxin level; teach reportable symptoms.',
        ],
      },
      {
        id: 'warfarin',
        name: 'Warfarin',
        summary: 'Vitamin K antagonist — bleeding risk; keep vitamin K intake consistent.',
        keyPoints: [
          'INR monitoring; soft toothbrush, electric razor, report bruising/bleeding.',
          'Many drug/food interactions.',
        ],
        nursingPriorities: [
          'Bleeding precautions and fall prevention.',
          'Do not stop therapy without provider guidance.',
        ],
      },
      {
        id: 'acei',
        name: 'ACE inhibitors',
        summary: 'Lower BP / afterload — watch cough, hyperkalemia, angioedema.',
        keyPoints: [
          'Persistent dry cough may need switch to ARB.',
          'First-dose hypotension; monitor renal function and K+.',
        ],
        nursingPriorities: [
          'Teach to report cough, swelling of lips/tongue, dizziness.',
          'Do not double dose or stop abruptly without guidance.',
        ],
      },
    ],
  },
  {
    id: 'maternity',
    label: 'Maternity',
    blurb: 'Antepartum, intrapartum, and postpartum safety checks.',
    conditions: [
      {
        id: 'late-decels',
        name: 'Late decelerations',
        summary: 'Uteroplacental insufficiency pattern — act before calling only.',
        keyPoints: [
          'Decel begins after contraction peak and recovers late.',
          'Stop oxytocin if infusing.',
        ],
        nursingPriorities: [
          'Left lateral position, oxygen, IV fluid bolus, notify provider.',
          'Prepare for further intrauterine resuscitation steps.',
        ],
      },
      {
        id: 'pph',
        name: 'Postpartum hemorrhage',
        summary: 'Pad saturation ≤15 min + lightheadedness = act for bleeding now.',
        keyPoints: [
          'Uterine atony is a leading cause — boggy fundus.',
          'Quantify blood loss; watch for tachycardia/hypotension.',
        ],
        nursingPriorities: [
          'Fundal massage, assess lochia/clots, call for help.',
          'IV access, oxytocin/uterotonics per protocol, empty bladder.',
        ],
      },
    ],
  },
  {
    id: 'psychiatric',
    label: 'Psychiatric',
    blurb: 'Mood, psychosis, safety, and therapeutic communication.',
    conditions: [
      {
        id: 'suicide-risk',
        name: 'Suicide risk',
        summary: 'Directly ask about ideation/plan — safety before reassurance.',
        keyPoints: [
          'Avoid changing the subject or minimizing feelings.',
          '1:1 observation when acutely unsafe.',
        ],
        nursingPriorities: [
          'Assess ideation, plan, means, intent.',
          'Remove hazards; stay with client; escalate per protocol.',
        ],
      },
      {
        id: 'psychosis',
        name: 'Acute psychosis / hallucinations',
        summary: 'Validate experience without reinforcing delusion; lower stimuli.',
        keyPoints: [
          'Do not argue that voices are unreal.',
          'Watch for escalating agitation and safety risk.',
        ],
        nursingPriorities: [
          'Quiet environment, calm presence, offer PRN after assessment.',
          'Reorient gently; protect client and others.',
        ],
      },
    ],
  },
  {
    id: 'fundamentals',
    label: 'Fundamentals',
    blurb: 'Infection control, injections, and core nursing skills.',
    conditions: [
      {
        id: 'cdiff',
        name: 'C. difficile precautions',
        summary: 'Spore-forming — soap and water, not alcohol rub alone.',
        keyPoints: [
          'Contact precautions: gown + gloves.',
          'Dedicated equipment when possible.',
        ],
        nursingPriorities: [
          'Hand hygiene with soap and water after care.',
          'Do not leave room in contaminated PPE.',
        ],
      },
      {
        id: 'im-site',
        name: 'IM injection sites',
        summary: 'Ventrogluteal preferred in adults for many IM volumes.',
        keyPoints: [
          'Avoid dorsogluteal (sciatic nerve risk).',
          'Deltoid limited volume (~1 mL typical).',
        ],
        nursingPriorities: [
          'Landmarks correctly; Z-track when indicated.',
          'Aspirate only if facility policy requires.',
        ],
      },
    ],
  },
  {
    id: 'endocrine',
    label: 'Endocrine',
    blurb: 'Diabetes, thyroid, and hormone-related emergencies.',
    conditions: [
      {
        id: 'hypoglycemia',
        name: 'Hypoglycemia',
        summary: 'BG low + symptoms — treat conscious clients with fast carbs (rule of 15).',
        keyPoints: [
          'Diaphoresis, tremor, confusion, hunger; severe → seizure/coma.',
          'Glucagon / IV dextrose if altered LOC.',
        ],
        nursingPriorities: [
          'If alert: ~15 g carbohydrate, recheck in 15 min.',
          'If unresponsive: airway + emergency glucose pathway.',
        ],
      },
      {
        id: 'dka',
        name: 'DKA (high-yield cues)',
        summary: 'Insulin deficiency → hyperglycemia, ketones, anion-gap acidosis.',
        keyPoints: [
          'Polyuria, polydipsia, fruity breath, Kussmaul respirations.',
          'Fluid and insulin protocols; monitor K+ closely.',
        ],
        nursingPriorities: [
          'IV fluids first per protocol, then insulin drip as ordered.',
          'Frequent labs; cardiac monitoring for electrolyte shifts.',
        ],
      },
    ],
  },
];

export const TOPIC_CATEGORY_IDS = TOPIC_GUIDES.map((t) => t.id);

export function getTopicGuide(id: string): TopicGuide | undefined {
  return TOPIC_GUIDES.find((t) => t.id === id);
}
