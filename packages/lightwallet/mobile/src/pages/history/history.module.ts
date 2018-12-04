import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryView } from './history';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [HistoryView],
  imports: [IonicPageModule.forChild(HistoryView), ComponentsModule],
})
export class HistoryPageModule {}
