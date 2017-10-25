import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeView } from './home';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    HomeView,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(HomeView),
  ],
})
export class HomeComponentModule {}
