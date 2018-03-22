import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditWalletView } from './edit-wallet';

@NgModule({
  declarations: [
    EditWalletView,
  ],
  imports: [
    IonicPageModule.forChild(EditWalletView),
  ],
})
export class EditWalletModule {
}
