import { NgModule } from '@angular/core';
import { TransactionHistoryComponent } from './transaction-history/transaction-history';
import { MomentModule } from 'angular2-moment';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [
    TransactionHistoryComponent
  ],
	imports: [
    MomentModule,
    IonicModule
  ],
	exports: [
    TransactionHistoryComponent
  ]
})
export class ComponentsModule {}
