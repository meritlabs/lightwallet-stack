webpackJsonp([32],{

/***/ 761:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateVaultGeneralInfoComponentModule", function() { return CreateVaultGeneralInfoComponentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_vaults_create_vault_general_info_general_info__ = __webpack_require__(844);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_utilities_mnemonic_mnemonic_service__ = __webpack_require__(207);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




let CreateVaultGeneralInfoComponentModule = class CreateVaultGeneralInfoComponentModule {
};
CreateVaultGeneralInfoComponentModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_vaults_create_vault_general_info_general_info__["a" /* CreateVaultGeneralInfoView */],
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_3_merit_utilities_mnemonic_mnemonic_service__["a" /* MnemonicService */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_vaults_create_vault_general_info_general_info__["a" /* CreateVaultGeneralInfoView */]),
        ],
    })
], CreateVaultGeneralInfoComponentModule);

//# sourceMappingURL=general-info.module.js.map

/***/ }),

/***/ 844:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateVaultGeneralInfoView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_vaults_create_vault_create_vault_service__ = __webpack_require__(507);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_vaults_vaults_service__ = __webpack_require__(505);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_core_bwc_service__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_merit_core_toast_config__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_merit_core_toast_controller__ = __webpack_require__(205);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











let CreateVaultGeneralInfoView = class CreateVaultGeneralInfoView {
    constructor(navCtrl, createVaultService, profileService, walletService, vaultsService, bwc, logger, toastCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.createVaultService = createVaultService;
        this.profileService = profileService;
        this.walletService = walletService;
        this.vaultsService = vaultsService;
        this.bwc = bwc;
        this.logger = logger;
        this.toastCtrl = toastCtrl;
        this.navParams = navParams;
        this.formData = { vaultName: '', whitelist: [] };
        this.isNextAvailable = false;
        this.whitelistCandidates = [];
        this.bitcore = null;
        this.bitcore = this.bwc.getBitcore();
        this.logger.info('bitcore', this.bitcore);
    }
    checkNextAvailable() {
        this.isNextAvailable = this.formData.vaultName.length > 0 && this.formData.whitelist.length > 0;
    }
    ionViewDidLoad() {
        let data = this.createVaultService.getData();
        this.formData.vaultName = data.vaultName;
        this.formData.whitelist = data.whitelist;
        // fetch users wallets
        this.getAllWallets().then((wallets) => {
            const walletDTOs = __WEBPACK_IMPORTED_MODULE_0_lodash__["map"](wallets, (w) => {
                const name = w.name || w._id;
                return { id: w.id, name: name, address: w.credentials.xPubKey, type: 'wallet', walletClientId: w.id };
            });
            this.logger.info('walletDTOs', walletDTOs);
            this.whitelistCandidates = this.whitelistCandidates.concat(walletDTOs);
        }).catch((err) => {
            this.toastCtrl.create({
                message: 'Failed to update wallets info',
                cssClass: __WEBPACK_IMPORTED_MODULE_9_merit_core_toast_config__["a" /* ToastConfig */].CLASS_ERROR
            }).present();
        });
        // fetch users vaults
        // ToDo: uncomment when vaults support vault addresses in whitelists
        // this.getAllVaults().then((vaults) => {
        //   const vaultDTOs = _.map(vaults, (v: any) => {
        //     const name = v.name || v._id;
        //     const key = new this.bitcore.Address(v.address).toString();
        //     this.logger.info(key);
        //     return { id: v._id, name: name, address: key, type: 'vault' };
        //   });
        //   this.logger.info('walletDTOs', vaultDTOs);
        //   this.whitelistCandidates = this.whitelistCandidates.concat(vaultDTOs);
        // }).catch((err) => {
        //   this.toastCtrl.create({
        //     message: 'Failed to update vaults info',
        //     cssClass: ToastConfig.CLASS_ERROR
        //   }).present();
        // });
        this.checkNextAvailable();
    }
    toDeposit() {
        this.createVaultService.updateData(this.formData);
        this.navCtrl.push('CreateVaultDepositView', { refreshVaultList: this.navParams.get('refreshVaultList') });
    }
    getAllWallets() {
        return this.profileService.getWallets().map((wallet) => {
            return this.walletService.getStatus(wallet).then((status) => {
                wallet.status = status;
                return wallet;
            });
        });
    }
    getAllVaults() {
        return this.profileService.getHeadWalletClient().then((walletClient) => {
            if (!walletClient) {
                return null;
            }
            return this.vaultsService.getVaults(walletClient);
        });
    }
};
CreateVaultGeneralInfoView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
        selector: 'view-create-vault-general',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/vaults/create-vault/general-info/general-info.html"*/'<ion-header>\n        \n    <ion-navbar color="secondary" >\n        <ion-title translate>Create Vault</ion-title>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <ion-list margin-top>\n        <ion-item>\n            <ion-label translate>Vault name</ion-label>\n            <ion-input text-right [placeholder]="\'My Vault\'" [(ngModel)]="formData.vaultName" (ngModelChange)="checkNextAvailable()"></ion-input>\n        </ion-item>\n    </ion-list>\n\n    <ion-list>\n        <ion-item>\n            <ion-label translate>Whitelist</ion-label>\n            <ion-select [(ngModel)]="formData.whitelist" okText="Ok" cancelText="Dismiss" multiple="true" (ngModelChange)="checkNextAvailable()">\n                 <ion-option *ngFor="let address of whitelistCandidates;trackBy:address?.id" [value]="address">\n                     {{address.name}} <span class="wallet-type">({{ address.type }})</span>\n                 </ion-option>\n             </ion-select>\n        </ion-item>\n    </ion-list>\n\n    <div class="control-buttons">\n        <button ion-button type="button" translate (click)="toDeposit()" [(disabled)]="!isNextAvailable" >\n            Next\n        </button>\n    </div>\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/vaults/create-vault/general-info/general-info.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_3_merit_vaults_create_vault_create_vault_service__["a" /* CreateVaultService */],
        __WEBPACK_IMPORTED_MODULE_5_merit_core_profile_service__["a" /* ProfileService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__["a" /* WalletService */],
        __WEBPACK_IMPORTED_MODULE_6_merit_vaults_vaults_service__["a" /* VaultsService */],
        __WEBPACK_IMPORTED_MODULE_7_merit_core_bwc_service__["a" /* BwcService */],
        __WEBPACK_IMPORTED_MODULE_8_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_10_merit_core_toast_controller__["a" /* MeritToastController */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavParams */]])
], CreateVaultGeneralInfoView);

//# sourceMappingURL=general-info.js.map

/***/ })

});
//# sourceMappingURL=32.js.map