webpackJsonp([33],{

/***/ 788:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateVaultDepositComponentModule", function() { return CreateVaultDepositComponentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_vaults_create_vault_deposit_deposit__ = __webpack_require__(876);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_utilities_mnemonic_mnemonic_service__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_bwc_service__ = __webpack_require__(39);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





let CreateVaultDepositComponentModule = class CreateVaultDepositComponentModule {
};
CreateVaultDepositComponentModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_vaults_create_vault_deposit_deposit__["a" /* CreateVaultDepositView */],
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_3_merit_utilities_mnemonic_mnemonic_service__["a" /* MnemonicService */],
            __WEBPACK_IMPORTED_MODULE_4_merit_core_bwc_service__["a" /* BwcService */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_vaults_create_vault_deposit_deposit__["a" /* CreateVaultDepositView */]),
        ],
    })
], CreateVaultDepositComponentModule);

//# sourceMappingURL=deposit.module.js.map

/***/ }),

/***/ 876:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateVaultDepositView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_vaults_create_vault_create_vault_service__ = __webpack_require__(507);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_core_bwc_service__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_merit_core_logger__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









let CreateVaultDepositView = class CreateVaultDepositView {
    constructor(navCtrl, createVaultService, profileService, walletService, bwcService, logger, navParams) {
        this.navCtrl = navCtrl;
        this.createVaultService = createVaultService;
        this.profileService = profileService;
        this.walletService = walletService;
        this.bwcService = bwcService;
        this.logger = logger;
        this.navParams = navParams;
        this.formData = { totalAvailable: 0, amountToDeposit: null, amountAvailable: 0, selectedWallet: null, walletName: '' };
        this.isNextAvailable = false;
        this.bitcore = null;
    }
    checkNextAvailable() {
        this.isNextAvailable = this.formData.amountToDeposit > 0 && this.formData.amountAvailable >= this.formData.amountToDeposit;
    }
    ionViewDidLoad() {
        this.bitcore = this.bwcService.getBitcore();
        let data = this.createVaultService.getData();
        this.formData.amountToDeposit = data.amountToDeposit;
        this.formData.amountAvailable = data.amountAvailable;
        this.checkNextAvailable();
        this.getAllWallets().then((wallets) => {
            __WEBPACK_IMPORTED_MODULE_1_lodash__["each"](wallets, (w) => this.logger.info(w));
            const wallet = wallets[0];
            const computed = wallet.status.balance.availableConfirmedAmount;
            const total = wallet.status.balance.availableAmount;
            const mrt = this.bitcore.Unit.fromMicros(computed).toMRT();
            const totalMrt = this.bitcore.Unit.fromMicros(total).toMRT();
            this.formData.selectedWallet = wallet;
            this.formData.amountAvailable = mrt;
            this.formData.totalAvailable = totalMrt;
            this.formData.walletName = wallet.name || wallet.id;
        });
        this.checkNextAvailable();
    }
    toMasterKey() {
        this.createVaultService.updateData(this.formData);
        this.navCtrl.push('CreateVaultMasterKeyView', { refreshVaultList: this.navParams.get('refreshVaultList') });
    }
    getAllWallets() {
        return this.profileService.getWallets().then((ws) => {
            return __WEBPACK_IMPORTED_MODULE_0_bluebird__["all"](__WEBPACK_IMPORTED_MODULE_1_lodash__["map"](ws, async (wallet) => {
                wallet.status = await this.walletService.getStatus(wallet);
                return wallet;
            }));
        });
    }
};
CreateVaultDepositView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Component"])({
        selector: 'view-create-vault-deposit',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/vaults/create-vault/deposit/deposit.html"*/'<ion-header>\n        \n    <ion-navbar color="secondary" >\n        <ion-title translate>Create Vault</ion-title>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <ion-list margin-top>\n        <ion-item>\n            <ion-label translate>Wallet</ion-label>\n            <ion-input text-right [placeholder]="\'0.0\'" type="text" [(ngModel)]="formData.walletName" [disabled]="true"></ion-input>\n        </ion-item>\n\n        <ion-item>\n            <ion-label translate>Total Merit</ion-label>\n            <ion-input text-right [placeholder]="\'0.0\'" type="number" [(ngModel)]="formData.totalAvailable" [disabled]="true"></ion-input>\n        </ion-item>\n\n        <ion-item>\n            <ion-label translate>Available Merit</ion-label>\n            <ion-input text-right [placeholder]="\'0.0\'" type="number" [(ngModel)]="formData.amountAvailable" [disabled]="true"></ion-input>\n        </ion-item>\n    </ion-list>\n\n    <ion-list>\n        <ion-item>\n            <ion-label translate>Amout to deposit</ion-label>\n            <ion-input text-right [placeholder]="\'0.0\'" type="number" [(ngModel)]="formData.amountToDeposit" (ngModelChange)="checkNextAvailable()"></ion-input>\n        </ion-item>\n    </ion-list>\n\n    <div class="control-buttons">\n        <button ion-button type="button" translate (click)="toMasterKey()" [(disabled)]="!isNextAvailable" >\n            Next\n        </button>\n    </div>\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/vaults/create-vault/deposit/deposit.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_4_merit_vaults_create_vault_create_vault_service__["a" /* CreateVaultService */],
        __WEBPACK_IMPORTED_MODULE_6_merit_core_profile_service__["a" /* ProfileService */],
        __WEBPACK_IMPORTED_MODULE_5_merit_wallets_wallet_service__["a" /* WalletService */],
        __WEBPACK_IMPORTED_MODULE_7_merit_core_bwc_service__["a" /* BwcService */],
        __WEBPACK_IMPORTED_MODULE_8_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["k" /* NavParams */]])
], CreateVaultDepositView);

//# sourceMappingURL=deposit.js.map

/***/ })

});
//# sourceMappingURL=33.js.map