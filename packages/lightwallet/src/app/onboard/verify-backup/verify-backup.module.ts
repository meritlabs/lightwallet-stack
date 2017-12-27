
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyBackupView } from 'merit/onboard/verify-backup/verify-backup';
import { ChunksPipe } from 'merit/shared/chunks.pipe';

@NgModule({
  declarations: [
    VerifyBackupView,
    ChunksPipe
  ],
  imports: [
    IonicPageModule.forChild(VerifyBackupView),
  ],
})
export class BackupModule {}
