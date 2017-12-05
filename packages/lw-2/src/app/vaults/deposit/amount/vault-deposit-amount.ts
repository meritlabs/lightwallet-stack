import * as _ from "lodash";
import * as Promise from 'bluebird';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VaultsService } from 'merit/vaults/vaults.service';
import { BwcService } from 'merit/core/bwc.service';
import { ProfileService } from 'merit/core/profile.service';
import { Logger } from 'merit/core/logger';
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";
import { WalletService } from "merit/wallets/wallet.service";
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { TxFormatService } from "merit/transact/tx-format.service";
import { FiatAmount } from 'merit/shared/fiat-amount.model';
import { RateService } from 'merit/transact/rate.service';


@IonicPage({
  segment: 'vault/:vaultId/deposit/amount',
  defaultHistory: ['VaultDetailsView']
})
@Component({
  selector: 'vault-deposit-amount-view',
  templateUrl: 'vault-deposit-amount.html',
})
export class VaultDepositAmountView {

}
