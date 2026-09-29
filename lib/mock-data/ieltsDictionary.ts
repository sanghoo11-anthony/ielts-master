import { WordLookupResponse } from '@/types/vocabulary';

export const IELTS_DICTIONARY: Record<string, WordLookupResponse> = {
  prohibitively: {
    word: 'prohibitively',
    phonetic: '/prəˈhɪb.ɪ.tɪv.li/',
    partOfSpeech: '부사 (adverb)',
    meaningKo: '엄두를 못 낼 만큼, 지나치게, 엄격히 제한될 정도로',
    definitionEn: 'In a way that is so expensive or difficult that it prevents something from being done.',
    contextSentence: 'The capital expenditure required to construct state-of-the-art multi-level facilities remains prohibitively high.',
    contextTranslation: '본문에서 수직 농장 시설을 짓는 데 필요한 건축비와 전기세가 너무 비싸서 상업화하기에 "엄두도 못 낼 만큼 과도하게 높다"는 맥락으로 쓰였습니다.',
    examples: [
      {
        en: 'The initial startup costs for advanced green technology are often prohibitively expensive for small businesses.',
        ko: '첨단 친환경 기술의 초기 창업 비용은 중소기업이 감당하기에 엄두를 못 낼 정도로 비싼 경우가 많습니다.',
      },
      {
        en: 'Property prices in major metropolitan hubs have become prohibitively high for young professionals.',
        ko: '주요 대도시 중심부의 부동산 가격은 사회 초년생들이 감당하기에 지나치게 높아졌습니다.',
      },
    ],
    collocations: ['prohibitively expensive', 'prohibitively high', 'prohibitive cost'],
    synonyms: ['exorbitantly', 'excessively', 'inordinately', 'unaffordably'],
    bandLevel: 'Band 7.5+',
    examinerTip: 'IELTS Writing Task 2에서 "very expensive" 대신 "prohibitively expensive"를 구사하면 Lexical Resource 영역에서 즉시 고득점 인상을 줍니다.',
  },
  expenditure: {
    word: 'expenditure',
    phonetic: '/ɪkˈspen.dɪ.tʃər/',
    partOfSpeech: '명사 (noun)',
    meaningKo: '지출, 경비, 비용 소비',
    definitionEn: 'The total amount of money that a government, organization, or person spends.',
    contextSentence: 'The capital expenditure required to construct state-of-the-art multi-level facilities remains prohibitively high.',
    contextTranslation: '본문에서 대규모 건축 및 설비 투자에 투입되는 "자본 지출(Capital expenditure / 설비투자비)"을 지칭합니다.',
    examples: [
      {
        en: 'Governmental expenditure on renewable energy infrastructure has doubled over the past decade.',
        ko: '재생에너지 인프라에 대한 정부 지출은 지난 10년간 두 배로 증가했습니다.',
      },
      {
        en: 'Households are actively reducing discretionary expenditure in response to rising inflation.',
        ko: '가계는 인플레이션 상승에 대응하여 재량적 지출을 적극적으로 줄이고 있습니다.',
      },
    ],
    collocations: ['capital expenditure', 'governmental expenditure', 'reduce expenditure', 'public expenditure'],
    synonyms: ['outlay', 'spending', 'disbursement', 'expenses'],
    bandLevel: 'Band 7.0+',
    examinerTip: 'Task 1과 Task 2 모두에서 "spending"의 고급 학술 대체어로 가장 빈번하게 채점관에게 어필하는 필수 명사입니다.',
  },
  photosynthetic: {
    word: 'photosynthetic',
    phonetic: '/ˌfoʊ.toʊ.sɪnˈθet̬.ɪk/',
    partOfSpeech: '형용사 (adjective)',
    meaningKo: '광합성의, 광합성에 의한',
    definitionEn: 'Relating to or involved in the process by which green plants use sunlight to synthesize nutrients.',
    contextSentence: 'LEDs calibrated to emit optimum photosynthetic wavelengths allow crops to flourish.',
    contextTranslation: '본문에서 식물이 영양분을 생성하는 데 가장 최적화된 "광합성 파장(photosynthetic wavelengths)"을 의미합니다.',
    examples: [
      {
        en: 'Artificial light sources can stimulate photosynthetic activity throughout nocturnal hours.',
        ko: '인공 광원은 야간 시간대 내내 광합성 활동을 촉진할 수 있습니다.',
      },
    ],
    collocations: ['photosynthetic activity', 'photosynthetic wavelength', 'photosynthetic efficiency'],
    synonyms: ['light-synthesizing'],
    bandLevel: 'Band 8.0+',
    examinerTip: '과학·환경 주제의 Reading 지문에서 빈출되는 전문 형용사입니다.',
  },
  aeroponic: {
    word: 'aeroponic',
    phonetic: '/ˌer.əˈpɑː.nɪk/',
    partOfSpeech: '형용사 (adjective)',
    meaningKo: '분무경의 (공기 중에 뿌리를 노출시켜 미스트로 양분을 주는)',
    definitionEn: 'Relating to a plant-cultivation technique where the roots hang in the air and are misted with nutrient-rich water.',
    contextSentence: 'Crucially, closed-loop hydroponic and aeroponic systems continuously recirculate moisture.',
    contextTranslation: '토양 없이 공기 중에 매달린 식물 뿌리에 양분 미스트를 분사하는 혁신적 농업 기술을 의미합니다.',
    examples: [
      {
        en: 'Aeroponic cultivation drastically reduces root rot while maximizing oxygen uptake.',
        ko: '분무경 재배는 산소 흡수를 극대화하면서 뿌리 부패를 획기적으로 줄여줍니다.',
      },
    ],
    collocations: ['aeroponic system', 'aeroponic farming', 'aeroponic cultivation'],
    synonyms: ['mist-cultivation'],
    bandLevel: 'Band 8.0+',
    examinerTip: 'Hydroponic(수경재배)과 함께 최첨단 스마트팜 지문에서 핵심 기술 키워드로 등장합니다.',
  },
  hydroponic: {
    word: 'hydroponic',
    phonetic: '/ˌhaɪ.drəˈpɑː.nɪk/',
    partOfSpeech: '형용사 (adjective)',
    meaningKo: '수경재배의 (흙 없이 물과 배양액으로 키우는)',
    definitionEn: 'Relating to the process of growing plants in water rather than in soil.',
    contextSentence: 'Closed-loop hydroponic and aeroponic systems continuously recirculate moisture.',
    contextTranslation: '흙 없이 영양분이 든 배양액 순환으로 식물을 재배하는 수경 시스템을 의미합니다.',
    examples: [
      {
        en: 'Commercial hydroponic greenhouses produce ten times the yield of conventional farms per square meter.',
        ko: '상업용 수경재배 온실은 제곱미터당 기존 농장보다 10배 많은 수확량을 생산합니다.',
      },
    ],
    collocations: ['hydroponic farming', 'hydroponic crops', 'hydroponic solution'],
    synonyms: ['soil-less cultivation'],
    bandLevel: 'Band 7.5+',
    examinerTip: 'IELTS General Section 3과 Academic Section 1/2에서 지속가능 농업 단골 출제 어휘입니다.',
  },
  transpiration: {
    word: 'transpiration',
    phonetic: '/ˌtræn.spəˈreɪ.ʃən/',
    partOfSpeech: '명사 (noun)',
    meaningKo: '증산 작용 (식물의 수분이 잎을 통해 대기로 배출되는 현상)',
    definitionEn: 'The process by which plants lose water vapor through the surface of their leaves.',
    contextSentence: 'Artificial intelligence is deployed to monitor plant transpiration rates.',
    contextTranslation: '스마트 센서가 식물 잎에서의 "수분 증산율"을 실시간으로 감지하여 물 공급을 최적화한다는 의미입니다.',
    examples: [
      {
        en: 'High atmospheric humidity slows down leaf transpiration.',
        ko: '대기 중의 높은 습도는 잎의 증산 작용을 둔화시킵니다.',
      },
    ],
    collocations: ['transpiration rate', 'leaf transpiration', 'plant transpiration'],
    synonyms: ['evapotranspiration', 'water vapor loss'],
    bandLevel: 'Band 8.0+',
    examinerTip: '생물학, 기후 변화, 농업 관련 Reading 지문에서 빈출되는 과학 용어입니다.',
  },
  monumental: {
    word: 'monumental',
    phonetic: '/ˌmɑːn.jəˈmen.t̬əl/',
    partOfSpeech: '형용사 (adjective)',
    meaningKo: '엄청난, 기념비적인, 대단히 중대한',
    definitionEn: 'Extremely great, important, or impressive.',
    contextSentence: 'The spatial proximity of vertical farming installations to urban consumers yields monumental logistical benefits.',
    contextTranslation: '도시 소비자와 가까워짐으로써 운송 거리와 비용이 획기적으로 줄어드는 "엄청나게 거대한(기념비적인)" 이점을 뜻합니다.',
    examples: [
      {
        en: 'The Paris Climate Accord represents a monumental milestone in international environmental governance.',
        ko: '파리 기후 협약은 국제 환경 거버넌스에서 기념비적인 이정표를 나타냅니다.',
      },
      {
        en: 'Developing a universal vaccine was a task of monumental complexity.',
        ko: '만능 백신을 개발하는 것은 대단히 엄청난 복잡성을 지닌 과제였습니다.',
      },
    ],
    collocations: ['monumental success', 'monumental challenge', 'monumental impact', 'monumental scale'],
    synonyms: ['immense', 'colossal', 'stupendous', 'monolithic'],
    bandLevel: 'Band 7.5+',
    examinerTip: '"Very big", "great" 대신 "monumental"을 사용하면 단번에 글의 품격이 격상됩니다.',
  },
  logistical: {
    word: 'logistical',
    phonetic: '/loʊˈdʒɪs.tɪ.kəl/',
    partOfSpeech: '형용사 (adjective)',
    meaningKo: '물류의, 실행 계획의, 수송 조직의',
    definitionEn: 'Relating to the practical organization and coordination of a complex activity or transport.',
    contextSentence: 'The spatial proximity yields monumental logistical benefits.',
    contextTranslation: '농작물을 산지에서 매장까지 운송하고 보관하는 일련의 "물류 및 유통 체계" 상의 이점을 의미합니다.',
    examples: [
      {
        en: 'Distributing relief supplies across disaster zones presented insurmountable logistical hurdles.',
        ko: '재난 지역 전체에 구호품을 분배하는 것은 극복하기 힘든 물류상의 장애를 낳았습니다.',
      },
    ],
    collocations: ['logistical hurdle', 'logistical support', 'logistical advantage', 'logistical challenge'],
    synonyms: ['operational', 'organizational', 'distributive'],
    bandLevel: 'Band 7.0+',
    examinerTip: '비즈니스, 유통, 국제무역 주제에서 자주 등장하는 필수 고급 단어입니다.',
  },
  viability: {
    word: 'viability',
    phonetic: '/ˌvaɪ.əˈbɪl.ə.t̬i/',
    partOfSpeech: '명사 (noun)',
    meaningKo: '실행 가능성, 생존 능력, 지속 가능성',
    definitionEn: 'Ability to work successfully or to survive in commercial and practical terms.',
    contextSentence: 'Vertical farming confronts substantial economic hurdles that constrain its immediate viability.',
    contextTranslation: '현재 높은 비용 때문에 당장 상업적으로 생존하여 수익을 낼 수 있는 "사업적 실행 가능성(경제성)"을 의미합니다.',
    examples: [
      {
        en: 'Investors questioned the long-term commercial viability of the proposed solar mega-project.',
        ko: '투자자들은 제안된 태양광 메가 프로젝트의 장기적 상업적 실행 가능성에 의문을 제기했습니다.',
      },
      {
        en: 'Government subsidies are vital to ensure the economic viability of public healthcare facilities.',
        ko: '공공 의료 시설의 경제적 생존 능력을 보장하기 위해 정부 보조금은 필수적입니다.',
      },
    ],
    collocations: ['commercial viability', 'economic viability', 'long-term viability', 'assess viability'],
    synonyms: ['feasibility', 'sustainability', 'workability', 'practicability'],
    bandLevel: 'Band 7.5+',
    examinerTip: 'Writing Task 2에서 어떤 정책이나 기술의 실현 가능성을 논할 때 "feasibility"와 함께 교차 사용할 수 있는 최고급 어휘입니다.',
  },
  indispensable: {
    word: 'indispensable',
    phonetic: '/ˌɪn.dɪˈspen.sə.bəl/',
    partOfSpeech: '형용사 (adjective)',
    meaningKo: '없어서는 안 될, 필수불가결한',
    definitionEn: 'Something or someone that is so good or important that you could not manage without it.',
    contextSentence: 'Vertical farming may evolve into an indispensable pillar of global food security.',
    contextTranslation: '미래 세계 식량 안보에 있어 절대로 빠뜨릴 수 없는 "필수불가결한 핵심 기둥"이 될 것이라는 결론 문맥입니다.',
    examples: [
      {
        en: 'Digital literacy has become an indispensable competency in the modern global economy.',
        ko: '디지털 문해력은 현대 글로벌 경제에서 없어서는 안 될 필수 역량이 되었습니다.',
      },
      {
        en: 'Public transportation plays an indispensable role in mitigating urban congestion.',
        ko: '대중교통은 도시 혼잡을 완화하는 데 없어서는 안 될 역할을 수행합니다.',
      },
    ],
    collocations: ['indispensable role', 'indispensable tool', 'indispensable part', 'prove indispensable'],
    synonyms: ['vital', 'essential', 'imperative', 'crucial', 'integral'],
    bandLevel: 'Band 7.5+',
    examinerTip: '"very important"나 "necessary"를 완벽히 대체하여 글 전체의 격조를 높여줍니다.',
  },
  confer: {
    word: 'confer',
    phonetic: '/kənˈfɝː/',
    partOfSpeech: '동사 (verb)',
    meaningKo: '(혜택·자격·명예 등을) 부여하다, 수여하다',
    definitionEn: 'To give an honor, advantage, or benefit to someone.',
    contextSentence: 'Telecommuting confers substantial advantages to both corporate entities and individual employees.',
    contextTranslation: '재택근무가 기업과 노동자 양측 모두에게 실질적인 이점과 혜택을 "가져다주다(부여하다)"라는 문맥입니다.',
    examples: [
      {
        en: 'A university degree still confers a distinct competitive edge in the white-collar labor market.',
        ko: '대학 학위는 여전히 사무직 노동 시장에서 뚜렷한 경쟁 우위를 부여합니다.',
      },
    ],
    collocations: ['confer advantages', 'confer benefits', 'confer rights', 'confer prestige'],
    synonyms: ['bestow', 'grant', 'endow', 'provide'],
    bandLevel: 'Band 7.5+',
    examinerTip: '"give benefits" 대신 "confer substantial advantages"를 사용하는 순간 Band 7.5+ 영작문이 됩니다.',
  },
  mitigate: {
    word: 'mitigate',
    phonetic: '/ˈmɪt̬.ə.ɡeɪt/',
    partOfSpeech: '동사 (verb)',
    meaningKo: '(고통·위험·피해 등을) 완화하다, 경감시키다',
    definitionEn: 'To make something less harmful, unpleasant, or bad.',
    contextSentence: 'Stakeholders must implement multifaceted measures to mitigate these burgeoning challenges.',
    contextTranslation: '급증하는 부작용과 난제들을 "효과적으로 누그러뜨리고 줄여나가다"라는 의미입니다.',
    examples: [
      {
        en: 'Strict emission regulations are paramount to mitigate the catastrophic ramifications of climate change.',
        ko: '엄격한 배출 규제는 기후 변화의 파국적인 악영향을 완화하는 데 있어 무엇보다 중요합니다.',
      },
    ],
    collocations: ['mitigate risks', 'mitigate the impact', 'mitigate climate change', 'mitigate problems'],
    synonyms: ['alleviate', 'attenuate', 'diminish', 'lessen', 'ease'],
    bandLevel: 'Band 7.5+',
    examinerTip: 'Writing Task 2 해결책(Solutions) 문단에서 "reduce problem" 대신 반드시 써야 할 핵심 동사입니다.',
  },
  telecommuting: {
    word: 'telecommuting',
    phonetic: '/ˈtel.ə.kə.mjuː.t̬ɪŋ/',
    partOfSpeech: '명사 (noun)',
    meaningKo: '원격 근무, 재택 근무 (통신망을 이용한 근무)',
    definitionEn: 'The practice of working from home, making use of the internet, email, and the telephone.',
    contextSentence: 'In contemporary society, telecommuting confers substantial advantages to both corporate entities and employees.',
    contextTranslation: '정보통신망을 이용하여 출퇴근 없이 집이나 원격지에서 업무를 수행하는 제도를 지칭합니다.',
    examples: [
      {
        en: 'Widespread telecommuting has diminished peak-hour traffic bottlenecks across metropolitan expressways.',
        ko: '광범위한 원격 근무는 수도권 고속도로의 출퇴근 시간대 교통 병목 현상을 줄였습니다.',
      },
    ],
    collocations: ['embrace telecommuting', 'telecommuting policies', 'flexible telecommuting'],
    synonyms: ['remote working', 'working from home', 'telework'],
    bandLevel: 'Band 7.0+',
    examinerTip: '"working from home"의 가장 세련된 전문 용어로 반복을 피하는 패러프레이징에 제격입니다.',
  },
  predicament: {
    word: 'predicament',
    phonetic: '/prəˈdɪk.ə.mənt/',
    partOfSpeech: '명사 (noun)',
    meaningKo: '곤경, 궁지, 진퇴양난의 어려운 상황',
    definitionEn: 'An unpleasant, difficult, or perplexing situation from which it is tough to escape.',
    contextSentence: 'This logistical predicament poses significant operational disruptions.',
    contextTranslation: '수화물 분실이나 물류 차질로 인해 이러지도 저러지도 못하는 "난감하고 곤혹스러운 난처함"을 표현합니다.',
    examples: [
      {
        en: 'Rising student debt places recent graduates in a severe financial predicament.',
        ko: '증가하는 학자금 부채는 최근 졸업생들을 심각한 재정적 곤경에 빠뜨립니다.',
      },
    ],
    collocations: ['dire predicament', 'financial predicament', 'escape a predicament'],
    synonyms: ['dilemma', 'quandary', 'plight', 'crisis'],
    bandLevel: 'Band 7.5+',
    examinerTip: '"bad situation"이나 "big problem" 대신 쓰면 어휘 점수가 대폭 상승합니다.',
  },
  subsidised: {
    word: 'subsidised',
    phonetic: '/ˈsʌb.sə.daɪzd/',
    partOfSpeech: '형용사 (adjective)',
    meaningKo: '(정부나 단체의) 보조금을 받는, 지원금을 받는',
    definitionEn: 'Having part of the cost paid for by an organization or government.',
    contextSentence: 'The construction costs in Europe are not subsidised by municipal environmental grants.',
    contextTranslation: '지자체나 정부 환경 기금으로부터 건축비 일부를 "재정적으로 보조·지원받다"라는 의미입니다.',
    examples: [
      {
        en: 'Subsidised public transportation encourages citizens to abandon personal automobiles.',
        ko: '보조금을 지원받는 대중교통은 시민들이 자가용을 이용하지 않도록 장려합니다.',
      },
    ],
    collocations: ['subsidised housing', 'heavily subsidised', 'subsidised meals'],
    synonyms: ['funded', 'underwritten', 'sponsored'],
    bandLevel: 'Band 7.0+',
    examinerTip: 'Reading T/F/NG 문항에서 주로 패러프레이징 함정으로 활용되는 빈출 어휘입니다.',
  },
  arable: {
    word: 'arable',
    phonetic: '/ˈer.ə.bəl/',
    partOfSpeech: '형용사 (adjective)',
    meaningKo: '경작 가능한, 곡식을 재배할 수 있는',
    definitionEn: 'Land that is suitable for growing crops rather than for housing or keeping animals.',
    contextSentence: 'Global demographic growth and loss of fertile arable land threaten food supplies.',
    contextTranslation: '농작물을 정상적으로 파종하고 수확할 수 있는 "비옥한 경작용 토지"를 의미합니다.',
    examples: [
      {
        en: 'Urban sprawl continues to encroach upon fertile arable soil surrounding major cities.',
        ko: '도시의 무분별한 확산은 주요 도시를 둘러싼 비옥한 경작 가능 토지를 계속 잠식하고 있습니다.',
      },
    ],
    collocations: ['arable land', 'arable farming', 'fertile arable soil'],
    synonyms: ['cultivable', 'tillable', 'fertile', 'productive'],
    bandLevel: 'Band 7.5+',
    examinerTip: '토지, 식량, 환경 관련 Reading 지문에서 "farming land"의 최고급 동의어입니다.',
  },
};

export function lookupInLocalDictionary(word: string, contextSentence?: string): WordLookupResponse | null {
  const cleanWord = word.trim().toLowerCase().replace(/[^a-z]/g, '');
  if (!cleanWord) return null;

  // 1. Direct key match
  if (IELTS_DICTIONARY[cleanWord]) {
    const result = { ...IELTS_DICTIONARY[cleanWord] };
    if (contextSentence) {
      result.contextSentence = contextSentence;
    }
    return result;
  }

  // 2. Stem/Lemmatization variations (e.g. plurals, adverbs, tenses)
  const stems = [
    cleanWord.replace(/s$/, ''),
    cleanWord.replace(/ed$/, ''),
    cleanWord.replace(/ing$/, ''),
    cleanWord.replace(/ly$/, ''),
    cleanWord.replace(/tion$/, ''),
    cleanWord.replace(/es$/, ''),
  ];

  for (const stem of stems) {
    if (IELTS_DICTIONARY[stem]) {
      const matched = { ...IELTS_DICTIONARY[stem] };
      matched.word = word; // preserve user casing
      if (contextSentence) {
        matched.contextSentence = contextSentence;
      }
      return matched;
    }
  }

  return null;
}
