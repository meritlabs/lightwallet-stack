import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddContactPage } from './add-contact';

@NgModule({
  declarations: [
    AddContactPage,
  ],
  imports: [
    IonicPageModule.forChild(AddContactPage),
  ],
})
export class AddContactPageModule {}
