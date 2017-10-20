import { Injectable } from '@angular/core';
import {Wallet} from "../models/wallet";

@Injectable()
export class ProfileService {

  getWallets():Array<Wallet> {
    return [];
  }

}