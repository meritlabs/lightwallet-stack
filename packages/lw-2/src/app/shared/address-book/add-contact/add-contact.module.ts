import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddContactView } from 'merit/shared/address-book/add-contact/add-contact';

@NgModule({
  declarations: [
    AddContactView,
  ],
  imports: [
    IonicPageModule.forChild(AddContactView),
  ],
})
export class AddContactComponentModule {}
