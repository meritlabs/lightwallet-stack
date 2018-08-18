import { Injectable, Optional } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { WalletService } from '@merit/common/services/wallet.service';
import { ContactsService } from '@merit/common/services/contacts.service';
import { MeritContact } from '@merit/common/models/merit-contact';

export interface IInviteRequest {
  id: string;
  refId: string;
  walletId: string;
  address: string;
  alias: string;
  isVault: boolean;
  ignored: boolean;
  parentAddress: string;
  timestamp: number;
}

export class InviteRequest implements IInviteRequest {
  id: string;
  refId: string;
  walletId: string;
  address: string;
  alias: string;
  isVault: boolean;
  ignored: boolean;
  parentAddress: string;
  timestamp: number;

  contact: MeritContact;

  isNew: boolean;

  constructor(public wallet: MeritWalletClient,
              private walletService: WalletService) {
  }

  static fromObject(obj: Partial<IInviteRequest>, wallet: MeritWalletClient, walletService: WalletService): InviteRequest {
    const ir = new InviteRequest(wallet, walletService);
    for (let key in obj)
      ir[key] = obj[key];
    return ir;
  }

  async accept(wallet: MeritWalletClient) {
    return this.walletService.sendInvite(wallet, this.address);
  }

  ignore() {
    return this.delete();
  }

  private delete(): Promise<void> {
    return this.wallet.deleteInviteRequest(this.id);
  }
}

@Injectable()
export class InviteRequestsService {
  constructor(private walletService: WalletService,
              @Optional() private contactsService: ContactsService) {
  }

  async getInviteRequests(wallet: MeritWalletClient): Promise<InviteRequest[]> {
    const inviteRequests = await wallet.getInviteRequests();
    return inviteRequests.map(inviteRequest => InviteRequest.fromObject(inviteRequest, wallet, this.walletService));
  }

  async getAllInviteRequests(wallets: MeritWalletClient[]): Promise<InviteRequest[]> {
    const inviteRequests = await Promise.all(wallets.map(wallet => this.getInviteRequests(wallet)));
    return inviteRequests.reduce((allRequests: InviteRequest[], inviteRequests: InviteRequest[]) => allRequests.concat(inviteRequests), []);
  }
}
