export interface EvaluateWritingRequest {
  task_type: 'TASK_1' | 'TASK_2';
  prompt_title: string;
  prompt_text: string;
  essay_text: string;
  word_count: number;
  time_spent_seconds?: number;
  custom_api_key?: string;
}

export interface AreaCritique {
  area_name: string;
  score: number;
  summary_3lines: string[];
}

export interface InlineCorrection {
  original: string;
  improved: string;
  reason: string;
  band_7_expression: string;
}

export interface EvaluateWritingResponse {
  overall_band: number;
  scores: {
    task_response: number;
    coherence_cohesion: number;
    lexical_resource: number;
    grammatical_range_accuracy: number;
  };
  detailed_critique: {
    task_response: AreaCritique;
    coherence_cohesion: AreaCritique;
    lexical_resource: AreaCritique;
    grammatical_range_accuracy: AreaCritique;
  };
  inline_corrections: InlineCorrection[];
  word_count: number;
  verdict: string;
}
