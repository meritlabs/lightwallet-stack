import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnlockRequestsView } from './unlock-requests';
import { ComponentsModule } from '@merit/mobile/components/components.module';

@NgModule({
  declarations: [UnlockRequestsView],
  imports: [IonicPageModule.forChild(UnlockRequestsView), ComponentsModule],
})
export class UnlockRequestsModule {}
