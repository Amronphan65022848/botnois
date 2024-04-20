import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { QuoteComponent } from './components/quote/quote.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';

const routes: Routes = [
  { path: '', component: PaymentComponent, canActivate: [AuthGuard] },
  { path: 'quote', title: 'Promotion', component: QuoteComponent },
  { path: 'payment_success', component: PaymentSuccessComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule { }
