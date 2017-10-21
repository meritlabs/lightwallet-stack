import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
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
    IonicComponentModule.forChild(CreateWalletComponent),
  ],
})
export class CreateWalletComponentModule {}
