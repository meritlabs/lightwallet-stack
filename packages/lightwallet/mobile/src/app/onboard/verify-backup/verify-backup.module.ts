import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyBackupView } from '@merit/mobile/app/onboard/verify-backup/verify-backup';
import { ChunksPipe } from '@merit/mobile/app/shared/chunks.pipe';

@NgModule({
  declarations: [
    VerifyBackupView,
    ChunksPipe
  ],
  imports: [
    IonicPageModule.forChild(VerifyBackupView),
  ],
})
export class VerifyBackupModule {
}
