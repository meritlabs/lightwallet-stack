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
import { IUTXO } from '@merit/common/reducers/transactions.reducer';

export interface IDisplayWalletOptions {
  skipANV?: boolean;
  skipAlias?: boolean;
  skipRankInfo?: boolean;
  skipInviteRequests?: boolean;
}

export interface IWalletBalance {
  amountMrt: number;
  invites: number;
  pendingInvites: number;
  spendableInvites: number;
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
  @ClientProperty balanceHidden: boolean;
  @ClientProperty utxos: IUTXO[];

  address: string;

  referrerAddress: string;
  alias: string;
  shareCode: string;
  // We will only have one icon type to start.
  iconUrl: string = '/assets/v1/icons/ui/wallets/wallet-ico-grey.svg';

  balance: IWalletBalance = {
    amountMrt: 0,
    invites: 0,
    pendingInvites: 0,
    spendableInvites: 0,
  };

  get confirmed() {
    return this.balance.invites > 0;
  }

  get totalBalanceMicros() {
    return this.balance.amountMrt;
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
    client.displayWallet = this;
    this.referrerAddress = this.address = this.client.getRootAddress().toString();
    this.shareCode = this.address;

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

  updateUtxos(utxos: IUTXO[]) {
    utxos = utxos || [];
    this.utxos = utxos;
    const balance = utxos.reduce((balance: IWalletBalance, utxo: IUTXO) => {
      if (utxo.isInvite) {
        balance.invites += utxo.amount;

        if (utxo.isPending) {
          balance.pendingInvites += utxo.amount;
        } else {
          balance.spendableInvites += utxo.amount;
        }
      } else {
        balance.amountMrt += utxo.amount;
      }

      return balance;
    }, {
      amountMrt: 0,
      invites: 0,
      pendingInvites: 0,
      spendableInvites: 0,
    });

    balance.spendableInvites = Math.max(--balance.spendableInvites, 0);

    this.balance = balance;
  }

  async updateAlias() {
    try {
      const { alias } = await getAddressInfo(this.referrerAddress);
      if (alias) {
        this.alias = alias;
        this.shareCode = '@' + this.alias;
      }
    } catch (err) {
      console.log('Error updating alias', err);
    }
  }

  async updateInviteRequests() {
    try {
      const visitedInvites = await this.persistenceService2.getVisitedInvites() || [];
      this.inviteRequests = (await this.inviteRequestsService.getInviteRequests(this.client))
        .map(request => {
          request.isNew = visitedInvites.findIndex(id => id === request.id) === -1;
          return request;
        });
    } catch (err) {
      console.log('Error updating invite requests', err);
    }
  }

  async updateRankInfo() {
    try {
      this.rankInfo = await this.client.getRankInfo();
    } catch (err) {
      this.rankInfo = {
        address: this.address,
        alias: this.alias,
        lastUpdated: Date.now(),
        cgs: 0,
        cgsChangeDay: 0,
        cgsChangeWeek: 0,
        communitySize: 0,
        cgsPercent: 0,
        communitySizeChange: 0,
        cgsChange: 0,
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

  async updateANV() {
    try {
      this.totalNetworkValueMicro = await this.client.getANV();
    } catch (err) {
      console.log('Error updating ANV', err);
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

  if (!options.skipANV)
    await displayWallet.updateANV();

  if (!options.skipRankInfo)
    await displayWallet.updateRankInfo();

  if (!options.skipInviteRequests)
    await displayWallet.updateInviteRequests();

  return displayWallet;
}
