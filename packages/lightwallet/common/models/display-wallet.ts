import { isNil, sumBy } from 'lodash';
import { DEFAULT_WALLET_COLOR } from '../utils/constants';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { WalletService } from '@merit/common/services/wallet.service';
import { SendService } from '@merit/common/services/send.service';
import { FiatAmount } from '@merit/common/models/fiat-amount';
import { TxFormatService } from '@merit/common/services/tx-format.service';

export interface IDisplayWalletOptions {
  skipStatus?: boolean;
  skipRewards?: boolean;
  skipAnv?: boolean;
  skipAlias?: boolean;
  skipShareCode?: boolean;
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
  shareCode: string;
  // We will only have one icon type to start.
  iconUrl: string = "/assets/v1/icons/ui/wallets/wallet-ico-grey.svg";

  totalBalanceStr?: string;
  totalBalanceMicros?: number;
  cachedBalanceUpdatedOn: string; // only available if we're using cached balance
  totalBalanceFiat?: string;

  totalNetworkValueMicro: number;
  totalNetworkValueMerit: string;
  totalNetworkValueFiat: string;

  miningRewardsMicro: number;
  miningRewardsMerit: string;
  miningRewardsFiat: string;

  ambassadorRewardsMicro: number;
  ambassadorRewardsMerit: string;
  ambassadorRewardsFiat: string;

  inviteRequests: any[];
  invites: number;

  constructor(public client: MeritWalletClient,
              private walletService: WalletService,
              private sendService?: SendService,
              private txFormatService?: TxFormatService
            ) {
    this.referrerAddress = this.walletService.getRootAddress(this.client).toString();

    if (!this.client.color) {
      this.client.color = DEFAULT_WALLET_COLOR;
    }
  }

  async updateAlias() {
    const { alias } = await this.sendService.getAddressInfo(this.referrerAddress);
    if (alias) {
      this.alias = alias;
    }
  }

  // Alias if you have one; otherwise address. 
  async updateShareCode() {
    const { alias } = await this.sendService.getAddressInfo(this.referrerAddress);
    if (alias) {
      this.shareCode = alias;
    } else {
      this.shareCode = this.referrerAddress;
    }
  }

  async updateAnv() {
    this.totalNetworkValueMicro = await this.walletService.getANV(this.client);
  }

  async updateStatus() {
    this.client.status = await this.walletService.getStatus(this.client, { force: true });
    this.inviteRequests = await this.walletService.getUnlockRequests(this.client);
    this.invites = this.status.availableInvites;
    if (this.status.totalBalanceStr) {
      this.totalBalanceStr = this.client.status.totalBalanceStr;
      this.totalBalanceMicros = this.client.status.totalBalanceMicros;
      const usdAmount = await this.txFormatService.formatToUSD(this.totalBalanceMicros);
      this.totalBalanceFiat = new FiatAmount(+usdAmount).amountStr;
    } else {
      this.totalBalanceStr = this.client.cachedBalance;
      this.cachedBalanceUpdatedOn = this.client.cachedBalanceUpdatedOn;
    }
  }

  async updateRewards() {
    const rewardsData = await this.walletService.getRewards(this.client);
    // If we cannot properly fetch data, let's return wallets as-is.
    if (rewardsData && rewardsData.length > 0) {
      this.miningRewardsMicro = sumBy(rewardsData, 'rewards.mining')
      this.ambassadorRewardsMicro = sumBy(rewardsData, 'rewards.ambassador')
    }
  }
}

export async function createDisplayWallet(wallet: MeritWalletClient, walletService: WalletService, sendService?: SendService, txFormatService?: TxFormatService, options: IDisplayWalletOptions = {}): Promise<DisplayWallet> {
  const displayWallet = new DisplayWallet(wallet, walletService, sendService, txFormatService);

  if (!options.skipAlias)
    await displayWallet.updateAlias();

  if (!options.skipAnv)
    await displayWallet.updateAnv();

  if (!options.skipStatus)
    await displayWallet.updateStatus();

  if (!options.skipRewards)
    await displayWallet.updateRewards();
 
  if (!options.skipShareCode)
    await displayWallet.updateShareCode();

  return displayWallet;
}
