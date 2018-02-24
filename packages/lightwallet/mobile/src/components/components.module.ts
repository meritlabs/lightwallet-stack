import { NgModule } from '@angular/core';
import { TransactionHistoryComponent } from './transaction-history/transaction-history';
import { MomentModule } from 'angular2-moment';
import { IonicModule } from 'ionic-angular';
import { SlideToActionComponent } from './slide-to-action/slide-to-action';
import { ContactAvatarComponent } from './contact-avatar/contact-avatar';
@NgModule({
	declarations: [
    TransactionHistoryComponent,
    SlideToActionComponent,
    ContactAvatarComponent
  ],
	imports: [
    MomentModule,
    IonicModule
  ],
	exports: [
    TransactionHistoryComponent,
    SlideToActionComponent,
    ContactAvatarComponent
  ]
})
export class ComponentsModule {}
