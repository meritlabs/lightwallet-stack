import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { VaultRenewView } from 'merit/vaults/renew-vault/renew-vault';

import { BwcService } from 'merit/core/bwc.service';
import { MnemonicService } from "merit/utilities/mnemonic/mnemonic.service";
import { WalletService } from "merit/wallets/wallet.service";
import { VaultsService } from 'merit/vaults/vaults.service';
import { PopupService } from "merit/core/popup.service";

@NgModule({
  declarations: [
    VaultRenewView,
  ],
  providers: [
    PopupService,
  ],
  imports: [
    IonicPageModule.forChild(VaultRenewView),
  ],
})
export class CreateVaultComponentModule {}
