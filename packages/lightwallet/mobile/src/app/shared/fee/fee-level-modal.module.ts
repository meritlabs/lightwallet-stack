import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeeLevelModal } from './fee-level-modal';

@NgModule({
  declarations: [
    FeeLevelModal
  ],
  imports: [
    IonicPageModule.forChild(FeeLevelModal),
  ]
})
export class FeeLevelModalModule {
}