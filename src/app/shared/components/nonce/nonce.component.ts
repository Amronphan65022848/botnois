import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CookieService, CookieOptions } from 'ngx-cookie-service';
import { CanvaAuthentication } from 'src/app/auth/models/auth-model';
import { NonceService } from '../../services/nonce.service';

@Component({
  template: ``,
  styles: [
  ]
})
export class NonceComponent {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _nonce: NonceService,
  ) { }

  ngOnInit(): void {
    // Expect query param from Canva app
    this.route.queryParams.subscribe(
      (param: Params | CanvaAuthentication) => {
        if (param.state) {
          // State existed, First flow: configuration/start
          this._nonce.generateNonce(param.state)
        } else { // No query param return to first
          this.router.navigate([''])
        }
      }
    )
  }
}
