import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddContactComponent } from './add-contact';

@NgModule({
  declarations: [
    AddContactComponent,
  ],
  imports: [
    IonicPageModule.forChild(AddContactComponent),
  ],
})
export class AddContactComponentModule {}
