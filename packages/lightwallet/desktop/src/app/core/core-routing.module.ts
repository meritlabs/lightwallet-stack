import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletsComponent } from './wallets/wallets.component';
import { ReceiveComponent } from './receive/receive.component';
import { SendComponent } from './send/send.component';
import { HistoryComponent } from './history/history.component';
import { CoreComponent } from './core.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommunityComponent } from './community/community.component';

const routes: Routes = [
  {
    path: '', component: CoreComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'wallets', component: WalletsComponent },
      { path: 'receive', component: ReceiveComponent },
      { path: 'send', component: SendComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'community', component: CommunityComponent },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
