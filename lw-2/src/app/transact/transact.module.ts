import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
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
    IonicComponentModule.forChild(TransactComponent),
  ],
})
export class TransactComponentModule {}
