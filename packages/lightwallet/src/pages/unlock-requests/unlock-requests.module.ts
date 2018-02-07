import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnlockRequestsView } from './unlock-requests';

@NgModule({
  declarations: [
    UnlockRequestsView,
  ],
  imports: [
    IonicPageModule.forChild(UnlockRequestsView),
  ],
})
export class UnlockRequestsModule {}
