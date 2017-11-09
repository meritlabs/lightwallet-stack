import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EasyReceiveView } from './easy-receive';
import {EasyReceiveService} from "merit/easy-receive/easy-receive.service";

import { LedgerService } from 'merit/shared/ledger-service';

@NgModule({
  declarations: [
    EasyReceiveView,
  ],
  providers: [
    EasyReceiveService,
    LedgerService
  ],
  imports: [
    IonicPageModule.forChild(EasyReceiveView),
  ],
})
export class EasyReceiveViewModule {}
