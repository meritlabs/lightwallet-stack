import { MeritWalletClient } from '../lib/merit-wallet-client/index';
import { WalletService } from 'merit/wallets/wallet.service';
import { pick, isNil } from 'lodash';

export interface IDisplayWallet {
  name: string;
  locked: boolean;
  color: string;
  referrerAddress: string;
  totalNetworkValueMicro: number;
  totalNetworkValueMerit: string;
  totalNetworkValueFiat: string;
  miningRewardsMicro: number;
  miningRewardsMerit: string;
  miningRewardsFiat: string;
  ambassadorRewardsMicro: number;
  ambassadorRewardsMerit: string;
  ambassadorRewardsFiat: string;
  network: string;
  credentials: any;
  inviteRequests: Array<any>;
  invites: number;
}

export async function createDisplayWallet(wallet: MeritWalletClient, walletService: WalletService): Promise<IDisplayWallet> {
  const displayWallet: IDisplayWallet = pick<IDisplayWallet, MeritWalletClient>(wallet, 'id', 'wallet', 'name', 'locked', 'color', 'totalNetworkValue', 'credentials', 'network');

  displayWallet.referrerAddress = walletService.getRootAddress(wallet).toString();
  displayWallet.totalNetworkValueMicro = await walletService.getANV(wallet);
  displayWallet.inviteRequests = await walletService.getUnlockRequests(wallet);
  displayWallet.invites = await walletService.getInvitesBalance(wallet);

  const rewardsData = await walletService.getRewards(wallet);

  // If we cannot properly fetch data, let's return wallets as-is.
  if (rewardsData && isNil(rewardsData.mining)) {
    displayWallet.miningRewardsMicro = rewardsData.mining;
    displayWallet.ambassadorRewardsMicro = rewardsData.ambassador;
  }

  return displayWallet;
}
