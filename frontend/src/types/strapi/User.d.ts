export type StrapiUserT = {
  id: number;
  username: string;
  email: string;
  blocked: boolean;
  provider: "local" | "google";
  isJudge: boolean;
  viewLastStep: boolean;
  viewPreviousStep: boolean;
  regions: RegionT[];
};

export type RegionT = {
  id?: number;
  title?: string;
  locale?: string;
};
export type StrapiLoginResponseT = {
  jwt: string;
  user: StrapiUserT;
};
