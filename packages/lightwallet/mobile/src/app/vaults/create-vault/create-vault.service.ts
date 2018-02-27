import { Injectable } from '@angular/core';

import { IDisplayWallet } from "merit/../models/display-wallet";
import { Logger } from 'merit/core/logger';
import { WalletService } from 'merit/wallets/wallet.service';
import { ProfileService } from 'merit/core/profile.service';
import { BwcService } from 'merit/core/bwc.service';
import { RateService } from "merit/transact/rate.service";

export interface  ICreateVaultData {
  vaultName: string;
  wallet: IDisplayWallet;
  whiteList: Array<IDisplayWallet>;
  amount: number;
  masterKey: {key: any, phrase: string};
}

@Injectable()
export class CreateVaultService {









}