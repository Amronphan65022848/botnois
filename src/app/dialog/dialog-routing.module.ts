import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { CookiePolicyComponent } from '../shared/components/cookie-policy/cookie-policy.component';
import { DialogSuccessComponent } from './components/dialog-success/dialog-success.component';
import { DynamicContractFormComponent } from './components/dynamic-contract-form/dynamic-contract-form.component';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';
import { DialogComponent } from './dialog.component';

const routesDialog: Routes = [
  { path: '', component: DialogComponent },
  {
    path: "success",
    component: DialogSuccessComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "cookie-policy",
    component: CookiePolicyComponent,
  },
  {
    path: "feedback-form",
    component: FeedbackFormComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routesDialog)],
  exports: [RouterModule]
})
export class DialogRoutingModule { }
