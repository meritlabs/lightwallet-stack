import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { filter, take } from 'rxjs/operators';

export const getLatestValue = (obs: Observable<any>, filterFn?: (val: any) => boolean) => {
  const args: any[] = [];

  if (filterFn) {
    args.push(filter(filterFn));
  }

  args.push(take(1));

  return obs.pipe.apply(obs, args).toPromise();
};

export const getLatestDefinedValue = (obs: Observable<any>) =>
  getLatestValue(obs, val => typeof val !== 'undefined' && val !== null);
