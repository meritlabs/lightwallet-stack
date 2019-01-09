import { ModalOptions } from 'ionic-angular';
import { ENV } from '@app/env';

export const MERIT_MODAL_OPTS: ModalOptions = {
  leaveAnimation: 'modal-slide-out',
  enterAnimation: 'modal-slide-in',
  cssClass: 'merit-modal',
};

export const COINBASE_CONFIRMATION_THRESHOLD = ENV.network == 'testnet' ? 6 : 100;

export const DEFAULT_WALLET_COLOR: string = '#00B0DD'; // primary color

export const UNITS = {
  mrt: {
    toMicros: 100000000,
    full: {
      maxDecimals: 8,
      minDecimals: 8,
    },
    short: {
      maxDecimals: 6,
      minDecimals: 2,
    },
  },
  bit: {
    toMicros: 100,
    full: {
      maxDecimals: 2,
      minDecimals: 2,
    },
    short: {
      maxDecimals: 0,
      minDecimals: 0,
    },
  },
};
