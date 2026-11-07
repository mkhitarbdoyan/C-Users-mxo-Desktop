/**
 * Gemini free-tier helper for brief exam answer explanations.
 * Falls back to the question rationale when GEMINI_API_KEY is missing or the call fails.
 */

type ExplainInput = {
  stem: string;
  choices: string[];
  correctIndex: number;
  selectedIndex: number;
  rationale: string;
};

const MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';

export async function explainExamAnswer(input: ExplainInput): Promise<{
  explanation: string;
  source: 'gemini' | 'rationale';
}> {
  const letters = ['A', 'B', 'C', 'D'];
  const selectedLabel = letters[input.selectedIndex] ?? String(input.selectedIndex);
  const correctLabel = letters[input.correctIndex] ?? String(input.correctIndex);
  const isCorrect = input.selectedIndex === input.correctIndex;

  const fallback = isCorrect
    ? `Correct (${correctLabel}). ${input.rationale}`
    : `Incorrect. You chose ${selectedLabel}; the correct answer is ${correctLabel}. ${input.rationale}`;

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return { explanation: fallback, source: 'rationale' };
  }

  const choiceLines = input.choices
    .map((c, i) => `${letters[i] ?? i}. ${c}`)
    .join('\n');

  const prompt = [
    'You are an NCLEX-RN tutor. In 2–4 short sentences, explain whether the learner’s choice is correct or incorrect and why.',
    'Be clinical and concise. Do not invent facts beyond the stem, choices, and rationale.',
    '',
    `Question: ${input.stem}`,
    `Choices:\n${choiceLines}`,
    `Learner selected: ${selectedLabel}`,
    `Correct answer: ${correctLabel}`,
    `Author rationale: ${input.rationale}`,
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
    return { explanation: text, source: 'gemini' };
  } catch {
    return { explanation: fallback, source: 'rationale' };
  }
}
