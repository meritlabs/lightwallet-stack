import { Observable } from 'rxjs/Observable';
import { filter, take } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';

export const getLatestValue = (obs: Observable<any>, filterFn?: (val: any) => boolean) => {
  const args: any[] = [
    take(1)
  ];

  if (filterFn) {
    args.push(filter(filterFn));
  }

  return obs.pipe.apply(obs, args).toPromise();
};
