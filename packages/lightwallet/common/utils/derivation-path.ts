export class DerivationPath {
  static getDefault() {
    return 'm/44\'/0\'/0\'';
  }

  static getDefaultTestnet() {
    return 'm/44\'/1\'/0\'';
  }

  static parse(str: string) {
    let arr = str.split('/');

    let ret: any = {};

    if (arr[0] != 'm') return false;

    switch (arr[1]) {
      case "44'":
        ret.derivationStrategy = 'BIP44';
        break;
      case "45'":
        return {
          derivationStrategy: 'BIP45',
          networkName: 'livenet',
          account: 0,
        };
      case "48'":
        ret.derivationStrategy = 'BIP48';
        break;
      default:
        return false;
    }

    switch (arr[2]) {
      case "0'":
        ret.networkName = 'livenet';
        break;
      case "1'":
        ret.networkName = 'testnet';
        break;
      default:
        return false;
    }

    let match = arr[3].match(/(\d+)'/);
    if (!match) return false;
    ret.account = +match[1];

    return ret;
  }
}
