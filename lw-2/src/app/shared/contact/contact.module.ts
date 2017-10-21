import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { ContactComponent } from './contact';

@NgModule({
  declarations: [
    ContactComponent,
  ],
  imports: [
    IonicComponentModule.forChild(ContactComponent),
  ],
})
export class ContactComponentModule {}
