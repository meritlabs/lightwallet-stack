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
  hideInvites?: boolean;
  hideRewards?: boolean;
  hideAnv?: boolean;
  hideAlias?: boolean;
}

export async function createDisplayWallet(wallet: MeritWalletClient, walletService: WalletService, sendService?: SendService, options: IDisplayWalletOptions = {}): Promise<IDisplayWallet> {
  const displayWallet: IDisplayWallet = pick<IDisplayWallet, MeritWalletClient>(wallet, 'id', 'wallet', 'name', 'locked', 'color', 'totalNetworkValue', 'credentials', 'network');

  displayWallet.client = wallet;
  displayWallet.referrerAddress = walletService.getRootAddress(wallet).toString();

  Object.defineProperty(displayWallet, 'color', {
    get: function() {
      return this.client.color || DEFAULT_WALLET_COLOR;
    }
  });

  if (!options.hideAlias) {
    const { alias } = await sendService.getAddressInfo(displayWallet.referrerAddress);
    if (alias) displayWallet.alias = alias;
  }

  if (!options.hideAnv) {
    displayWallet.totalNetworkValueMicro = await walletService.getANV(wallet);
  }

  if (!options.hideInvites) {
    wallet.status =  await walletService.getStatus(wallet, { force: false });
    displayWallet.inviteRequests = await walletService.getUnlockRequests(wallet);
    displayWallet.invites = wallet.status.availableInvites;
  }

  if (!options.hideRewards) {
    const rewardsData = await walletService.getRewards(wallet);

    // If we cannot properly fetch data, let's return wallets as-is.
    if (rewardsData && isNil(rewardsData.mining)) {
      displayWallet.miningRewardsMicro = rewardsData.mining;
      displayWallet.ambassadorRewardsMicro = rewardsData.ambassador;
    }
  }

  return displayWallet;
}
