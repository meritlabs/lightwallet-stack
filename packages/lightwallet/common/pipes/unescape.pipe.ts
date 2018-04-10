import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'unescape'})
export class UnescapePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return decodeURI(value);
  }

}