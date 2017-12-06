import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditContactView } from 'merit/shared/address-book/edit-contact/edit-contact';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { Contacts } from '@ionic-native/contacts';

@NgModule({
  declarations: [
    EditContactView,
  ],
  imports: [
    IonicPageModule.forChild(EditContactView),
  ],
  providers: [
    Contacts,
    AddressBookService,
  ]
})
export class EditContactComponentModule {}
