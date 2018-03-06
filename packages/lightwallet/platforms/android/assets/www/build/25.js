webpackJsonp([25],{

/***/ 785:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImportScanComponentModule", function() { return ImportScanComponentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_utilities_import_import_scan_import_scan__ = __webpack_require__(873);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_barcode_scanner__ = __webpack_require__(845);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




let ImportScanComponentModule = class ImportScanComponentModule {
};
ImportScanComponentModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_utilities_import_import_scan_import_scan__["a" /* ImportScanView */],
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_barcode_scanner__["a" /* BarcodeScanner */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_utilities_import_import_scan_import_scan__["a" /* ImportScanView */]),
        ],
    })
], ImportScanComponentModule);

//# sourceMappingURL=import-scan.module.js.map

/***/ }),

/***/ 845:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BarcodeScanner; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__ = __webpack_require__(80);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * @name Barcode Scanner
 * @description
 * The Barcode Scanner Plugin opens a camera view and automatically scans a barcode, returning the data back to you.
 *
 * Requires Cordova plugin: `phonegap-plugin-barcodescanner`. For more info, please see the [BarcodeScanner plugin docs](https://github.com/phonegap/phonegap-plugin-barcodescanner).
 *
 * @usage
 * ```typescript
 * import { BarcodeScanner } from '@ionic-native/barcode-scanner';
 *
 * constructor(private barcodeScanner: BarcodeScanner) { }
 *
 * ...
 *
 *
 * this.barcodeScanner.scan().then((barcodeData) => {
 *  // Success! Barcode data is here
 * }, (err) => {
 * 	// An error occurred
 * });
 * ```
 * @interfaces
 * BarcodeScannerOptions
 * BarcodeScanResult
 */
var BarcodeScanner = (function (_super) {
    __extends(BarcodeScanner, _super);
    function BarcodeScanner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Encode = {
            TEXT_TYPE: 'TEXT_TYPE',
            EMAIL_TYPE: 'EMAIL_TYPE',
            PHONE_TYPE: 'PHONE_TYPE',
            SMS_TYPE: 'SMS_TYPE'
        };
        return _this;
    }
    /**
     * Open the barcode scanner.
     * @param options {BarcodeScannerOptions} Optional options to pass to the scanner
     * @returns {Promise<any>} Returns a Promise that resolves with scanner data, or rejects with an error.
     */
    BarcodeScanner.prototype.scan = function (options) { return; };
    /**
     * Encodes data into a barcode.
     * NOTE: not well supported on Android
     * @param type {string} Type of encoding
     * @param data {any} Data to encode
     * @returns {Promise<any>}
     */
    BarcodeScanner.prototype.encode = function (type, data) { return; };
    BarcodeScanner.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    BarcodeScanner.ctorParameters = function () { return []; };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])({
            callbackOrder: 'reverse'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BarcodeScanner.prototype, "scan", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["a" /* Cordova */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], BarcodeScanner.prototype, "encode", null);
    BarcodeScanner = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["h" /* Plugin */])({
            pluginName: 'BarcodeScanner',
            plugin: 'phonegap-plugin-barcodescanner',
            pluginRef: 'cordova.plugins.barcodeScanner',
            repo: 'https://github.com/phonegap/phonegap-plugin-barcodescanner',
            platforms: ['Android', 'BlackBerry 10', 'Browser', 'iOS', 'Windows']
        })
    ], BarcodeScanner);
    return BarcodeScanner;
}(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["g" /* IonicNativePlugin */]));

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 873:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImportScanView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_barcode_scanner__ = __webpack_require__(845);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




let ImportScanView = class ImportScanView {
    constructor(viewCtrl, barcodeScanner, logger) {
        this.viewCtrl = viewCtrl;
        this.barcodeScanner = barcodeScanner;
        this.logger = logger;
    }
    close() {
        this.viewCtrl.dismiss();
    }
    ionViewDidLoad() {
        this.barcodeScanner.scan({ formats: 'QR_CODE' }).then((barcodeData) => {
            this.viewCtrl.dismiss(barcodeData.text);
        }).catch((err) => {
            this.err = err;
        });
    }
};
ImportScanView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-import-scan',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/utilities/import/import-scan/import-scan.html"*/'<ion-header>\n    <ion-navbar color="secondary">\n        <ion-title translate></ion-title>\n        <ion-buttons end>\n            <button ion-button (click)="close()">\n                close\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n\n<ion-content padding>\n\n    <ion-card  padding>\n        <div translate>\n\n            <div class="icon">\n                <img src="assets/img/icons/qr-code.svg">\n            </div>\n\n            QR Scanner not available\n\n            <div>{{err}}</div>\n        </div>\n    </ion-card>\n\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/utilities/import/import-scan/import-scan.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */],
        __WEBPACK_IMPORTED_MODULE_3__ionic_native_barcode_scanner__["a" /* BarcodeScanner */],
        __WEBPACK_IMPORTED_MODULE_2_merit_core_logger__["a" /* Logger */]])
], ImportScanView);

//# sourceMappingURL=import-scan.js.map

/***/ })

});
//# sourceMappingURL=25.js.map