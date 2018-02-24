import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from 'merit/shared/shared.module';
import { VaultDetailsView } from 'merit/vaults/vault-details/vault-details';

@NgModule({
  declarations: [
    VaultDetailsView
  ],
  imports: [
    IonicPageModule.forChild(VaultDetailsView),
    SharedModule,
    MomentModule
  ]
})
export class VaultDetailsModule {
}
