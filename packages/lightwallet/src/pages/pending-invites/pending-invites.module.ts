import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PendingInvitesView } from './pending-invites';

@NgModule({
  declarations: [
    PendingInvitesView,
  ],
  imports: [
    IonicPageModule.forChild(PendingInvitesView),
  ],
})
export class PendingInvitesViewModule {}
