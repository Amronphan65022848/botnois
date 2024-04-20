import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { NotificationData } from 'src/app/shared/models/notification-model';
import { environment } from 'src/environments/environment';
import { TAPIResponse } from '../models/shared-model';
const { webapi } = environment;

interface param {
  warning: string;
  pinned_tts: string[];
  problem_category: string[];
}
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notifyJson = new BehaviorSubject<NotificationData>(null);

  constructor(private http: HttpClient, private _auth: AuthService) { }

  getnotifromServer() {
    const token = 'Bearer ' + this._auth.getToken();

    const header = new HttpHeaders({
      Authorization: token,
    });

    // const url = webapi + '/payment/alert_message';
    const url = webapi + '/warning/get_warning_message';
    // return this.http.get<TAPIResponse<NotificationData>>(url, { headers: header })
    return this.http.get<TAPIResponse<NotificationData>>(url, {
      headers: header,
    });
  }
}
