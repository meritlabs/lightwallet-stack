import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactComponent } from './transact';

/*
  Transact is the most thoughtful name we can think of to define all of 
  'primary' actions associated with merit (receiving, sending, primarily).
*/
@NgModule({
  declarations: [
    TransactComponent,
  ],
  imports: [
    IonicPageModule.forChild(TransactComponent),
  ],
})
export class TransactComponentModule {}
