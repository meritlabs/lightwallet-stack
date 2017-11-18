import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultDetailsView } from 'merit/vaults/vault-details/vault-details';


/*
  ToDo: Work to get this lazy-loadable as possible. 
*/
@NgModule({
  declarations: [
    VaultDetailsView
  ],
  imports: [
    IonicPageModule.forChild(VaultDetailsView),
  ],
  providers: [
  ]
})
export class VaultDetailsModule {}