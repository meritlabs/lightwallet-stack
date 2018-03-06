webpackJsonp([42],{

/***/ 767:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdvancedSettingsComponentModule", function() { return AdvancedSettingsComponentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_settings_advanced_settings_advanced_settings__ = __webpack_require__(854);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let AdvancedSettingsComponentModule = class AdvancedSettingsComponentModule {
};
AdvancedSettingsComponentModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_settings_advanced_settings_advanced_settings__["a" /* AdvancedSettingsView */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_settings_advanced_settings_advanced_settings__["a" /* AdvancedSettingsView */]),
        ],
    })
], AdvancedSettingsComponentModule);

//# sourceMappingURL=advanced-settings.module.js.map

/***/ }),

/***/ 854:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdvancedSettingsView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let AdvancedSettingsView = class AdvancedSettingsView {
    constructor(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    ionViewDidLoad() {
        //do something here
    }
    spendUnconfirmedChange() {
    }
    recentTransactionChange() {
    }
    nextStepsChange() {
    }
};
AdvancedSettingsView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-advanced-settings',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/settings/advanced-settings/advanced-settings.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title>Advanced</ion-title>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <ion-list margin-top>\n        <ion-item>\n            <ion-label translate>Use Unconfirmed Funds</ion-label>\n            <ion-toggle [(ngModel)]="spendUnconfirmed" (ionChange)="spendUnconfirmedChange()">\n            </ion-toggle>\n        </ion-item>\n        <ion-item>\n            <ion-label class="white-space-normal">\n                If enabled, wallets will also try to spend unconfirmed funds. This option may cause transaction delays.\n            </ion-label>\n        </ion-item>\n    </ion-list>\n\n\n    <ion-list>\n        <ion-item>\n            <ion-label translate>Recent Transaction Card</ion-label>\n            <ion-toggle [(ngModel)]="recentTransactionsEnabled" (ionChange)="recentTransactionChange()">\n            </ion-toggle>\n        </ion-item>\n        <ion-item>\n            <ion-label class="white-space-normal">\n                If enabled, the Recent Transactions card - a list of transactions occuring across all wallets - will appear in the Home tab.\n            </ion-label>\n        </ion-item>\n    </ion-list>\n\n    <ion-list>\n        <ion-item>\n            <ion-label translate>Hide Next Steps Card</ion-label>\n            <ion-toggle [(ngModel)]="nextStepsEnabled" (ionChange)="nextStepsChange()">\n            </ion-toggle>\n        </ion-item>\n    </ion-list>\n\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/settings/advanced-settings/advanced-settings.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
], AdvancedSettingsView);

//# sourceMappingURL=advanced-settings.js.map

/***/ })

});
//# sourceMappingURL=42.js.map