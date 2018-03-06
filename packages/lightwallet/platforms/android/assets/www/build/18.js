webpackJsonp([18],{

/***/ 793:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VaultSpendAmountModule", function() { return VaultSpendAmountModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_shared_shared_module__ = __webpack_require__(817);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__vault_spend_amount__ = __webpack_require__(881);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




/*
  ToDo: Work to get this lazy-loadable as possible.
*/
let VaultSpendAmountModule = class VaultSpendAmountModule {
};
VaultSpendAmountModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_3__vault_spend_amount__["a" /* VaultSpendAmountView */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_3__vault_spend_amount__["a" /* VaultSpendAmountView */]),
            __WEBPACK_IMPORTED_MODULE_2_merit_shared_shared_module__["a" /* SharedModule */],
        ],
        providers: []
    })
], VaultSpendAmountModule);

//# sourceMappingURL=vault-spend-amount.module.js.map

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

/***/ 881:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VaultSpendAmountView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_logger__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




let VaultSpendAmountView = class VaultSpendAmountView {
    constructor(navCtrl, navParams, log) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.log = log;
        this.LENGTH_EXPRESSION_LIMIT = 19;
        this.SMALL_FONT_SIZE_LIMIT = 10;
        this.availableUnits = [];
        this.unitIndex = 0;
        this.reNr = /^[1234567890\.]$/;
        this.reOp = /^[\*\+\-\/]$/;
        this.vault = null;
        this.wallet = null;
        this.amount = '';
        this.allowSend = false;
    }
    ionViewDidLoad() {
        console.log('Params', this.navParams.data);
        this.recipient = this.navParams.get('recipient');
        this.wallet = this.navParams.get('wallet');
        this.vault = this.navParams.get('vault');
        this.sending = this.navParams.get('sending');
        this.displayName = !__WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](this.recipient.name) ? this.recipient.name : this.recipient.meritAddress;
    }
    handleKeyboardEvent(event) {
        if (!event.key)
            return;
        if (event.which === 8) {
            event.preventDefault();
            this.removeDigit();
        }
        if (event.key.match(this.reNr)) {
            this.pushDigit(event.key);
        }
        else if (event.key.match(this.reOp)) {
            this.pushOperator(event.key);
        }
        else if (event.keyCode === 86) {
            // if (event.ctrlKey || event.metaKey) processClipboard();
        }
        else if (event.keyCode === 13)
            this.finish();
    }
    pushDigit(digit) {
        if (this.amount && this.amount.length >= this.LENGTH_EXPRESSION_LIMIT)
            return;
        if (this.amount.indexOf('.') > -1 && digit == '.')
            return;
        // TODO: next line - Need: isFiat
        //if (this.availableUnits[this.unitIndex].isFiat && this.amount.indexOf('.') > -1 && this.amount[this.amount.indexOf('.') + 2]) return;
        this.amount = (this.amount + digit).replace('..', '.');
        this.checkFontSize();
        this.processAmount();
    }
    ;
    removeDigit() {
        this.amount = (this.amount).toString().slice(0, -1);
        this.processAmount();
        this.checkFontSize();
    }
    ;
    pushOperator(operator) {
        if (!this.amount || this.amount.length == 0)
            return;
        this.amount = this._pushOperator(this.amount, operator);
    }
    ;
    _pushOperator(val, operator) {
        if (!this.isOperator(__WEBPACK_IMPORTED_MODULE_0_lodash__["last"](val))) {
            return val + operator;
        }
        else {
            return val.slice(0, -1) + operator;
        }
    }
    ;
    isOperator(val) {
        const regex = /[\/\-\+\x\*]/;
        return regex.test(val);
    }
    ;
    isExpression(val) {
        const regex = /^\.?\d+(\.?\d+)?([\/\-\+\*x]\d?\.?\d+)+$/;
        return regex.test(val);
    }
    ;
    checkFontSize() {
        if (this.amount && this.amount.length >= this.SMALL_FONT_SIZE_LIMIT)
            this.smallFont = true;
        else
            this.smallFont = false;
    }
    ;
    processAmount() {
        var formatedValue = this.format(this.amount);
        var result = this.evaluate(formatedValue);
        this.allowSend = __WEBPACK_IMPORTED_MODULE_0_lodash__["isNumber"](result) && +result > 0;
        if (__WEBPACK_IMPORTED_MODULE_0_lodash__["isNumber"](result)) {
            this.globalResult = this.isExpression(this.amount) ? '= ' + this.processResult(result) : '';
            // TODO this.globalResult is always undefinded - Need: processResult()
            /* if (this.availableUnits[this.unitIndex].isFiat) {
      
              var a = this.fromFiat(result);
              if (a) {
                this.alternativeAmount = txFormatService.formatAmount(a * unitToMicro, true);
              } else {
                this.alternativeAmount = 'N/A'; //TODO
                this.allowSend = false;
              }
            } else {
              this.alternativeAmount = $filter('formatFiatAmount')(toFiat(result));
            } */
            this.globalResult = result.toString();
        }
    }
    ;
    format(val) {
        if (!val)
            return;
        var result = val.toString();
        if (this.isOperator(__WEBPACK_IMPORTED_MODULE_0_lodash__["last"](val)))
            result = result.slice(0, -1);
        return result.replace('x', '*');
    }
    ;
    evaluate(val) {
        var result;
        try {
            result = eval(val);
        }
        catch (e) {
            return 0;
        }
        if (!__WEBPACK_IMPORTED_MODULE_0_lodash__["isFinite"](result))
            return 0;
        return result;
    }
    ;
    processResult(val) {
        // TODO: implement this function correctly - Need: txFormatService, isFiat, $filter
        this.log.info("processResult TODO");
        /*if (this.availableUnits[this.unitIndex].isFiat) return $filter('formatFiatAmount')(val);
        else return txFormatService.formatAmount(val.toFixed(unitDecimals) * unitToMicro, true);*/
    }
    ;
    finish() {
        console.log(this.navParams.get('coins'));
        this.navCtrl.push('VaultSpendConfirmView', { recipient: this.recipient, toAmount: parseFloat(this.globalResult), wallet: this.navParams.get('wallet'), vault: this.vault, coins: this.navParams.get('coins') });
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["HostListener"])('document:keydown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], VaultSpendAmountView.prototype, "handleKeyboardEvent", null);
VaultSpendAmountView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
        selector: 'vault-spend-amount-view',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/vaults/spend/amount/vault-spend-amount.html"*/'<ion-header>\n        \n    <ion-navbar color="secondary">\n        <ion-title>Vault: Amount</ion-title>\n    </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n    <ion-list>\n    <ion-label padding>Recipient</ion-label>\n        <ion-item>\n        <ion-icon name="contact" item-left></ion-icon>\n        <span>{{ displayName }}</span>\n        </ion-item>\n    </ion-list>\n    <div>\n        <div padding>\n        <div>\n            <span>Amount</span>\n        </div>\n        <div>\n            <span>{{ amount || "0.00" }}</span>\n        </div>\n        <div [hidden]="!globalResult">\n            = {{ globalResult || "0.00" }}\n        </div>\n        </div>\n        <div class="keypad">\n        <div class="operator-row">\n            <div class="col operator-send"\n                [hidden]="!allowSend" (click)="finish()">\n            <ion-icon name="arrow-round-forward"></ion-icon>\n            </div>\n        </div>\n        <div class="row">\n            <div class="col digit" (click)="pushDigit(\'7\')">7</div>\n            <div class="col digit" (click)="pushDigit(\'8\')">8</div>\n            <div class="col digit" (click)="pushDigit(\'9\')">9</div>\n            <div class="col operator" (click)="pushOperator(\'/\')">&#247;</div>\n        </div>\n\n        <div class="row">\n            <div class="col digit" (click)="pushDigit(\'4\')">4</div>\n            <div class="col digit" (click)="pushDigit(\'5\')">5</div>\n            <div class="col digit" (click)="pushDigit(\'6\')">6</div>\n            <div class="col operator" (click)="pushOperator(\'x\')">&#215;</div>\n        </div>\n\n        <div class="row">\n            <div class="col digit" (click)="pushDigit(\'1\')">1</div>\n            <div class="col digit" (click)="pushDigit(\'2\')">2</div>\n            <div class="col digit" (click)="pushDigit(\'3\')">3</div>\n            <div class="col operator" (click)="pushOperator(\'+\')">&#43;</div>\n        </div>\n\n        <div class="row">\n            <div class="col digit" (click)="pushDigit(\'.\')">.</div>\n            <div class="col digit" (click)="pushDigit(\'0\')">0</div>\n            <div class="col digit" (click)="removeDigit()"><ion-icon name="backspace"></ion-icon></div>\n            <div class="col operator" (click)="pushOperator(\'-\')">&#45;</div>\n        </div>\n        </div>\n    </div>\n</ion-content>\n        '/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/vaults/spend/amount/vault-spend-amount.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_3_merit_core_logger__["a" /* Logger */]])
], VaultSpendAmountView);

//# sourceMappingURL=vault-spend-amount.js.map

/***/ })

});
//# sourceMappingURL=18.js.map