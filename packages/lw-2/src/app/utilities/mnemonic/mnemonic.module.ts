import { ErrorHandler, NgModule } from '@angular/core';

import { ProfileService } from 'merit/core/profile.service'; 
import { MnemonicService } from 'merit/utilities/mnemonic/mnemonic.service'; 

// TODO: Revisit
@NgModule({
  providers: [
    ProfileService
  ],
  declarations: [
    MnemonicService
  ]
})

export class MnemonicModule {}