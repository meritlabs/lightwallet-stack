import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactView } from '@app/shared/contact/contact.view';

@NgModule({
  declarations: [
    ContactView,
  ],
  imports: [
    IonicPageModule.forChild(ContactView),
  ],
})
export class ContactViewModule {}
