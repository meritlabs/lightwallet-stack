import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaderboardView } from './leaderboard';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [LeaderboardView],
  imports: [IonicPageModule.forChild(LeaderboardView), CommonPipesModule],
})
export class LeaderboardModule {}
