import { NgModule } from '@angular/core';
import { GravatarComponent } from 'merit/shared/gravatar.component';

// This module manaages the avatar/user-image of a user based on 
// email address.
@NgModule({
  declarations: [
    GravatarComponent
  ],
  imports: [
  ],
  exports: [
    GravatarComponent
  ]
})
export class GravatarModule {}