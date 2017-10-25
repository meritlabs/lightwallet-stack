import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressbookComponent } from './addressbook';
import {ContactsService} from "../../../../providers/contacts-service";

@NgModule({
  declarations: [
    AddressbookComponent,
  ],
  providers: [
    ContactsService
  ],
  imports: [
    IonicPageModule.forChild(AddressbookComponent),
  ],
})
export class AddressbookComponentModule {}
