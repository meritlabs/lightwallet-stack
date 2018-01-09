import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { ContactView } from 'merit/shared/address-book/contact/contact';
import { GravatarModule } from 'merit/shared/gravatar.module';
import { Contacts } from '@ionic-native/contacts';
import { ProfileService } from "merit/core/profile.service";

// Contact Module
@NgModule({
  declarations: [
    ContactView,
  ],
  providers: [
    Contacts,
    ProfileService,
    AddressBookService
  ],
  imports: [
    GravatarModule,
    IonicPageModule.forChild(ContactView),
  ],
})
export class ContactViewModule {}
