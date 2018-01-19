import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryView } from './history';

@NgModule({
  declarations: [
    HistoryView,
  ],
  imports: [
    IonicPageModule.forChild(HistoryView),
  ],
})
export class HistoryPageModule {}
