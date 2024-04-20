import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
const { webapi } = environment;
import { UserAgentService } from './user-agent.service';
import { SpeakerData } from 'src/app/voice/models/conversation-model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { TAPIResponse, TAPIResponseMessage } from '../models/shared-model';

@Injectable({
  providedIn: 'root',
})
export class SpeakerService {
  $speaker = new BehaviorSubject<SpeakerData[]>(null);
  $cart = new BehaviorSubject<SpeakerData[]>(null);
  $actorSelectedData = new BehaviorSubject<any>(null);
  constructor(
    private http: HttpClient,
    private domSanitizer: DomSanitizer,
    private _agent: UserAgentService,
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
  // Get speaker from API
  fetchSpeaker() {
    return this.http
      .get<
        TAPIResponse<SpeakerData>
      >(webapi + '/marketplace/get_all_marketplace', this.getHeader())
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
      );
  }

  deleteCart(speaker_idList: string[]) {
    const options = {
      body: {
        speaker_id: speaker_idList,
      },
    };

    const url = webapi + '/marketplace/delete_voice_studio';
    this.http
      .post<TAPIResponseMessage>(url, options, this.getHeader())
      .subscribe();
  }

  setCart(speaker_idList: string[]) {
    const url = webapi + '/marketplace/insert_voice_studio';
    this.http
      .post<TAPIResponseMessage>(
        url,
        { speaker_id: speaker_idList },
        this.getHeader(),
      )
      .subscribe();
  }

  fetchCart() {
    return this.http
      .get<
        TAPIResponse<SpeakerData>
      >(webapi + '/marketplace/get_voice_studio', this.getHeader())
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
      );
  }

  speechStyleFormat(arr: any[]) {
    let temp = [];
    arr.forEach((e, i) => {
      if (e.popularity == 'ยอดนิยม') {
        arr[i].type = 0;
      }
      if (this._agent.getAgent()) {
        e.speech_style.forEach((r: string) => {
          temp.push(this.removeSomeText(r));
        });
        arr[i].speech_style = temp;
        temp = []; //reset
      }
    });
    return arr;
  }

  removeSomeText(text: string) {
    return text.replace('สไตล์', '');
  }

  urlToBase64(url) {
    new Promise((resolve, reject) => {
      let image = new Image();
      image.onload = function () {
        let canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 500;
        // Insert the picture into the canvas and start drawing
        canvas.getContext('2d').drawImage(image, 0, 0);
        // result
        let result = canvas.toDataURL('image/jpeg');
        resolve(result);
      };
      // CORS strategy, there will be cross-domain problems https://stackoverflow.com/questions/20424279/canvas-to dataurl-security yerror
      image.setAttribute('crossOrigin', 'Anonymous');
      image.src = url;
      // Error Handling of Failed Picture Loading
      image.onerror = () => {
        reject(new Error('picture stream anomaly'));
      };
    }).then((base64) =>
      this.base64ToBlob(base64).then((blob: any) => {
        return this.blobtoSafeUrl(blob.preview);
      }),
    );
  }

  base64ToBlob({ b64data = '', contentType = '', sliceSize = 512 } = {}) {
    return new Promise((resolve, reject) => {
      // data decoding using atob () method
      let byteCharacters = atob(b64data);
      let byteArrays = [];
      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);
        let byteNumbers = [];
        for (let i = 0; i < slice.length; i++) {
          byteNumbers.push(slice.charCodeAt(i));
        }
        // A typed array of 8-bit unsigned integer values. Content will be initialized to 0.
        // If the number of bytes requested cannot be allocated, an exception is thrown.
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      let result = new Blob(byteArrays, {
        type: contentType,
      });
      result = Object.assign(result, {
        // jartto: You have to deal with the URL. createObject URL here.
        preview: URL.createObjectURL(result),
        Name: `Picture example. png`,
      });
      resolve(result);
    });
  }

  //try image url to base64 to solve slow image load
  // imageUrltoBase64(imageUrl:string){
  //   // call lib to convert
  //   imageToBase64(imageUrl).then(
  //     res => {
  //       return this.base64toSafeUrl(res)
  //     }
  //   )
  // }

  blobtoSafeUrl(blob: any | undefined) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(blob);
  }

  getSpeaker(): SpeakerData[] {
    return JSON.parse(sessionStorage.getItem('speaker'));
  }

  getCart() {
    return JSON.parse(sessionStorage.getItem('cart'));
  }
}
