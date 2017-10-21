import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { WalletComponent } from './wallet';

@NgModule({
  declarations: [
    WalletComponent,
  ],
  imports: [
    IonicComponentModule.forChild(WalletComponent),
  ],
})
export class WalletComponentModule {}
