import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { FiatAmount } from '@merit/common/models/fiat-amount';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { isNil, sumBy } from 'lodash';
import { DEFAULT_WALLET_COLOR } from '../utils/constants';
import { InviteRequest, InviteRequestsService } from '@merit/common/services/invite-request.service';
import { IRankInfo } from '@merit/common/models/rank';
import { getAddressInfo } from '@merit/common/utils/addresses';

export interface IDisplayWalletOptions {
  skipStatus?: boolean;
  skipRewards?: boolean;
  skipAnv?: boolean;
  skipAlias?: boolean;
  skipShareCode?: boolean;
  skipRankInfo?: boolean;
}

export function ClientProperty(target: DisplayWallet, key: keyof MeritWalletClient) {
  Object.defineProperty(target, key, {
    enumerable: true,
    get: function() {
      return this.client[key];
    },
    set: function(value: any) {
      this.client[key] = value;
    },
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
  @ClientProperty balance: any;
  @ClientProperty availableInvites: number;
  @ClientProperty pendingInvites: number;
  @ClientProperty sendableInvites: number;
  @ClientProperty confirmed: boolean;

  get address() {
    return this.client.getRootAddress().toString();
  }

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

  communitySize: number;

  inviteRequests: InviteRequest[];
  rankInfo: IRankInfo;

  constructor(public client: MeritWalletClient,
              private walletService: WalletService,
              private inviteRequestsService: InviteRequestsService,
              private txFormatService?: TxFormatService,
              private persistenceService2?: PersistenceService2) {
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
      balanceHidden: this.balanceHidden,
    };
  }

  importPreferences(preferences: any) {
    preferences = preferences || {};
    this.name = preferences.name || this.name;
    this.color = preferences.color || this.color;
    this.balanceHidden = Boolean(preferences.balanceHidden);
  }

  async updateAlias() {
    try {
      const { alias } = await getAddressInfo(this.referrerAddress);
      if (alias) {
        this.alias = alias;
      }
    } catch (err) {
      console.log('Error updating alias', err);
    }
  }

  // Alias if you have one; otherwise address.
  async updateShareCode() {
    try {
      const { alias } = await getAddressInfo(this.referrerAddress);
      if (alias) {
        this.shareCode = '@' + alias;
      } else {
        this.shareCode = this.referrerAddress;
      }
    } catch (err) {
      console.log('Error updating share code', err);
    }
  }

  async updateStatus() {
    try {
      this.client.status = await this.client.getStatus();
      const visitedInvites = await this.persistenceService2.getVisitedInvites() || [];
      this.inviteRequests = (await this.inviteRequestsService.getInviteRequests(this.client))
        .map(request => {
          request.isNew = visitedInvites.findIndex(id => id === request.id) === -1;
          return request;
        });
    } catch (err) {
      console.log('Error updating status', err);
    }
  }

  async updateRankInfo() {
    try {
      if (!this.confirmed) {
        throw 'Wallet not confirmed';
      }

      this.rankInfo = await this.client.getRankInfo();
    } catch (err) {
      console.log('Unable to get rank info', err);
      this.rankInfo = {
        address: this.address,
        alias: this.alias,
        lastUpdated: Date.now(),
        anv: 0,
        anvChangeDay: 0,
        anvChangeWeek: 0,
        communitySize: 0,
        anvPercent: 0,
        communitySizeChange: 0,
        anvChange: 0,
        communitySizeChangeDay: 0,
        communitySizeChangeWeek: 0,
        percentile: '0',
        rank: null,
        rankChange: 0,
        rankChangeDay: 0,
        rankChangeWeek: 0,
      };
    }

    this.communitySize = this.rankInfo.communitySize || 0;
  }

  async updateRewards() {
    try {
      this.totalNetworkValueMicro = await this.client.getANV();

      const rewardsData = await this.client.getRewards();
      // If we cannot properly fetch data, let's return wallets as-is.
      if (rewardsData && rewardsData.length > 0) {
        this.miningRewardsMicro = sumBy(rewardsData, 'rewards.mining');
        this.growthRewardsMicro = sumBy(rewardsData, 'rewards.ambassador');
        this.formatNetworkInfo();
      }
    } catch (err) {
      console.log('Error updating rewards', err);
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

    if (!isNil(this.growthRewardsMicro)) {
      this.growthRewardsMerit = this.txFormatService.parseAmount(this.growthRewardsMicro, 'micros').amountUnitStr;
      this.growthRewardsFiat = new FiatAmount(+this.txFormatService.formatToUSD(this.growthRewardsMicro)).amountStr;
    }
  }
}

export async function createDisplayWallet(wallet: MeritWalletClient,
                                          walletService: WalletService,
                                          inviteRequestsService: InviteRequestsService,
                                          txFormatService?: TxFormatService,
                                          persistenceService2?: PersistenceService2,
                                          options: IDisplayWalletOptions = {}): Promise<DisplayWallet> {
  const displayWallet = new DisplayWallet(wallet, walletService, inviteRequestsService, txFormatService, persistenceService2);
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

  if (!options.skipRankInfo)
    await displayWallet.updateRankInfo();

  return displayWallet;
}
