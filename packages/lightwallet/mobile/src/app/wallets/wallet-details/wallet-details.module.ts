import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { IonicPageModule } from 'ionic-angular';
import { WalletDetailsView } from '@merit/mobile/app/wallets/wallet-details/wallet-details';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { CommonPipesModule } from '@merit/common/common-pipes.module';


@NgModule({
  declarations: [
    WalletDetailsView
  ],
  imports: [
    IonicPageModule.forChild(WalletDetailsView),
    MomentModule,
    ComponentsModule,
    DirectivesModule,
    CommonPipesModule
  ]
})
export class WalletDetailsModule {
}
