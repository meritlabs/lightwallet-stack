import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeComponent } from './home';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(HomeComponent),
  ],
})
export class HomeComponentModule {}
