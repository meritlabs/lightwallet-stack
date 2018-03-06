webpackJsonp([22],{

/***/ 791:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VaultRenewConfirmationViewModule", function() { return VaultRenewConfirmationViewModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_vaults_renew_vault_confirmation_confirmation__ = __webpack_require__(879);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_vaults_renew_vault_renew_vault_service__ = __webpack_require__(829);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




let VaultRenewConfirmationViewModule = class VaultRenewConfirmationViewModule {
};
VaultRenewConfirmationViewModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_vaults_renew_vault_confirmation_confirmation__["a" /* VaultRenewConfirmationView */],
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_3_merit_vaults_renew_vault_renew_vault_service__["a" /* RenewVaultService */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_vaults_renew_vault_confirmation_confirmation__["a" /* VaultRenewConfirmationView */]),
        ],
    })
], VaultRenewConfirmationViewModule);

//# sourceMappingURL=confirmation.module.js.map

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

/***/ 879:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VaultRenewConfirmationView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_core_bwc_service__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_vaults_renew_vault_renew_vault_service__ = __webpack_require__(829);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_toast_controller__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_core_toast_config__ = __webpack_require__(206);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






let VaultRenewConfirmationView = class VaultRenewConfirmationView {
    constructor(navCtrl, navParams, bwc, toastCtrl, renewVaultService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.bwc = bwc;
        this.toastCtrl = toastCtrl;
        this.renewVaultService = renewVaultService;
        this.formData = { masterKeyMnemonic: '' };
        this.walletClient = null;
        this.updatedVault = this.navParams.get('updatedVault');
        this.vault = this.navParams.get('vault');
        this.bitcore = this.bwc.getBitcore();
        this.walletClient = this.navParams.get('walletClient');
    }
    ionViewDidLoad() {
        console.log('confirmation view', this.updatedVault, this.vault);
    }
    sanatizeMnemonic(rawmnemonic) {
        let trimmed = rawmnemonic.trim();
        return trimmed.toLowerCase();
    }
    renew() {
        // create master key from mnemonic
        const network = this.vault.address.network;
        //validate mnemonic
        let masterKeyMnemonic;
        try {
            const sanatizedMasterKeyMnemonic = this.sanatizeMnemonic(this.formData.masterKeyMnemonic);
            masterKeyMnemonic = this.walletClient.getNewMnemonic(sanatizedMasterKeyMnemonic);
        }
        catch (ex) {
            return this.toastCtrl.create({
                message: 'The master key must only contain words seperated by spaces.',
                cssClass: __WEBPACK_IMPORTED_MODULE_5_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
            }).present();
        }
        const xMasterKey = masterKeyMnemonic.toHDPrivateKey('', network);
        console.log('xMasterKey', xMasterKey);
        console.log('MasterPub', xMasterKey.publicKey.toString());
        console.log('OrigPubKey', new this.bitcore.PublicKey(this.updatedVault.masterPubKey, network).toString());
        return this.renewVaultService.renewVault(this.updatedVault, xMasterKey).then(() => {
            return this.navCtrl.goToRoot({}).then(() => {
                return this.navCtrl.push('VaultDetailsView', { vaultId: this.vault._id, vault: this.vault });
            });
        });
    }
};
VaultRenewConfirmationView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-renew-confirmation',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/vaults/renew-vault/confirmation/confirmation.html"*/'<ion-header>\n    \n<ion-navbar color="secondary" >\n    <ion-title translate>Reset Vault</ion-title>\n</ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <ion-list>\n        <ion-item>\n            <ion-label translate>Master key</ion-label>\n        </ion-item>\n\n        <ion-item>\n            <ion-textarea [placeholder]="\'You have to use your old master key\'" [(ngModel)]="formData.masterKeyMnemonic"></ion-textarea>\n        </ion-item>\n    </ion-list>\n\n\n    <div class="control-buttons">\n        <button ion-button type="button" translate (click)="renew()">\n            Reset\n        </button>\n    </div>\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/vaults/renew-vault/confirmation/confirmation.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2_merit_core_bwc_service__["a" /* BwcService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_toast_controller__["a" /* MeritToastController */],
        __WEBPACK_IMPORTED_MODULE_3_merit_vaults_renew_vault_renew_vault_service__["a" /* RenewVaultService */]])
], VaultRenewConfirmationView);

//# sourceMappingURL=confirmation.js.map

/***/ })

});
//# sourceMappingURL=22.js.map