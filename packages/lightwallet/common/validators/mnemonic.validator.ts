import { AbstractControl, ValidationErrors } from '@angular/forms';
import { hasValidEntropy, hasValidWords, isValidSize } from '@merit/common/utils/mnemonic';

export class MnemonicValidator {
  static validateMnemonicImport(control: AbstractControl): ValidationErrors | null {
    const words = control.value;

    if (!isValidSize(words))
      return {
        InvalidSize: true
      };

    if (!hasValidWords(words))
      return {
        InvalidWords: true
      };

    return null;
  }

  static validateMnemonicEntropy(control: AbstractControl): ValidationErrors | null {
    const words = control.value;

    if (!hasValidEntropy(words))
      return {
        InvalidEntropy: true
      };

    return null;
  }
}
