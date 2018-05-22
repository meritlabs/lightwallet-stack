import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@Component({
  selector: 'wallet-selector',
  templateUrl: './wallet-selector.component.html',
  styleUrls: ['./wallet-selector.component.sass'],
  host: {
    '[class.disabled]': 'wallets.length === 0'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => WalletSelectorComponent)
    }
  ]
})
export class WalletSelectorComponent implements ControlValueAccessor {
  value: boolean;
  onChange: Function = () => {};
  onTouched: Function = () => {};

  @Input() wallets: DisplayWallet[];
  show: boolean;

  writeValue(val: boolean) {
    this.onChange(this.value = Boolean(val));
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  select(value: boolean) {
    this.show = false;
    this.writeValue(value);
  }

  onBlur() {
    setTimeout(() => {
      this.show = false;
    }, 200);
  }
}
