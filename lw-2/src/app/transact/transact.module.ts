import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactPage } from './transact';

/*
  Transact is the most thoughtful name we can think of to define all of 
  'primary' actions associated with merit (receiving, sending, primarily).
*/
@NgModule({
  declarations: [
    TransactPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactPage),
  ],
})
export class TransactPageModule {}
