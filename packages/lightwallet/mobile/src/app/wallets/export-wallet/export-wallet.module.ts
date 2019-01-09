import { NgModule } from '@angular/core';
import { QRCodeModule } from 'angular2-qrcode';
import { IonicPageModule } from 'ionic-angular';
import { DirectivesModule } from '@merit/mobile/directives/directives.module';
import { ExportWalletView } from './export-wallet';
import { ClipModule } from 'ng2-clip';

@NgModule({
  declarations: [ExportWalletView],
  imports: [QRCodeModule, IonicPageModule.forChild(ExportWalletView), DirectivesModule, ClipModule],
})
export class ExportWalletModule {}
