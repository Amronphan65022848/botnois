import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogService } from '../../dialog/services/dialog.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/services/auth.service';
const { webapi } = environment;
@Injectable({
  providedIn: 'root',
})
export class AudioStorageApiService {
  isAudioPlayerPath = new BehaviorSubject(false);
  isSharePath = new BehaviorSubject(false);
  searchData = new BehaviorSubject<any[]>([]);
  constructor(
    private http: HttpClient,
    private _dialog: DialogService,
    private _auth: AuthService,
  ) {}

  getAllStorage() {
    return this.http
      .get<any>(webapi + '/storage/get_storage', this._auth.getHeader())
      .pipe(
        catchError((err) => {
          this._dialog.somethingWentWrong();
          return throwError(err);
        }),
      );
  }

  getOneStorage(url: string, userid: string) {
    const body = {
      url: url,
    };
    return this.http
      .post(webapi + '/service/get_one_storage', body, {
        responseType: 'blob',
        ...this._auth.getHeader(),
      })
      .pipe(
        catchError((err) => {
          this._dialog.somethingWentWrong();
          return throwError(err);
        }),
      );
  }
  checkSize() {
    return this.http
      .get<any>(webapi + '/service/check_size', this._auth.getHeader())
      .pipe(
        catchError((err) => {
          this._dialog.somethingWentWrong();
          return throwError(err);
        }),
      );
  }

  uploadFile(filename: string, b64string: ArrayBuffer | string) {
    const body = {
      filename: filename,
      b64string: b64string,
    };
    return this.http
      .post<any>(webapi + '/service/upload_file', body, this._auth.getHeader())
      .pipe(
        catchError((err) => {
          this._dialog.somethingWentWrong();
          return throwError(err);
        }),
      );
  }

  removeFile(url: string) {
    const body = {
      url: url,
    };
    return this.http
      .post<any>(
        webapi + '/service/delete_storage',
        body,
        this._auth.getHeader(),
      )
      .pipe(
        catchError((err) => {
          this._dialog.somethingWentWrong();
          return throwError(err);
        }),
      );
  }
}
