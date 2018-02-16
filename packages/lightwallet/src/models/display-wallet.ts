import { MeritWalletClient } from '../lib/merit-wallet-client/index';
import { WalletService } from 'merit/wallets/wallet.service';
import { pick, isNil } from 'lodash';
import { SendService } from 'merit/transact/send/send.service';

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
  invites?: boolean;
  rewards?: boolean;
  anv?: boolean;
}

const defaultOptions: IDisplayWalletOptions = {
  invites: true,
  rewards: true,
  anv: true
};

export async function createDisplayWallet(wallet: MeritWalletClient, walletService: WalletService, sendService: SendService, options?: IDisplayWalletOptions): Promise<IDisplayWallet> {
  options = Object.assign({}, defaultOptions, options);

  const displayWallet: IDisplayWallet = pick<IDisplayWallet, MeritWalletClient>(wallet, 'id', 'wallet', 'name', 'locked', 'color', 'totalNetworkValue', 'credentials', 'network');

  displayWallet.client = wallet;
  displayWallet.referrerAddress = walletService.getRootAddress(wallet).toString();

  const { alias } = await sendService.getAddressInfo(displayWallet.referrerAddress);
  if (alias) displayWallet.alias = alias;

  if (options.anv) {
    displayWallet.totalNetworkValueMicro = await walletService.getANV(wallet);
  }

  if (options.invites) {
    displayWallet.inviteRequests = await walletService.getUnlockRequests(wallet);
    const invitesInfo = await walletService.getInvitesBalance(wallet);
    displayWallet.invites = Math.max(0, invitesInfo.availableConfirmedAmount - 1);
  }

  if (options.rewards) {
    const rewardsData = await walletService.getRewards(wallet);

    // If we cannot properly fetch data, let's return wallets as-is.
    if (rewardsData && isNil(rewardsData.mining)) {
      displayWallet.miningRewardsMicro = rewardsData.mining;
      displayWallet.ambassadorRewardsMicro = rewardsData.ambassador;
    }
  }

  return displayWallet;
}
