import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LineComponent } from './shared/components/line/line.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';

import { BlacklistComponent } from './shared/components/blacklist/blacklist.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PrivacyPolicyComponent } from './shared/components/privacy-policy/privacy-policy.component';
import { SaleReferenceComponent } from './shared/components/sale-reference/sale-reference.component';
import { UseInviteComponent } from './shared/components/use-invite/use-invite.component';
import { CampaignComponent } from './home/components/campaign/campaign.component';
import { AgreementComponent } from './shared/components/agreement/agreement.component';
import { FirebaseAuthComponent } from './firebase-auth/firebase-auth.component';
import { FirebaseAuthModule } from './firebase-auth/firebase-auth.module';
import { NonceComponent } from './shared/components/nonce/nonce.component';
import { SaleCodeComponent } from './dialog/components/sale-code/sale-code.component';

const redirectPage = [
  {
    path: 'form',
    redirectTo: '/',
  },
  {
    path: 'wordstore',
    redirectTo: '/',
  },
  {
    path: 'audio-storage',
    redirectTo: '/',
  },
  {
    path: 'agreement&condition',
    redirectTo: 'agreement',
  },
  {
    path: 'text_to_speech',
    redirectTo: 'tts/conversation',
  },
];

export const routes: Routes = [
  ...redirectPage,
  {
    path: 'redirect-url',
    component: FirebaseAuthComponent,
  },
  {
    path: 'authenticatate',
    component: FirebaseAuthComponent,
  },
  {
    path: 'configuration/start',
    component: NonceComponent,
  },

  {
    path: 'auth/redirect',
    component: LineComponent,
    pathMatch: 'full',
  },
  {
    path: 'Privacy&Policy',
    component: PrivacyPolicyComponent,
    pathMatch: 'full',
  },
  {
    path: 'agreement',
    component: AgreementComponent,
    // canActivate: [AuthGuard],
    pathMatch: 'full',
  },
  {
    path: 'campaign',
    component: CampaignComponent,
  },
  {
    path: 'invite',
    component: UseInviteComponent,
    pathMatch: 'full',
  },
  {
    path: 'partner',
    component: SaleCodeComponent,
    pathMatch: 'full',
  },
  {
    path: 'ref',
    component: SaleReferenceComponent,
  },
  {
    path: 'blacklist',
    component: BlacklistComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    title: 'Botnoi Voice',

    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'core',
    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'tts',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./voice/voice.module').then((m) => m.VoiceModule),
  },
  {
    path: 'payment',
    // canActivate: [AuthGuard],
    loadChildren: () =>
      import('./payment/payment.module').then((m) => m.PaymentModule),
  },
  {
    path: 'dialog',
    loadChildren: () =>
      import('./dialog/dialog.module').then((m) => m.DialogModule),
  },
  {
    path: 'storage',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./storage/storage.module').then((m) => m.StorageModule),
  },
  {
    path: 'marketplace',
    // canActivate: [AuthGuard],
    loadChildren: () =>
      import('./marketplace/marketplace.module').then(
        (m) => m.MarketplaceModule,
      ),
  },
  {
    path: 'dictionary',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./dictionary/dictionary.module').then((m) => m.DictionaryModule),
  },
  {
    path: 'sales',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./sales/sales.module').then((m) => m.SalesModule),
  },
  {
    path: 'firebaseAuth',
    component: FirebaseAuthModule, // Must be module because css can't load in time
    loadChildren: () =>
      import('./firebase-auth/firebase-auth.module').then(
        (m) => m.FirebaseAuthModule,
      ),
  },
  {
    path: 'account',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./account/account.module').then((m) => m.AccountModule),
  },
  {
    path: '**',
    component: NotFoundComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
