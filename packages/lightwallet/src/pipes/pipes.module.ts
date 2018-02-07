import { NgModule } from '@angular/core';
import { WalletNamePipe } from './wallet-name/wallet-name';
@NgModule({
	declarations: [WalletNamePipe],
	imports: [],
	exports: [WalletNamePipe]
})
export class PipesModule {}
