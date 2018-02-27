import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BackupView } from '@merit/mobile/app/onboard/backup/backup';

@NgModule({
  declarations: [
    BackupView,
  ],
  imports: [
    IonicPageModule.forChild(BackupView),
  ],
})
export class BackupModule {
}
