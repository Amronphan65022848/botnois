import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
const { webapi } = environment;
import { SubscriptionPackage } from '../models/subscription-model';
import {
  TAPIResponse,
  TPayMethods,
  TypeCurrency,
} from 'src/app/shared/models/shared-model';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionAPIService {
  // $package = new BehaviorSubject<SubscriptionPackage[]>(null);
  $package_addon = new BehaviorSubject<SubscriptionPackage[]>(null);
  $currentPackage = new BehaviorSubject<SubscriptionPackage>(null);
  constructor(
    private http: HttpClient,
    private _auth: AuthService,
  ) {}

  getSubscriptionPackage() {
    const data = this.$package_addon.getValue();
    if (!data) {
      // console.log(this._auth.getHeader().headers.getAll('Authorization'));
      this.http
        .get<
          TAPIResponse<SubscriptionPackage[]>
        >(webapi + '/payment/v2/get_package_add_on', this._auth.getHeader())
        .subscribe({
          next: (res) => {
            const _package = res.data.filter(
              (e) => e.add_id === '1' || e.add_id === '3',
            );
            _package.sort((a, b) => Number(b.add_id) - Number(a.add_id));
            this.$package_addon.next(_package);
            return _package;
          },
          error: (err) => {},
        });
    } else {
      const _package = data;
      return _package;
    }
  }

  // TODO still /payment
  /** Cancel the subscription package */
  cancelSubscription(cancel_now: boolean) {
    // const webapi = 'https://seriously-super-vulture.ngrok-free.app/api'
    const temp = this.http.get<any>(
      webapi + '/payment/cancel_subscription?cancel_now=' + cancel_now,
      this._auth.getHeader(),
    );
    return temp;
  }

  /** Get subscription promptpay qrcode */
  getSubscriptionPromptpay(sub_id: string, sid?: string, isDiscount?: boolean) {
    let url = webapi + '/stripe/stripe_subscription_qrcode?sub_id=' + sub_id;
    if (sid) url += `&sid=${sid}`;
    if (isDiscount) url += `&promotion=${isDiscount}`;
    return this.http.get<TAPIResponse<any>>(url, this._auth.getHeader());
  }

  /** Get url of addon subscription package */
  getAddonSubscription(
    sub_id: string,
    method: TPayMethods,
    currency: TypeCurrency,
  ) {
    let url =
      webapi +
      `/stripe/stripe_add_on?add_id=${sub_id}&method=${method}&currency=${currency}`;
    return this.http.get<TAPIResponse<string>>(url, this._auth.getHeader());
  }

  /** Get subscription promptpay qrcode */
  getSubscriptionPromptpayLugent(sub_id: string) {
    return this.http.post<any>(
      webapi + '/payment/qrcode_subscription',
      { sub_id },
      this._auth.getHeader(),
    );
  }

  checkQrWebSocket(data: any) {
    // const token = this._auth.getToken();

    const url =
      'wss://api-staging-text2speech.botnoi.ai/api/payment/ws_check_qr';
    const socket = new WebSocket(url);

    socket.onopen = function () {
      console.log('WebSocket connection opened.');
      socket.send(JSON.stringify(data));
    };

    socket.onmessage = function (msg) {
      console.log('Received message from server:', JSON.parse(msg.data));
    };

    socket.onerror = function (error) {
      console.error('WebSocket error:', error);
    };

    socket.onclose = function (msg) {
      console.log('WebSocket closed');
    };
  }
}
