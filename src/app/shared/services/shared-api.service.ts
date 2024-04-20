import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
const { webapi } = environment
import { TrackSoundSample } from '../models/shared-model';

@Injectable({
  providedIn: 'root'
})
export class SharedApiService {

  constructor(
    private http: HttpClient,
    private _auth: AuthService,
  ) { }

  fetchTrackSoundSample(data: TrackSoundSample[]){

    if(data.length <= 0) return;

    const temp = {
      sound_sample_list: data
    }

    const url = webapi + '/payment/get_count_sample_voice';
    return this.http.post<any>(url, temp).subscribe();
  }

  fetchAgreement(){
    const token = "Bearer " + this._auth.getToken();

    const header = new HttpHeaders(
      {
        "Authorization": token,
      })
    const url = webapi + '/dashboard/agreement';
    return this.http.get<any>(url, { headers: header })
  }
}
