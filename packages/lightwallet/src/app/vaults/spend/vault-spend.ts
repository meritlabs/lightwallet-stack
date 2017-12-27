import * as _ from "lodash";
 

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VaultsService } from 'merit/vaults/vaults.service';
import { BwcService } from 'merit/core/bwc.service';
import { ProfileService } from 'merit/core/profile.service';
import { WalletService } from "merit/wallets/wallet.service";
import { Logger } from 'merit/core/logger';

@IonicPage({
  segment: 'vault/:vaultId/spend',
  defaultHistory: ['VaultDetailsView']
})
@Component({
  selector: 'vault-spend-view',
  templateUrl: 'vault-spend.html',
})
export class VaultSpendView {}
