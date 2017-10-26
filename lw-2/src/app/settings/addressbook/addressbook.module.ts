import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressbookView } from '@app/settings/addressbook/addressbook';
import { ContactsService } from "./../../shared/contacts.service";

@NgModule({
  declarations: [
    AddressbookView,
  ],
  providers: [
    ContactsService
  ],
  imports: [
    IonicPageModule.forChild(AddressbookView),
  ],
})
export class AddressbookComponentModule {}
