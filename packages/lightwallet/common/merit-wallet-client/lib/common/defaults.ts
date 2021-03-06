export namespace Defaults {
  export const DEFAULT_FEE_PER_KB: number = 10000;
  export const MIN_FEE_PER_KB: number = 0;
  export const MAX_FEE_PER_KB: number = 1000000;
  export const MAX_TX_FEE: number = 1 * 1e8;
  export const MAX_TX_FEE_PERCENT = 0.00001;

  export const adjustableMaxFee = function(value: number): number {
    const percents = value * Defaults.MAX_TX_FEE_PERCENT;
    return percents > Defaults.MAX_TX_FEE ? percents : Defaults.MAX_TX_FEE;
  };
}
