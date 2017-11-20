import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultsView } from 'merit/vaults/vaults';
import { MnemonicService } from "merit/utilities/mnemonic/mnemonic.service";
import { VaultsService } from 'merit/vaults/vaults.service';

@NgModule({
  declarations: [
    VaultsView,
  ],
  providers: [
    MnemonicService,
    VaultsService,
  ],
  imports: [
    IonicPageModule.forChild(VaultsView)
  ],
})
export class VaultsModule {}
  
