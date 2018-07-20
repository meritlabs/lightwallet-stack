import { Component, OnInit } from '@angular/core';
import { ENV } from '@app/env';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-invite-application',
  templateUrl: './invite-application.component.html',
  styleUrls: ['./invite-application.component.sass'],
})
export class InviteApplicationComponent {
  applicationUrl: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.applicationUrl = this.sanitizer.bypassSecurityTrustResourceUrl(ENV.discordBotApplication);
  }
}
