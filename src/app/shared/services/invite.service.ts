import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
const { webapi } = environment;
import { DialogService } from '../../dialog/services/dialog.service';
import { TAPIResponse } from '../models/shared-model';
type TInviteFriend = {
  coupon_id: string;
  invite_count: number;
};
@Injectable({
  providedIn: 'root',
})
export class InviteService {
  public data_invite = new BehaviorSubject<any>(undefined);

  constructor(
    private dialogService: DialogService,
    private http: HttpClient,
    private _auth: AuthService,
  ) {}
  getInviteCoupon() {
    const token = 'Bearer ' + this._auth.getToken();

    const header = new HttpHeaders({
      Authorization: token,
    });

    const url = webapi + '/payment/generate_invite_coupon';
    return this.http.get<TAPIResponse<TInviteFriend>>(url, { headers: header });
  }

  sendCodetoServer() {
    const code = localStorage.getItem('_code');
    localStorage.removeItem('_code');

    const token = 'Bearer ' + this._auth.getToken();

    const header = new HttpHeaders({
      Authorization: token,
    });
    const body = {
      invite_code: code,
    };

    const url = webapi + '/payment/check_invite_coupon';
    return this.http.post<TAPIResponse<TInviteFriend>>(url, body, {
      headers: header,
    });
  }
}
