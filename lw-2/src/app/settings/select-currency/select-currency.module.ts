import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { SelectCurrencyModal } from './select-currency';

@NgModule({
  declarations: [
    SelectCurrencyModal,
  ],
  imports: [
    IonicComponentModule.forChild(SelectCurrencyModal),
  ],
})
export class SelectCurrencyComponentModule {}
