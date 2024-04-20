import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogService } from '../../dialog/services/dialog.service';
import { AudioDataAPI } from '../../storage/models/text2speech-model';
import { NotificationService } from './notification.service';
import { TextSaved } from 'src/app/voice/models/textspeech-model';

import { environment } from 'src/environments/environment';
import { TGetStoreFile } from 'src/app/voice/models/voice-model';
import { ChangeLanguageService } from './change-language.service';
import { TAPIResponse } from '../models/shared-model';
import { SpeakerData } from 'src/app/voice/models/conversation-model';
const { webapi, voice } = environment;

@Injectable({
  providedIn: 'root',
})
export class TextspeechService {
  public task = new BehaviorSubject<any>([]);
  public loadingState = new BehaviorSubject<number>(0);
  public file = new BehaviorSubject<TGetStoreFile[]>([]);
  public data = new BehaviorSubject<any>([]); // Used only on v2 page
  public count = new BehaviorSubject<number>(0);
  public data_v1 = new BehaviorSubject<any>([]); // Used only on v1 page
  public language = new BehaviorSubject<any>([]);

  public allCoin = new BehaviorSubject<any>([]);

  public $inputLang = new BehaviorSubject<string>(null); //Service เดิมใน detectLanguage

  textSaved = new BehaviorSubject<TextSaved[]>(null);

  /* remember toggle state on merge audio files */
  public $isSlideToggle = new BehaviorSubject<boolean>(false);

  private apiKey: string =
    'trnsl.1.1.20240124T045924Z.41d06ada705f2756.bc34063446d4aaef9cd6b3a0d172426661f35e5f';
  private detectUrl: string =
    'https://translate.yandex.net/api/v1.5/tr.json/detect';
  private translateUrl: string =
    'https://translate.yandex.net/api/v1.5/tr.json/translate';

  constructor(
    private http: HttpClient,
    private _auth: AuthService,
    private _dialogService: DialogService,
    private _notify: NotificationService, // private tts: Text2speechComponent
    private _language: ChangeLanguageService,
  ) {}

  /** This function is save last picked speaker to local storage.
   * @param speaker string
   */
  saveDefaultSpeaker(speaker: string) {
    sessionStorage.setItem('default_speaker', speaker);
    localStorage.removeItem('default_speaker');
  }

  getDefaultSpeaker() {
    const speaker = sessionStorage.getItem('default_speaker');
    if (speaker) return speaker;
  }

  getHeader() {
    const tokenString = this._auth.getToken();
    const token = 'Bearer ' + tokenString;
    const header = new HttpHeaders({
      Authorization: token,
    });

    return header;
  }

  getFlexHeader(name: string) {
    const tokenString = this._auth.getToken();
    const token = 'Bearer ' + tokenString;
    const header = new HttpHeaders({
      [name]: token,
    });

    return header;
  }

  checkToken() {
    const header = this.getHeader();
    const url = webapi + '/service/get_token';
    return this.http.post(url, {}, { headers: header });
  }

  reToken() {
    const header = this.getHeader();
    const url = webapi + '/service/refresh_token';
    return this.http.post(url, {}, { headers: header });
  }

  // TEST NEW FLOW
  generateVoice(data: AudioDataAPI) {
    // const { header, url } = this.getCoreAPI("generate")
    // const headers = this.getFlexHeader(header)
    const headers = this.getHeader();
    const url = voice + '/voice/v1/generate_voice?provider=botnoivoice';
    return this.http.post(url, data, {
      // responseType: 'blob',
      headers: headers,
    });
  }

  downloadAll(data: any) {
    const header = this.getHeader();
    // const url = "https://api-staging-text2speech.botnoi.ai/download/v1/download_voice_zip_master"
    const url = voice + '/download/v1/download_voice_zip_master';
    return this.http.post(url, data, { responseType: 'blob', headers: header });
  }

  downloadVoice(data: any) {
    const headers = this.getHeader();
    const url = voice + '/download/v1/download_voice_master';
    // const url = webapi + '/service/new_download_voice_master'
    return this.http.post(url, data, {
      responseType: 'blob',
      headers: headers,
    });
  }

  getSavedText() {
    const header = this.getHeader();

    const url = voice + '/voice/v1/get_text_save';
    return this.http.get<any>(url, { headers: header });
  }

  removeSavedText(json: any) {
    const header = this.getHeader();

    const data = {
      text_list: [json],
    };

    const url = voice + '/voice/v1/delete_text_save';
    return this.http.post<any>(url, data, { headers: header });
  }
  setLanguageFromDetection(value: string, blockIndex: number) {
    this.$inputLang.next(value);
  }

  generateVoiceNoToken(data: any) {
    const url = voice + '/voice/v1/generate_voice_demo';
    return this.http.post(url, data, { responseType: 'blob' });
  }

  getSpeakers() {
    const url = webapi + '/marketplace/get_all_marketplace_demo';
    return this.http.get<TAPIResponse<SpeakerData[]>>(url);
  }

  translateText(text: string, targetLang: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    // สร้าง URLSearchParams ที่มีพารามิเตอร์สำหรับ API
    const body = new URLSearchParams({
      key: this.apiKey,
      text: text,
      lang: targetLang, // ตั้งค่าภาษาเป้าหมาย, สามารถตรวจจับภาษาต้นทางอัตโนมัติได้
    });

    // ทำการ POST request ไปยัง Yandex Translate API
    return this.http.post(this.translateUrl, body.toString(), { headers });
  }

  detectLanguage(text: string): Observable<any> {
    // ตั้งค่า URL พร้อม query parameters
    const url = `${this.detectUrl}?key=${this.apiKey}`;

    // สร้างตัวแปรสำหรับร่าง body ของ POST request
    const body = new URLSearchParams();
    body.set('text', text);

    // ส่ง POST request ไปยัง Yandex API พร้อมข้อความที่ต้องการตรวจสอบภาษา
    return this.http.post(url, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }
}
