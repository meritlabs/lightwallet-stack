import { FeeService } from './fee.service';
import { IonicPageModule } from 'ionic-angular';
import { FeeLevelModal } from './fee-level-modal';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    FeeLevelModal
  ],
  imports: [
    IonicPageModule.forChild(FeeLevelModal),
  ],
  providers: [
    FeeService
  ]
})
export class FeeLevelModalModule {}