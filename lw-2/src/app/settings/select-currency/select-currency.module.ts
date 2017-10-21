import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectCurrencyModal } from './select-currency';

@NgModule({
  declarations: [
    SelectCurrencyModal,
  ],
  imports: [
    IonicPageModule.forChild(SelectCurrencyModal),
  ],
})
export class SelectCurrencyPageModule {}
