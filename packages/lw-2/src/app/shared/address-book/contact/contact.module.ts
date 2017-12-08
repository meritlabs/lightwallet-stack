import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactView } from 'merit/shared/address-book/contact/contact';
import { GravatarModule } from 'merit/shared/gravatar.module';
import { Contacts } from '@ionic-native/contacts';
import { ProfileService } from "merit/core/profile.service";
import { AddressBookModule } from "merit/shared/address-book/address-book.module";


// Contact Module
@NgModule({
  declarations: [
    ContactView,
  ],
  providers: [
    Contacts,
    ProfileService
  ],
  imports: [
    AddressBookModule,
    GravatarModule,
    IonicPageModule.forChild(ContactView),
  ],
})
export class ContactViewModule {}
