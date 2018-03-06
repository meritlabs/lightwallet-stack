webpackJsonp([31],{

/***/ 789:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateVaultMasterKeyComponentModule", function() { return CreateVaultMasterKeyComponentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_vaults_create_vault_master_key_master_key__ = __webpack_require__(877);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_popup_service__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_bwc_service__ = __webpack_require__(39);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





let CreateVaultMasterKeyComponentModule = class CreateVaultMasterKeyComponentModule {
};
CreateVaultMasterKeyComponentModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_vaults_create_vault_master_key_master_key__["a" /* CreateVaultMasterKeyView */],
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_3_merit_core_popup_service__["a" /* PopupService */],
            __WEBPACK_IMPORTED_MODULE_4_merit_core_bwc_service__["a" /* BwcService */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_vaults_create_vault_master_key_master_key__["a" /* CreateVaultMasterKeyView */]),
        ],
    })
], CreateVaultMasterKeyComponentModule);

//# sourceMappingURL=master-key.module.js.map

/***/ }),

/***/ 877:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateVaultMasterKeyView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_vaults_create_vault_create_vault_service__ = __webpack_require__(507);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_popup_service__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_bwc_service__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_shared_config_service__ = __webpack_require__(23);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






let CreateVaultMasterKeyView = class CreateVaultMasterKeyView {
    constructor(navCtrl, navParams, configService, createVaultService, popupService, bwcService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.configService = configService;
        this.createVaultService = createVaultService;
        this.popupService = popupService;
        this.bwcService = bwcService;
        this.formData = { masterKey: null, masterKeyMnemonic: null };
    }
    ionViewDidLoad() {
        const bitcore = this.bwcService.getBitcore();
        let data = this.createVaultService.getData();
        if (!data.masterKey) {
            let masterKeyMnemonic = data.selectedWallet.getNewMnemonic(undefined);
            let network = data.selectedWallet.credentials.network || this.configService.getDefaults().network.name;
            let masterKey = masterKeyMnemonic.toHDPrivateKey('', network);
            data.masterKey = masterKey;
            data.masterKeyMnemonic = masterKeyMnemonic;
            this.createVaultService.updateData(data);
            data = this.createVaultService.getData();
        }
        this.formData.masterKey = data.masterKey;
        this.formData.masterKeyMnemonic = data.masterKeyMnemonic.toString();
    }
    confirm() {
        this.popupService.ionicConfirm('Master key', 'Did you copy the master key?', 'Yes', 'No')
            .then((result) => {
            if (result)
                this.toVautlSummary();
            return;
        });
    }
    toVautlSummary() {
        this.navCtrl.push('CreateVaultSummaryView', { refreshVaultList: this.navParams.get('refreshVaultList') });
    }
};
CreateVaultMasterKeyView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-create-vault-master-key',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/vaults/create-vault/master-key/master-key.html"*/'<ion-header>\n        \n    <ion-navbar color="secondary" >\n        <ion-title translate>Create Vault</ion-title>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <ion-list margin-top>\n        <ion-list>\n            <ion-item>\n                <div class="title">\n                    Master key\n                </div>\n            </ion-item>\n            <ion-item>\n                <div class="key">\n                    {{ formData.masterKeyMnemonic }}\n                </div>\n            </ion-item>\n        </ion-list>\n\n        <div class="comment">\n            You have to write down the key and keep it in secret.\n        </div>\n    </ion-list>\n\n    <div class="control-buttons">\n        <button ion-button type="button" translate (click)="confirm()">\n            Next\n        </button>\n    </div>\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/vaults/create-vault/master-key/master-key.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_5_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_2_merit_vaults_create_vault_create_vault_service__["a" /* CreateVaultService */],
        __WEBPACK_IMPORTED_MODULE_3_merit_core_popup_service__["a" /* PopupService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_bwc_service__["a" /* BwcService */]])
], CreateVaultMasterKeyView);

//# sourceMappingURL=master-key.js.map

/***/ })

});
//# sourceMappingURL=31.js.map