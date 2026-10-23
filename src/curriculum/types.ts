export type Kind = 'lecture' | 'lab' | 'review';
export interface Resource {
  title: string;
  provider: string;
  type: 'Documentation' | 'Course' | 'Video';
  description: string;
  url: string;
  duration?: string;
  verified?: boolean;
  reviewedOn?: string;
  selection?: string;
}
export interface Section {
  title: string;
  body: string;
  code?: string;
  language?: string;
  diagram?: string[];
}
export interface Question {
  prompt: string;
  type: 'single' | 'multiple' | 'boolean' | 'short';
  options?: string[];
  answer: number[];
  explanation: string;
  domain?: string;
  selfRubric?: string[];
}
export interface Lab {
  title: string;
  tools: string;
  cost: 'Free & local' | 'Potentially billable';
  setup: string;
  tasks: string[];
  expected: string;
  validate: string;
  troubleshooting: string;
  cleanup: string;
  code?: string;
  guide?: Section[];
}
export interface Week {
  number: number;
  title: string;
  topics: string[];
  objectives: string[];
  sections: Section[];
  terms: Record<string, string>;
  misconception: string;
  summary: string;
  resources: Resource[];
  lab: Lab;
  questions: Question[];
  assignment: string;
  review: string;
  reviewQuestions: string[];
  status?: 'ready' | 'planned';
  prerequisites?: string;
  plan?: {
    lecture: string[];
    lab: string[];
    review: string[];
    outcome: string;
  };
}
