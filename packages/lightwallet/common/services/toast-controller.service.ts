import { Injectable } from '@angular/core';

export interface IMeritToastConfig {
  position?: 'top' | 'bottom';
  cssClass?: string;
  title?: string;
  message: string;
  duration?: number;
  showCloseButton?: boolean;
}

@Injectable()
export class ToastControllerService {
  create(opts: IMeritToastConfig): any {}
  createSticky(opts: IMeritToastConfig): any {}
  success(message: string): any {}
  message(message: string): any {}
  error(message: string): any {}
}
