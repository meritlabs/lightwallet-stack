import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateWalletPage } from './create-wallet';
import {ConfigProvider} from "../../../../providers/config";

@NgModule({
  declarations: [
    CreateWalletPage,
  ],
  providers: [
    ConfigProvider
  ],
  imports: [
    IonicPageModule.forChild(CreateWalletPage),
  ],
})
export class CreateWalletPageModule {}
