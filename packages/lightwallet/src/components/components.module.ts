import { NgModule } from '@angular/core';
import { TransactionHistoryComponent } from './transaction-history/transaction-history';
import { MomentModule } from 'angular2-moment';
import { IonicModule } from 'ionic-angular';
import { SlideToActionComponent } from './slide-to-action/slide-to-action';
@NgModule({
	declarations: [
    TransactionHistoryComponent,
    SlideToActionComponent
  ],
	imports: [
    MomentModule,
    IonicModule
  ],
	exports: [
    TransactionHistoryComponent,
    SlideToActionComponent
  ]
})
export class ComponentsModule {}
