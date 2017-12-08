import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuyAndSellView } from './buy-and-sell';

@NgModule({
  declarations: [
    BuyAndSellView,
  ],
  imports: [
    IonicPageModule.forChild(BuyAndSellView),
  ],
})
export class BuyAndSellModule {}
