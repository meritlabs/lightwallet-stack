import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactPage } from './transact';

@NgModule({
  declarations: [
    TransactPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactPage),
  ],
})
export class TransactPageModule {}
