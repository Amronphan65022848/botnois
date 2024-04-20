import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FirebaseAuthComponent } from 'src/app/firebase-auth/firebase-auth.component';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private _auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {}

  async canActivate(): Promise<boolean> {
    if (this._auth.getToken()) {
      return true;
    } else {
      this.router.navigate(['/']);
      this.firebaseSignIn();
      return false;
    }
  }

  firebaseSignIn() {
    this.dialog.open(FirebaseAuthComponent);
  }
}
