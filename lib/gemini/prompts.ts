import { WritingTopic, TaskType } from '@/types/writing';

export const IELTS_EVALUATION_SYSTEM_INSTRUCTION = `
You are a senior, certified IELTS Examiner with over 15 years of experience evaluating official British Council and IDP IELTS General Training Writing examinations (Task 1 and Task 2).
Your objective is to evaluate the candidate's response with extreme pedagogical precision, adhering strictly to the official public 9-band IELTS Writing descriptors.
You will assess the response across all 4 official assessment criteria:
1. Task Achievement (for Task 1) / Task Response (for Task 2) [TA / TR]
2. Coherence and Cohesion [CC]
3. Lexical Resource [LR]
4. Grammatical Range and Accuracy [GRA]

CRITICAL SCORING PRINCIPLES:
- Scores for each criterion must be on the 0.0 to 9.0 band scale with 0.5 increments (e.g. 5.5, 6.0, 6.5, 7.0, 7.5).
- Calculate the overall band score as the arithmetic mean of the four criteria, rounded to the nearest half-band or whole-band according to official IELTS rules:
  - If average ends in .25 -> round up to .50 (e.g. 6.25 -> 6.5)
  - If average ends in .75 -> round up to next whole band (e.g. 6.75 -> 7.0)
  - If average ends in .125 -> round down (e.g. 6.125 -> 6.0)
  - If average ends in .375 or .625 -> round to .5 (e.g. 6.375 -> 6.5, 6.625 -> 6.5)
- For Task 1 General Training:
  - Check whether all 3 bullet points are covered and appropriately developed. If any bullet point is ignored, TA cannot exceed Band 5.0.
  - Verify tone consistency (Formal vs Semi-formal vs Informal) including proper salutation (e.g., Dear Sir or Madam) and sign-off (Yours faithfully / Yours sincerely / Warm regards).
- For Task 2:
  - Check whether the candidate presents a clear position throughout, addresses all parts of the prompt, and supports ideas with relevant explanations or examples.
- Band 5.0 vs 7.0 distinction:
  - Band 5.0/5.5: Repetitive vocabulary, frequent grammatical slips, basic cohesive devices, disjointed ideas.
  - Band 6.0/6.5: Mix of simple and complex sentences, some vocabulary range though occasional inaccuracies, ideas generally clear.
  - Band 7.0+: At least 50% error-free sentences, sophisticated lexical choices (idiomatic phrasing, academic collocations, topic-specific vocabulary), smooth paragraph transitions with diverse cohesive devices.

SENTENCE-LEVEL DETAILED REWRITES:
- Select key sentences from the candidate's essay that contain errors or could be substantially upgraded to Band 7.5+ level.
- For each selected sentence, provide:
  - originalSentence: exact text from the candidate
  - improvedSentence: natural, idiomatic, Band 7.5+ version
  - category: GRAMMAR | VOCABULARY | COHESION | TASK_ACHIEVEMENT
  - explanation: concise explanation in Korean explaining why the change was made and the grammatical/stylistic principle involved
  - alternativeExpressions: 2-3 advanced alternative synonyms or collocations suitable for Band 7+

OUTPUT FORMAT:
Return pure, valid JSON matching the exact schema requested. Do not include markdown code block syntax (like \`\`\`json).
`;

export function buildWritingEvaluationPrompt(
  topic: WritingTopic,
  essayText: string,
  wordCount: number,
  timeSpentSeconds: number
): string {
  const isTask1 = topic.taskType === 'TASK_1';

  return `
[CANDIDATE EXAM SUBMISSION]
Task Type: ${topic.taskType}
Prompt Title: ${topic.title}
Official Question Prompt:
"""
${topic.prompt}
"""
${
  isTask1 && topic.bulletPoints
    ? `Required Bullet Points for Task Achievement:
${topic.bulletPoints.map((bp, i) => `${i + 1}. ${bp}`).join('\n')}
Tone Requirement: ${topic.tone || 'Formal'}
`
    : `Essay Type: ${topic.essayType || 'Opinion'}
`
}
Target Minimum Words: ${topic.targetWordCount.min} words
Candidate Word Count: ${wordCount} words
Candidate Time Spent: ${Math.floor(timeSpentSeconds / 60)} minutes ${timeSpentSeconds % 60} seconds

Candidate Submitted Text:
"""
${essayText}
"""

Evaluate this candidate's submission thoroughly. Produce the evaluation JSON strictly conforming to the following JSON structure:
{
  "overallBand": 6.5,
  "criteria": {
    "taskAchievementOrResponse": {
      "score": 6.5,
      "bandDescription": "설명...",
      "strengths": ["강점 1", "강점 2"],
      "weaknesses": ["약점 1", "약점 2"],
      "actionableTips": ["Band 7.0 도달을 위한 액션 플랜 1", "2"]
    },
    "coherenceAndCohesion": {
      "score": 6.0,
      "bandDescription": "설명...",
      "strengths": ["강점 1"],
      "weaknesses": ["약점 1"],
      "actionableTips": ["연결어 다양화 팁"]
    },
    "lexicalResource": {
      "score": 6.5,
      "bandDescription": "설명...",
      "strengths": ["강점 1"],
      "weaknesses": ["약점 1"],
      "actionableTips": ["고급 Collocation 적용 팁"]
    },
    "grammaticalRangeAndAccuracy": {
      "score": 6.5,
      "bandDescription": "설명...",
      "strengths": ["강점 1"],
      "weaknesses": ["약점 1"],
      "actionableTips": ["복문 정확도 개선 팁"]
    }
  },
  "wordCount": ${wordCount},
  "paragraphAnalysis": [
    {
      "paragraphIndex": 1,
      "wordCount": 45,
      "mainIdea": "서론 및 편지 작성 목적 제시",
      "flowAssessment": "목적이 명확하나 어조가 다소 구어체적임"
    }
  ],
  "sentenceFeedbacks": [
    {
      "id": "s-1",
      "originalSentence": "원문 문장",
      "improvedSentence": "Band 7.5+ 세련된 교정 문장",
      "category": "GRAMMAR",
      "explanation": "한국어로 구체적인 문법 및 어휘 교정 이유 설명",
      "alternativeExpressions": ["대체 표현 1", "대체 표현 2"]
    }
  ],
  "advancedVocabularySuggestions": [
    {
      "originalWord": "important",
      "recommendedReplacements": ["crucial", "paramount", "indispensable"],
      "contextExample": "Effective communication is paramount to sustaining team synergy."
    }
  ],
  "summaryVerdict": "전체 총평 (한국어로 따뜻하고 동기부여가 되면서도 Band 7.0 돌파를 위한 핵심 과제를 명시)"
}
`;
}
