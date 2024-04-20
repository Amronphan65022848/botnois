import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { CategoryPipe } from './pipes/category.pipe';
import { NoSanitizePipe } from './pipes/nosanitizerpipe';
import { MarketplaceAlertComponent } from '../marketplace/components/marketplace-alert/marketplace-alert.component';
import { RouterModule } from '@angular/router';
import { AgreementComponent } from './components/agreement/agreement.component';
import { WarningUserComponent } from './components/warning-user/warning-user.component';
import { LineComponent } from './components/line/line.component';
import { BlacklistComponent } from './components/blacklist/blacklist.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { ShowContentByPagePipe } from '../dialog/pipes/ShowContentByPage';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import {
  SpeakerFilterPipe,
  SpeakerSearchPipe,
  MarketFilterPipe,
  MarketSearchPipe,
} from './pipes/speaker-filter.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { FlexDialogComponent } from './dialogs/flex-dialog/flex-dialog.component';
import { FooterV2Component } from './components/footer-v2/footer-v2.component';
import { PopupTriggerDirective } from './directives/popup-trigger.directive';
import { AddcartAlertComponent } from '../marketplace/components/addcart-alert/addcart-alert.component';
import { FloatingMessageComponent } from '../marketplace/components/floating-message/floating-message.component';
import { FooterComponent } from '../home/components/footer/footer.component';
import { NgxLoadingModule } from 'ngx-loading';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatStepperModule } from '@angular/material/stepper';
import { SafePipe } from './pipes/safe.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EraPipe } from './pipes/era';
import { ShortNumberPipe } from './pipes/short-number';
import { PaginationPipe } from './pipes/pagination.pipe';
import { MatExpansionModule } from '@angular/material/expansion';
import { SubscriptionComponent } from '../payment/components/subscription/subscription.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CompareContentComponent } from '../home/components/compare-content/compare-content.component';
import { SocialSignInComponent } from './components/auth/social-sign-in/social-sign-in.component';
import { InputPointComponent } from './components/payment/input-point/input-point.component';
import { AuthFormComponent } from './components/auth/auth-form/auth-form.component';
import { FooterSeoComponent } from './components/footer-seo/footer-seo.component';
import { TryFullComponent } from './components/gen-sound-sample/dialog/try-full/try-full.component';
import { PointListComponent } from './components/payment/point-group/point-box/point-list/point-list.component';
import {
  NonEventDirective,
  SaleEventDirective,
} from './directives/sale-event.directive';
import { PointBoxComponent } from './components/payment/point-group/point-box/point-box.component';
import { PointGroupComponent } from './components/payment/point-group/point-group.component';
import { SetElementIdDirective } from './directives/set-element-id.directive';

const components = [
  FloatingMessageComponent,
  MarketplaceAlertComponent,
  AddcartAlertComponent,
  FooterComponent,
  AgreementComponent,
  WarningUserComponent,
  LineComponent,
  BlacklistComponent,
  ShowContentByPagePipe,
  MaintenanceComponent,
  FlexDialogComponent,
  FooterV2Component,
  SubscriptionComponent,
  CompareContentComponent,
  FooterSeoComponent,
  TryFullComponent,
];

const pipes = [
  NoSanitizePipe,
  CategoryPipe,
  SpeakerFilterPipe,
  SpeakerSearchPipe,
  MarketFilterPipe,
  MarketSearchPipe,
  ClickOutsideDirective,
  PopupTriggerDirective,
  SafePipe,
  EraPipe,
  ShortNumberPipe,
  PaginationPipe,
];

const modules = [
  MatIconModule,
  MatSliderModule,
  // CarouselModule,
  ReactiveFormsModule,
  FormsModule,
  NgxLoadingModule,
  MatFormFieldModule,
  MatInputModule,
  MatTooltipModule,
  MatButtonModule,
  MatOptionModule,
  MatSelectModule,
  MatDialogModule,
  MatCheckboxModule,
  MatTabsModule,
  RouterModule,
  MatSnackBarModule,
  HttpClientModule,
  MatProgressBarModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatTableModule,
  InfiniteScrollModule,
  NgxSkeletonLoaderModule,
  MatExpansionModule,
  MatStepperModule,
  MatDatepickerModule,
  MatNativeDateModule,
];

const standalone = [
  SocialSignInComponent,
  InputPointComponent,
  AuthFormComponent,
  PointGroupComponent,
  PointListComponent,
  PointBoxComponent,
  SaleEventDirective,
  NonEventDirective,
  SetElementIdDirective,
];

@NgModule({
  declarations: [].concat(components, pipes),
  imports: [
    CommonModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    ...standalone,
    NgxLoadingModule.forRoot({
      fullScreenBackdrop: true, // Always fullscreen back drop
    }),
  ],
  exports: [].concat(modules, pipes, components, standalone),
  providers: [],
})
export class SharedModule {}
