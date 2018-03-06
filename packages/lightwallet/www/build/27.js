webpackJsonp([27],{

/***/ 800:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$$moduleName$$Module", function() { return $$moduleName$$Module; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__select_color__ = __webpack_require__(891);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let $$moduleName$$Module = class $$moduleName$$Module {
};
$$moduleName$$Module = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__select_color__["a" /* SelectColorView */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__select_color__["a" /* SelectColorView */]),
        ],
    })
], $$moduleName$$Module);

//# sourceMappingURL=select-color.module.js.map

/***/ }),

/***/ 891:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectColorView; });
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


let SelectColorView = class SelectColorView {
    constructor(navCtrl, navParams, viewCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.availableColors = [
            { hex: '#dd4b39', name: 'Cinnabar' },
            { hex: '#f38f12', name: 'Carrot Orange' },
            { hex: '#faa77f', name: 'Light Salmon' },
            { hex: '#d0b136', name: 'Metallic Gold' },
            { hex: '#9edd72', name: 'Feijoa' },
            { hex: '#29bb9c', name: 'Shamrock' },
            { hex: '#019477', name: 'Observatory' },
            { hex: '#77dada', name: 'Turquoise Blue' },
            { hex: '#4a90e2', name: 'Cornflower Blue' },
            { hex: '#484ed3', name: 'Free Speech Blue' },
            { hex: '#9b59b6', name: 'Deep Lilac' },
            { hex: '#e856ef', name: 'Free Speech Magenta' },
            { hex: '#ff599e', name: 'Brilliant Rose' },
            { hex: '#7a8c9e', name: 'Light Slate Grey' },
            { hex: '#30afe6', name: 'Merit' }
        ];
    }
    ionViewDidLoad() {
        //do something here
    }
    cancel() {
        this.viewCtrl.dismiss();
    }
    select(color) {
        this.viewCtrl.dismiss(color.hex);
    }
};
SelectColorView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-select-color',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/wallets/select-color/select-color.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title>Select Wallet Color</ion-title>\n        <ion-buttons end>\n            <button ion-button (click)="cancel()" translate>\n                cancel\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n    <ion-list>\n        <button ion-item *ngFor="let color of availableColors" [class.selected]="color.hex == selectedColorHex" (click)="select(color)">\n            <ion-label>{{color.name}}</ion-label>\n            <ion-label item-right text-right>\n                <i class="wallet-icon">\n                    <img src="assets/img/icon-wallet.svg"  [style.background]="color.hex">\n                </i>\n            </ion-label>\n        </button>\n    </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/wallets/select-color/select-color.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */]])
], SelectColorView);

//# sourceMappingURL=select-color.js.map

/***/ })

});
//# sourceMappingURL=27.js.map