import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '@merit/mobile/app/shared/shared.module';
import { VaultDetailsView } from '@merit/mobile/app/vaults/vault-details/vault-details';

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
