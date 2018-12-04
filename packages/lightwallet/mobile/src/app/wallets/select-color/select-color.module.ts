import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectColorView } from './select-color';

@NgModule({
  declarations: [SelectColorView],
  imports: [IonicPageModule.forChild(SelectColorView)],
})
export class SelectColorModule {}
