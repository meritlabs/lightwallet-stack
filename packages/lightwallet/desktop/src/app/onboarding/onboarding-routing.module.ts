import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingRootComponent } from '@merit/desktop/app/onboarding/onboarding-root/onboarding-root.component';
import { UnlockComponent } from './unlock/unlock.view';
import { OnboardView} from './onboard/onboard.view';
import { AppStartUpComponent } from './app-start-up/app-start-up.component';
import { GuideWentFromDesktopComponent } from './app-start-up/guide-went-from-desktop/guide-went-from-desktop.component';
import { InvitedUserComponent } from './app-start-up/invited-user/invited-user.component';
const routes: Routes = [
  {
    path: '',
    component: OnboardingRootComponent,
    children: [
      { path: '', component: AppStartUpComponent },
      { path: 'tour', component: OnboardView },
      { path: 'tour/desktop', component: GuideWentFromDesktopComponent },
      { path: 'tour/invited', component: InvitedUserComponent },
      { path: 'unlock', component: UnlockComponent },
      { path: 'import', loadChildren: '../import/import.module#ImportModule' },
      { path: 'import/qr-code', loadChildren: '../import/import-by-qr/import-by-qr.module#ImportByQrModule' },
      { path: 'import/file', loadChildren: '../import/import-with-file/import-with-file.module#ImportWithFileModule' },
      { path: 'import/phrase', loadChildren: '../import/phrase-import/phrase-import.module#PhraseImportModule' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class OnboardingRoutingModule {}
