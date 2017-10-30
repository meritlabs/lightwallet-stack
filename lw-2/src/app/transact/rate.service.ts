import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
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
  private bchRateServiceUrl = 'https://api.kraken.com/0/public/Ticker?pair=BCHUSD,BCHEUR';
  
  constructor(public http: Http) {
    console.log('Hello RateService Service');
    this._rates = {};
    this._alternatives = [];
    this._ratesBCH = {};
    this.SAT_TO_BTC = 1 / 1e8;
    this.BTC_TO_SAT = 1e8;
    this.updateRates();
  }

  updateRates(): Promise<any> {
    return new Promise ((resolve, reject) => {
      let self = this;
      this.getBTC().then((dataBTC) => {

        _.each(dataBTC, (currency) => {
          self._rates[currency.code] = currency.rate;
          self._alternatives.push({
            name: currency.name,
            isoCode: currency.code,
            rate: currency.rate
          });
        });

        this.getBCH().then((dataBCH) => {

          _.each(dataBCH.result, (data, paircode) => {
            var code = paircode.substr(3,3);
            var rate =data.c[0];
            self._ratesBCH[code] = rate;
          });

          this._isAvailable = true;
          resolve();
        })
        .catch((errorBCH) => {
          console.log("Error: ", errorBCH);
          reject(errorBCH);
        });
      })
      .catch((errorBTC) => {
        console.log("Error: ", errorBTC);
        reject(errorBTC);
      });
    });
  }

  getBTC(): Promise<any> {
    return this.http.get(this.rateServiceUrl)
      .map((response) => response.json())
      .toPromise()
      .catch((error) => console.log("Error", error));
  }

  getBCH(): Promise<any> {
    return this.http.get(this.bchRateServiceUrl)
      .map((response) => response.json())
      .toPromise()
      .catch((error) => console.log("Error", error));
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
  whenAvailable() { 
    return new Promise((resolve, reject)=> {
      if (this._isAvailable) resolve();
      else {
       this.updateRates().then(()=>{
          resolve();
        });
      }
    });

  }

}
