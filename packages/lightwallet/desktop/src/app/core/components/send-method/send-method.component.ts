import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SendMethodType } from '@merit/common/models/send-method';

@Component({
  selector: 'send-method',
  templateUrl: './send-method.component.html',
  styleUrls: ['./send-method.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SendMethodComponent),
    },
  ],
})
export class SendMethodComponent implements ControlValueAccessor {
  value: SendMethodType;
  onChange: Function = () => {};
  onTouched: Function = () => {};

  @Input()
  invite: boolean;

  writeValue(val: SendMethodType) {
    this.onChange((this.value = val));
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  onClick(value: string) {
    this.writeValue(value as SendMethodType);
  }
}
