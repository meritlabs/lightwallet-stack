import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TellPeopleView } from './tell-people';
import { ClipModule } from 'ng2-clip';

@NgModule({
  declarations: [TellPeopleView],
  imports: [IonicPageModule.forChild(TellPeopleView), ClipModule],
})
export class TellPeopleModule {}
