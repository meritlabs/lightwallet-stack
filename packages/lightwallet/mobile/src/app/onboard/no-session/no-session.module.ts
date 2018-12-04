import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoSessionView } from './no-session';

@NgModule({
  declarations: [NoSessionView],
  imports: [IonicPageModule.forChild(NoSessionView)],
})
export class NoSessionModule {}
