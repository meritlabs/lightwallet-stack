import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressbookPage } from './addressbook';

@NgModule({
  declarations: [
    AddressbookPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressbookPage),
  ],
})
export class AddressbookPageModule {}
