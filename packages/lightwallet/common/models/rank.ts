export interface IRankData {
  unlocked: boolean;
  totalAnv: number;
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
  anv: number;
  anvChange: number;
  anvChangeDay: number;
  anvChangeWeek: number;
  anvPercent: number;
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
  lotteryanv: string;
  lotteryentrants: number;
  ranks: IRankInfo[];
}
