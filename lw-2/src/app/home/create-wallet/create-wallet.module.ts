import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateWalletView } from './create-wallet';
import {ConfigService} from "../../../../providers/config";

@NgModule({
  declarations: [
    CreateWalletView,
  ],
  providers: [
    ConfigService
  ],
  imports: [
    IonicPageModule.forChild(CreateWalletView),
  ],
})
export class CreateWalletComponentModule {}
