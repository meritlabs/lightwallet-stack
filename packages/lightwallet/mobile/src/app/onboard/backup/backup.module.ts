import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BackupView } from '@merit/mobile/app/onboard/backup/backup';
import { ClipModule } from 'ng2-clip';

@NgModule({
  declarations: [BackupView],
  imports: [IonicPageModule.forChild(BackupView), ClipModule],
})
export class BackupModule {}
