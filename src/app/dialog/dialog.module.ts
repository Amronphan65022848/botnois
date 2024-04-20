import { NgModule } from '@angular/core';

import { DialogRoutingModule } from './dialog-routing.module';
import { DialogComponent } from './dialog.component';

import { RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { AleartSuccessComponent } from './components/aleart-success/aleart-success.component';
import { DialogDeleteRowComponent } from './components/dialog-delete-row/dialog-delete-row.component';
import { DialogSuccessComponent } from './components/dialog-success/dialog-success.component';
import { DialognconfirmpaidComponent } from './components/dialognconfirmpaid/dialognconfirmpaid.component';
import { DynamicContractFormComponent } from './components/dynamic-contract-form/dynamic-contract-form.component';
import { DynamicDialogImage1TextsComponent } from './components/dynamic-dialog-image1-texts/dynamic-dialog-image1-texts.component';
import { DynamicDialogImage3TextsComponent } from './components/dynamic-dialog-image3-texts/dynamic-dialog-image3-texts.component';
import { EditrowmobiledialogComponent } from './components/editrowmobiledialog/editrowmobiledialog.component';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';
import { SuccessCopyComponent } from './components/success-copy/success-copy.component';
import { CookiePolicyComponent } from '../shared/components/cookie-policy/cookie-policy.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { DialogRecommendPackageComponent } from './components/dialog-recommend-package/dialog-recommend-package.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NewsFormComponent } from './components/news-form/news-form.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PatchNoteComponent } from './components/patch-note/patch-note.component';
import { DialogFullUsersComponent } from './components/dialog-full-users/dialog-full-users.component';
import { MatIconModule } from '@angular/material/icon';
import { DialogIHTBComponent } from './components/dialog-ihtb/dialog-ihtb.component';
import { ConfirmTextComponent } from './components/confirm-text/confirm-text.component';
import { AlertSelectVoiceComponent } from './components/alert-select-voice/alert-select-voice.component';
import { DialogPaidV2Component } from './components/dialog-paid-v2/dialog-paid-v2.component';
import { DialogUpsellComponent } from './components/dialog-upsell/dialog-upsell.component';
import { SnackSoundComponent } from './components/snack-sound/snack-sound.component';
import { DialogAdsComponent } from './components/dialog-ads/dialog-ads.component';
import { DialogResetSubscriptionComponent } from './components/dialog-reset-subscription/dialog-reset-subscription.component';
import { SurveyComponent } from './components/survey/survey.component';

/** library modules is only use on the specific module  */
const modules = [
  QRCodeModule,
  MatRadioModule,
  MatAutocompleteModule,
  MatSlideToggleModule,
  MatIconModule,
];

@NgModule({
  declarations: [
    DialogComponent,
    DialogSuccessComponent,
    DialogDeleteRowComponent,
    DialognconfirmpaidComponent,
    AleartSuccessComponent,
    EditrowmobiledialogComponent,
    SuccessCopyComponent,
    DynamicContractFormComponent,
    DynamicDialogImage3TextsComponent,
    DynamicDialogImage1TextsComponent,
    FeedbackFormComponent,
    CookiePolicyComponent,
    DialogRecommendPackageComponent,
    NewsFormComponent,
    PatchNoteComponent,
    DialogFullUsersComponent,
    DialogIHTBComponent,
    ConfirmTextComponent,
    AlertSelectVoiceComponent,
    DialogPaidV2Component,
    DialogUpsellComponent,
    SnackSoundComponent,
    DialogAdsComponent,
    DialogResetSubscriptionComponent,
    SurveyComponent,
  ],
  imports: [
    CommonModule,
    DialogRoutingModule,
    SharedModule,
    RouterModule,
  ].concat(modules),
})
export class DialogModule { }
