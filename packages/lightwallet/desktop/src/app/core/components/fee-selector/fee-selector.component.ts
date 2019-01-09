import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'fee-selector',
  template: `<div (click)="onClick(false)" [class.selected]="!value">Me</div><div (click)="onClick(true)" [class.selected]="value">Recipient</div>`,
  styleUrls: ['./fee-selector.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => FeeSelectorComponent),
    },
  ],
})
export class FeeSelectorComponent implements ControlValueAccessor {
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

  onClick(value: boolean) {
    this.writeValue(value);
  }
}
