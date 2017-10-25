import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateWalletComponent } from './create-wallet';
import {ConfigService} from "../../../../providers/config";

@NgModule({
  declarations: [
    CreateWalletComponent,
  ],
  providers: [
    ConfigService
  ],
  imports: [
    IonicPageModule.forChild(CreateWalletComponent),
  ],
})
export class CreateWalletComponentModule {}
