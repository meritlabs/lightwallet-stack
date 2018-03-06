webpackJsonp([37],{

/***/ 776:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TermsOfUseComponentModule", function() { return TermsOfUseComponentModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_shared_terms_of_use_terms_of_use__ = __webpack_require__(863);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let TermsOfUseComponentModule = class TermsOfUseComponentModule {
};
TermsOfUseComponentModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_shared_terms_of_use_terms_of_use__["a" /* TermsOfUseView */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_shared_terms_of_use_terms_of_use__["a" /* TermsOfUseView */]),
        ],
    })
], TermsOfUseComponentModule);

//# sourceMappingURL=terms-of-use.module.js.map

/***/ }),

/***/ 863:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TermsOfUseView; });
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


let TermsOfUseView = class TermsOfUseView {
    constructor(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    ionViewDidLoad() {
        //do something here
    }
};
TermsOfUseView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-terms-of-use',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/shared/terms-of-use/terms-of-use.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title translate>Terms of use</ion-title>\n    </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n    <div id="terms">\n        <p>\n            This is a binding Agreement between Merit Labs Pte Ltd.   (&ldquo;Merit Labs&rdquo; or &ldquo;We&rdquo;) and the person, persons, or entity (&ldquo;You&rdquo; or &ldquo;Your&rdquo;) using the service, Software, or application (&ldquo;Software&rdquo;).\n        </p>\n        <p class="heading">\n            RIGHTS AND OBLIGATIONS\n        </p>\n        <p>\n            Merit Labs provides the Software solely on the terms and conditions set forth in this Agreement and on the condition that You accept and comply with them. By using the Software You (a) accept this Agreement and agree that You are legally bound by its terms; and (b) represent and warrant that: (i) You are of legal age to enter into a binding agreement; and (ii) if You are a corporation, governmental organization or other legal entity, You have the right, power and authority to enter into this Agreement on behalf of the corporation, governmental organization or other legal entity and bind them to these terms.\n        </p>\n        <p>\n            This Software functions as a free, open source, and multi-signature digital wallet. The Software does not constitute an account where We or other third parties serve as financial intermediaries or custodians of Your merit(s).\n        </p>\n        <p>\n            While the Software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, We cannot guarantee there will not be bugs in the Software. You acknowledge that Your use of this Software is at Your own discretion and in compliance with all applicable laws. You are responsible for safekeeping Your passwords, private key pairs, PINs, and any other codes You use to access the Software.\n        </p>\n        <p>\n            IF YOU LOSE ACCESS TO YOUR MERIT WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY MERIT YOU HAVE ASSOCIATED WITH THAT WALLET WILL BECOME INACCESSIBLE. All transaction requests are irreversible. The authors of the Software, employees and affiliates of Merit Labs, copyright holders, and Merit Labs Pte Ltd.   cannot retrieve Your private keys or passwords if You lose or forget them and cannot guarantee transaction confirmation as they do not have control over the merit network.\n        </p>\n        <p class="heading">\n            DISCLAIMER\n        </p>\n        <p>\n            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OF THE SOFTWARE, EMPLOYEES AND AFFILIATES OF MERIT LABS, COPYRIGHT HOLDERS, OR MERIT LABS, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n        </p>\n        <p>\n            IN NO EVENT WILL MERIT LABS OR ITS AFFILIATES, OR ANY OF ITS OR THEIR RESPECTIVE SERVICE PROVIDERS, BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY USE, INTERRUPTION, DELAY OR INABILITY TO USE THE SOFTWARE, LOST REVENUES OR PROFITS, DELAYS, INTERRUPTION OR LOSS OF SERVICES, BUSINESS OR GOODWILL, LOSS OR CORRUPTION OF DATA, LOSS RESULTING FROM SYSTEM OR SYSTEM SERVICE FAILURE, MALFUNCTION OR SHUTDOWN, FAILURE TO ACCURATELY TRANSFER, READ OR TRANSMIT INFORMATION, FAILURE TO UPDATE OR PROVIDE CORRECT INFORMATION, SYSTEM INCOMPATIBILITY OR PROVISION OF INCORRECT COMPATIBILITY INFORMATION OR BREACHES IN SYSTEM SECURITY, OR FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, EXEMPLARY, SPECIAL OR PUNITIVE DAMAGES, WHETHER ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT, BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE) OR OTHERWISE, REGARDLESS OF WHETHER SUCH DAMAGES WERE FORESEEABLE AND WHETHER OR NOT WE WERE ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.\n        </p>\n        <p class="heading">\n            INTELLECTUAL PROPERTY\n        </p>\n        <p>\n            We retain all right, title, and interest in and to the Content and all of Merit Labs’s brands, logos, and trademarks, including, but not limited to, Merit Labs Pte Ltd., Merit Labs, Merit Labs &ndash; Secure Merit Wallet, Merit Labs Wallet, Merit LightWallet, Merit Wallet, Merit Labs App, and variations of the wording of the aforementioned brands, logos, and trademarks.\n        </p>\n        <p class="heading">\n            CHOICE OF LAW\n        </p>\n        <p>\n            This Agreement, and its application and interpretation, shall be governed exclusively by the laws of Singapore, without regard to its conflict of law rules. You consent to the exclusive jurisdiction of the courts of Singapore.\n        <p class="heading">\n            SEVERABILITY\n        </p>\n        <p>\n            In the event any court shall declare any section or sections of this Agreement invalid or void, such declaration shall not invalidate the entire Agreement and all other paragraphs of the Agreement shall remain in full force and effect.\n        </p>\n        <p class="heading">\n            BINDING AGREEMENT\n        </p>\n        <p>\n            The terms and provisions of this Agreement are binding upon Your heirs, successors, assigns, and other representatives. This Agreement may be executed in counterparts, each of which shall be considered to be an original, but both of which constitute the same Agreement.\n        </p>\n        <p>\n            You assume any and all risks associated with the use of the Software. We reserve the right to modify this Agreement from time to time.\n        </p>\n    </div>\n\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lightwallet/src/app/shared/terms-of-use/terms-of-use.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
], TermsOfUseView);

//# sourceMappingURL=terms-of-use.js.map

/***/ })

});
//# sourceMappingURL=37.js.map