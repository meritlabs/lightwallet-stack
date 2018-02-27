import { Injectable } from '@angular/core';

@Injectable()
export class PopupService {
  alert(...args): any {}
  confirm(...args): any {}
  prompt(...args): any {}
}
