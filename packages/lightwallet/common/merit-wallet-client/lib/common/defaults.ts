export module Defaults {

  export const DEFAULT_FEE_PER_KB:number = 10000;
  export const MIN_FEE_PER_KB:number = 0;
  export const MAX_FEE_PER_KB:number = 1000000;
  export const MAX_TX_FEE:number = 1 * 1e8;
  export const MAX_TX_FEE_PERCENT = 0.0001;

  export const adjustableMaxFee = function(value) {
    return value * Defaults.MAX_TX_FEE_PERCENT;
  }

};