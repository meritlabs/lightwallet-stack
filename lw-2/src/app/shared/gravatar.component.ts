import { Component, ElementRef, Input } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';

@Component({ 
  selector: '[gravatar]', 
  inputs: ['name', 'height', 'width', 'email'],
  template: `
  <img class="gravatar" alt="{{ name }}" height="{{ height }}"  width="{{ width }}" src="https://secure.gravatar.com/avatar/{{ emailHash }}.jpg?s={{ width }}&d=mm">
`
 })
export class GravatarComponent {
    name: string;
    height: string; 
    width: string;
    email: string;
    emailHash: string;

    constructor(
      el: ElementRef
    ) {
      this.emailHash = Md5.createHash(this.email.toLowerCase() || '');
    }

}
