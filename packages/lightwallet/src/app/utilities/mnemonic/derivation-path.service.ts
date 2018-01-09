import { Injectable } from '@angular/core';


@Injectable()
export class DerivationPathService {

  public getDefault() {
    return 'm/44\'/0\'/0'';
  }

  public getDefaultTestnet() {
    return 'm/44\'/1\'/0'';
  }

  public parse(str) {
    var arr = str.split('/');

    var ret: any = {};

    if (arr[0] != 'm')
      return false;

    switch (arr[1]) {
      case '44'':
        ret.derivationStrategy = 'BIP44';
        break;
      case '45'':
        return {
          derivationStrategy: 'BIP45',
          networkName: 'livenet',
          account: 0,
        }
        break;
      case '48'':
        ret.derivationStrategy = 'BIP48';
        break;
      default:
        return false;
    }
    ;

    switch (arr[2]) {
      case '0'':
        ret.networkName = 'livenet';
        break;
      case '1'':
        ret.networkName = 'testnet';
        break;
      default:
        return false;
    }
    ;

    var match = arr[3].match(/(\d+)'/);
    if (!match)
      return false;
    ret.account = +match[1]

    return ret;
  }
}