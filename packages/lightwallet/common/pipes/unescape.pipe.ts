import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'unescape' })
export class UnescapePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const unescapedStr = decodeURIComponent(value); //Belt-and-suspenders check for an "@" at the beginning of the alias
    if (unescapedStr.length > 0 && unescapedStr.charAt(0) != '@') {
      return '@'.concat(unescapedStr);
    }
    return unescapedStr;
  }
}
