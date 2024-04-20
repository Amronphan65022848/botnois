import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirebaseAuthComponent } from './firebase-auth.component';

const routes: Routes = [{ path: '', component: FirebaseAuthComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FirebaseAuthRoutingModule { }
