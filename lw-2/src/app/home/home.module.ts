import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { HomeComponent } from './home';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    MomentModule,
    IonicComponentModule.forChild(HomeComponent),
  ],
})
export class HomeComponentModule {}
