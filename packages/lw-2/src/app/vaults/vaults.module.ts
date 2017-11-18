import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultsView } from 'merit/vaults/vaults';
import { MnemonicService } from "merit/utilities/mnemonic/mnemonic.service";
import { ProfileService } from 'merit/core/profile.service';
import { WalletService } from "merit/wallets/wallet.service";
import { BwcService } from 'merit/core/bwc.service';

@NgModule({
  declarations: [
    VaultsView,
  ],
  providers: [
    BwcService,
    MnemonicService,
    ProfileService,
    WalletService,
  ],
  imports: [
    IonicPageModule.forChild(VaultsView)
  ],
})
export class VaultsModule {}
  
