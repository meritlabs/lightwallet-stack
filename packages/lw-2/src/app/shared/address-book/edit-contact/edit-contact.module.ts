import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditContactView } from 'merit/shared/address-book/edit-contact/edit-contact';
import { MeritContactBuilder } from "merit/shared/address-book/merit-contact.builder";
import { Contacts } from '@ionic-native/contacts';
import { AddressBookModule } from "merit/shared/address-book/address-book.module";

@NgModule({
  declarations: [
    EditContactView,
  ],
  imports: [
    AddressBookModule,
    IonicPageModule.forChild(EditContactView)
  ],
  providers: [
  ]
})
export class EditContactComponentModule {}
