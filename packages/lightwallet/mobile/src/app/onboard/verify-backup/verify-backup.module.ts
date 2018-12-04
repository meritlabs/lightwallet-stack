import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyBackupView } from '@merit/mobile/app/onboard/verify-backup/verify-backup';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [VerifyBackupView],
  imports: [IonicPageModule.forChild(VerifyBackupView), CommonPipesModule],
})
export class VerifyBackupModule {}
