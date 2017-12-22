import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactView } from 'merit/transact/transact';
import { FeeService } from 'merit/shared/fee/fee.service'

import { ProfileService } from 'merit/core/profile.service';

import { RateService } from 'merit/transact/rate.service';


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
  providers: [
    RateService,
    FeeService
  ]
})
export class TransactModule {}
