import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Logger } from 'merit/core/logger';

import { Promise } from 'bluebird';

import * as _ from 'lodash';

@Injectable()
export class RateService {

  private _rates: Object;
  private _alternatives: Array<any>;
  private _ratesBCH: Object;
  private SAT_TO_BTC: any;
  private BTC_TO_SAT: any;
  private _isAvailable: boolean = false;

  private rateServiceUrl = 'https://bitpay.com/api/rates';
  
  constructor(
    public http: Http,
    private logger: Logger    
  ) {
    console.log('Hello RateService Service');
    this._rates = {};
    this._alternatives = [];
    this.SAT_TO_BTC = 1 / 1e8;
    this.BTC_TO_SAT = 1e8;
    this.updateRates();
  }

  updateRates(): Promise<any> {
    return new Promise ((resolve, reject) => {
      let self = this;
      return this.getBTC().then((dataBTC) => {
        if (_.isEmpty(dataBTC)) {
          this.logger.warn("Could not update rates from rate Service");
          resolve();
          //reject(new Error("Could not get conversion rate."))
        } else {
          _.each(dataBTC, (currency) => {
            self._rates[currency.code] = currency.rate;
            self._alternatives.push({
              name: currency.name,
              isoCode: currency.code,
              rate: currency.rate
            });
          });
          resolve();
        }
      })
      .catch((errorBTC) => {
        console.log("JUICED ERROR: ", errorBTC);
        resolve();
        //reject(errorBTC);
      });
    });
  }

  getBTC(): Promise<any> {
    return this.http.get(this.rateServiceUrl)
      .map((response) => response.json())
      .toPromise();
      
  }

  getRate(code) {
      return this._rates[code];
  };
  
  getAlternatives() {
    return this._alternatives;
  };
  
  toFiat(satoshis, code) {
    return satoshis * this.SAT_TO_BTC * this.getRate(code);
  };

  fromFiat(amount, code) {
    return amount / this.getRate(code) * this.BTC_TO_SAT;
  };

  listAlternatives(sort: boolean) {
    var self = this;
  
    var alternatives = _.map(this.getAlternatives(), (item) => {
      return {
        name: item.name,
        isoCode: item.isoCode
      }
    });
    if (sort) {
      alternatives.sort( (a, b) => {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      });
    }
    return _.uniqBy(alternatives, 'isoCode');
  };

  //TODO IMPROVE WHEN AVAILABLE
  public whenAvailable(): Promise<any> { 
    return new Promise((resolve, reject)=> {
      if (this._isAvailable) {
        return resolve();
      } else {
       return this.updateRates().then(()=>{
          resolve();
        }).catch((err) => {
          this.logger.warn("Could not update rates: " + err);
          //reject(err);
        });
      }
    });

  }

}
