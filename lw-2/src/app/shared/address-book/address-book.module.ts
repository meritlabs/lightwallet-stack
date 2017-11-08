import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendView } from 'merit/transact/send/send';
import { SendService } from "merit/transact/send/send.service";
import { GravatarModule } from 'merit/shared/gravatar.module';
import { GravatarComponent } from 'merit/shared/gravatar.component';
import { WalletService } from "merit/wallets/wallet.service";
import { WalletsModule } from "merit/wallets/wallets.module";
import { AddressBookView } from 'merit/shared/address-book/address-book';
import { Contacts } from '@ionic-native/contacts';


// This module manaages the sending of money.
// This is the first of three steps.
@NgModule({ 
  declarations: [
    AddressBookView 
  ],
  imports: [
    IonicPageModule.forChild(AddressBookView),
    GravatarModule
    ],
  providers: [
    WalletService,
    SendService,
    Contacts 
  ],
  exports: [
  ]
})
export class AddressBookModule {}
