import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { SendComponent } from './send';

@NgModule({
  declarations: [
    SendComponent,
  ],
  imports: [
    IonicComponentModule.forChild(SendComponent),
  ],
})
export class SendComponentModule {}
