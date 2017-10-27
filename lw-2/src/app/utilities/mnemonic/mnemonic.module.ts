import { ErrorHandler, NgModule } from '@angular/core';

import { ProfileService } from 'merit/core/profile.service'; 

@NgModule({
  providers: [
    ProfileService
  ]
})

export class MnemonicModule {}