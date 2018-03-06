webpackJsonp([40],{

/***/ 769:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectCurrencyComponentModule", function() { return SelectCurrencyComponentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_settings_select_currency_select_currency__ = __webpack_require__(856);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let SelectCurrencyComponentModule = class SelectCurrencyComponentModule {
};
SelectCurrencyComponentModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_settings_select_currency_select_currency__["a" /* SelectCurrencyModal */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_settings_select_currency_select_currency__["a" /* SelectCurrencyModal */]),
        ],
    })
], SelectCurrencyComponentModule);

//# sourceMappingURL=select-currency.module.js.map

/***/ }),

/***/ 856:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectCurrencyModal; });
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


let SelectCurrencyModal = class SelectCurrencyModal {
    constructor(navCtrl, navParams, viewCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.searchQuery = '';
        this.foundCurrencies = [];
        this.currentCurrency = this.navParams.get('currentCurrency');
        this.availableCurrencies = this.navParams.get('availableCurrencies');
        this.findCurrencies();
    }
    ionViewDidLoad() {
        //do something here
    }
    findCurrencies() {
        if (!this.searchQuery) {
            this.foundCurrencies = this.availableCurrencies;
        }
        else {
            this.foundCurrencies = this.availableCurrencies.filter((c) => {
                return (c.toLowerCase().indexOf(this.searchQuery.toLowerCase()) != -1);
            });
        }
    }
    cancel() {
        this.viewCtrl.dismiss();
    }
    select(currency) {
        this.viewCtrl.dismiss(currency);
    }
};
SelectCurrencyModal = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-select-currency',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/settings/select-currency/select-currency.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title translate>Alternative Currency</ion-title>\n\n        <ion-buttons end>\n            <button ion-button (click)="cancel()" translate>\n                cancel\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n    <ion-list>\n        <ion-searchbar [placeholder]="\'Search your currency\'" (ionInput)="findCurrencies()" [(ngModel)]="searchQuery"></ion-searchbar>\n        <ion-item *ngFor="let currency of foundCurrencies" [class.selected]="currentCurrency == currency" (click)="select(currency)">\n            <ion-label>{{currency}}</ion-label>\n            <ion-icon name="checkmark" color="primary" item-right *ngIf="currentCurrency == currency"></ion-icon>\n        </ion-item>\n    </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/settings/select-currency/select-currency.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */]])
], SelectCurrencyModal);

//# sourceMappingURL=select-currency.js.map

/***/ })

});
//# sourceMappingURL=40.js.map