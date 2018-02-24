import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'rxjs/add/observable/defer';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/zip';

import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
