/**
 * Gemini free-tier helper for brief exam answer explanations.
 * Mid-exam mode must not reveal which option letter is correct.
 * Falls back to a blind concept note when GEMINI_API_KEY is missing or the call fails.
 */

type ExplainInput = {
  stem: string;
  choices: string[];
  correctIndex: number;
  selectedIndex: number;
  rationale: string;
  /** When false (default for live exams), never name the correct option. */
  revealAnswerKey?: boolean;
};

const MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';

const KEY_LEAK_PATTERNS: RegExp[] = [
  /\bcorrect answer\b/gi,
  /\bthe (?:correct|right) (?:choice|option|answer)\b/gi,
  /\boption\s*[A-D]\s+is\s+correct\b/gi,
  /\banswer\s+is\s+[A-D]\b/gi,
  /\bchoose\s+[A-D]\b/gi,
  /\bshould (?:have )?selected\s+[A-D]\b/gi,
  /\b[A-D]\s+is\s+(?:the\s+)?(?:correct|right)\b/gi,
];

function scrubKeyLeaks(text: string): string {
  let out = text;
  for (const pattern of KEY_LEAK_PATTERNS) {
    out = out.replace(pattern, 'the preferred nursing action');
  }
  return out.replace(/\s{2,}/g, ' ').trim();
}

function blindFallback(isCorrect: boolean, selectedLabel: string): string {
  if (isCorrect) {
    return `Choice ${selectedLabel} fits the priority nursing action suggested by the stem. Focus on safety and clinical cues that support this selection as you continue.`;
  }
  return `Choice ${selectedLabel} may not address the highest priority in this scenario. Re-read the stem for ABC and safety cues, then reconsider what the nurse should do first.`;
}

function keyedFallback(
  isCorrect: boolean,
  selectedLabel: string,
  correctLabel: string,
  rationale: string
): string {
  return isCorrect
    ? `Correct (${correctLabel}). ${rationale}`
    : `Incorrect. You chose ${selectedLabel}; the correct answer is ${correctLabel}. ${rationale}`;
}

export async function explainExamAnswer(input: ExplainInput): Promise<{
  explanation: string;
  source: 'gemini' | 'rationale';
}> {
  const letters = ['A', 'B', 'C', 'D'];
  const selectedLabel = letters[input.selectedIndex] ?? String(input.selectedIndex);
  const correctLabel = letters[input.correctIndex] ?? String(input.correctIndex);
  const isCorrect = input.selectedIndex === input.correctIndex;
  const revealAnswerKey = Boolean(input.revealAnswerKey);

  const fallback = revealAnswerKey
    ? keyedFallback(isCorrect, selectedLabel, correctLabel, input.rationale)
    : blindFallback(isCorrect, selectedLabel);

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return { explanation: fallback, source: 'rationale' };
  }

  const choiceLines = input.choices
    .map((c, i) => `${letters[i] ?? i}. ${c}`)
    .join('\n');

  const prompt = revealAnswerKey
    ? [
        'You are an NCLEX-RN tutor. In 2–4 short sentences, explain whether the learner’s choice is correct or incorrect and why.',
        'Be clinical and concise. Do not invent facts beyond the stem, choices, and rationale.',
        '',
        `Question: ${input.stem}`,
        `Choices:\n${choiceLines}`,
        `Learner selected: ${selectedLabel}`,
        `Correct answer: ${correctLabel}`,
        `Author rationale: ${input.rationale}`,
      ].join('\n')
    : [
        'You are an NCLEX-RN tutor giving mid-exam coaching.',
        'In 2–4 short sentences, discuss the clinical concept behind the learner’s selected choice.',
        'CRITICAL: Do NOT say which option letter is correct. Do NOT say “the correct answer is…”. Do NOT name any other option as right or wrong.',
        'You may say whether their selected choice is a strong or weak priority for this stem, without revealing the answer key.',
        'Be clinical and concise. Do not invent facts beyond the stem and choices.',
        '',
        `Question: ${input.stem}`,
        `Choices:\n${choiceLines}`,
        `Learner selected: ${selectedLabel}`,
        `Internal hint (do not reveal letters): the learner’s choice is ${isCorrect ? 'aligned' : 'not aligned'} with the preferred action.`,
      ].join('\n');

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 220,
        },
      }),
    });

    if (!response.ok) {
      return { explanation: fallback, source: 'rationale' };
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('').trim();
    if (!text) {
      return { explanation: fallback, source: 'rationale' };
    }

    const explanation = revealAnswerKey ? text : scrubKeyLeaks(text);
    return { explanation, source: 'gemini' };
  } catch {
    return { explanation: fallback, source: 'rationale' };
  }
}
