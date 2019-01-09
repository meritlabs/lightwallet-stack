import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-checkbox',
  template: `
<span class="switcher"></span>
  `,
  styleUrls: ['./ui-checkbox.component.sass'],
  host: {
    '(click)': 'onClick()',
    '[class.checked]': 'value',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => UICheckboxComponent),
    },
  ],
})
export class UICheckboxComponent implements ControlValueAccessor {
  value: boolean;
  onChange: Function = () => {};
  onTouched: Function = () => {};

  writeValue(val: boolean) {
    this.onChange((this.value = Boolean(val)));
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  onClick() {
    this.writeValue(!this.value);
  }
}
