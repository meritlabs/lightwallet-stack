import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { AddContactComponent } from './add-contact';

@NgModule({
  declarations: [
    AddContactComponent,
  ],
  imports: [
    IonicComponentModule.forChild(AddContactComponent),
  ],
})
export class AddContactComponentModule {}
