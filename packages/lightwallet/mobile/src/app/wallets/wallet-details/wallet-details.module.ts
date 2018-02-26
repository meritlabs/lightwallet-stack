import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from 'merit/shared/shared.module';
import { WalletDetailsView } from 'merit/wallets/wallet-details/wallet-details';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    WalletDetailsView
  ],
  imports: [
    IonicPageModule.forChild(WalletDetailsView),
    MomentModule,
    SharedModule,
    ComponentsModule,
    DirectivesModule
  ]
})
export class WalletDetailsModule {
}
