export class Profile {

  version: string;
  createdOn: Number;
  credentials: Array<any>;
  disclaimerAccepted: boolean;
  checked: Object;
  checkedUA?: any;
  dirty: boolean;
  wallets: Array<any>;
  vaults: Array<any>;

  constructor() {
    this.version = '1.0.0';
    this.credentials = [];
    this.vaults = [];
  }

  static create(opts?: any): any {
    opts = opts ? opts : {};
    const profile = new Profile();
    profile.createdOn = Date.now();
    profile.credentials = opts.credentials || [];
    profile.disclaimerAccepted = false;
    profile.checked = {};
    profile.vaults = opts.vaults || [];
    return profile;
  };

  fromObj(obj: any): any {
    let x = new Profile();

    x.createdOn = obj.createdOn;
    x.credentials = obj.credentials;
    x.disclaimerAccepted = obj.disclaimerAccepted;
    x.checked = obj.checked || {};
    x.checkedUA = obj.checkedUA || {};
    x.vaults = obj.vaults || [];

    if (x.credentials[0] && typeof x.credentials[0] != 'object')
      throw ('credentials should be an object');

    return x;
  };

  fromString(str: string): any {
    return this.fromObj(JSON.parse(str));
  };

  toObj(): string {
    delete this.dirty;
    return JSON.stringify(this);
  };


  hasWallet(walletId: string): boolean {
    for (let i in this.credentials) {
      let c = this.credentials[i];
      if (c.walletId == walletId) return true;
    }
    ;
    return false;
  };

  isChecked(ua: any, walletId: string): boolean {
    return !!(this.checkedUA == ua && this.checked[walletId]);
  }


  isDeviceChecked(ua: any): boolean {
    return this.checkedUA == ua;
  }


  setChecked(ua: any, walletId: string): void {
    if (this.checkedUA != ua) {
      this.checkedUA = ua;
      this.checked = {};
    }
    this.checked[walletId] = true;
    this.dirty = true;
  }

  addWallet(credentials: any): boolean {
    if (!credentials.walletId)
      throw 'credentials must have .walletId';

    if (this.hasWallet(credentials.walletId))
      return false;

    this.credentials.push(credentials);
    this.dirty = true;
    return true;
  }

  updateWallet(credentials: any): boolean {
    if (!credentials.walletId)
      throw 'credentials must have .walletId';

    if (!this.hasWallet(credentials.walletId))
      return false;

    this.credentials = this.credentials.map((c: any) => {
      return c.walletId != credentials.walletId ? c : credentials;
    });

    this.dirty = true;
    return true;
  }

  deleteWallet(walletId: string): boolean {
    if (!this.hasWallet(walletId))
      return false;

    this.credentials = this.credentials.filter(function (c) {
      return c.walletId != walletId;
    });

    this.dirty = true;
    return true;
  }

  hasVault(id: string): boolean {
    for (let i in this.vaults) {
      let c = this.vaults[i];
      if (c.id == id) return true;
    }
    return false;
  }

  addVault(vault: any): boolean {
    if (!vault.id)
      throw 'vault must have .id';

    if (this.hasVault(vault.id))
      return false;

    this.vaults.push(vault);
    this.dirty = true;
    return true;
  }

  updateVault(vault: any): boolean {
    if (!vault.id)
      throw 'vault must have .id';

    if (!this.hasVault(vault.id))
      return false;

    this.vaults = this.vaults.map((c: any) => {
      return c.id != vault.id ? c : vault;
    });

    this.dirty = true;
    return true;
  }

  deleteVault(vaultId: string): boolean {
    if (!this.hasVault(vaultId))
      return false;

    this.vaults = this.vaults.filter(function (c) {
      return c.vaultId != vaultId;
    });

    return this.dirty = true;
  }
}
