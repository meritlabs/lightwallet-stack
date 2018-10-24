import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { FiatAmount } from '@merit/common/models/fiat-amount';
import { AddressService } from '@merit/common/services/address.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { IUnlockRequest } from '@merit/common/services/unlock-request.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { isNil, sumBy } from 'lodash';
import { DEFAULT_WALLET_COLOR } from '../utils/constants';

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

const MINIMAL_STAKE = 2000000000;

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
  @ClientProperty balance: any;
  @ClientProperty availableInvites: number;
  @ClientProperty pendingInvites: number;
  @ClientProperty sendableInvites: number;
  @ClientProperty confirmed: boolean;

  referrerAddress: string;
  alias: string;
  shareCode: string;
  // We will only have one icon type to start.
  iconUrl: string = '/assets/v1/icons/ui/wallets/wallet-ico-grey.svg';

  get totalBalanceMicros() {
    return this.balance.spendableAmount;
  }

  totalNetworkValueMicro: number;
  totalNetworkValueMerit: string;
  totalNetworkValueFiat: string;

  miningRewardsMicro: number;
  miningRewardsMerit: string;
  miningRewardsFiat: string;

  growthRewardsMicro: number;
  growthRewardsMerit: string;
  growthRewardsFiat: string;

  inviteRequests: any[];

  communitySize: number = 0;

  constructor(public client: MeritWalletClient,
    private walletService: WalletService,
    private addressService: AddressService,
    private txFormatService?: TxFormatService,
    private persistenceService2?: PersistenceService2) {
    this.client = client;
    this.walletService = walletService;
    this.txFormatService = txFormatService;
    this.persistenceService2 = persistenceService2;

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
      this.shareCode = '@' + alias;
    } else {
      this.shareCode = this.referrerAddress;
    }
  }

  async updateStatus() {
    this.client.status = await this.client.getStatus();
    let visitedInvites = await this.persistenceService2.getVisitedInvites() || [];
    this.inviteRequests = (await this.client.getUnlockRequests())
      .filter((request: IUnlockRequest) => !request.isConfirmed)
      .map((request: IUnlockRequest) => {

        request.walletClient = this.client;
        request.isNew = visitedInvites.findIndex(rId => rId === request.rId) === -1;

        return request;
      });
  }

  canReceiveGrowthReward() {
    return this.confirmed && this.totalNetworkValueMicro > MINIMAL_STAKE;
  }

  async updateRewards() {
    this.totalNetworkValueMicro = await this.client.getANV(this.client.getRootAddress());

    const rewardsData = await this.client.getRewards([this.client.getRootAddress()]);
    // If we cannot properly fetch data, let's return wallets as-is.
    if (rewardsData && rewardsData.length > 0) {
      this.miningRewardsMicro = sumBy(rewardsData, 'rewards.mining');
      this.growthRewardsMicro = sumBy(rewardsData, 'rewards.ambassador');
      this.formatNetworkInfo();
    }

    this.communitySize = (await this.client.getCommunityInfo(this.client.getRootAddress())).referralcount;
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

    if (!isNil(this.growthRewardsMicro)) {
      this.growthRewardsMerit = this.txFormatService.parseAmount(this.growthRewardsMicro, 'micros').amountUnitStr;
      this.growthRewardsFiat = new FiatAmount(+this.txFormatService.formatToUSD(this.growthRewardsMicro)).amountStr;
    }
  }
}

export async function createDisplayWallet(wallet: MeritWalletClient, walletService: WalletService, addressService?: AddressService, txFormatService?: TxFormatService, persistenceService2?: PersistenceService2, options: IDisplayWalletOptions = {}): Promise<DisplayWallet> {
  const displayWallet = new DisplayWallet(wallet, walletService, addressService, txFormatService, persistenceService2);
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
