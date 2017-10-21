import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
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
    IonicComponentModule.forChild(AddressbookComponent),
  ],
})
export class AddressbookComponentModule {}
