import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectCurrencyModal } from '@app/settings/select-currency/select-currency';

@NgModule({
  declarations: [
    SelectCurrencyModal,
  ],
  imports: [
    IonicPageModule.forChild(SelectCurrencyModal),
  ],
})
export class SelectCurrencyComponentModule {}
