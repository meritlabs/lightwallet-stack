import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultsView } from 'merit/vaults/vaults';
import { MnemonicService } from "merit/utilities/mnemonic/mnemonic.service";

@NgModule({
  declarations: [
    VaultsView,
  ],
  providers: [
    MnemonicService,
  ],
  imports: [
    IonicPageModule.forChild(VaultsView)
  ],
})
export class VaultsModule {}
  
