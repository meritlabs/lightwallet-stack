import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaderboardView } from './leaderboard';

@NgModule({
  declarations: [
    LeaderboardView
  ],
  imports: [
    IonicPageModule.forChild(LeaderboardView)
  ],
})
export class LeaderboardModule {}
