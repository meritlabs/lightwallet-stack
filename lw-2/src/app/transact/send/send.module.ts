import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendComponent } from './send';

@NgModule({
  declarations: [
    SendComponent,
  ],
  imports: [
    IonicPageModule.forChild(SendComponent),
  ],
})
export class SendComponentModule {}
