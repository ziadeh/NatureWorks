export type GlobalT = {
  data: GlobalData;
  meta: Meta;
};

interface Meta {}

interface GlobalData {
  id: number;
  attributes: GlobalAttributes;
}

interface GlobalAttributes {
  siteName: string;
  competitionLocalOpen: boolean;
  competitionRegionalOpen: boolean;
  openViewToJudges: boolean;
  createdAt: string;
  updatedAt: string;
}
