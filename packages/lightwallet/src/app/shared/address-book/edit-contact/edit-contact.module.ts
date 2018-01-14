import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditContactView } from 'merit/shared/address-book/edit-contact/edit-contact';

@NgModule({
  declarations: [
    EditContactView,
  ],
  imports: [
    IonicPageModule.forChild(EditContactView)
  ]
})
export class EditContactComponentModule {
}
