import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const { webapi } = environment;

type Path = 'popup' | 'studio';
@Injectable({
  providedIn: 'root',
})
export class DialogApiService {
  constructor(private http: HttpClient) {}

  getToken() {
    return sessionStorage.getItem('token');
  }

  contractToGoogleSheet(js: any) {
    return this.http.post<any>(webapi + '/service/post_googlesheet', js);
  }

  // Fetching when user acknowledge
  alreadyShowDialog() {
    const header = new HttpHeaders({
      Authorization: `${'Bearer ' + this.getToken()}`,
    });
    const url = webapi + `/payment/v2/pop_up`;
    return this.http.get<any>(url, { headers: header });
  }

  checkUserClickNews(path: Path) {
    const header = new HttpHeaders({
      Authorization: `${'Bearer ' + this.getToken()}`,
    });
    const url = webapi + `/payment/logs_popup_studio?${path}=1`;
    return this.http.get<any>(url, { headers: header });
  }
}
