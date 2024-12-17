export type GetStartupT = {
  token: string | undefined;
  startupId?: string;
  step?: string;
};

export type StartupT = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  entrepreneur?: string;
  startup_assessments?: StartupAssessmentsT[];
  startup_scores?: StartupScores[];
  region?: RegionT;
};

export type StartupAssessmentsT = {
  id: number;
  step: string;
  createdAt: string;
  updatedAt: string;
  approved: boolean;
  lockedForm: boolean;
  score?: number;
  questionScore: questionScore[];
  judge?: StrapiUserT;
};
type questionScore = {
  id?: number;
  question?: number;
  score: number;
};

export type StartupScores = {
  id: number;
  finalScore: number;
  createdAt: Date;
  updatedAt: Date;
  step: string;
  localContestWinner: boolean;
  regionalContestWinner: boolean;
};

interface LocalContest {
  finalScore: number;
  localContestWinner: boolean;
  regionalContestWinner: boolean;
  step: string;
  startup_assessments: StartupAssessmentsT[];
}
export type RegionT = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  locale: string;
};
