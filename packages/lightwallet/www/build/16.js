webpackJsonp([16],{

/***/ 796:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VaultDetailsModule", function() { return VaultDetailsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_vaults_vault_details_vault_details__ = __webpack_require__(884);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_shared_shared_module__ = __webpack_require__(817);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular2_moment__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular2_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_angular2_moment__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





/*
  ToDo: Work to get this lazy-loadable as possible.
*/
let VaultDetailsModule = class VaultDetailsModule {
};
VaultDetailsModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_vaults_vault_details_vault_details__["a" /* VaultDetailsView */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_vaults_vault_details_vault_details__["a" /* VaultDetailsView */]),
            __WEBPACK_IMPORTED_MODULE_3_merit_shared_shared_module__["a" /* SharedModule */],
            __WEBPACK_IMPORTED_MODULE_4_angular2_moment__["MomentModule"],
        ],
        providers: []
    })
], VaultDetailsModule);

//# sourceMappingURL=vault-details.module.js.map

/***/ }),

/***/ 817:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SharedModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_merit_shared_to_unit_pipe__ = __webpack_require__(818);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_shared_to_fiat_pipe__ = __webpack_require__(819);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__ = __webpack_require__(210);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




// This module manaages the sending of money.
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_1_merit_shared_to_unit_pipe__["a" /* ToUnitPipe */],
            __WEBPACK_IMPORTED_MODULE_2_merit_shared_to_fiat_pipe__["a" /* ToFiatPipe */]
        ],
        imports: [],
        exports: [
            __WEBPACK_IMPORTED_MODULE_1_merit_shared_to_unit_pipe__["a" /* ToUnitPipe */],
            __WEBPACK_IMPORTED_MODULE_2_merit_shared_to_fiat_pipe__["a" /* ToFiatPipe */],
            __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__["b" /* TranslateModule */]
        ]
    })
], SharedModule);

//# sourceMappingURL=shared.module.js.map

/***/ }),

/***/ 818:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ToUnitPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_merit_shared_config_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_transact_tx_format_service__ = __webpack_require__(127);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let ToUnitPipe = class ToUnitPipe {
    constructor(configProvider, txFormatProvider) {
        this.configProvider = configProvider;
        this.txFormatProvider = txFormatProvider;
        this.unitCode = this.configProvider.get().wallet.settings.unitCode;
    }
    transform(value, satoshis) {
        return this.txFormatProvider.formatAmountStr(satoshis);
    }
};
ToUnitPipe = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({ name: 'toUnit' }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_2_merit_transact_tx_format_service__["a" /* TxFormatService */]])
], ToUnitPipe);

//# sourceMappingURL=to-unit.pipe.js.map

/***/ }),

/***/ 819:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ToFiatPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_merit_shared_config_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_transact_tx_format_service__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_bluebird__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




let ToFiatPipe = class ToFiatPipe {
    constructor(configProvider, txFormatProvider) {
        this.configProvider = configProvider;
        this.txFormatProvider = txFormatProvider;
        this.unitCode = this.configProvider.get().wallet.settings.unitCode;
    }
    transform(value, satoshis) {
        return this.txFormatProvider.formatAlternativeStr(satoshis).then((altSr) => {
            return __WEBPACK_IMPORTED_MODULE_3_bluebird__["resolve"](altSr);
        });
    }
};
ToFiatPipe = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({ name: 'toFiat' }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_2_merit_transact_tx_format_service__["a" /* TxFormatService */]])
], ToFiatPipe);

//# sourceMappingURL=to-fiat.pipe.js.map

/***/ }),

/***/ 884:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VaultDetailsView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_vaults_vaults_service__ = __webpack_require__(505);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_core_bwc_service__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_merit_transact_tx_format_service__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_merit_shared_fiat_amount_model__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_merit_transact_rate_service__ = __webpack_require__(128);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












let VaultDetailsView = class VaultDetailsView {
    constructor(navCtrl, navParams, logger, profileService, walletService, vaultsService, bwc, txFormatService, rateService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.logger = logger;
        this.profileService = profileService;
        this.walletService = walletService;
        this.vaultsService = vaultsService;
        this.bwc = bwc;
        this.txFormatService = txFormatService;
        this.rateService = rateService;
        this.whitelist = [];
        this.coins = [];
        this.transactions = [];
        this.bitcore = null;
        // We can assume that the wallet data has already been fetched and
        // passed in from the wallets (list) view.  This enables us to keep
        // things fast and smooth.  We can refresh as needed.
        this.vault = this.navParams.get('vault');
        this.bitcore = this.bwc.getBitcore();
        this.whitelist = this.vault.whitelist;
        console.log("Inside the vault-details view.");
        console.log('Vault to display:', this.vault);
    }
    ionViewDidLoad() {
        console.log("Vault-Detail View Did Load.");
        console.log(this.vault);
        __WEBPACK_IMPORTED_MODULE_1_bluebird__["all"]([
            this.getAllWallets().then((wallets) => {
                return __WEBPACK_IMPORTED_MODULE_0_lodash__["map"](wallets, (w) => {
                    const name = w.name || w._id;
                    const addr = this.bitcore.HDPublicKey.fromString(w.credentials.xPubKey).publicKey.toAddress().toString();
                    return { id: w.id, name: name, address: addr, type: 'wallet', walletClientId: w.id, walletClient: w };
                });
            }),
        ]).then((arr) => {
            const whitelistCandidates = __WEBPACK_IMPORTED_MODULE_0_lodash__["flatten"](arr);
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["map"](this.vault.whitelist, (wl) => {
                return __WEBPACK_IMPORTED_MODULE_1_bluebird__["map"](whitelistCandidates, (candidate) => {
                    if (candidate.type === 'vault') {
                        if (wl == candidate.address)
                            return candidate;
                    }
                    else {
                        return candidate.walletClient.getMainAddresses({}).then((addresses) => {
                            const found = __WEBPACK_IMPORTED_MODULE_0_lodash__["find"](addresses, { address: wl });
                            if (found) {
                                candidate.walletClient = null;
                                candidate.address = wl;
                                return candidate;
                            }
                        });
                    }
                    return null;
                });
            }).then((unfilteredWhitelist) => {
                const results = __WEBPACK_IMPORTED_MODULE_0_lodash__["compact"](__WEBPACK_IMPORTED_MODULE_0_lodash__["flatten"](unfilteredWhitelist));
                this.whitelist = results;
                return __WEBPACK_IMPORTED_MODULE_1_bluebird__["resolve"]();
            });
        }).then(() => {
            return this.getVaultTxHistory().then((txs) => {
                this.transactions = __WEBPACK_IMPORTED_MODULE_0_lodash__["map"](txs, this.processTx.bind(this));
                this.vault.completeHistory = txs;
                this.formatAmounts();
                return __WEBPACK_IMPORTED_MODULE_1_bluebird__["resolve"]();
            });
        });
    }
    toResetVault() {
        this.navCtrl.push('VaultRenewView', { vaultId: this.vault._id, vault: this.vault });
    }
    goToTxDetails(tx) {
        return this.profileService.getHeadWalletClient().then((walletClient) => {
            this.navCtrl.push('TxDetailsView', { wallet: walletClient, walletId: walletClient.credentials.walletId, vaultId: this.vault._id, vault: this.vault, txId: tx.txid });
        });
    }
    spendToAddress(address) {
        let wallet = null;
        this.profileService.getHeadWalletClient().then((w) => {
            wallet = w;
            return this.vaultsService.getVaultCoins(w, this.vault);
        }).then((coins) => {
            this.coins = coins;
            this.navCtrl.push('VaultSpendAmountView', { recipient: address, wallet: wallet, vault: this.vault, vaultId: this.vault.id, coins: coins });
        });
    }
    getAllWallets() {
        const wallets = this.profileService.getWallets().then((ws) => {
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["all"](__WEBPACK_IMPORTED_MODULE_0_lodash__["map"](ws, async (wallet) => {
                wallet.status = await this.walletService.getStatus(wallet);
                return wallet;
            }));
        });
        return wallets;
    }
    getAllVaults() {
        return this.profileService.getHeadWalletClient().then((walletClient) => {
            this.walletClient = walletClient;
            return this.vaultsService.getVaults(walletClient);
        });
    }
    getCoins(walletClient) {
        return this.vaultsService.getVaultCoins(walletClient, this.vault);
    }
    ;
    getVaultTxHistory() {
        return this.profileService.getHeadWalletClient().then((walletClient) => {
            return this.vaultsService.getVaultTxHistory(walletClient, this.vault);
        });
    }
    ;
    formatAmounts() {
        this.profileService.getHeadWalletClient().then((walletClient) => {
            return this.getCoins(walletClient).then((coins) => {
                this.vault.amount = __WEBPACK_IMPORTED_MODULE_0_lodash__["sumBy"](coins, 'micros');
                this.vault.altAmount = this.rateService.fromMicrosToFiat(this.vault.amount, walletClient.cachedStatus.alternativeIsoCode);
                this.vault.altAmountStr = new __WEBPACK_IMPORTED_MODULE_10_merit_shared_fiat_amount_model__["a" /* FiatAmount */](this.vault.altAmount);
                this.vault.amountStr = this.txFormatService.formatAmountStr(this.vault.amount);
            });
        });
    }
    processTx(tx) {
        const thisAddr = new this.bitcore.Address(this.vault.address).toString();
        const summ = __WEBPACK_IMPORTED_MODULE_0_lodash__["reduce"](tx.outputs, (acc, output) => {
            if (output.address != thisAddr) {
                return acc;
            }
            return acc + output.amount;
        }, 0);
        tx.amountStr = this.txFormatService.formatAmountStr(summ);
        return tx;
    }
};
VaultDetailsView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Component"])({
        selector: 'vault-details-view',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/vaults/vault-details/vault-details.html"*/'<ion-header no-border>\n<ion-navbar color="secondary">\n    <ion-title>{{ vault.name || vault._id }}</ion-title>\n    <ion-buttons end>\n        <button ion-button icon-only (click)="toResetVault()">\n            <ion-icon name="settings"></ion-icon>\n        </button>\n    </ion-buttons>\n</ion-navbar>\n</ion-header>\n\n<ion-content>\n\n    <ion-list>\n        <div class="balance-header">\n            <div class="balance-str">{{ vault.amountStr }}</div>\n            <div class="balance-alt-str"> {{ vault.altAmountStr.amountStr }}</div>\n            <div *ngIf="vault.status == \'pending\'" class="assertive">\n                <span translate>Pending</span>\n            </div>\n        </div>\n    </ion-list>\n\n    <ion-list>\n        <button ion-item *ngFor="let address of whitelist" (click)="spendToAddress(address)">\n            <ion-avatar item-start class="btn whitelist-icon" item-start *ngIf="address.type == \'wallet\'">\n                <img src="assets/img/icon-wallet.svg">\n            </ion-avatar>\n            <ion-avatar item-start class="btn whitelist-icon" item-start *ngIf="address.type == \'vault\'">\n                <ion-icon name="lock"></ion-icon>\n            </ion-avatar>\n            <p>\n                {{ address.name }} <span class="wallet-type">({{ address.type }})</span>\n            </p>   \n            <div class="spend" item-end>\n                Transfer To\n            </div>\n        </button>\n    </ion-list>\n\n    <ion-list>\n        <button ion-item *ngFor="let tx of transactions" (click)="goToTxDetails(tx)">\n            <ion-icon item-start>\n                <img src="assets/img/icon-receive-history.svg" *ngIf="tx.action == \'received\'" width="40">\n                <img src="assets/img/icon-sent.svg" *ngIf="tx.action == \'sent\'" width="40">\n                <img src="assets/img/icon-moved.svg" *ngIf="tx.action == \'moved\'" width="40">\n            </ion-icon>\n            <div class="action">{{tx.action}}</div>\n            <div class="detail">\n                <div class="amount">{{tx.amountStr}}</div>\n                <div class="date">{{tx.time * 1000 | amTimeAgo}}</div>\n            </div>\n        </button>\n    </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/vaults/vault-details/vault-details.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_7_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_6_merit_core_profile_service__["a" /* ProfileService */],
        __WEBPACK_IMPORTED_MODULE_8_merit_wallets_wallet_service__["a" /* WalletService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_vaults_vaults_service__["a" /* VaultsService */],
        __WEBPACK_IMPORTED_MODULE_5_merit_core_bwc_service__["a" /* BwcService */],
        __WEBPACK_IMPORTED_MODULE_9_merit_transact_tx_format_service__["a" /* TxFormatService */],
        __WEBPACK_IMPORTED_MODULE_11_merit_transact_rate_service__["a" /* RateService */]])
], VaultDetailsView);

//# sourceMappingURL=vault-details.js.map

/***/ })

});
//# sourceMappingURL=16.js.map