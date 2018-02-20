import { MeritWalletClient } from '../lib/merit-wallet-client/index';
import { WalletService } from 'merit/wallets/wallet.service';
import { pick, isNil } from 'lodash';
import { SendService } from 'merit/transact/send/send.service';
import { DEFAULT_WALLET_COLOR } from '../utils/constants';

export interface IDisplayWallet {
  id: string;
  name: string;
  alias: string;
  address: string;
  locked: boolean;
  color: string;
  referrerAddress: string;
  totalBalanceStr?: string;
  totalBalanceMicros?: number;
  balanceHidden: boolean;
  cachedBalanceUpdatedOn: string; // only available if we're using cached balance
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
  client: MeritWalletClient;
}

export interface IDisplayWalletOptions {
  skipStatus?: boolean;
  skipRewards?: boolean;
  skipAnv?: boolean;
  skipAlias?: boolean;
}

export async function createDisplayWallet(wallet: MeritWalletClient, walletService: WalletService, sendService?: SendService, options: IDisplayWalletOptions = {}): Promise<IDisplayWallet> {
  const displayWallet: IDisplayWallet = pick<IDisplayWallet, MeritWalletClient>(wallet, 'id', 'wallet', 'name', 'locked', 'color', 'totalNetworkValue', 'credentials', 'network');

  displayWallet.client = wallet;
  displayWallet.referrerAddress = walletService.getRootAddress(wallet).toString();
  displayWallet.balanceHidden = wallet.balanceHidden;

  Object.defineProperty(displayWallet, 'color', {
    get: function() {
      return this.client.color || DEFAULT_WALLET_COLOR;
    }
  });

  if (!options.skipAlias) {
    const { alias } = await sendService.getAddressInfo(displayWallet.referrerAddress);
    if (alias) displayWallet.alias = alias;
  }

  if (!options.skipAnv) {
    displayWallet.totalNetworkValueMicro = await walletService.getANV(wallet);
  }

  if (!options.skipStatus) {
    wallet.status =  await walletService.getStatus(wallet, { force: true });
    displayWallet.inviteRequests = await walletService.getUnlockRequests(wallet);
    displayWallet.invites = wallet.status.availableInvites;
    if (wallet.status && wallet.status.totalBalanceStr) {
      displayWallet.totalBalanceStr = wallet.status.totalBalanceStr;
      displayWallet.totalBalanceMicros = wallet.status.totalBalanceMicros;
    } else {
      displayWallet.totalBalanceStr = wallet.cachedBalance;
      displayWallet.cachedBalanceUpdatedOn = wallet.cachedBalanceUpdatedOn;
    }
  }

  if (!options.skipRewards) {
    const rewardsData = await walletService.getRewards(wallet);

    // If we cannot properly fetch data, let's return wallets as-is.
    if (rewardsData && isNil(rewardsData.mining)) {
      displayWallet.miningRewardsMicro = rewardsData.mining;
      displayWallet.ambassadorRewardsMicro = rewardsData.ambassador;
    }
  }

  return displayWallet;
}
