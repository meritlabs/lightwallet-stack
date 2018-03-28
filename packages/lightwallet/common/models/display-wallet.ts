import { isNil, sumBy } from 'lodash';
import { DEFAULT_WALLET_COLOR } from '../utils/constants';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { WalletService } from '@merit/common/services/wallet.service';
import { AddressService } from '@merit/common/services/address.service';
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
    get: function () {
      return this.client[key];
    },
    set: function (value: any) {
      this.client[key] = value;
    }
  });
}

export class DisplayWallet {
  @ClientProperty readonly id: string;
  @ClientProperty readonly locked: boolean;
  @ClientProperty name: string;
  @ClientProperty color: string;
  @ClientProperty totalNetworkValue: number;
  @ClientProperty credentials: any;
  @ClientProperty network: string;
  @ClientProperty status: any;
  @ClientProperty balanceHidden: boolean;

  referrerAddress: string;
  alias: string;
  shareCode: string;
  // We will only have one icon type to start.
  iconUrl: string = '/assets/v1/icons/ui/wallets/wallet-ico-grey.svg';

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

  confirmed: boolean;
  inviteRequests: any[];
  invites: number;

  constructor(public client: MeritWalletClient,
              private walletService: WalletService,
              private addressService: AddressService,
              private txFormatService?: TxFormatService) {
    this.client = client;
    this.walletService = walletService;
    this.txFormatService = txFormatService;

    this.referrerAddress = this.client.getRootAddress().toString();

    if (!this.client.color) {
      this.client.color = DEFAULT_WALLET_COLOR;
    }
  }

  exportPreferences() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      balanceHidden: this.balanceHidden
    };
  }

  importPreferences(preferences: any) {
    preferences = preferences || {};
    this.name = preferences.name || this.name;
    this.color = preferences.color || this.color;
    this.balanceHidden = Boolean(preferences.balanceHidden);
  }

  async updateAlias() {
    const { alias } = await this.addressService.getAddressInfo(this.referrerAddress);
    if (alias) {
      this.alias = alias;
    }
  }

  // Alias if you have one; otherwise address.
  async updateShareCode() {
    const { alias } = await this.addressService.getAddressInfo(this.referrerAddress);
    if (alias) {
      this.shareCode = alias;
    } else {
      this.shareCode = this.referrerAddress;
    }
  }

  async updateStatus() {
    this.client.status = await this.walletService.getStatus(this.client, { force: true });
    this.inviteRequests = await this.client.getUnlockRequests();
    this.invites = this.client.availableInvites;
    this.confirmed = this.client.confirmed;
  }

  async updateRewards() {
    this.totalNetworkValueMicro = await this.walletService.getANV(this.client);

    const rewardsData = await this.walletService.getRewards(this.client);
    // If we cannot properly fetch data, let's return wallets as-is.
    if (rewardsData && rewardsData.length > 0) {
      this.miningRewardsMicro = sumBy(rewardsData, 'rewards.mining');
      this.ambassadorRewardsMicro = sumBy(rewardsData, 'rewards.ambassador');
      this.formatNetworkInfo();
    }
  }

  private formatNetworkInfo() {
    if (!isNil(this.totalNetworkValueMicro)) {
      this.totalNetworkValueMerit = this.txFormatService.parseAmount(this.totalNetworkValueMicro, 'micros').amountUnitStr;
      this.totalNetworkValueFiat = new FiatAmount(+this.txFormatService.formatToUSD(this.totalNetworkValueMicro)).amountStr;
    }

    if (!isNil(this.miningRewardsMicro)) {
      this.miningRewardsMerit = this.txFormatService.parseAmount(this.miningRewardsMicro, 'micros').amountUnitStr;
      this.miningRewardsFiat = new FiatAmount(+this.txFormatService.formatToUSD(this.miningRewardsMicro)).amountStr;
    }

    if (!isNil(this.ambassadorRewardsMicro)) {
      this.ambassadorRewardsMerit = this.txFormatService.parseAmount(this.ambassadorRewardsMicro, 'micros').amountUnitStr;
      this.ambassadorRewardsFiat = new FiatAmount(+this.txFormatService.formatToUSD(this.ambassadorRewardsMicro)).amountStr;
    }
  }
}

export async function createDisplayWallet(wallet: MeritWalletClient, walletService: WalletService, addressService?: AddressService, txFormatService?: TxFormatService, options: IDisplayWalletOptions = {}): Promise<DisplayWallet> {
  const displayWallet = new DisplayWallet(wallet, walletService, addressService, txFormatService);
  return updateDisplayWallet(displayWallet, options);
}

export async function updateDisplayWallet(displayWallet: DisplayWallet, options: IDisplayWalletOptions) {
  if (!options.skipAlias)
    await displayWallet.updateAlias();

  if (!options.skipStatus)
    await displayWallet.updateStatus();

  if (!options.skipRewards)
    await displayWallet.updateRewards();

  if (!options.skipShareCode)
    await displayWallet.updateShareCode();

  return displayWallet;
}
