webpackJsonp([8,9],{

/***/ 758:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddressBookModule", function() { return AddressBookModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_transact_send_send_service__ = __webpack_require__(810);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_shared_gravatar_module__ = __webpack_require__(808);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_shared_address_book_address_book__ = __webpack_require__(816);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_shared_address_book_address_book_service__ = __webpack_require__(804);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_contacts__ = __webpack_require__(805);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_merit_shared_address_book_merit_contact_builder__ = __webpack_require__(806);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_merit_shared_address_book_merit_contact_service__ = __webpack_require__(813);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};










// This module manaages the sending of money.
// This is the first of three steps.
let AddressBookModule = class AddressBookModule {
};
AddressBookModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_5_merit_shared_address_book_address_book__["a" /* AddressBookView */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_5_merit_shared_address_book_address_book__["a" /* AddressBookView */]),
            __WEBPACK_IMPORTED_MODULE_3_merit_shared_gravatar_module__["a" /* GravatarModule */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_4_merit_wallets_wallet_service__["a" /* WalletService */],
            __WEBPACK_IMPORTED_MODULE_2_merit_transact_send_send_service__["a" /* SendService */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_native_contacts__["b" /* Contacts */],
            __WEBPACK_IMPORTED_MODULE_8_merit_shared_address_book_merit_contact_builder__["a" /* MeritContactBuilder */],
            __WEBPACK_IMPORTED_MODULE_6_merit_shared_address_book_address_book_service__["a" /* AddressBookService */],
            __WEBPACK_IMPORTED_MODULE_9_merit_shared_address_book_merit_contact_service__["a" /* MeritContactService */]
        ],
        exports: []
    })
], AddressBookModule);

//# sourceMappingURL=address-book.module.js.map

/***/ }),

/***/ 774:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContactViewModule", function() { return ContactViewModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_shared_address_book_contact_contact__ = __webpack_require__(861);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_shared_gravatar_module__ = __webpack_require__(808);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_contacts__ = __webpack_require__(805);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_shared_address_book_address_book_module__ = __webpack_require__(758);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







// Contact Module
let ContactViewModule = class ContactViewModule {
};
ContactViewModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2_merit_shared_address_book_contact_contact__["a" /* ContactView */],
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_contacts__["b" /* Contacts */],
            __WEBPACK_IMPORTED_MODULE_5_merit_core_profile_service__["a" /* ProfileService */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_6_merit_shared_address_book_address_book_module__["AddressBookModule"],
            __WEBPACK_IMPORTED_MODULE_3_merit_shared_gravatar_module__["a" /* GravatarModule */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2_merit_shared_address_book_contact_contact__["a" /* ContactView */]),
        ],
    })
], ContactViewModule);

//# sourceMappingURL=contact.module.js.map

/***/ }),

/***/ 804:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddressBookService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_persistence_service__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_contacts__ = __webpack_require__(805);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_merit_core_platform_service__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_merit_shared_address_book_merit_contact_builder__ = __webpack_require__(806);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_merit_shared_config_service__ = __webpack_require__(23);
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
 * This service looks up entered addresses against the address book.
 */
let AddressBookService = class AddressBookService {
    constructor(persistenceService, platformService, configService, contacts, logger, meritContactBuilder) {
        this.persistenceService = persistenceService;
        this.platformService = platformService;
        this.configService = configService;
        this.contacts = contacts;
        this.logger = logger;
        this.meritContactBuilder = meritContactBuilder;
    }
    get(addr, network) {
        return this.getAddressbook(network).then((addressBook) => {
            if (addressBook && addressBook[addr]) {
                return __WEBPACK_IMPORTED_MODULE_1_bluebird__["resolve"](addressBook[addr]);
            }
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["reject"](new Error('contact with address ' + addr + ' not found'));
        }, (err) => {
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["reject"](new Error('error getting addressBook entry: ' + err));
        });
    }
    ;
    list(network) {
        return this.getAddressbook(network).then((addressBook) => {
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["resolve"](addressBook);
        }).catch((err) => {
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["reject"](new Error('error listing addressBook: ' + err));
        });
    }
    ;
    searchDeviceContacts(term) {
        let options = { filter: term, multiple: true };
        let fields = ['name', 'phoneNumbers', 'emails'];
        if (!this.platformService.isMobile)
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["resolve"]([]);
        return __WEBPACK_IMPORTED_MODULE_1_bluebird__["resolve"](this.contacts.find(fields, options)).catch((err) => {
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["resolve"]([]);
        });
    }
    ;
    getAllDeviceContacts() {
        return this.searchDeviceContacts('');
    }
    searchContacts(contacts, searchQuery) {
        searchQuery = searchQuery.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        let exp = new RegExp(searchQuery, 'ig');
        return __WEBPACK_IMPORTED_MODULE_2_lodash__["filter"](contacts, (contact) => {
            if (contact.name.formatted && contact.name.formatted.match(exp))
                return true;
            if (__WEBPACK_IMPORTED_MODULE_2_lodash__["some"](contact.emails, (email) => email.value.match(exp)))
                return true;
            if (__WEBPACK_IMPORTED_MODULE_2_lodash__["some"](contact.phoneNumbers, (phoneNumber) => phoneNumber.value.match(exp)))
                return true;
            if (__WEBPACK_IMPORTED_MODULE_2_lodash__["some"](contact.meritAddresses, (address) => address.address.match(exp)))
                return true;
            return false;
        });
    }
    getAllMeritContacts() {
        return this.getAllDeviceContacts().then((deviceContacts) => {
            return this.getAddressbook(this.configService.getDefaults().network.name).then((localContacts) => {
                let contacts = __WEBPACK_IMPORTED_MODULE_2_lodash__["map"](__WEBPACK_IMPORTED_MODULE_2_lodash__["filter"](deviceContacts, contact => !__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](contact.phoneNumbers) || !__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](contact.emails)), contact => this.meritContactBuilder.build(contact));
                __WEBPACK_IMPORTED_MODULE_2_lodash__["each"](__WEBPACK_IMPORTED_MODULE_2_lodash__["map"](localContacts, contact => contact), (contact) => {
                    let currentContact = __WEBPACK_IMPORTED_MODULE_2_lodash__["find"](contacts, { id: contact.id });
                    if (currentContact) {
                        currentContact.meritAddresses = contact.meritAddresses;
                    }
                    else {
                        contacts.push(contact);
                    }
                });
                return contacts.sort((a, b) => {
                    if (!(__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](a.meritAddresses) || __WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](b.meritAddresses)) ||
                        (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](a.meritAddresses) && (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](b.meritAddresses)))) {
                        return a.name.formatted > b.name.formatted ? 1 : -1;
                    }
                    return (!__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](a.meritAddresses)) ? -1 : 1;
                });
            });
        });
    }
    add(entry, address, network) {
        return new __WEBPACK_IMPORTED_MODULE_1_bluebird__((resolve, reject) => {
            return this.getAddressbook(network).then((addressBook) => {
                if (addressBook[address])
                    return reject(new Error('contact already exists'));
                addressBook[address] = entry;
                return this.persistenceService.setAddressbook(network, addressBook).then(() => {
                    return resolve(addressBook);
                });
            });
        });
    }
    ;
    remove(addr, network) {
        return new __WEBPACK_IMPORTED_MODULE_1_bluebird__((resolve, reject) => {
            this.getAddressbook(network).then((addressBook) => {
                delete addressBook[addr];
                return this.persistenceService.setAddressbook(network, addressBook).then(() => {
                    return resolve(addressBook);
                });
            });
        });
    }
    ;
    removeAll(network) {
        return this.persistenceService.removeAddressbook(network).catch((err) => {
            return __WEBPACK_IMPORTED_MODULE_1_bluebird__["reject"](new Error('could not removeAll contacts: ' + err));
        });
    }
    ;
    getAddressbook(network) {
        return new __WEBPACK_IMPORTED_MODULE_1_bluebird__((resolve, reject) => {
            return this.persistenceService.getAddressbook(network).then((ab) => {
                if (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](ab))
                    ab = {};
                resolve(ab);
            });
        });
    }
};
AddressBookService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_merit_core_persistence_service__["a" /* PersistenceService */],
        __WEBPACK_IMPORTED_MODULE_5_merit_core_platform_service__["a" /* PlatformService */],
        __WEBPACK_IMPORTED_MODULE_8_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_contacts__["b" /* Contacts */],
        __WEBPACK_IMPORTED_MODULE_7_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_6_merit_shared_address_book_merit_contact_builder__["a" /* MeritContactBuilder */]])
], AddressBookService);

//# sourceMappingURL=address-book.service.js.map

/***/ }),

/***/ 805:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Contact; });
/* unused harmony export ContactName */
/* unused harmony export ContactField */
/* unused harmony export ContactAddress */
/* unused harmony export ContactOrganization */
/* unused harmony export ContactFindOptions */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Contacts; });
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
 * @hidden
 */
var Contact = (function () {
    function Contact() {
        if (Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["i" /* checkAvailability */])('navigator.contacts', 'create', 'Contacts') === true) {
            this._objectInstance = navigator.contacts.create();
        }
    }
    Contact.prototype.clone = function () {
        var newContact = new Contact();
        for (var prop in this) {
            if (prop === 'id')
                return;
            newContact[prop] = this[prop];
        }
        return newContact;
    };
    Contact.prototype.remove = function () { return; };
    Contact.prototype.save = function () {
        var _this = this;
        return Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["j" /* getPromise */])(function (resolve, reject) {
            _this._objectInstance.save(function (contact) {
                _this._objectInstance = contact;
                resolve(_this);
            }, reject);
        });
    };
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", String)
    ], Contact.prototype, "id", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", String)
    ], Contact.prototype, "displayName", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Object)
    ], Contact.prototype, "name", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", String)
    ], Contact.prototype, "nickname", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Array)
    ], Contact.prototype, "phoneNumbers", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Array)
    ], Contact.prototype, "emails", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Array)
    ], Contact.prototype, "addresses", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Array)
    ], Contact.prototype, "ims", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Array)
    ], Contact.prototype, "organizations", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Date)
    ], Contact.prototype, "birthday", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", String)
    ], Contact.prototype, "note", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Array)
    ], Contact.prototype, "photos", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Array)
    ], Contact.prototype, "categories", void 0);
    __decorate([
        __WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["f" /* InstanceProperty */],
        __metadata("design:type", Array)
    ], Contact.prototype, "urls", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["e" /* InstanceCheck */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Contact)
    ], Contact.prototype, "clone", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["c" /* CordovaInstance */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Contact.prototype, "remove", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["e" /* InstanceCheck */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Contact.prototype, "save", null);
    return Contact;
}());

/**
 * @hidden
 */
var ContactName = (function () {
    function ContactName(formatted, familyName, givenName, middleName, honorificPrefix, honorificSuffix) {
        this.formatted = formatted;
        this.familyName = familyName;
        this.givenName = givenName;
        this.middleName = middleName;
        this.honorificPrefix = honorificPrefix;
        this.honorificSuffix = honorificSuffix;
    }
    return ContactName;
}());

/**
 * @hidden
 */
var ContactField = (function () {
    function ContactField(type, value, pref) {
        this.type = type;
        this.value = value;
        this.pref = pref;
    }
    return ContactField;
}());

/**
 * @hidden
 */
var ContactAddress = (function () {
    function ContactAddress(pref, type, formatted, streetAddress, locality, region, postalCode, country) {
        this.pref = pref;
        this.type = type;
        this.formatted = formatted;
        this.streetAddress = streetAddress;
        this.locality = locality;
        this.region = region;
        this.postalCode = postalCode;
        this.country = country;
    }
    return ContactAddress;
}());

/**
 * @hidden
 */
var ContactOrganization = (function () {
    function ContactOrganization(type, name, department, title, pref) {
        this.type = type;
        this.name = name;
        this.department = department;
        this.title = title;
        this.pref = pref;
    }
    return ContactOrganization;
}());

/**
 * @hidden
 */
var ContactFindOptions = (function () {
    function ContactFindOptions(filter, multiple, desiredFields, hasPhoneNumber) {
        this.filter = filter;
        this.multiple = multiple;
        this.desiredFields = desiredFields;
        this.hasPhoneNumber = hasPhoneNumber;
    }
    return ContactFindOptions;
}());

/**
 * @name Contacts
 * @description
 * Access and manage Contacts on the device.
 *
 * @usage
 *
 * ```typescript
 * import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
 *
 * constructor(private contacts: Contacts) { }
 *
 * let contact: Contact = this.contacts.create();
 *
 * contact.name = new ContactName(null, 'Smith', 'John');
 * contact.phoneNumbers = [new ContactField('mobile', '6471234567')];
 * contact.save().then(
 *   () => console.log('Contact saved!', contact),
 *   (error: any) => console.error('Error saving contact.', error)
 * );
 *
 * ```
 * @classes
 * Contact
 * @interfaces
 * IContactProperties
 * IContactError
 * IContactName
 * IContactField
 * IContactAddress
 * IContactOrganization
 * IContactFindOptions
 */
var Contacts = (function (_super) {
    __extends(Contacts, _super);
    function Contacts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Create a single contact.
     * @returns {Contact} Returns a Contact object
     */
    Contacts.prototype.create = function () {
        return new Contact();
    };
    /**
     * Search for contacts in the Contacts list.
     * @param fields {ContactFieldType[]}  Contact fields to be used as a search qualifier
     * @param options {IContactFindOptions} Optional options for the query
     * @returns {Promise<Contact[]>} Returns a Promise that resolves with the search results (an array of Contact objects)
     */
    Contacts.prototype.find = function (fields, options) {
        return Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["j" /* getPromise */])(function (resolve, reject) {
            navigator.contacts.find(fields, function (contacts) {
                resolve(contacts.map(processContact));
            }, reject, options);
        });
    };
    /**
     * Select a single Contact.
     * @returns {Promise<Contact>} Returns a Promise that resolves with the selected Contact
     */
    Contacts.prototype.pickContact = function () {
        return Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["j" /* getPromise */])(function (resolve, reject) {
            navigator.contacts.pickContact(function (contact) { return resolve(processContact(contact)); }, reject);
        });
    };
    Contacts.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /** @nocollapse */
    Contacts.ctorParameters = function () { return []; };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["b" /* CordovaCheck */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Object]),
        __metadata("design:returntype", Promise)
    ], Contacts.prototype, "find", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["b" /* CordovaCheck */])(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Contacts.prototype, "pickContact", null);
    Contacts = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["h" /* Plugin */])({
            pluginName: 'Contacts',
            plugin: 'cordova-plugin-contacts',
            pluginRef: 'navigator.contacts',
            repo: 'https://github.com/apache/cordova-plugin-contacts',
            platforms: ['Android', 'BlackBerry 10', 'Firefox OS', 'iOS', 'Ubuntu', 'Windows', 'Windows Phone 8']
        })
    ], Contacts);
    return Contacts;
}(__WEBPACK_IMPORTED_MODULE_1__ionic_native_core__["g" /* IonicNativePlugin */]));

/**
 * @hidden
 */
function processContact(contact) {
    var newContact = new Contact();
    for (var prop in contact) {
        if (typeof contact[prop] === 'function')
            continue;
        newContact[prop] = contact[prop];
    }
    return newContact;
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 806:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeritContactBuilder; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_contacts__ = __webpack_require__(805);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_shared_address_book_merit_contact_model__ = __webpack_require__(809);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let MeritContactBuilder = class MeritContactBuilder {
    constructor(deviceContactsService) {
        this.deviceContactsService = deviceContactsService;
    }
    build(contact = {}) {
        let clone = val => val ? JSON.parse(JSON.stringify(val)) : null;
        let created = new __WEBPACK_IMPORTED_MODULE_2_merit_shared_address_book_merit_contact_model__["a" /* MeritContact */]();
        if (contact instanceof __WEBPACK_IMPORTED_MODULE_1__ionic_native_contacts__["a" /* Contact */]) {
            created.nativeModel = contact;
            created.id = contact.id;
        }
        else if (contact instanceof __WEBPACK_IMPORTED_MODULE_2_merit_shared_address_book_merit_contact_model__["a" /* MeritContact */]) {
            if (contact.nativeModel) {
                created.nativeModel = contact.nativeModel;
                created.id = contact.nativeModel.id;
            }
            else {
                created.id = contact.id || `merit-${new Date().getUTCMilliseconds()}`;
            }
        }
        else {
            let deviceContact = this.deviceContactsService.create();
            try {
                //the only way we can check that contact was created properly.
                // if cordova is not available, service returns object with non-working getters
                let check = deviceContact.name;
                created.nativeModel = deviceContact;
            }
            catch (e) {
                //we are in non-cordova environment, just leaving nativeModel empty
            }
        }
        created.name = clone(contact.name) || { formatted: '' };
        created.phoneNumbers = clone(contact.phoneNumbers) || [];
        created.emails = clone(contact.emails) || [];
        created.photos = clone(contact.photos) || [];
        if (contact['meritAddresses']) {
            created.meritAddresses = clone(contact['meritAddresses']) || [];
        }
        return created;
    }
};
MeritContactBuilder = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_native_contacts__["b" /* Contacts */]])
], MeritContactBuilder);

//# sourceMappingURL=merit-contact.builder.js.map

/***/ }),

/***/ 808:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GravatarModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_merit_shared_gravatar_component__ = __webpack_require__(811);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


// This module manaages the avatar/user-image of a user based on 
// email address.
let GravatarModule = class GravatarModule {
};
GravatarModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_1_merit_shared_gravatar_component__["a" /* GravatarComponent */]
        ],
        imports: [],
        exports: [
            __WEBPACK_IMPORTED_MODULE_1_merit_shared_gravatar_component__["a" /* GravatarComponent */]
        ]
    })
], GravatarModule);

//# sourceMappingURL=gravatar.module.js.map

/***/ }),

/***/ 809:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let Bitcore = __webpack_require__(45);
class MeritContact {
    constructor() {
        this.name = { formatted: '' };
        this.phoneNumbers = [];
        this.emails = [];
        this.photos = [];
        this.urls = [];
        this.meritAddresses = [];
    }
    isValid() {
        if (!this.name)
            return false;
        if (!this.meritAddresses.length)
            return false;
        let isValid = true;
        this.meritAddresses.forEach((address) => {
            if (!address.network) {
                isValid = false;
            }
            else {
                if (!Bitcore.Address.isValid(address.address))
                    isValid = false;
            }
        });
        return isValid;
    }
    formatAddress() {
        this.meritAddresses.forEach((val) => {
            if (val.address.indexOf('merit:') == 0)
                val.address = val.address.split(':')[1];
            try {
                val.network = Bitcore.Address.fromString(val.address).network.name;
                console.log('set network!', val.network);
            }
            catch (e) { }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MeritContact;

//# sourceMappingURL=merit-contact.model.js.map

/***/ }),

/***/ 810:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SendService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_merit_core_bwc_service__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_transact_rate_service__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_shared_config_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_bluebird__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/*
  Service to help manage sending merit to others.
*/
let SendService = class SendService {
    constructor(bwcService, rate, config, logger) {
        this.bwcService = bwcService;
        this.rate = rate;
        this.config = config;
        this.logger = logger;
        this.logger.info('Hello SendService');
        this.bitcore = this.bwcService.getBitcore();
    }
    isAddressValid(addr) {
        // First, let's check to be sure it's the right format.
        try {
            let address = this.bitcore.Address.fromString(addr);
            let network = address.network;
            if (this.bitcore.Address.isValid(address, network))
                // If it is, then let's be sure it's beaconed.
                return this.isAddressUnlocked(addr, network);
            return __WEBPACK_IMPORTED_MODULE_5_bluebird__["resolve"](false);
        }
        catch (_e) {
            return __WEBPACK_IMPORTED_MODULE_5_bluebird__["resolve"](false);
        }
    }
    isAddressUnlocked(addr, network) {
        return new __WEBPACK_IMPORTED_MODULE_5_bluebird__((resolve, reject) => {
            const walletClient = this.bwcService.getClient(null, {});
            walletClient.validateAddress(addr, network).then((result) => {
                if (!result) {
                    reject(new Error("Could not validateAddress"));
                }
                else {
                    const isAddressBeaconed = result.isValid && result.isBeaconed;
                    resolve(isAddressBeaconed);
                }
            });
        });
    }
};
SendService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_merit_core_bwc_service__["a" /* BwcService */],
        __WEBPACK_IMPORTED_MODULE_2_merit_transact_rate_service__["a" /* RateService */],
        __WEBPACK_IMPORTED_MODULE_3_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_logger__["a" /* Logger */]])
], SendService);

//# sourceMappingURL=send.service.js.map

/***/ }),

/***/ 811:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GravatarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ts_md5_dist_md5__ = __webpack_require__(812);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ts_md5_dist_md5___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ts_md5_dist_md5__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


// Used to display friendly images of people who use gravatar.
let GravatarComponent = class GravatarComponent {
    ngOnInit() {
        if (this.email) {
            this.emailHash = __WEBPACK_IMPORTED_MODULE_1_ts_md5_dist_md5__["Md5"].hashStr(this.email.toLowerCase() || '').toString();
        }
    }
};
GravatarComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'gravatar',
        inputs: ['name', 'height', 'width', 'email'],
        template: `
  <img  class="gravatar" [alt]="name" [height]="height"  [width]="width" 
  [src]="'https://secure.gravatar.com/avatar/'+emailHash+'.jpg?s='+width+'&d=mm'"> 
`
    })
], GravatarComponent);

//# sourceMappingURL=gravatar.component.js.map

/***/ }),

/***/ 812:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*

TypeScript Md5
==============

Based on work by
* Joseph Myers: http://www.myersdaily.org/joseph/javascript/md5-text.html
* André Cruz: https://github.com/satazor/SparkMD5
* Raymond Hill: https://github.com/gorhill/yamd5.js

Effectively a TypeScrypt re-write of Raymond Hill JS Library

The MIT License (MIT)

Copyright (C) 2014 Raymond Hill

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.



            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2015 André Cruz <amdfcruz@gmail.com>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.


*/
Object.defineProperty(exports, "__esModule", { value: true });
var Md5 = (function () {
    function Md5() {
        this._state = new Int32Array(4);
        this._buffer = new ArrayBuffer(68);
        this._buffer8 = new Uint8Array(this._buffer, 0, 68);
        this._buffer32 = new Uint32Array(this._buffer, 0, 17);
        this.start();
    }
    // One time hashing functions
    Md5.hashStr = function (str, raw) {
        if (raw === void 0) { raw = false; }
        return this.onePassHasher
            .start()
            .appendStr(str)
            .end(raw);
    };
    Md5.hashAsciiStr = function (str, raw) {
        if (raw === void 0) { raw = false; }
        return this.onePassHasher
            .start()
            .appendAsciiStr(str)
            .end(raw);
    };
    Md5._hex = function (x) {
        var hc = Md5.hexChars;
        var ho = Md5.hexOut;
        var n;
        var offset;
        var j;
        var i;
        for (i = 0; i < 4; i += 1) {
            offset = i * 8;
            n = x[i];
            for (j = 0; j < 8; j += 2) {
                ho[offset + 1 + j] = hc.charAt(n & 0x0F);
                n >>>= 4;
                ho[offset + 0 + j] = hc.charAt(n & 0x0F);
                n >>>= 4;
            }
        }
        return ho.join('');
    };
    Md5._md5cycle = function (x, k) {
        var a = x[0];
        var b = x[1];
        var c = x[2];
        var d = x[3];
        // ff()
        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        // gg()
        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        // hh()
        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        // ii()
        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
    };
    Md5.prototype.start = function () {
        this._dataLength = 0;
        this._bufferLength = 0;
        this._state.set(Md5.stateIdentity);
        return this;
    };
    // Char to code point to to array conversion:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
    // #Example.3A_Fixing_charCodeAt_to_handle_non-Basic-Multilingual-Plane_characters_if_their_presence_earlier_in_the_string_is_unknown
    Md5.prototype.appendStr = function (str) {
        var buf8 = this._buffer8;
        var buf32 = this._buffer32;
        var bufLen = this._bufferLength;
        var code;
        var i;
        for (i = 0; i < str.length; i += 1) {
            code = str.charCodeAt(i);
            if (code < 128) {
                buf8[bufLen++] = code;
            }
            else if (code < 0x800) {
                buf8[bufLen++] = (code >>> 6) + 0xC0;
                buf8[bufLen++] = code & 0x3F | 0x80;
            }
            else if (code < 0xD800 || code > 0xDBFF) {
                buf8[bufLen++] = (code >>> 12) + 0xE0;
                buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                buf8[bufLen++] = (code & 0x3F) | 0x80;
            }
            else {
                code = ((code - 0xD800) * 0x400) + (str.charCodeAt(++i) - 0xDC00) + 0x10000;
                if (code > 0x10FFFF) {
                    throw new Error('Unicode standard supports code points up to U+10FFFF');
                }
                buf8[bufLen++] = (code >>> 18) + 0xF0;
                buf8[bufLen++] = (code >>> 12 & 0x3F) | 0x80;
                buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                buf8[bufLen++] = (code & 0x3F) | 0x80;
            }
            if (bufLen >= 64) {
                this._dataLength += 64;
                Md5._md5cycle(this._state, buf32);
                bufLen -= 64;
                buf32[0] = buf32[16];
            }
        }
        this._bufferLength = bufLen;
        return this;
    };
    Md5.prototype.appendAsciiStr = function (str) {
        var buf8 = this._buffer8;
        var buf32 = this._buffer32;
        var bufLen = this._bufferLength;
        var i;
        var j = 0;
        for (;;) {
            i = Math.min(str.length - j, 64 - bufLen);
            while (i--) {
                buf8[bufLen++] = str.charCodeAt(j++);
            }
            if (bufLen < 64) {
                break;
            }
            this._dataLength += 64;
            Md5._md5cycle(this._state, buf32);
            bufLen = 0;
        }
        this._bufferLength = bufLen;
        return this;
    };
    Md5.prototype.appendByteArray = function (input) {
        var buf8 = this._buffer8;
        var buf32 = this._buffer32;
        var bufLen = this._bufferLength;
        var i;
        var j = 0;
        for (;;) {
            i = Math.min(input.length - j, 64 - bufLen);
            while (i--) {
                buf8[bufLen++] = input[j++];
            }
            if (bufLen < 64) {
                break;
            }
            this._dataLength += 64;
            Md5._md5cycle(this._state, buf32);
            bufLen = 0;
        }
        this._bufferLength = bufLen;
        return this;
    };
    Md5.prototype.getState = function () {
        var self = this;
        var s = self._state;
        return {
            buffer: String.fromCharCode.apply(null, self._buffer8),
            buflen: self._bufferLength,
            length: self._dataLength,
            state: [s[0], s[1], s[2], s[3]]
        };
    };
    Md5.prototype.setState = function (state) {
        var buf = state.buffer;
        var x = state.state;
        var s = this._state;
        var i;
        this._dataLength = state.length;
        this._bufferLength = state.buflen;
        s[0] = x[0];
        s[1] = x[1];
        s[2] = x[2];
        s[3] = x[3];
        for (i = 0; i < buf.length; i += 1) {
            this._buffer8[i] = buf.charCodeAt(i);
        }
    };
    Md5.prototype.end = function (raw) {
        if (raw === void 0) { raw = false; }
        var bufLen = this._bufferLength;
        var buf8 = this._buffer8;
        var buf32 = this._buffer32;
        var i = (bufLen >> 2) + 1;
        var dataBitsLen;
        this._dataLength += bufLen;
        buf8[bufLen] = 0x80;
        buf8[bufLen + 1] = buf8[bufLen + 2] = buf8[bufLen + 3] = 0;
        buf32.set(Md5.buffer32Identity.subarray(i), i);
        if (bufLen > 55) {
            Md5._md5cycle(this._state, buf32);
            buf32.set(Md5.buffer32Identity);
        }
        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        dataBitsLen = this._dataLength * 8;
        if (dataBitsLen <= 0xFFFFFFFF) {
            buf32[14] = dataBitsLen;
        }
        else {
            var matches = dataBitsLen.toString(16).match(/(.*?)(.{0,8})$/);
            if (matches === null) {
                return;
            }
            var lo = parseInt(matches[2], 16);
            var hi = parseInt(matches[1], 16) || 0;
            buf32[14] = lo;
            buf32[15] = hi;
        }
        Md5._md5cycle(this._state, buf32);
        return raw ? this._state : Md5._hex(this._state);
    };
    // Private Static Variables
    Md5.stateIdentity = new Int32Array([1732584193, -271733879, -1732584194, 271733878]);
    Md5.buffer32Identity = new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    Md5.hexChars = '0123456789abcdef';
    Md5.hexOut = [];
    // Permanent instance is to use for one-call hashing
    Md5.onePassHasher = new Md5();
    return Md5;
}());
exports.Md5 = Md5;
if (Md5.hashStr('hello') !== '5d41402abc4b2a76b9719d911017c592') {
    console.error('Md5 self test failed.');
}
//# sourceMappingURL=md5.js.map

/***/ }),

/***/ 813:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeritContactService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_shared_address_book_address_book_service__ = __webpack_require__(804);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_bwc_service__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_logger__ = __webpack_require__(13);
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
 * Creates MeritContact model and injects native contact in it
 */
let MeritContactService = class MeritContactService {
    constructor(addressBookService, bwcService, logger) {
        this.addressBookService = addressBookService;
        this.bwcService = bwcService;
        this.logger = logger;
        this.bitcore = bwcService.getBitcore();
    }
    updateModel(contact) {
        contact.nativeModel.name = contact.name;
        contact.nativeModel.emails = contact.emails;
        contact.nativeModel.phoneNumbers = contact.phoneNumbers;
        contact.nativeModel.urls = contact.urls;
    }
    add(contact) {
        if (!contact.isValid()) {
            return __WEBPACK_IMPORTED_MODULE_0_bluebird__["reject"]('Contact is not valid');
        }
        let address = contact.meritAddresses[0].address;
        let network = contact.meritAddresses[0].network;
        return this.addressBookService.add(contact, address, network);
    }
    edit(contact) {
        if (!contact.isValid()) {
            return __WEBPACK_IMPORTED_MODULE_0_bluebird__["reject"]('Contact is not valid');
        }
        let address = contact.meritAddresses[0].address;
        let network = contact.meritAddresses[0].network;
        return this.addressBookService.remove(address, network).then(() => {
            this.updateModel(contact);
            return this.addressBookService.add(contact, address, network);
        });
    }
    remove(contact) {
        let address = contact.meritAddresses[0].address;
        let network = contact.meritAddresses[0].network;
        return this.addressBookService.remove(address, network);
    }
};
MeritContactService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_merit_shared_address_book_address_book_service__["a" /* AddressBookService */],
        __WEBPACK_IMPORTED_MODULE_3_merit_core_bwc_service__["a" /* BwcService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_logger__["a" /* Logger */]])
], MeritContactService);

//# sourceMappingURL=merit-contact.service.js.map

/***/ }),

/***/ 816:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddressBookView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_shared_address_book_address_book_service__ = __webpack_require__(804);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_merit_core_logger__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__ = __webpack_require__(67);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






let AddressBookView = class AddressBookView {
    constructor(navCtrl, navParams, addressBookService, logger, sanitizer) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.addressBookService = addressBookService;
        this.logger = logger;
        this.sanitizer = sanitizer;
        this.contacts = [];
        this.filteredContacts = [];
        this.renderingContacts = [];
        this.searchQuery = '';
        this.contactsOffset = 0;
        this.contactsLimit = 10;
    }
    ionViewWillEnter() {
        this.loading = true;
        this.updateContacts().then(() => {
            this.loading = false;
        });
    }
    updateContacts() {
        this.contactsOffset = 0;
        return this.addressBookService.getAllMeritContacts().then((contacts) => {
            this.contacts = contacts;
            this.filterContacts();
        });
    }
    filterContacts() {
        this.contactsOffset = 0;
        this.filteredContacts = this.addressBookService.searchContacts(this.contacts, this.searchQuery);
        this.renderingContacts = this.filteredContacts.slice(0, this.contactsLimit);
    }
    renderMoreContacts(infiniteScroll) {
        this.contactsOffset += this.contactsLimit;
        this.renderingContacts = this.renderingContacts.concat(this.filteredContacts.slice(this.contactsOffset, this.contactsOffset + this.contactsLimit));
        infiniteScroll.complete();
    }
    sanitizePhotoUrl(url) {
        return this.sanitizer.sanitize(__WEBPACK_IMPORTED_MODULE_1__angular_core__["SecurityContext"].URL, url);
    }
    doRefresh(refresher) {
        this.updateContacts().then(() => {
            refresher.complete();
        });
    }
    hasContacts() {
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](this.contacts);
    }
    toAddContact() {
        this.navCtrl.push('EditContactView');
    }
    toContact(contact) {
        this.navCtrl.push('ContactView', { contact: contact });
    }
};
AddressBookView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
        selector: 'addressbook-view',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/shared/address-book/address-book.html"*/'<ion-header>\n\n    <ion-navbar color="secondary">\n        <ion-title translate>Address Book</ion-title>\n\n        <ion-buttons end>\n            <button ion-button (click)="toAddContact()" translate>\n                <ion-icon name="add"></ion-icon>\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n    <ion-refresher (ionRefresh)="doRefresh($event)"></ion-refresher>\n\n    <ion-searchbar\n            [(ngModel)]="searchQuery"\n            [showCancelButton]="shouldShowCancel"\n            (ionChange)="filterContacts()"\n            debounce="300">\n    </ion-searchbar>\n\n    <div *ngIf="loading" text-center>\n        <ion-spinner></ion-spinner>Loading contacts...\n    </div>\n\n    <ion-list *ngIf="!loading">\n        <ion-item *ngFor="let contact of renderingContacts" (click)="toContact(contact)">\n            <ion-avatar class="icon big-icon-svg" item-start>\n                <img [src]="sanitizePhotoUrl(contact.photos[0].value)" *ngIf="contact.photos.length">\n                <gravatar class="send-gravatar" [name]="contact.name.formatted" width="30" height="30" [email]="contact.emails[0]?.value || \'\'" *ngIf="!contact.photos.length"></gravatar>\n            </ion-avatar>\n            {{contact.name.formatted}}\n            <img item-right src="assets/img/16x16.png" *ngIf="contact.meritAddresses.length">\n        </ion-item>\n\n    </ion-list>\n\n    <ion-infinite-scroll (ionInfinite)="renderMoreContacts($event)" *ngIf="filteredContacts && filteredContacts.length > contactsOffset+contactsLimit">\n    </ion-infinite-scroll>\n\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/shared/address-book/address-book.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_3_merit_shared_address_book_address_book_service__["a" /* AddressBookService */],
        __WEBPACK_IMPORTED_MODULE_4_merit_core_logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__["c" /* DomSanitizer */]])
], AddressBookView);

//# sourceMappingURL=address-book.js.map

/***/ }),

/***/ 861:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContactView; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_merit_shared_address_book_address_book_service__ = __webpack_require__(804);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_merit_core_profile_service__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__ = __webpack_require__(67);
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






let ContactView = class ContactView {
    constructor(navCtrl, navParams, addressBookService, alertCtrl, configService, profileService, sanitizer) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.addressBookService = addressBookService;
        this.alertCtrl = alertCtrl;
        this.configService = configService;
        this.profileService = profileService;
        this.sanitizer = sanitizer;
        this.contact = this.navParams.get('contact');
    }
    ionViewDidLoad() {
        this.getWallets();
    }
    getWallets() {
        if (this.wallets) {
            return Promise.resolve(this.wallets);
        }
        else {
            return new Promise((resolve, reject) => {
                return this.profileService.getWallets().then((wallets) => {
                    this.wallets = wallets;
                    return resolve(wallets);
                });
            });
        }
    }
    remove() {
        this.alertCtrl.create({
            title: 'Remove contact',
            message: 'Are you sure want to delete contact?',
            buttons: [
                { text: 'Cancel', role: 'cancel', handler: () => { } },
                { text: 'Ok', handler: (data) => {
                        this.addressBookService.remove(this.contact.meritAddress, this.configService.getDefaults().network.name).then(() => {
                            this.navCtrl.pop();
                        });
                    }
                }
            ]
        }).present();
    }
    toSendAmount() {
        this.getWallets().then((wallets) => {
            this.navCtrl.push('SendAmountView', {
                sending: true,
                contact: this.contact
            });
        });
    }
    toEditContact() {
        this.navCtrl.push('EditContactView', { contact: this.contact });
    }
    sanitizePhotoUrl(url) {
        return this.sanitizer.sanitize(__WEBPACK_IMPORTED_MODULE_0__angular_core__["SecurityContext"].URL, url);
    }
};
ContactView = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'view-contact',template:/*ion-inline-start:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/shared/address-book/contact/contact.html"*/'<ion-header no-border transparent>\n\n    <ion-navbar color="secondary" transparent>\n        <ion-title></ion-title>\n        <ion-buttons end>\n            <button ion-button icon-only (click)="toEditContact()">\n                <ion-icon name="settings"></ion-icon>\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n\n</ion-header>\n\n<ion-content fullscreen>\n\n    <div class="contact-header">\n        <!--<img [src]="sanitizePhotoUrl(contact.photos[0].value)" *ngIf="contact.photos.length">-->\n        <h4 class="name">{{contact.name.formatted}}</h4>\n    </div>\n\n    <ion-list style="position: relative">\n        <ion-fab top right edge (click)="toSendAmount()">\n            <button ion-fab color="primary"><ion-icon name="send"></ion-icon></button>\n        </ion-fab>\n        <ion-item  *ngIf="contact.meritAddresses.length">\n            <ion-label stacked>Merit Address</ion-label>\n            <ion-label>{{contact.meritAddresses[0].address}}</ion-label>\n        </ion-item>\n        <ion-item  *ngFor="let email of contact.emails">\n            <ion-label stacked>Email</ion-label>\n            <ion-label>{{email.value}}</ion-label>\n        </ion-item>\n        <ion-item *ngFor="let phoneNumber of contact.phoneNumbers">\n            <ion-label stacked>Phone</ion-label>\n            <ion-label>{{phoneNumber.value}}</ion-label>\n        </ion-item>\n    </ion-list>\n\n\n</ion-content>\n'/*ion-inline-end:"/Users/adilwali/Development/src/github.com/meritlabs/lightwallet-stack/packages/lw-2/src/app/shared/address-book/contact/contact.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2_merit_shared_address_book_address_book_service__["a" /* AddressBookService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_5_merit_shared_config_service__["a" /* ConfigService */],
        __WEBPACK_IMPORTED_MODULE_3_merit_core_profile_service__["a" /* ProfileService */],
        __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__["c" /* DomSanitizer */]])
], ContactView);

//# sourceMappingURL=contact.js.map

/***/ })

});
//# sourceMappingURL=8.js.map