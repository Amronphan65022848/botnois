import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
const { webapi } = environment

@Injectable({
  providedIn: 'root',
})
export class contactService {
  constructor(private http: HttpClient, private _auth: AuthService) { }

  contactSend(text: any) {
    const data = {
      name: text.name,
      office_name: text.value.office_name,
      email: text.value.email,
      phone: text.value.phone,
      department: text.value.department,
      position: text.value.position,
      detail: text.value.detail,
      subject: text.value.subject,
    };

    const url = webapi + '/dashboard/contact';
    return this.http.post(url, data);
  }

  contactSendLanding(text: any) {
    const data = {
      name: text.name,
      office_name: text.company,
      email: text.email,
      phone: text.phone,
      detail: text.details,
    };

    const url = webapi + '/dashboard/contact';
    return this.http.post(url, data);
  }
}
