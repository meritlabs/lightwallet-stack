import { Injectable } from '@angular/core';
import { Promise } from 'bluebird';
import * as _ from 'lodash';

import { Logger } from 'merit/core/logger';
import { BwcService } from 'merit/core/bwc.service';
import { BwcError } from 'merit/core/bwc-error.model';
import { PersistenceService } from 'merit/core/persistence.service';

import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';

declare var navigator:any;

/**
 * This service looks up entered addresses against the address book.
 */
@Injectable()
export class AddressBookService {
  private bitcore: any;
  
  constructor(
    private logger: Logger,
    private bwcService: BwcService,
    private bwcErrorService: BwcError,
    private persistenceService: PersistenceService,
    private contacts:Contacts
  ) {
    this.bitcore = this.bwcService.getBitcore();

    // this.getAllDeviceContacts().catch(err => {
      // this.logger.warn(err); 
    // })

  }

  get = function(addr, cb) {
    this.persistenceService.getAddressbook('testnet', function(err, ab) {
      if (err) return cb(err);
      if (ab) ab = JSON.parse(ab);
      if (ab && ab[addr]) return cb(null, ab[addr]);

      this.persistenceService.getAddressbook('livenet', function(err, ab) {
        if (err) return cb(err);
        if (ab) ab = JSON.parse(ab);
        if (ab && ab[addr]) return cb(null, ab[addr]);
        return cb();
      });
    });
  };

  list = function(cb) {
    this.persistenceService.getAddressbook('testnet', function(err, ab) {
      if (err) return cb('Could not get the Addressbook');

      if (ab) ab = JSON.parse(ab);

      ab = ab || {};
      this.persistenceService.getAddressbook('livenet', function(err, ab2) {
        if (ab2) ab2 = JSON.parse(ab2);

        ab2 = ab2 || {};
        return cb(err, _.defaults(ab2, ab));
      });
    });
  };

  searchContacts = function(term, cb) {
    var contacts = navigator ? navigator.contacts : null;
    var options = {filter: term};
    var fields = ['name', 'phoneNumbers', 'emails'];

    if (contacts) {
      return contacts.find(fields, cb, function() { cb([]); }, options);
    }
    return cb();
  };

  // _getAllDeviceContacts = function(cb) {
    // return this.searchContacts('', cb);
  // };

  public getAllDeviceContacts():Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      this.contacts.find(['displayName', 'name', 'phoneNumbers', 'emails'], {filter: "", multiple: true}).then((contacts) => {
        return resolve(contacts);
      }).catch((err) => {
        this.logger.warn(err);
        return resolve([]); 
      })
    }) 
  }

  add = function(entry, cb) {
    var network = (new this.bitcore.Address(entry.address)).network.name;
    this.persistenceService.getAddressbook(network, function(err, ab) {
      if (err) return cb(err);
      if (ab) ab = JSON.parse(ab);
      ab = ab || {};
      if (_.isArray(ab)) ab = {}; // No array
      if (ab[entry.address]) return cb('Entry already exist');
      ab[entry.address] = entry;
      this.persistenceService.setAddressbook(network, JSON.stringify(ab), function(err, ab) {
        if (err) return cb('Error adding new entry');
        this.list(function(err, ab) {
          return cb(err, ab);
        });
      });
    });
  };

  remove = function(addr, cb) {
    var network = (new this.bitcore.Address(addr)).network.name;
    this.persistenceService.getAddressbook(network, function(err, ab) {
      if (err) return cb(err);
      if (ab) ab = JSON.parse(ab);
      ab = ab || {};
      if (_.isEmpty(ab)) return cb('Addressbook is empty');
      if (!ab[addr]) return cb('Entry does not exist');
      delete ab[addr];
      this.persistenceService.setAddressbook(network, JSON.stringify(ab), function(err) {
        if (err) return cb('Error deleting entry');
        this.list(function(err, ab) {
          return cb(err, ab);
        });
      });
    });
  };

  removeAll = function(cb) {
    this.persistenceService.removeAddressbook('livenet', function(err) {
      this.persistenceService.removeAddressbook('testnet', function(err) {
        if (err) return cb('Error deleting addressbook');
        return cb();
      });
    });
  };

}