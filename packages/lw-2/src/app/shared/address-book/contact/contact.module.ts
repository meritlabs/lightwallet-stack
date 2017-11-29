import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactView } from 'merit/shared/address-book/contact/contact';
import { GravatarModule } from 'merit/shared/gravatar.module';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { Contacts } from '@ionic-native/contacts';
import { ProfileService } from "merit/core/profile.service";


// Contact Module
@NgModule({
  declarations: [
    ContactView,
  ],
  providers: [
    AddressBookService,
    Contacts,
    ProfileService
  ],
  imports: [
    GravatarModule,
    IonicPageModule.forChild(ContactView),
  ],
})
export class ContactViewModule {}
