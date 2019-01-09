import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MeritContact } from '@merit/common/models/merit-contact';
import { getContactInitials } from '@merit/common/utils/contacts';

@Component({
  selector: 'contact-avatar',
  template: `
    <ion-avatar [attr.img-icon]="!imageSrc && !contactInitials ? true : null">
      <img *ngIf="!imageSrc && !contactInitials" [src]="fallback" alt=""/>
      <img *ngIf="imageSrc" [src]="imageSrc">
      <span *ngIf="contactInitials" color="primary">{{ contactInitials }}</span>
    </ion-avatar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactAvatarComponent {
  @Input()
  set contact(contact: MeritContact) {
    if (!contact) return;
    if (contact.photos && contact.photos.length) {
      this.imageSrc = this._sanitizer.bypassSecurityTrustUrl(contact.photos[0].value);
    } else {
      this.contactInitials = getContactInitials(contact);
    }
  }

  @Input()
  fallback: string = 'assets/img/icons/merit.svg';

  imageSrc: any;
  contactInitials: string;

  constructor(private _sanitizer: DomSanitizer) {}
}
