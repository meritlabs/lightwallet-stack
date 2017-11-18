import { Injectable } from '@angular/core';

import { ProfileService } from 'merit/core/profile.service';


@Injectable()
export class VaultsService {

  constructor(
    private profileService: ProfileService
  ) {
    console.log('hello VaultsService');
  }

  getVaultList(): Array<any> {
    return this.profileService.getVaults();
  }

  getVaults(): Promise<Array<any>> {
    return Promise.resolve([]);
  }

  addVault(vault: any): Promise<boolean> {
    return this.profileService.addVault(vault);
  }
}
