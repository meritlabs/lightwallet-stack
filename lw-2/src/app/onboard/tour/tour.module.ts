import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TourComponent } from './tour';

@NgModule({
  declarations: [
    TourComponent,
  ],
  imports: [
    IonicPageModule.forChild(TourComponent),
  ],
})
export class TourComponentModule {}
