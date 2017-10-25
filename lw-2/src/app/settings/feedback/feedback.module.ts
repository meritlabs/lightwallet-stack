import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedbackView } from './feedback';

@NgModule({
  declarations: [
    FeedbackView,
  ],
  imports: [
    IonicPageModule.forChild(FeedbackView),
  ],
})
export class FeedbackComponentModule {}
