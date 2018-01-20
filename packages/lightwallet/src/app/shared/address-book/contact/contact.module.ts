import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactView } from 'merit/shared/address-book/contact/contact';
import { GravatarModule } from 'merit/shared/gravatar.module';

// Contact Module
@NgModule({
  declarations: [
    ContactView,
  ],
  imports: [
    GravatarModule,
    IonicPageModule.forChild(ContactView),
  ],
})
export class ContactViewModule {
}
