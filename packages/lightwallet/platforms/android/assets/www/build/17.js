webpackJsonp([17],{

/***/ 795:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VaultSpendModule", function() { return VaultSpendModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_shared_shared_module__ = __webpack_require__(817);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__vault_spend__ = __webpack_require__(883);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




/*
  ToDo: Work to get this lazy-loadable as possible.
*/
let VaultSpendModule = class VaultSpendModule {
};
VaultSpendModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_3__vault_spend__["a" /* VaultSpendView */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_3__vault_spend__["a" /* VaultSpendView */]),
            __WEBPACK_IMPORTED_MODULE_2_merit_shared_shared_module__["a" /* SharedModule */],
        ],
        providers: []
    })
], VaultSpendModule);

//# sourceMappingURL=vault-spend.module.js.map

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

/***/ 883:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VaultSpendView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

let VaultSpendView = class VaultSpendView {
};
VaultSpendView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'vault-spend-view',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/vaults/spend/vault-spend.html"*/''/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/vaults/spend/vault-spend.html"*/,
    })
], VaultSpendView);

//# sourceMappingURL=vault-spend.js.map

/***/ })

});
//# sourceMappingURL=17.js.map