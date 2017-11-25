import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddContactView } from 'merit/shared/address-book/add-contact/add-contact';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { Contacts } from '@ionic-native/contacts';

@NgModule({
  declarations: [
    AddContactView,
  ],
  imports: [
    IonicPageModule.forChild(AddContactView),
  ],
  providers: [
    Contacts,
    AddressBookService,
  ]
})
export class AddContactComponentModule {}
