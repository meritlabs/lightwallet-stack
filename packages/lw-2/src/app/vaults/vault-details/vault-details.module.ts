import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultDetailsView } from 'merit/vaults/vault-details/vault-details';
import { ToUnitPipe } from 'merit/shared/to-unit.pipe';
import { ToFiatPipe } from 'merit/shared/to-fiat.pipe';
import { SharedModule } from 'merit/shared/shared.module';
import { VaultsService } from 'merit/vaults/vaults.service';

/*
  ToDo: Work to get this lazy-loadable as possible. 
*/
@NgModule({
  declarations: [
    VaultDetailsView
  ],
  imports: [
    IonicPageModule.forChild(VaultDetailsView),
    SharedModule,
  ],
  providers: [
    VaultsService
  ]
})
export class VaultDetailsModule {}
