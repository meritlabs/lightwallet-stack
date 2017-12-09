import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EasyReceiveService } from "merit/easy-receive/easy-receive.service";

import { LedgerService } from 'merit/shared/ledger.service';

@NgModule({
  declarations: [
  ],
  providers: [
    EasyReceiveService,
    LedgerService
  ],
  imports: [
  ],
})
export class EasyReceiveViewModule {}
