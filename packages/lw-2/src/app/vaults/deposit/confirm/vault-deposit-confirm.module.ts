import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultDepositConfirmView } from 'merit/vaults/deposit/confirm/vault-deposit-confirm';
import { ToUnitPipe } from 'merit/shared/to-unit.pipe';
import { ToFiatPipe } from 'merit/shared/to-fiat.pipe';
import { SharedModule } from 'merit/shared/shared.module';
import { VaultsService } from 'merit/vaults/vaults.service';
import { MomentModule } from 'angular2-moment';


/*
  ToDo: Work to get this lazy-loadable as possible. 
*/
@NgModule({
  declarations: [
    VaultDepositConfirmView
  ],
  imports: [
    IonicPageModule.forChild(VaultDepositConfirmView),
  ],
  providers: [
  ]
})
export class VaultDepositConfirmModule {}
