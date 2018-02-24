import { NgModule } from '@angular/core';
import { QRCodeModule } from 'angular2-qrcode';
import { IonicPageModule } from 'ionic-angular';
import { ExportWalletView } from './export-wallet';

@NgModule({
  declarations: [
    ExportWalletView,
  ],
  imports: [
    QRCodeModule,
    IonicPageModule.forChild(ExportWalletView),
  ]
})
export class $$moduleName$$Module {
}
