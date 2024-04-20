import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { CouponCodeComponent } from './components/coupon-code/coupon-code.component';

import { SharedModule } from '../shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';
import { InvitePageComponent } from './components/invite-page/invite-page.component';
import { RecordInformationComponent } from './components/record-information/record-information.component';
import { RecordVoiceComponent } from './components/record-voice/record-voice.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DialogModule } from '../dialog/dialog.module';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { QuoteComponent } from './components/quote/quote.component';
import { BuyPointsComponent } from './components/buy-points/buy-points.component';
import { PaymentFooterComponent } from './components/payment-footer/payment-footer.component';
import { PaymentFlexComponent } from './dialog/payment-flex/payment-flex.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { BuyPointsPipe } from './pipes/buy-points.pipe';
import { PointListComponent } from '../shared/components/payment/point-group/point-box/point-list/point-list.component';
import { PromotionBoxComponent } from '../shared/components/payment/promotion-box/promotion-box.component'

/** library modules is only use on the specific module  */
const modules = [
  QRCodeModule,
  // MatExpansionModule,
  DialogModule,
  BuyPointsPipe,
];

const standalone = [PointListComponent, PromotionBoxComponent];

@NgModule({
  declarations: [
    PaymentComponent,
    CouponCodeComponent,
    RecordVoiceComponent,
    RecordInformationComponent,
    InvitePageComponent,
    QuoteComponent,
    BuyPointsComponent,
    PaymentFooterComponent,
    PaymentFlexComponent,
    PaymentSuccessComponent,
    
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    SharedModule,
    ...standalone,
  ].concat(modules),
})
export class PaymentModule {}
