export interface IRankData {
  unlocked: boolean;
  totalAnv: number;
  bestRank: number;
  bestPercentile: number;
  percentileStr: string;
}

export interface IRankInfo {
  address: string;
  alias?: string;
  anv: number;
  anvpercent: number;
  percentile: string;
  rank: number;
}

export interface ILeaderboard {
  lotteryanv: string;
  lotteryentrants: number;
  ranks: IRankInfo[];
}
