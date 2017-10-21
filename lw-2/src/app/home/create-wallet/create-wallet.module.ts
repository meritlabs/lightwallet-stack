import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { CreateWalletComponent } from './create-wallet';
import {ConfigProvider} from "../../../../providers/config";

@NgModule({
  declarations: [
    CreateWalletComponent,
  ],
  providers: [
    ConfigProvider
  ],
  imports: [
    IonicComponentModule.forChild(CreateWalletComponent),
  ],
})
export class CreateWalletComponentModule {}
