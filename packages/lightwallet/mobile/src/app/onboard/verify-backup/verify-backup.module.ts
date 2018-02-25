import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyBackupView } from '@merit/mobile/app/onboard/verify-backup/verify-backup';

@NgModule({
  declarations: [
    VerifyBackupView
  ],
  imports: [
    IonicPageModule.forChild(VerifyBackupView),
  ],
})
export class VerifyBackupModule {
}
