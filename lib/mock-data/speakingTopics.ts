import { SpeakingTopic } from '@/types/speaking';

export const SPEAKING_TOPICS: SpeakingTopic[] = [
  {
    id: 'spk-part1-hometown',
    title: 'Hometown & Living Environment',
    titleKo: 'Part 1: 고향 및 거주 환경',
    part: 'part1',
    description: '응시자의 출신 지역, 주거 환경 및 동네 편의시설에 대한 일상적 대화 질문 (4~5분)',
    preparationTimeSeconds: 0,
    speechTimeSeconds: 45,
    questions: [
      {
        id: 'q1-1',
        questionText: 'Can you describe the town or city where you currently reside?',
        questionKo: '현재 살고 계신 도시나 동네를 묘사해 주시겠습니까?',
        sampleBand7Answer:
          'I currently live in a bustling metropolitan district situated on the outskirts of Seoul. It boasts a harmonious blend of ultra-modern residential complexes and tranquil public parks, making it both convenient and livable.',
        recommendedCollocations: ['bustling metropolitan district', 'ultra-modern residential complexes', 'tranquil public parks'],
      },
      {
        id: 'q1-2',
        questionText: 'What do you like most about your neighborhood?',
        questionKo: '현재 살고 계신 동네에서 가장 마음에 드는 점은 무엇인가요?',
        sampleBand7Answer:
          'Without doubt, the most compelling aspect is the seamless connectivity to public transit. Within a five-minute stroll, I can access express subway lines and local amenities, which substantially streamlines my daily commute.',
        recommendedCollocations: ['seamless connectivity', 'public transit', 'local amenities', 'streamlines daily commute'],
      },
      {
        id: 'q1-3',
        questionText: 'Has your hometown changed considerably since your childhood?',
        questionKo: '어린 시절과 비교했을 때 고향이 많이 변했나요?',
        sampleBand7Answer:
          'Incontestably, yes. It has undergone a profound transformation driven by rapid urban redevelopment. Where low-rise houses once stood, imposing commercial skyscrapers and cultural infrastructure have emerged.',
        recommendedCollocations: ['undergone profound transformation', 'rapid urban redevelopment', 'cultural infrastructure'],
      },
    ],
  },
  {
    id: 'spk-part1-technology',
    title: 'Technology & Everyday Habits',
    titleKo: 'Part 1: 디지털 기술과 일상 습관',
    part: 'part1',
    description: '스마트폰, 인터넷, 소셜 미디어가 개인의 일상에 미치는 영향에 대한 질문 (4~5분)',
    preparationTimeSeconds: 0,
    speechTimeSeconds: 45,
    questions: [
      {
        id: 'q2-1',
        questionText: 'How frequently do you rely on digital technology in your daily routine?',
        questionKo: '일상생활에서 디지털 기기에 얼마나 자주 의존하시나요?',
        sampleBand7Answer:
          'To be completely candid, digital devices have become indispensable to my routine. From coordinating work meetings on cloud platforms to managing personal finances, virtually every facet of my day involves digital automation.',
        recommendedCollocations: ['indispensable to my routine', 'coordinating work meetings', 'digital automation'],
      },
      {
        id: 'q2-2',
        questionText: 'Do you believe people spend excessive amounts of time on smartphones nowadays?',
        questionKo: '요즘 사람들이 스마트폰에 지나치게 많은 시간을 쓴다고 생각하시나요?',
        sampleBand7Answer:
          'Unequivocally, yes. A substantial portion of the population is trapped in mindless scrolling on social feeds, which not only erodes concentration spans but also diminishes meaningful face-to-face interpersonal interactions.',
        recommendedCollocations: ['mindless scrolling', 'erodes concentration spans', 'interpersonal interactions'],
      },
    ],
  },
  {
    id: 'spk-part2-journey',
    title: 'Describe a Memorable Journey',
    titleKo: 'Part 2: 잊을 수 없는 여행/여정 (Cue Card)',
    part: 'part2',
    description: '1분 동안 메모를 준비한 후 1분~2분 동안 끊김 없이 혼자 길게 발화하는 Cue Card 시험',
    preparationTimeSeconds: 60,
    speechTimeSeconds: 120,
    questions: [
      {
        id: 'q3-cue',
        questionText:
          'Describe a memorable journey you have taken. You should say: where you went, whom you traveled with, what you experienced, and explain why this particular journey remains so memorable to you.',
        questionKo:
          '기억에 남는 여행을 설명해 주세요. (어디로 갔는지, 누구와 함께했는지, 무엇을 경험했는지, 왜 그 여행이 그토록 기억에 남는지 포함)',
        cueCardBulletPoints: [
          'Where you went and how you traveled there',
          'Whom you went with',
          'What notable activities you engaged in',
          'Explain why this particular journey remains profoundly memorable',
        ],
        sampleBand7Answer:
          'I would like to elaborate on an extraordinary trekking expedition to the coastal cliffs of Jeju Island that I embarked upon two autumns ago alongside my university peers. We opted for scenic coastal hiking trails rather than conventional tourist hotspots. What made this journey indelible was an unexpected encounter with fierce maritime fog, followed by an awe-inspiring sunrise over the ocean horizon. That profound contrast between arduous physical exertion and sublime natural tranquility left an indelible impression upon my psyche.',
        recommendedCollocations: ['extraordinary trekking expedition', 'opted for scenic coastal trails', 'awe-inspiring sunrise', 'sublime natural tranquility', 'left an indelible impression'],
      },
    ],
  },
  {
    id: 'spk-part3-transport',
    title: 'Transportation & Future Mobility',
    titleKo: 'Part 3: 대중교통의 미래와 도시 환경 (심층 토론)',
    part: 'part3',
    description: 'Part 2 주제와 연계하여 사회적, 환경적, 정책적 관점을 심층 논리적으로 토론 (4~5분)',
    preparationTimeSeconds: 0,
    speechTimeSeconds: 60,
    questions: [
      {
        id: 'q4-1',
        questionText: 'How can municipal authorities encourage citizens to adopt public transit over private vehicles?',
        questionKo: '지방 정부는 시민들이 자가용 대신 대중교통을 더 많이 이용하도록 어떻게 유도할 수 있을까요?',
        sampleBand7Answer:
          'In my assessment, governments must simultaneously implement both incentive structures and disincentives. On one hand, subsidizing ticket tariffs and expanding dedicated bus corridors elevates reliability and convenience. On the other hand, introducing congestion charges and scaling back inner-city parking renders private vehicular commuting economically prohibitive.',
        recommendedCollocations: ['incentive structures and disincentives', 'subsidizing ticket tariffs', 'congestion charges', 'economically prohibitive'],
      },
      {
        id: 'q4-2',
        questionText: 'Do you envision autonomous or electric vehicles completely replacing conventional transport in the future?',
        questionKo: '미래에 자율주행차나 전기차가 기존 화석연료 운송수단을 완전히 대체할 것으로 보시나요?',
        sampleBand7Answer:
          'It is highly probable within the forthcoming decades. Given the pressing urgency of curbing carbon emissions and mitigating driver-induced traffic accidents, autonomous electric fleets will likely dominate metropolitan transport networks, provided that charging infrastructure and legal frameworks evolve commensurately.',
        recommendedCollocations: ['pressing urgency of curbing emissions', 'autonomous electric fleets', 'charging infrastructure', 'evolve commensurately'],
      },
      {
        id: 'q4-3',
        questionText: 'Will remote working and virtual communication reduce the need for international travel in the future?',
        questionKo: '원격 근무와 화상 회의 기술이 미래의 국제 비즈니스 출장 수요를 줄일 것이라고 보시나요?',
        sampleBand7Answer:
          'While routine administrative meetings have undeniably migrated to digital platforms, high-stakes negotiations and diplomatic summits still necessitate in-person rapport and nuanced non-verbal cues. Thus, business travel will likely become more selective rather than obsolete.',
        recommendedCollocations: ['undeniably migrated to digital platforms', 'high-stakes negotiations', 'in-person rapport', 'nuanced non-verbal cues'],
      },
    ],
  },
];
