import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultDepositAmountView } from 'merit/vaults/deposit/amount/vault-deposit-amount';
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
    VaultDepositAmountView
  ],
  imports: [
    IonicPageModule.forChild(VaultDepositAmountView),
  ],
  providers: [
  ]
})
export class VaultDepositAmountModule {}