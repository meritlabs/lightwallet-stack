import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactView } from './transact';

/*
  Transact is the most thoughtful name we can think of to define all of 
  'primary' actions associated with merit (receiving, sending, primarily).
*/
@NgModule({
  declarations: [
    TransactView,
  ],
  imports: [
    IonicPageModule.forChild(TransactView),
  ],
})
export class TransactComponentModule {}
