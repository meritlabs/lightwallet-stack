import { Component, ViewEncapsulation } from '@angular/core';
import { ProfileService } from '@merit/common/services/profile.service';

@Component({
  selector: 'merit-lw',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  constructor(private profileService: ProfileService) {}

  async ngOnInit() {
    await this.profileService.getProfile();
  }

}
