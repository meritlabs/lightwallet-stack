import { NgModule } from '@angular/core';
import { TransactionHistoryComponent } from './transaction-history/transaction-history';
import { MomentModule } from 'ngx-moment';
import { IonicModule } from 'ionic-angular';
import { SlideToActionComponent } from './slide-to-action/slide-to-action';
import { ContactAvatarComponent } from './contact-avatar/contact-avatar';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [TransactionHistoryComponent, SlideToActionComponent, ContactAvatarComponent],
  imports: [MomentModule, CommonPipesModule, IonicModule],
  exports: [TransactionHistoryComponent, SlideToActionComponent, ContactAvatarComponent],
})
export class ComponentsModule {}
