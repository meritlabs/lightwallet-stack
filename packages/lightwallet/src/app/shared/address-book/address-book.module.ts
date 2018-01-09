import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressBookView } from 'merit/shared/address-book/address-book';
import { GravatarModule } from 'merit/shared/gravatar.module';


// This module manages the sending of money.
// This is the first of three steps.
@NgModule({
  declarations: [
    AddressBookView
  ],
  imports: [
    IonicPageModule.forChild(AddressBookView),
    GravatarModule
  ]
})
export class AddressBookModule {
}
