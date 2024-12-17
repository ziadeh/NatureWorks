export type AssessmentQuestionT = {
  id: number;
  title: string;
  step: string;
  createdAt: string;
  updatedAt: string;
  locale: string;
  questions: Question[];
};

interface Question {
  id: number;
  header: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  locale: string;
  options: Option[];
  localizations: Localization[];
}

interface Option {
  id: number;
  choice: string;
  selected?: any;
}

interface Localization {
  id: number;
  header: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  locale: string;
  options: Option[];
}
