import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedbackComponent } from './feedback';

@NgModule({
  declarations: [
    FeedbackComponent,
  ],
  imports: [
    IonicPageModule.forChild(FeedbackComponent),
  ],
})
export class FeedbackComponentModule {}
