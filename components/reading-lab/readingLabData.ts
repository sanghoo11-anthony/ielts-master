export interface LabParagraph {
  id: string; // 'A', 'B', 'C', 'D', 'E', 'F'
  label: string; // 'A', 'B', 'C', 'D', 'E', 'F'
  content: string;
}

export interface HeadingChoice {
  id: string;
  roman: string;
  text: string;
}

export type LabQuestionType = 'TRUE_FALSE_NOT_GIVEN' | 'MATCHING_HEADINGS';

export interface LabQuestion {
  id: string;
  questionNumber: number;
  type: LabQuestionType;
  prompt: string;
  correctAnswer: string;
  paragraphTarget: string; // 'A', 'B', 'C', 'D', 'E'
  evidenceQuote: string;
  explanation: string;
  // Matching headings specific
  targetParagraphForHeading?: string;
}

export const LIST_OF_HEADINGS: HeadingChoice[] = [
  { id: 'h-1', roman: 'i', text: 'Financial and technological limitations impeding widespread adoption' },
  { id: 'h-2', roman: 'ii', text: 'Innovative controlled-environment systems drastically saving resources' },
  { id: 'h-3', roman: 'iii', text: 'Severe global demographic growth and loss of fertile arable land' },
  { id: 'h-4', roman: 'iv', text: 'Logistical advantages of local cultivation in dense urban epicenters' },
  { id: 'h-5', roman: 'v', text: 'The traditional dependence on unpredictable seasonal rainfall' },
  { id: 'h-6', roman: 'vi', text: 'Governmental subsidies allocated for conventional rural farming' },
];

export const READING_LAB_PASSAGE = {
  title: 'Vertical Agriculture: The Future of Urban Food Security',
  subTitle: 'How high-tech indoor cultivation is revolutionizing food production in modern cities',
  paragraphs: [
    {
      id: 'para-A',
      label: 'A',
      content: `By the mid-21st century, the human population residing across global metropolitan areas is projected to increase by over three billion. Traditional farming methodologies already consume nearly 80 percent of all available freshwater and utilize roughly half of the planet's habitable landmass. However, accelerating desertification, soil erosion, and severe weather anomalies driven by climatic upheaval have rendered expansive open-field farming progressively unstable. In response to this impending crisis, agricultural scientists and architects have proposed vertical farming—the practice of growing crops in vertically stacked arrays inside climate-controlled structures.`,
    },
    {
      id: 'para-B',
      label: 'B',
      content: `Unlike conventional agriculture, which remains wholly hostage to unpredictable seasons and insect infestations, vertical farms operate within completely isolated facilities. By employing specialized light-emitting diodes (LEDs) calibrated to emit optimum photosynthetic wavelengths, crops can flourish 24 hours a day without exposure to solar radiation. Crucially, closed-loop hydroponic and aeroponic systems continuously recirculate moisture and essential nutrients. This innovative mechanism enables facilities to consume up to 95 percent less water than traditional outdoor farming, while entirely eradicating the need for chemical pesticides and synthetic herbicides.`,
    },
    {
      id: 'para-C',
      label: 'C',
      content: `The spatial proximity of vertical farming installations to urban consumers yields monumental logistical benefits. Under typical commercial distribution channels, fresh produce frequently travels thousands of transit miles from rural farm belts to metropolitan grocery shelves, burning immense quantities of petroleum fuels for refrigerated transport and causing substantial spoilage. Vertical farms erected in renovated warehouses or skyscraper complexes can deliver freshly harvested greens to local grocery stores within hours of cutting, drastically reducing transportation emissions and guaranteeing peak nutritional integrity.`,
    },
    {
      id: 'para-D',
      label: 'D',
      content: `Despite its compelling theoretical promise, vertical farming confronts substantial economic hurdles that constrain its immediate viability. The capital expenditure required to construct state-of-the-art multi-level facilities, coupled with the recurring electricity costs demanded by artificial lighting and climate-control HVAC systems, remains prohibitively high. Furthermore, economic feasibility is presently restricted to fast-maturing, high-margin produce such as leafy greens, basil, and strawberries. Staple cereal crops that furnish the majority of human caloric intake—specifically wheat, corn, and rice—cannot currently be cultivated cost-effectively in vertical towers.`,
    },
    {
      id: 'para-E',
      label: 'E',
      content: `To achieve genuine long-term commercial sustainability, future vertical facilities must integrate cleanly with urban renewable energy grids, such as rooftop photovoltaic solar arrays and industrial geothermal systems. Furthermore, artificial intelligence and robotic automation are increasingly being deployed to monitor plant transpiration rates, calibrate nutrient dosing down to the milligram, and harvest crops automatically without human intervention. Should these technological innovations continue to mature, vertical farming may evolve from an experimental novelty into an indispensable pillar of global food security.`,
    },
  ],
};

export const READING_LAB_QUESTIONS: LabQuestion[] = [
  // 1. True / False / Not Given 문항 3개
  {
    id: 'rl-q1',
    questionNumber: 1,
    type: 'TRUE_FALSE_NOT_GIVEN',
    prompt: 'Traditional open-field farming currently accounts for the consumption of nearly 80 percent of the world’s freshwater resources.',
    correctAnswer: 'TRUE',
    paragraphTarget: 'para-A',
    evidenceQuote: 'Traditional farming methodologies already consume nearly 80 percent of all available freshwater',
    explanation: '단락 A에서 "Traditional farming methodologies already consume nearly 80 percent of all available freshwater"라고 명확히 일치하므로 정답은 TRUE입니다.',
  },
  {
    id: 'rl-q2',
    questionNumber: 2,
    type: 'TRUE_FALSE_NOT_GIVEN',
    prompt: 'Vertical farms require sunlight during morning hours to initiate the photosynthesis process in crops.',
    correctAnswer: 'FALSE',
    paragraphTarget: 'para-B',
    evidenceQuote: 'crops can flourish 24 hours a day without exposure to solar radiation.',
    explanation: '단락 B에서 식물 재배용 LED 조명을 통해 "태양광 노출 없이(without exposure to solar radiation) 24시간 내내 생장할 수 있다"고 명시하여 지문과 상반되므로 정답은 FALSE입니다.',
  },
  {
    id: 'rl-q3',
    questionNumber: 3,
    type: 'TRUE_FALSE_NOT_GIVEN',
    prompt: 'The construction costs of vertical farms in Europe are fully subsidised by municipal environmental grants.',
    correctAnswer: 'NOT GIVEN',
    paragraphTarget: 'para-D',
    evidenceQuote: 'The capital expenditure required to construct state-of-the-art multi-level facilities, coupled with the recurring electricity costs demanded by artificial lighting and climate-control HVAC systems, remains prohibitively high.',
    explanation: '단락 D에서 시설 건축에 막대한 자본 비용(capital expenditure)이 든다는 언급은 있으나, 유럽에서 시 보조금(subsidised by municipal environmental grants)을 지원한다는 내용은 지문에 전혀 언급되지 않았으므로 NOT GIVEN입니다.',
  },

  // 2. Matching Headings 드롭다운 문항 2개
  {
    id: 'rl-q4',
    questionNumber: 4,
    type: 'MATCHING_HEADINGS',
    prompt: 'Choose the correct heading for Paragraph B from the List of Headings.',
    targetParagraphForHeading: 'Paragraph B',
    correctAnswer: 'h-2', // ii. Innovative controlled-environment systems drastically saving resources
    paragraphTarget: 'para-B',
    evidenceQuote: 'closed-loop hydroponic and aeroponic systems continuously recirculate moisture and essential nutrients. This innovative mechanism enables facilities to consume up to 95 percent less water than traditional outdoor farming',
    explanation: '단락 B는 폐쇄형 수경재배 및 분무경 시스템을 통해 물 소비를 95% 절감하고 농약을 사용하지 않는 등 통제된 환경에서의 획기적 자원 절약 기술을 설명하므로 정답은 ii입니다.',
  },
  {
    id: 'rl-q5',
    questionNumber: 5,
    type: 'MATCHING_HEADINGS',
    prompt: 'Choose the correct heading for Paragraph D from the List of Headings.',
    targetParagraphForHeading: 'Paragraph D',
    correctAnswer: 'h-1', // i. Financial and technological limitations impeding widespread adoption
    paragraphTarget: 'para-D',
    evidenceQuote: 'Staple cereal crops that furnish the majority of human caloric intake—specifically wheat, corn, and rice—cannot currently be cultivated cost-effectively in vertical towers.',
    explanation: '단락 D는 천문학적인 건축비와 전기세, 그리고 곡물류 재배 불가능 등 수직 농업의 대규모 확산을 가로막는 재정적·기술적 한계(Financial and technological limitations)를 다루므로 정답은 i입니다.',
  },
];
