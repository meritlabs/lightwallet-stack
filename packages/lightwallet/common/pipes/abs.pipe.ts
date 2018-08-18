import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abs'
})
export class AbsPipe implements PipeTransform {
  transform(value: string | number) {
    const num = Number(value);

    if (isNaN(num)) {
      return '0';
    }

    return Math.abs(num).toString();
  }
}
