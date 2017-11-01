import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletsView } from 'merit/wallets/wallets';
import { MomentModule } from 'angular2-moment';
import { BwcService } from 'merit/core/bwc.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { WalletService } from 'merit/wallets/wallet.service';
import { MnemonicService } from 'merit/utilities/mnemonic/mnemonic.service';
import { LanguageService } from 'merit/core/language.service';
//import {WalletServiceMock} from "./wallet.service.mock";

import {AppUpdateService} from "merit/core/app-update.service";
import {AppUpdateServiceMock} from "merit/core/app-update.service.mock";
import {FeedbackService} from "../feedback/feedback.service";
import {FeedbackServiceMock} from "../feedback/feedback.service.mock";

import {EasyReceiveService} from "merit/easy-receive/easy-receive.service";
import {EasyReceiveServiceMock} from "merit/easy-receive/easy-receive.service.mock";

import { InAppBrowser } from '@ionic-native/in-app-browser';
import {AddressbookService} from "merit/addressbook/addressbook.service";
import {AddressbookServiceMock} from "merit/addressbook/addressbook.service.mock";

@NgModule({
  declarations: [
    WalletsView,
  ],
  /** @DISCUSS what's the best place for app update service? */
  providers: [
    WalletService,
    AppUpdateService,
    FeedbackService,
    EasyReceiveService,
    AddressbookService,
    InAppBrowser,
    MnemonicService,
    LanguageService
  ]
  ,
  imports: [
    MomentModule,
    IonicPageModule.forChild(WalletsView),
  ],
})
export class WalletsModule {}
