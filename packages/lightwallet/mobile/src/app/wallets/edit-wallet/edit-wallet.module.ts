import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectivesModule } from '@merit/mobile/directives/directives.module';
import { EditWalletView } from './edit-wallet';

@NgModule({
  declarations: [EditWalletView],
  imports: [IonicPageModule.forChild(EditWalletView), DirectivesModule],
})
export class EditWalletModule {}
