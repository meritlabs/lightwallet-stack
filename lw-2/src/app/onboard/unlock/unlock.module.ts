import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnlockComponent } from './unlock';

@NgModule({
  declarations: [
    UnlockComponent,
  ],
  imports: [
    IonicPageModule.forChild(UnlockComponent),
  ],
})
export class UnlockComponentModule {}
