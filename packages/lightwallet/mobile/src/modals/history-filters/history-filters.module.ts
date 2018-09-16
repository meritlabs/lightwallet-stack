import { NgModule } from '@angular/core';
import { HistoryFiltersModal } from './history-filters';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    HistoryFiltersModal
  ],
  imports: [
    IonicPageModule.forChild(HistoryFiltersModal)
  ]
})
export class HistoryFiltersModule {}
