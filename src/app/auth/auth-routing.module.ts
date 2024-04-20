import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgreementComponent } from '../shared/components/agreement/agreement.component';

const routes: Routes = [
  {
    path: '',
    // redirectTo: '/' // redirect to first page
  },
  {
    path: "facebook/delete",
    component: AgreementComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
