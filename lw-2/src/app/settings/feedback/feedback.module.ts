import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { FeedbackComponent } from './feedback';

@NgModule({
  declarations: [
    FeedbackComponent,
  ],
  imports: [
    IonicComponentModule.forChild(FeedbackComponent),
  ],
})
export class FeedbackComponentModule {}
