import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SalesGuard implements CanActivate {
  constructor(
    private _auth: AuthService,
    private router: Router
  ){ }

  canActivate(): any {

    const temp: string = this._auth.data.getValue().sale_code_name
    if(!temp) {
      this.router.navigate([''])
    return false

    } else {
      return true
    }

  }

}
