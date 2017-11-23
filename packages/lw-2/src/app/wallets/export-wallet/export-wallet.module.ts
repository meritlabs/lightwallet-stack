import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExportWalletView } from './export-wallet';
import { QRCodeModule } from 'angular2-qrcode';


@NgModule({
  declarations: [
    ExportWalletView,
  ],
  imports: [
    QRCodeModule, 
    IonicPageModule.forChild(ExportWalletView),
  ],
})
export class $$moduleName$$Module {}
