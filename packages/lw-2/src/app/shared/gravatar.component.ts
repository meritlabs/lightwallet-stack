import { Component, Input } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';

// Used to display friendly images of people who use gravatar.
@Component({ 
  selector: 'gravatar', 
  inputs: ['name', 'height', 'width', 'email'],
  template: `
  <img  class="gravatar" [alt]="name" [height]="height"  [width]="width" 
  [src]="'https://secure.gravatar.com/avatar/'+emailHash+'.jpg?s='+width+'&d=mm'"> 
`
 })
export class GravatarComponent {
    public name: string;
    public height: string; 
    public width: string;
    public email: string;
    public emailHash: string;

    ngOnInit() {
      if(this.email) {
        this.emailHash = Md5.hashStr(this.email.toLowerCase() || '').toString();
      }
    }

}
