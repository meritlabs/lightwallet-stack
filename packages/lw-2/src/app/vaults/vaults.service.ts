import { Injectable } from '@angular/core';

import { BwcService } from 'merit/core/bwc.service';


@Injectable()
export class VaultsService {

    constructor(
        bwcService: BwcService,
    ) {}

    getVaults(): Promise<Array<any>> {
        return Promise.resolve([]);
    }

}