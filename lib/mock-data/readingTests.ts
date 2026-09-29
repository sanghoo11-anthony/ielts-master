import { ReadingTestSet } from '@/types/reading';

export const MOCK_READING_TESTS: ReadingTestSet[] = [
  {
    id: 'gt-reading-test-01',
    title: 'IELTS General Reading Practice Test 1',
    description: '공공 자전거 이용 규칙(Section 1), 직장 휴가 및 병가 규정(Section 2), 수직 농업의 혁신(Section 3)으로 구성된 종합 실전 테스트',
    difficulty: 'BAND_6_7',
    timeLimitMinutes: 60,
    passages: [
      // Section 1: Everyday Social Context
      {
        id: 'passage-s1',
        section: 'SECTION_1',
        title: 'Central City Bicycle-Sharing Scheme',
        subTitle: 'User Guidelines, Rental Fees, and Safety Regulations',
        paragraphs: [
          {
            id: 'P1-1',
            label: 'A',
            content: `The Central City Bicycle-Sharing Scheme provides an eco-friendly and affordable transit option for residents and visitors alike. More than 1,200 smart bicycles are situated across 85 docking stations in the metropolitan area. Users can unlock a bicycle using our dedicated smartphone app or by tapping a contactless debit or credit card directly against the dock terminal.`,
          },
          {
            id: 'P1-2',
            label: 'B',
            content: `The initial 30 minutes of any journey are completely complimentary for registered members who possess an active annual pass. For non-members, a standard unlock fee of $1.50 applies, followed by a flat rate of $0.20 per minute thereafter. If a journey exceeds four consecutive hours without returning the bicycle to an authorized docking station, an extended usage surcharge of $25.00 will be automatically debited from the user's card.`,
          },
          {
            id: 'P1-3',
            label: 'C',
            content: `Under municipal traffic bylaws, riders are strictly obligated to wear a securely fastened safety helmet at all times. Helmets are not provided at the docking stations, so cyclists must supply their own protective gear before commencing their trip. Riding on pedestrian footpaths is strictly prohibited unless specifically marked with dual-use cycling signs.`,
          },
          {
            id: 'P1-4',
            label: 'D',
            content: `Should you experience mechanical failure, such as a flat tire or brake malfunction during your ride, you must immediately return the bicycle to the nearest docking bay. Once locked into the dock, press the red 'Fault' button on the terminal within 60 seconds to ensure your account is not billed for subsequent rental time and to alert our mobile maintenance crew.`,
          },
        ],
      },

      // Section 2: Workplace Context
      {
        id: 'passage-s2',
        section: 'SECTION_2',
        title: 'Apex Global Logistics: Staff Leave Policy',
        subTitle: 'Guidelines on Annual Leave, Sick Leave, and Unforeseen Absences',
        paragraphs: [
          {
            id: 'P2-1',
            label: 'A',
            content: `All full-time permanent employees accrue 20 working days of paid annual leave per calendar year, calculated on a pro-rata basis from the initial commencement date. Leave requests must be submitted through the internal HR portal at least four weeks in advance for absences spanning five consecutive business days or longer. Department managers reserve the discretion to decline requests during peak operating quarters (November through January).`,
          },
          {
            id: 'P2-2',
            label: 'B',
            content: `A maximum of five days of accrued but untaken annual leave may be carried forward into the following financial year. Any accumulated leave exceeding this threshold will automatically lapse on March 31st unless written prior authorization is granted by the Human Resources Director. Employees are vigorously encouraged to utilize their full leave entitlements to safeguard mental well-being and maintain work-life balance.`,
          },
          {
            id: 'P2-3',
            label: 'C',
            content: `In cases of acute illness or unexpected injury, employees must notify their immediate supervisor via phone call or direct message no later than 8:30 AM on the initial day of absence. A registered medical practitioner's certificate is mandatory for any sickness absence extending beyond two consecutive working days, or for any absence occurring immediately prior to or following a designated public holiday.`,
          },
        ],
      },

      // Section 3: General Academic / Extended Feature
      {
        id: 'passage-s3',
        section: 'SECTION_3',
        title: 'Vertical Farming: Cultivating the Cities of Tomorrow',
        subTitle: 'How high-tech indoor agriculture is transforming sustainable food production',
        paragraphs: [
          {
            id: 'P3-1',
            label: 'A',
            content: `As the global population is projected to eclipse 9.8 billion by the year 2050, traditional agriculture faces unprecedented constraints. Arable land is diminishing rapidly due to urbanization, soil degradation, and desertification. Concurrently, erratic weather events driven by climate change threaten staple crop yields worldwide. In response to these pressing crises, agricultural scientists and urban planners are increasingly championing vertical farming—the practice of cultivating crops in vertically stacked layers inside controlled environment facilities.`,
          },
          {
            id: 'P3-2',
            label: 'B',
            content: `Unlike conventional open-field farming, which remains utterly vulnerable to droughts and pests, vertical farms operate within completely sealed, climate-controlled environments. By harnessing specialized light-emitting diode (LED) arrays tailored to emit exact photosynthetic wavelengths, growers can optimize plant growth cycles year-round without sunlight. Furthermore, aeroponic and hydroponic irrigation systems recirculate water and nutrient solutions, utilizing up to 95 percent less water than conventional outdoor farming methods while entirely discarding chemical synthetic pesticides.`,
          },
          {
            id: 'P3-3',
            label: 'C',
            content: `Locating food production directly within dense urban epicenters also yields profound logistics benefits. Conventional produce typically travels thousands of food miles from rural farms to city supermarket shelves, consuming colossal amounts of fossil fuels in refrigerated freight and resulting in substantial spoilage. Vertical farms situated in abandoned warehouses, shipping containers, or purpose-built skyscrapers deliver harvested leafy greens and herbs to local consumers within mere hours of cutting, dramatically preserving nutritional potency and flavor.`,
          },
          {
            id: 'P3-4',
            label: 'D',
            content: `Nonetheless, formidable barriers impede vertical farming from completely superseding traditional farming. The foremost obstacle is astronomical capital expenditure and continuous energy consumption. Operating high-intensity LED lighting systems and commercial HVAC climate controls requires immense electricity. Unless powered entirely by renewable energy grids such as solar or wind power, vertical farms could paradoxically exacerbate carbon emissions. Furthermore, current economic viability is predominantly confined to high-value, rapid-growth crops like lettuce, microgreens, and strawberries, leaving staple calorie crops such as wheat, rice, and maize still firmly tied to outdoor farmland.`,
          },
        ],
      },
    ],
    questions: [
      // Questions 1-4 (Section 1: True / False / Not Given)
      {
        id: 'q-1',
        questionNumber: 1,
        type: 'TRUE_FALSE_NOT_GIVEN',
        prompt: 'Annual pass members can use bicycles for the first half hour of every trip without paying additional usage fees.',
        correctAnswer: 'TRUE',
        evidence: {
          paragraphId: 'P1-2',
          quoteText: 'The initial 30 minutes of any journey are completely complimentary for registered members who possess an active annual pass.',
          explanation: '지문에서 연간 회원권을 소지한 등록 회원의 경우 각 여정의 첫 30분은 완전 무료(complimentary)라고 명시되어 있으므로 정답은 TRUE입니다.',
        },
      },
      {
        id: 'q-2',
        questionNumber: 2,
        type: 'TRUE_FALSE_NOT_GIVEN',
        prompt: 'Bicycle helmets are available for hire at all 85 docking stations across the city.',
        correctAnswer: 'FALSE',
        evidence: {
          paragraphId: 'P1-3',
          quoteText: 'Helmets are not provided at the docking stations, so cyclists must supply their own protective gear before commencing their trip.',
          explanation: '지문에서는 거치대에서 헬멧이 제공되지 않으며 이용자가 직접 준비해야 한다고 하였으므로 지문과 모순되어 정답은 FALSE입니다.',
        },
      },
      {
        id: 'q-3',
        questionNumber: 3,
        type: 'TRUE_FALSE_NOT_GIVEN',
        prompt: 'Cyclists are allowed to ride on pedestrian footpaths only when designated dual-use signage is present.',
        correctAnswer: 'TRUE',
        evidence: {
          paragraphId: 'P1-3',
          quoteText: 'Riding on pedestrian footpaths is strictly prohibited unless specifically marked with dual-use cycling signs.',
          explanation: '이중 용도 자전거 표지판(dual-use cycling signs)이 있는 경우를 제외하고 보도 주행이 금지된다고 하였으므로, 표지판이 있을 때만 허용된다는 진술은 일치하여 TRUE입니다.',
        },
      },
      {
        id: 'q-4',
        questionNumber: 4,
        type: 'TRUE_FALSE_NOT_GIVEN',
        prompt: 'The mobile maintenance crew repairs broken bicycles within two hours of notification.',
        correctAnswer: 'NOT GIVEN',
        evidence: {
          paragraphId: 'P1-4',
          quoteText: 'press the red "Fault" button on the terminal within 60 seconds to ensure your account is not billed for subsequent rental time and to alert our mobile maintenance crew.',
          explanation: '결함 버튼을 누르면 정비팀에 알림이 전송된다는 내용은 있으나, 정비팀이 2시간 이내에 수리한다는 시간 정보는 지문에 전혀 언급되지 않았으므로 NOT GIVEN입니다.',
        },
      },

      // Questions 5-7 (Section 2: Multiple Choice & Summary)
      {
        id: 'q-5',
        questionNumber: 5,
        type: 'MULTIPLE_CHOICE',
        prompt: 'According to the Staff Leave Policy, in which period may managers decline employee annual leave requests?',
        options: [
          { label: 'A', text: 'Throughout the entire summer season' },
          { label: 'B', text: 'From November through January' },
          { label: 'C', text: 'Immediately after the fiscal year ends in March' },
          { label: 'D', text: 'During unannounced company audit weeks' },
        ],
        correctAnswer: 'B',
        evidence: {
          paragraphId: 'P2-1',
          quoteText: 'Department managers reserve the discretion to decline requests during peak operating quarters (November through January).',
          explanation: '성수기 분기인 11월부터 1월 사이(November through January)에는 관리자가 휴가 신청을 거부할 재량권을 가진다고 명시되어 있으므로 정답은 B입니다.',
        },
      },
      {
        id: 'q-6',
        questionNumber: 6,
        type: 'MULTIPLE_CHOICE',
        prompt: 'What happens to accrued annual leave exceeding the five-day carryover limit?',
        options: [
          { label: 'A', text: 'It is automatically paid out in cash at the normal hourly rate.' },
          { label: 'B', text: 'It will expire on March 31st without prior written HR approval.' },
          { label: 'C', text: 'It is permanently transferred into the personal sick leave balance.' },
          { label: 'D', text: 'It leads to a mandatory reduction in working hours the following year.' },
        ],
        correctAnswer: 'B',
        evidence: {
          paragraphId: 'P2-2',
          quoteText: 'Any accumulated leave exceeding this threshold will automatically lapse on March 31st unless written prior authorization is granted by the Human Resources Director.',
          explanation: '5일을 초과하는 잔여 휴가는 인사 이사의 서면 사전 승인이 없는 한 3월 31일에 자동으로 소멸(lapse = expire)되므로 정답은 B입니다.',
        },
      },
      {
        id: 'q-7',
        questionNumber: 7,
        type: 'SUMMARY_COMPLETION',
        prompt: 'In cases of sickness, employees are strictly required to furnish a medical practitioner’s certificate if their absence exceeds _____ consecutive business days.',
        wordLimit: 2,
        contextSummaryWithBlanks: 'In cases of sickness, employees are strictly required to furnish a medical practitioner’s certificate if their absence exceeds [BLANK] consecutive business days.',
        correctAnswer: ['two', '2', 'two working', '2 working'],
        evidence: {
          paragraphId: 'P2-3',
          quoteText: 'A registered medical practitioner\'s certificate is mandatory for any sickness absence extending beyond two consecutive working days',
          explanation: '지문에서 병가가 이틀 연속(extending beyond two consecutive working days)을 초과할 경우 의사 진단서 제출이 의무라고 명시되어 있습니다.',
        },
      },

      // Questions 8-10 (Section 3: Matching Headings & T/F/NG)
      {
        id: 'q-8',
        questionNumber: 8,
        type: 'MATCHING_HEADINGS',
        prompt: 'Choose the correct heading for Paragraph B.',
        paragraphIdToMatch: 'P3-2',
        headingOptions: [
          { id: 'h-1', romanNumeral: 'i', text: 'Urgent environmental and demographic challenges facing agriculture' },
          { id: 'h-2', romanNumeral: 'ii', text: 'Controlled environments and highly resource-efficient farming techniques' },
          { id: 'h-3', romanNumeral: 'iii', text: 'Proximity to consumers and minimization of transportation waste' },
          { id: 'h-4', romanNumeral: 'iv', text: 'Substantial economic and energy limitations of vertical farming' },
          { id: 'h-5', romanNumeral: 'v', text: 'Government legislation promoting rural agrarian subsidies' },
        ],
        correctAnswer: 'h-2',
        evidence: {
          paragraphId: 'P3-2',
          quoteText: 'vertical farms operate within completely sealed, climate-controlled environments... aeroponic and hydroponic irrigation systems recirculate water... utilizing up to 95 percent less water',
          explanation: '문단 B는 외부 기후와 해충으로부터 완벽히 차단된 통제 환경(climate-controlled environments)과 LED, 수경재배 등을 통한 높은 자원 효율성(95% 물 절약)을 중점적으로 다루고 있으므로 정답은 ii입니다.',
        },
      },
      {
        id: 'q-9',
        questionNumber: 9,
        type: 'MATCHING_HEADINGS',
        prompt: 'Choose the correct heading for Paragraph C.',
        paragraphIdToMatch: 'P3-3',
        headingOptions: [
          { id: 'h-1', romanNumeral: 'i', text: 'Urgent environmental and demographic challenges facing agriculture' },
          { id: 'h-2', romanNumeral: 'ii', text: 'Controlled environments and highly resource-efficient farming techniques' },
          { id: 'h-3', romanNumeral: 'iii', text: 'Proximity to consumers and minimization of transportation waste' },
          { id: 'h-4', romanNumeral: 'iv', text: 'Substantial economic and energy limitations of vertical farming' },
          { id: 'h-5', romanNumeral: 'v', text: 'Government legislation promoting rural agrarian subsidies' },
        ],
        correctAnswer: 'h-3',
        evidence: {
          paragraphId: 'P3-3',
          quoteText: 'Locating food production directly within dense urban epicenters also yields profound logistics benefits... deliver harvested leafy greens and herbs to local consumers within mere hours',
          explanation: '문단 C는 도심 내 생산을 통해 수천 마일의 수송 거리(food miles)와 화물 냉장 에너지를 줄이고 소비자에게 수 시간 내 신선하게 배송하는 이점(Proximity to consumers and minimization of transportation waste)을 설명하므로 정답은 iii입니다.',
        },
      },
      {
        id: 'q-10',
        questionNumber: 10,
        type: 'TRUE_FALSE_NOT_GIVEN',
        prompt: 'At present, vertical farms can cost-effectively cultivate staple calorie crops such as wheat and rice on an industrial scale.',
        correctAnswer: 'FALSE',
        evidence: {
          paragraphId: 'P3-4',
          quoteText: 'current economic viability is predominantly confined to high-value, rapid-growth crops like lettuce, microgreens, and strawberries, leaving staple calorie crops such as wheat, rice, and maize still firmly tied to outdoor farmland.',
          explanation: '지문에서 현재의 경제적 타당성(economic viability)은 상추, 딸기 등 고부가가치 작물에 국한되며, 밀과 쌀 같은 주요 칼로리 작물은 여전히 야외 농지에 묶여 있다고 명시하고 있으므로 FALSE입니다.',
        },
      },
    ],
  },
];
