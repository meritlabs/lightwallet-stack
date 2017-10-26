import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddContactView } from '@app/settings/addressbook/add-contact/add-contact';

@NgModule({
  declarations: [
    AddContactView,
  ],
  imports: [
    IonicPageModule.forChild(AddContactView),
  ],
})
export class AddContactComponentModule {}
