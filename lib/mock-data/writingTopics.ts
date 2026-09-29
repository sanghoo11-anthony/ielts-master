import { WritingTopic } from '@/types/writing';

export const MOCK_WRITING_TOPICS: WritingTopic[] = [
  // --- Task 1: Letters (IELTS General) ---
  {
    id: 'topic-gt-task1-01',
    taskType: 'TASK_1',
    tone: 'FORMAL',
    title: '분실 수하물에 대한 항공사 공식 항의 및 보상 요청 편지',
    prompt: `You recently traveled on a flight with an airline and your checked baggage was lost upon arrival. You have not received any satisfactory response from the airport customer support team.

Write a formal letter to the Airline Customer Service Manager. In your letter:
• Give details of your flight and baggage
• Explain the inconvenience and problems this situation has caused you
• State clearly what action you expect the airline to take`,
    bulletPoints: [
      'Give details of your flight and baggage',
      'Explain the inconvenience and problems this situation has caused you',
      'State clearly what action you expect the airline to take',
    ],
    targetWordCount: { min: 150, recommended: 175 },
    timeLimitMinutes: 20,
    difficulty: 'BAND_6_7',
    sampleAnswers: [
      {
        bandScore: 7.5,
        answerText: `Dear Sir or Madam,

I am writing to express my profound dissatisfaction regarding the loss of my checked luggage on flight QA-382 from Singapore to London Heathrow on October 14th, 2026.

Upon landing at Terminal 4, my suitcase (a black Samsonite hard-shell spinner with baggage tag number QA-928174) failed to appear on baggage carousel 6. Although I immediately filed a Property Irregularity Report (reference: LHRQA10293) at the service desk, your representatives were unable to provide any verifiable tracking information.

This delay has placed me in an extraordinarily distressing circumstance. As I am currently in London to deliver a keynote speech at an international conference, the lost luggage contained both my tailored professional attire and essential presentation materials stored on secure encrypted drives. Consequently, I was forced to expend considerable personal funds to acquire emergency clothing and replacement accessories.

I request that your logistics team locate and expedite the delivery of my luggage to my hotel address within 24 hours. Furthermore, I expect full reimbursement for the emergency expenditures incurred, receipts for which are enclosed herewith.

I anticipate your prompt resolution of this matter.

Yours faithfully,
Sanghoo Kim`,
        examinerComment:
          'Excellent formal register and clear tone throughout. All three bullet points are thoroughly developed with precise context (Task Achievement 8.0). High degree of lexical sophistication (Lexical Resource 7.5). Smooth cohesive progression (Coherence & Cohesion 7.5). Overall Band 7.5.',
      },
    ],
  },
  {
    id: 'topic-gt-task1-02',
    taskType: 'TASK_1',
    tone: 'SEMI_FORMAL',
    title: '직속 상사에게 유연 근무제(원격 근무) 승인을 요청하는 서신',
    prompt: `You want to request permission from your manager to work from home two days a week due to changes in your personal circumstances.

Write a letter to your manager. In your letter:
• Explain why you want to adopt a hybrid work schedule
• Describe how this arrangement will not negatively impact your current projects
• Suggest a trial period and propose how your performance can be evaluated`,
    bulletPoints: [
      'Explain why you want to adopt a hybrid work schedule',
      'Describe how this arrangement will not negatively impact your current projects',
      'Suggest a trial period and propose how your performance can be evaluated',
    ],
    targetWordCount: { min: 150, recommended: 170 },
    timeLimitMinutes: 20,
    difficulty: 'BAND_6_7',
  },
  {
    id: 'topic-gt-task1-03',
    taskType: 'TASK_1',
    tone: 'INFORMAL',
    title: '새로운 도시로 이사한 후 친구를 초대하고 조언을 구하는 편지',
    prompt: `You have recently moved to a new city for a new job. 

Write a letter to an English-speaking friend. In your letter:
• Describe your new apartment and the neighborhood
• Invite your friend to come and stay with you for a weekend
• Ask for their advice about activities or places to explore in the city`,
    bulletPoints: [
      'Describe your new apartment and the neighborhood',
      'Invite your friend to come and stay with you for a weekend',
      'Ask for their advice about activities or places to explore in the city',
    ],
    targetWordCount: { min: 150, recommended: 165 },
    timeLimitMinutes: 20,
    difficulty: 'BAND_5_6',
  },

  // --- Task 2: Essays (IELTS General) ---
  {
    id: 'topic-gt-task2-01',
    taskType: 'TASK_2',
    essayType: 'OPINION',
    title: '원격 근무의 확산과 전통적 사무실 출근 문화의 지속성 여부',
    prompt: `With advancements in digital communication technology, an increasing number of companies are allowing employees to work remotely from home rather than working in traditional offices.

Do you agree or disagree with the view that remote work is more beneficial for both employers and employees?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.`,
    targetWordCount: { min: 250, recommended: 285 },
    timeLimitMinutes: 40,
    difficulty: 'BAND_7_PLUS',
    sampleAnswers: [
      {
        bandScore: 7.5,
        answerText: `The rapid evolution of telecommunication technologies has catalyzed a paradigm shift in modern corporate culture, prompting many organizations to transition toward telecommuting. I firmly agree that remote work offers substantial advantages to both corporate entities and individual workers, fundamentally enhancing productivity and personal well-being.

From an organizational perspective, embracing decentralized working models drastically curtail operational overheads. Companies no longer need to lease sprawling commercial properties in expensive metropolitan centers, nor do they incur exorbitant expenditure on utilities and office amenities. Furthermore, employers can recruit top-tier talent from a global candidate pool unconstrained by geographical boundaries. For instance, multinational tech enterprises frequently assemble distributed development teams across varying time zones, facilitating continuous round-the-clock progress while reducing payroll expenditures.

For employees, telecommuting eliminates the daily ordeal of commuting, thereby fostering a superior work-life balance. Commuters in bustling urban centers often squander hours daily navigating congested transit systems, which induces substantial mental and physical fatigue. By reclaiming this lost time, individuals can dedicate more attention to physical exercise, familial responsibilities, and professional development. Additionally, autonomous working environments afford employees greater flexibility to organize their schedules during their peak cognitive hours, directly bolstering workplace output and job satisfaction.

However, critics often contend that teleworking erodes camaraderie and complicates supervision. While this concern holds merit, contemporary project management suites and video conferencing platforms adequately mitigate these hurdles when managed proactively with transparent key performance indicators.

In conclusion, the proliferation of remote work represents an overwhelmingly positive transformation. By slashing corporate expenditure and empowering workers with greater autonomy, remote working fosters a symbiotic environment conducive to sustained prosperity.`,
        examinerComment:
          'Clear position sustained throughout (Task Response 8.0). Sophisticated cohesive structures and smooth paragraph transitions (CC 7.5). Wide range of academic vocabulary such as "catalyzed a paradigm shift", "curtail operational overheads", "symbiotic environment" (LR 8.0). Complex sentence structures with minimal error (GRA 7.5). Overall Band 7.5~8.0.',
      },
    ],
  },
  {
    id: 'topic-gt-task2-02',
    taskType: 'TASK_2',
    essayType: 'DISCUSSION',
    title: '대학 교육의 목표: 직업 실무 기술 중심 vs 폭넓은 학문적 소양 함양',
    prompt: `Some people believe that university education should primarily focus on providing graduates with practical knowledge and skills needed for workplace employment. Others argue that universities should offer a broad general education regardless of career utility.

Discuss both views and give your own opinion.`,
    targetWordCount: { min: 250, recommended: 280 },
    timeLimitMinutes: 40,
    difficulty: 'BAND_6_7',
  },
  {
    id: 'topic-gt-task2-03',
    taskType: 'TASK_2',
    essayType: 'PROBLEM_SOLUTION',
    title: '현대 대도시의 극심한 교통 체증 원인과 정부의 실효적 해결책',
    prompt: `In many major cities around the world, traffic congestion has become a severe problem that affects air quality and the daily lives of residents.

What are the primary causes of this issue, and what practical measures can governments implement to resolve it?`,
    targetWordCount: { min: 250, recommended: 275 },
    timeLimitMinutes: 40,
    difficulty: 'BAND_6_7',
  },
];
