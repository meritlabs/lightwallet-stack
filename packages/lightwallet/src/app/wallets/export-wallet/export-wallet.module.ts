import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExportWalletView } from './export-wallet';
import { QRCodeModule } from 'angular2-qrcode';
import { File } from '@ionic-native/file';


@NgModule({
  declarations: [
    ExportWalletView,
  ],
  imports: [
    QRCodeModule, 
    IonicPageModule.forChild(ExportWalletView),
  ],
  providers: [
    File,
  ]
})
export class $$moduleName$$Module {}
