export interface IRankData {
  unlocked: boolean;
  totalCGS: number;
  bestRank: number;
  bestPercentile: number;
  percentileStr: string;
  rankChangeDay: number;
  totalCommunitySize: number;
  totalCommunitySizeChange: number;
  estimateStr?: string;
  totalProbability?: number;
}

export interface IRankInfo {
  address: string;
  alias?: string;
  lastUpdated: number;
  cgs: number;
  cgsChange: number;
  cgsChangeDay: number;
  cgsChangeWeek: number;
  cgsPercent: number;
  percentile: string;
  rank: number;
  rankChange: number;
  rankChangeDay: number;
  rankChangeWeek: number;
  communitySize: number;
  communitySizeChange: number;
  communitySizeChangeDay: number;
  communitySizeChangeWeek: number;
}

export interface ILeaderboard {
  lotterycgs: number;
  lotteryentrants: number;
  ranks: IRankInfo[];
}
