import { Injectable } from '@angular/core';

import { BwcService } from 'merit/core/bwc.service';


@Injectable()
export class VaultsService {

    constructor(
        private bwcService: BwcService,
    ) {
        console.log('hello VaultsService');
    }

    getVaults(): Promise<Array<any>> {
        console.log('getting vaults');
        return this.bwcService.getClient({}, null).getVaults();
    }

}