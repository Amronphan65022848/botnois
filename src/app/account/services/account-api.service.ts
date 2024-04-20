import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
const { webapi } = environment;

@Injectable({
  providedIn: 'root',
})
export class AccountAPIService {
  constructor(
    // private _auth: AuthService,
    private http: HttpClient,
    private cookie: CookieService,
  ) {}

  /**
   * Get reponse header
   */
  getHeader() {
    const token = 'Bearer ' + this.cookie.get('_bn_token');
    const header = new HttpHeaders({
      Authorization: `${token}`,
      // 'ngrok-skip-browser-warning': '564',
    });

    return { headers: header };
  }

  /* Return history point observable */
  getHistoryPoint() {
    return this.http.get(
      webapi + '/payment/v2/history_point',
      this.getHeader(),
    );
  }
}
