import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { HistoryComponent } from './components/history/history.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SpeakerComponent } from './components/speaker/speaker.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { SpeakerInviteComponent } from './components/speaker/speaker-invite/speaker-invite.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SharedModule } from '../shared/shared.module';
import { SpeakerPriceComponent } from './components/speaker/speaker-price/speaker-price.component';
import { SubscriptionManagementComponent } from './components/subscription-management/subscription-management.component';
import { DialogModule } from '../dialog/dialog.module';
const modules = [MatButtonToggleModule,MatSnackBarModule]

@NgModule({
  declarations: [
    AccountComponent,
    ProfileComponent,
    HistoryComponent,
    SpeakerComponent,
    SpeakerInviteComponent,
    SpeakerPriceComponent,
    SubscriptionManagementComponent,

  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    DialogModule,
  ].concat(modules)
})
export class AccountModule { }
