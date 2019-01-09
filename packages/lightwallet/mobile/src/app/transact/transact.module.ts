import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactView } from '@merit/mobile/app/transact/transact';

@NgModule({
  declarations: [TransactView],
  imports: [IonicPageModule.forChild(TransactView)],
})
export class TransactModule {}
