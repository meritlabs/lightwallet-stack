import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressbookPage } from './addressbook';
//import {ContactsService} from "../../../../providers/contacts-service";

@NgModule({
  declarations: [
    AddressbookPage,
  ],
  //providers: [
  //  ContactsService
  //],
  imports: [
    IonicPageModule.forChild(AddressbookPage),
  ],
})
export class AddressbookPageModule {}
