import { Injectable } from '@angular/core';
import {Wallet} from "../models/wallet";

@Injectable()
export class ProfileProvider {

  getWallets():Array<Wallet> {
      return [];
  }

}