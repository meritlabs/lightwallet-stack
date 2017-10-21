import { Injectable } from '@angular/core';
import {ProfileService} from "../profile-service";
import {Wallet} from "../../models/wallet";
import {WalletMock} from "../../models/mocks/wallet";

@Injectable()
export class ProfileServiceMock extends ProfileService {

  getWallets():Array<Wallet> {

    console.log("using mock method ProfileService::getWallets()");

    return [
      new WalletMock({id: '1', name: 'Empty wallet'}),
      new WalletMock({id: '2', color: 'orange', name: 'Hidden balance wallet', balanceHidden: true}),
      new WalletMock({id: '3', color: 'darkblue', name: 'Cached balance wallet', cachedBalance: '10 bits', cachedBalanceUpdatedOn: 1508229051}),
      new WalletMock({id: '4', color: 'red', name: 'Locked wallet', locked: true }),
      new WalletMock({id: '5', color: 'darkgreen', name: 'Incomplete wallet', _isComplete: false, secret: '123456789'}),
      new WalletMock({id: '6', color: undefined, name: 'Multisig wallet', m: 2}),
      new WalletMock({id: '7', color: 'darkcyan', name: 'Processing wallet', status: {totalBalanceStr: '10 bits', totalBalanceMicros: 10, spendableAmount: 0}}),
      new WalletMock({id: '8', color: 'darkslateblue', name: 'Error wallet', error: 'Some error'}),
    ]

  }

}

