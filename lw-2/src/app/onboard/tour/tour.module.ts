import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { TourComponent } from './tour';

@NgModule({
  declarations: [
    TourComponent,
  ],
  imports: [
    IonicComponentModule.forChild(TourComponent),
  ],
})
export class TourComponentModule {}
