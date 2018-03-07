import { isNil } from 'lodash';
import { DEFAULT_WALLET_COLOR } from '../utils/constants';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { WalletService } from '@merit/common/services/wallet.service';
import { AddressService } from '@merit/common/services/address.service';

export interface IDisplayWalletOptions {
  skipStatus?: boolean;
  skipRewards?: boolean;
  skipAnv?: boolean;
  skipAlias?: boolean;
}

export function ClientProperty(target: DisplayWallet, key: keyof MeritWalletClient) {
  Object.defineProperty(target, key, {
    enumerable: true,
    get: function() {
      return this.client[key];
    }
  });
}


export class DisplayWallet {
  @ClientProperty readonly id: string;
  @ClientProperty readonly name: string;
  @ClientProperty readonly locked: boolean;
  @ClientProperty readonly color: string;
  @ClientProperty readonly totalNetworkValue: number;
  @ClientProperty readonly credentials: any;
  @ClientProperty readonly network: string;
  @ClientProperty readonly status: any;

  referrerAddress: string;
  alias: string;

  totalBalanceStr?: string;
  totalBalanceMicros?: number;
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

  confirmed: boolean;
  inviteRequests: any[];
  invites: number;

  constructor(public client: MeritWalletClient,
              private walletService: WalletService,
              private addressService?: AddressService) {
    this.referrerAddress = this.walletService.getRootAddress(this.client).toString();

    if (!this.client.color) {
      this.client.color = DEFAULT_WALLET_COLOR;
    }
  }

  async updateAlias() {
    const { alias } = await this.addressService.getAddressInfo(this.referrerAddress);
    if (alias) {
      this.alias = alias;
    }
  }

  async updateAnv() {
    this.totalNetworkValueMicro = await this.walletService.getANV(this.client);
  }

  async updateStatus() {
    this.client.status = await this.walletService.getStatus(this.client, { force: true });
    this.inviteRequests = await this.walletService.getUnlockRequests(this.client);
    this.invites = this.status.availableInvites;
    this.confirmed = this.client.confirmed;
    if (this.status.totalBalanceStr) {
      this.totalBalanceStr = this.client.status.totalBalanceStr;
      this.totalBalanceMicros = this.client.status.totalBalanceMicros;
    } else {
      this.totalBalanceStr = this.client.cachedBalance;
      this.cachedBalanceUpdatedOn = this.client.cachedBalanceUpdatedOn;
    }
  }

  async updateRewards() {
    const rewardsData = await this.walletService.getRewards(this.client);
    // If we cannot properly fetch data, let's return wallets as-is.
    if (rewardsData && isNil(rewardsData.mining)) {
      this.miningRewardsMicro = rewardsData.mining;
      this.ambassadorRewardsMicro = rewardsData.ambassador;
    }
  }
}

export async function createDisplayWallet(wallet: MeritWalletClient, walletService: WalletService, addressService?: AddressService, options: IDisplayWalletOptions = {}): Promise<DisplayWallet> {
  const displayWallet = new DisplayWallet(wallet, walletService, addressService);

  if (!options.skipAlias)
    await displayWallet.updateAlias();

  if (!options.skipAnv)
    await displayWallet.updateAnv();

  if (!options.skipStatus)
    await displayWallet.updateStatus();

  if (!options.skipRewards)
    await displayWallet.updateRewards();

  return displayWallet;
}
