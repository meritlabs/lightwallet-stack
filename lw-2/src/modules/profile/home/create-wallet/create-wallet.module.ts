import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateWalletPage } from './create-wallet';

@NgModule({
  declarations: [
    CreateWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateWalletPage),
  ],
})
export class CreateWalletPageModule {}
