import { Pipe, PipeTransform } from '@angular/core';
import { concat } from 'rxjs/operators';

@Pipe({name: 'unescape'})
export class UnescapePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    var unescapedStr = decodeURIComponent(value); //Belt-and-suspenders check for an "@" at the beginning of the alias
    if (unescapedStr.length > 0) {
      if (unescapedStr.charAt(0) != ("@")) {
        unescapedStr = "@".concat(unescapedStr);
      } 
    }
    return unescapedStr;
  }

}