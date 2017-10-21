import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { UnlockComponent } from './unlock';

@NgModule({
  declarations: [
    UnlockComponent,
  ],
  imports: [
    IonicComponentModule.forChild(UnlockComponent),
  ],
})
export class UnlockComponentModule {}
