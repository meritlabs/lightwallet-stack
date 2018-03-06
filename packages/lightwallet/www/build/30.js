webpackJsonp([30],{

/***/ 790:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateVaultSummaryComponentModule", function() { return CreateVaultSummaryComponentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_vaults_create_vault_vault_summary_vault_summary__ = __webpack_require__(878);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_shared_config_service__ = __webpack_require__(23);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




let CreateVaultSummaryComponentModule = class CreateVaultSummaryComponentModule {
};
CreateVaultSummaryComponentModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_vaults_create_vault_vault_summary_vault_summary__["a" /* CreateVaultSummaryView */],
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_3_merit_shared_config_service__["a" /* ConfigService */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_vaults_create_vault_vault_summary_vault_summary__["a" /* CreateVaultSummaryView */]),
        ],
    })
], CreateVaultSummaryComponentModule);

//# sourceMappingURL=vault-summary.module.js.map

/***/ }),

/***/ 878:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateVaultSummaryView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_vaults_create_vault_create_vault_service__ = __webpack_require__(507);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let CreateVaultSummaryView = class CreateVaultSummaryView {
    constructor(navCtrl, createVaultService, navParams) {
        this.navCtrl = navCtrl;
        this.createVaultService = createVaultService;
        this.navParams = navParams;
        this.formData = { vaultName: '', whitelist: [], amountToDeposit: 0.0, masterKey: '' };
    }
    ionViewDidLoad() {
        let data = this.createVaultService.getData();
        this.formData.vaultName = data.vaultName;
        this.formData.whitelist = data.whitelist;
        this.formData.amountToDeposit = data.amountToDeposit;
        this.formData.masterKey = data.masterKey;
    }
    create() {
        this.createVaultService.createVault().then(() => {
            this.navCtrl.goToRoot({});
        }).then(() => {
            const refreshFn = this.navParams.get('refreshVaultList');
            refreshFn();
        });
    }
};
CreateVaultSummaryView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-create-vault-summary',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/vaults/create-vault/vault-summary/vault-summary.html"*/'<ion-header>\n        \n    <ion-navbar color="secondary" >\n        <ion-title translate>Create Vault</ion-title>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <ion-list margin-top>\n        <ion-item>\n            <ion-label translate>Vault name</ion-label>\n            <ion-input text-right [placeholder]="\'My Vault\'" [(ngModel)]="formData.vaultName" [disabled]="true"></ion-input>\n        </ion-item>\n    </ion-list>\n\n    <ion-list>\n        <ion-item>\n            <ion-label translate>Amount to deposit</ion-label>\n            <ion-input text-right [placeholder]="\'0.0\'" [(ngModel)]="formData.amountToDeposit" [disabled]="true"></ion-input>\n        </ion-item>\n    </ion-list>\n\n    <ion-list>\n        <ion-item>\n            <ion-label translate>Master key</ion-label>\n            <ion-input text-right [placeholder]="\'THE KEY\'" [(ngModel)]="formData.masterKey" [disabled]="true"></ion-input>\n        </ion-item>\n    </ion-list>\n\n    <ion-list>\n        <ion-item>\n            <ion-label translate>Whitelist</ion-label>\n        </ion-item>\n            \n        <ion-item *ngFor="let address of formData.whitelist">\n            <ion-label class="whitelist-item">\n                {{ address.name }}\n            </ion-label>\n        </ion-item>\n    </ion-list>\n\n    <div class="control-buttons">\n        <button ion-button type="button" translate (click)="create()">\n            Create\n        </button>\n    </div>\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/vaults/create-vault/vault-summary/vault-summary.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2_merit_vaults_create_vault_create_vault_service__["a" /* CreateVaultService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
], CreateVaultSummaryView);

//# sourceMappingURL=vault-summary.js.map

/***/ })

});
//# sourceMappingURL=30.js.map