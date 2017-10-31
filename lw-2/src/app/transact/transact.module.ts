import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactView } from 'merit/transact/transact';
import { RateService } from 'merit/transact/rate.service';
import {RateServiceMock} from "merit/transact/rate.service.mock";
import {TxFormatService} from "merit/transact/tx-format.service";
import {TxFormatServiceMock} from "merit/transact/tx-format.sevice.mock";


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
    {
      provide: RateService,
      useClass: RateServiceMock
    }
  ]
})
export class TransactModule {}
