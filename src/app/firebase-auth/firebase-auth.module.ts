import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FirebaseAuthRoutingModule } from './firebase-auth-routing.module';
import { FirebaseAuthComponent } from './firebase-auth.component';
import { NgxLoadingModule } from 'ngx-loading';
import { SharedModule } from '../shared/shared.module';
import { SocialSignInComponent } from '../shared/components/auth/social-sign-in/social-sign-in.component';

@NgModule({
  declarations: [
    FirebaseAuthComponent,
  ],
  imports: [
    CommonModule,
    FirebaseAuthRoutingModule,
    NgxLoadingModule,
    SharedModule,
    SocialSignInComponent,
  ]
})
export class FirebaseAuthModule { }
