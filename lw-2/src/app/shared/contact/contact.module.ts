import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactView } from './contact';

@NgModule({
  declarations: [
    ContactView,
  ],
  imports: [
    IonicPageModule.forChild(ContactView),
  ],
})
export class ContactComponentModule {}
