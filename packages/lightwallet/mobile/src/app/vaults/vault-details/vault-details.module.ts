import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultDetailsView } from 'merit/vaults/vault-details/vault-details';
import { ComponentsModule } from 'merit/../components/components.module';

@NgModule({
  declarations: [
    VaultDetailsView
  ],
  imports: [
    IonicPageModule.forChild(VaultDetailsView),
    ComponentsModule
  ]
})
export class VaultDetailsModule {}
