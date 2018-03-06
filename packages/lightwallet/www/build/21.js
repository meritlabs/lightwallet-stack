webpackJsonp([21],{

/***/ 792:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VaultRenewViewModule", function() { return VaultRenewViewModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_vaults_renew_vault_renew_vault__ = __webpack_require__(880);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_popup_service__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_vaults_renew_vault_renew_vault_service__ = __webpack_require__(829);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





let VaultRenewViewModule = class VaultRenewViewModule {
};
VaultRenewViewModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_vaults_renew_vault_renew_vault__["a" /* VaultRenewView */],
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_3_merit_core_popup_service__["a" /* PopupService */],
            __WEBPACK_IMPORTED_MODULE_4_merit_vaults_renew_vault_renew_vault_service__["a" /* RenewVaultService */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_vaults_renew_vault_renew_vault__["a" /* VaultRenewView */]),
        ],
    })
], VaultRenewViewModule);

//# sourceMappingURL=renew-vault.module.js.map

/***/ }),

/***/ 829:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RenewVaultService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_merit_core_bwc_service__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_vaults_vaults_service__ = __webpack_require__(505);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






let RenewVaultService = class RenewVaultService {
    constructor(bwcService, walletService, logger, profileService, vaultsService) {
        this.bwcService = bwcService;
        this.walletService = walletService;
        this.logger = logger;
        this.profileService = profileService;
        this.vaultsService = vaultsService;
        this.walletClient = null;
        this.bitcore = bwcService.getBitcore();
    }
    renewVault(vault, masterKey) {
        return this.profileService.getHeadWalletClient().then((walletClient) => {
            if (!this.walletClient) {
                this.walletClient = walletClient;
            }
            return this.vaultsService.getVaultCoins(walletClient, vault);
        }).then((coins) => {
            let address = this.bitcore.Address.fromObject(vault.address);
            let network = this.walletClient.credentials.network;
            let tx = this.walletClient.buildRenewVaultTx(coins, vault, masterKey, { network: network });
            console.log("RENEW TX");
            console.log('tx: ', tx);
            console.log('Serialized: ', tx.serialize());
            vault.coins = [{ raw: tx.serialize(), network: network }];
            return this.walletClient.renewVault(vault);
        }).catch((err) => {
            throw err;
        });
        ;
    }
};
RenewVaultService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_merit_core_bwc_service__["a" /* BwcService */],
        __WEBPACK_IMPORTED_MODULE_2_merit_wallets_wallet_service__["a" /* WalletService */],
        __WEBPACK_IMPORTED_MODULE_3_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_profile_service__["a" /* ProfileService */],
        __WEBPACK_IMPORTED_MODULE_5_merit_vaults_vaults_service__["a" /* VaultsService */]])
], RenewVaultService);

//# sourceMappingURL=renew-vault.service.js.map

/***/ }),

/***/ 880:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VaultRenewView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_popup_service__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_vaults_vaults_service__ = __webpack_require__(505);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_core_bwc_service__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_merit_shared_config_service__ = __webpack_require__(23);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










let VaultRenewView = class VaultRenewView {
    constructor(navCtrl, navParams, popupService, configService, bwc, walletService, vaultsService, profileService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.popupService = popupService;
        this.configService = configService;
        this.bwc = bwc;
        this.walletService = walletService;
        this.vaultsService = vaultsService;
        this.profileService = profileService;
        this.vault = null;
        this.formData = { vaultName: '', masterKey: '', whitelist: [] };
        this.whitelistCandidates = [];
        this.bitcore = null;
        this.vault = this.navParams.get('vault');
        this.bitcore = this.bwc.getBitcore();
    }
    async ionViewDidLoad() {
        await this.updateWhitelist();
        this.formData.vaultName = this.vault.name;
        this.formData.masterKey = '';
        this.checkCanConfirm();
    }
    checkCanConfirm() {
        this.canConfirm =
            this.formData.vaultName.length > 0 &&
                this.formData.whitelist.length > 0;
    }
    confirmRenew() {
        this.popupService.ionicConfirm('Reset vault?', 'All pending transactions will be canceled and timeout will be reset. Do you want to reset the vault?', 'Yes', 'No').then((result) => {
            if (result)
                this.toVault();
            return;
        });
    }
    toVault() {
        const newVault = __WEBPACK_IMPORTED_MODULE_0_lodash__["cloneDeep"](this.vault);
        __WEBPACK_IMPORTED_MODULE_4_bluebird__["map"](this.formData.whitelist, (w) => {
            let address;
            if (w.type == 'wallet') {
                address = this.getAllWallets().then((wallets) => {
                    let foundWallet = __WEBPACK_IMPORTED_MODULE_0_lodash__["find"](wallets, { id: w.walletClientId });
                    return foundWallet.createAddress().then((resp) => {
                        return this.bitcore.Address.fromString(resp.address);
                    });
                });
            }
            else {
                address = __WEBPACK_IMPORTED_MODULE_4_bluebird__["resolve"](this.bitcore.Address.fromString(w.address));
            }
            return address;
        }).then((whitelist) => {
            newVault.whitelist = __WEBPACK_IMPORTED_MODULE_0_lodash__["map"](whitelist, (a) => { return a.toBuffer(); });
            newVault.masterKey = this.formData.masterKey;
            newVault.name = this.formData.vaultName;
            this.navCtrl.push('VaultRenewConfirmationView', { vaultId: this.vault._id, vault: this.vault, updatedVault: newVault, walletClient: this.walletClient });
        });
    }
    regenerateMasterKey() {
        let network = this.walletClient.credentials.network || this.configService.getDefaults().network.name;
        let masterKey = this.bitcore.PrivateKey.fromRandom(network);
        let masterKeyMnemonic = this.walletClient.getNewMnemonic(masterKey.toBuffer());
        this.formData.masterKey = masterKey;
        this.popupService.ionicAlert('Master key', masterKeyMnemonic, 'I copied the Master Key.');
    }
    compareWhitelistEntries(e1, e2) {
        return e1.type == e2.type && e1.id == e2.id;
    }
    updateWhitelist() {
        return __WEBPACK_IMPORTED_MODULE_4_bluebird__["all"]([
            // fetch users wallets
            this.getAllWallets().then((wallets) => {
                return __WEBPACK_IMPORTED_MODULE_0_lodash__["map"](wallets, (w) => {
                    const name = w.name || w._id;
                    const addr = this.bitcore.HDPublicKey.fromString(w.credentials.xPubKey).publicKey.toAddress().toString();
                    return { 'id': w.id, 'name': name, 'address': addr, 'type': 'wallet', walletClient: w, walletClientId: w.id };
                });
            }),
        ]).then((arr) => {
            const whitelistCandidates = __WEBPACK_IMPORTED_MODULE_0_lodash__["flatten"](arr);
            const filtered = __WEBPACK_IMPORTED_MODULE_0_lodash__["reject"](whitelistCandidates, { id: this.vault._id });
            this.whitelistCandidates = filtered;
            return __WEBPACK_IMPORTED_MODULE_4_bluebird__["map"](this.vault.whitelist, (wl) => {
                return __WEBPACK_IMPORTED_MODULE_4_bluebird__["map"](whitelistCandidates, (candidate) => {
                    if (candidate.type === 'vault') {
                        if (wl == candidate.address)
                            return candidate;
                    }
                    else {
                        return candidate.walletClient.getMainAddresses({}).then((addresses) => {
                            const found = __WEBPACK_IMPORTED_MODULE_0_lodash__["find"](addresses, { address: wl });
                            candidate.walletClient = null;
                            if (found) {
                                candidate.address = wl;
                                return candidate;
                            }
                        });
                    }
                    return null;
                });
            }).then((unfilteredWhitelist) => {
                const results = __WEBPACK_IMPORTED_MODULE_0_lodash__["compact"](__WEBPACK_IMPORTED_MODULE_0_lodash__["flatten"](unfilteredWhitelist));
                this.formData.whitelist = results;
                return __WEBPACK_IMPORTED_MODULE_4_bluebird__["resolve"]();
            });
        });
    }
    getAllWallets() {
        const wallets = this.profileService.getWallets().then((ws) => {
            this.walletClient = __WEBPACK_IMPORTED_MODULE_0_lodash__["head"](ws);
            return __WEBPACK_IMPORTED_MODULE_4_bluebird__["all"](__WEBPACK_IMPORTED_MODULE_0_lodash__["map"](ws, async (wallet) => {
                wallet.status = await this.walletService.getStatus(wallet);
                return wallet;
            }));
        });
        return wallets;
    }
    getAllWVaults() {
        return this.profileService.getWallets().then((ws) => {
            if (__WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](ws)) {
                __WEBPACK_IMPORTED_MODULE_4_bluebird__["reject"](new Error('getAllWVaults failed')); //ToDo: add proper error handling;
            }
            return __WEBPACK_IMPORTED_MODULE_0_lodash__["head"](ws);
        }).then((walletClient) => {
            this.walletClient = walletClient;
            return this.vaultsService.getVaults(walletClient);
        });
    }
};
VaultRenewView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
        selector: 'view-renew',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/vaults/renew-vault/renew-vault.html"*/'<ion-header>\n        \n    <ion-navbar color="secondary" >\n        <ion-title translate>Reset Vault</ion-title>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <ion-list margin-top>\n        <ion-item>\n            <ion-label translate>Vault name</ion-label>\n            <ion-input \n                text-right\n                [placeholder]="\'My Vault\'"\n                [(ngModel)]="formData.vaultName"\n                (ngModelChange)="checkCanConfirm()">\n            </ion-input>\n        </ion-item>\n    </ion-list>\n\n    <ion-list>\n        <ion-item>\n            <ion-label translate>Master key</ion-label>\n            <ion-input\n                text-right\n                [placeholder]="\'Old key will be used\'"\n                [(ngModel)]="formData.masterKey"\n                [disabled]="true">\n            </ion-input>\n        </ion-item>\n        <ion-item>\n            <button ion-button type="button" translate (click)="regenerateMasterKey()">\n                Generate new\n            </button>\n        </ion-item>\n    </ion-list>\n\n    <ion-list>\n        <ion-item>\n            <ion-label translate>Whitelist</ion-label>\n            <ion-select \n                [compareWith]="compareWhitelistEntries" \n                [(ngModel)]="formData.whitelist" \n                (ngModelChange)="checkCanConfirm()"\n                okText="Ok" \n                cancelText="Dismiss" \n                multiple="true" >\n                <ion-option *ngFor="let address of whitelistCandidates" [value]="address">\n                    {{address.name}} <span class="wallet-type">({{ address.type }})</span>\n                </ion-option>\n            </ion-select>\n        </ion-item>\n    </ion-list>\n\n    <div class="control-buttons">\n        <button ion-button type="button" translate (click)="confirmRenew()" [(disabled)]="!canConfirm">\n            Reset\n        </button>\n    </div>\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/vaults/renew-vault/renew-vault.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_3_merit_core_popup_service__["a" /* PopupService */],
        __WEBPACK_IMPORTED_MODULE_9_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_7_merit_core_bwc_service__["a" /* BwcService */],
        __WEBPACK_IMPORTED_MODULE_5_merit_wallets_wallet_service__["a" /* WalletService */],
        __WEBPACK_IMPORTED_MODULE_6_merit_vaults_vaults_service__["a" /* VaultsService */],
        __WEBPACK_IMPORTED_MODULE_8_merit_core_profile_service__["a" /* ProfileService */]])
], VaultRenewView);

//# sourceMappingURL=renew-vault.js.map

/***/ })

});
//# sourceMappingURL=21.js.map