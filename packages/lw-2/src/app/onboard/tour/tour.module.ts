import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TourView } from 'merit/onboard/tour/tour';

// This is the tour component. 
// It walks a user through the benefits of Merit..
@NgModule({
  declarations: [
    TourView,
  ],
  imports: [
    IonicPageModule.forChild(TourView),
  ],
})
export class TourComponentModule {}
