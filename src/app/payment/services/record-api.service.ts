import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { environment } from 'src/environments/environment';
const { webapi } = environment

export interface body {
  message: string;
  response: any;
  status: number;
}

@Injectable({
  providedIn: 'root'
})

export class RecordApiService {
  url = webapi + '/record'

  constructor(
    private http: HttpClient,
    private _alert: DialogService,
    private _auth: AuthService,
  ) { }

  sendAudio(form: FormData) {
    return this.http.post<any>(this.url + '/device', form, this._auth.getHeader())
      .pipe(
        catchError(err => {
          this._alert.somethingWentWrong()
          return err
        })
      )
  }

  getSkip(collection, userid) {
    let json = {
      collection: collection,
      userid: userid
    }
    return this.http.post<any>(this.url + '/getSkip', json, this._auth.getHeader())
      .pipe(
        catchError(err => {
          this._alert.somethingWentWrong()
          return err
        })
      )
  }

  skip(userid, tid, collection) {
    let json = {
      tid: tid,
      userid: userid,
      collection: collection
    }
    return this.http.post<any>(this.url + '/skip', json, this._auth.getHeader())
      .pipe(
        catchError(err => {
          this._alert.somethingWentWrong()
          return err
        })
      )
  }

  getScore(userid, categories) {
    let body = {
      userid: userid,
      collection: categories
    }
    return this.http.post<any>(this.url + '/getScore', body, this._auth.getHeader())
      .pipe(
        catchError(err => {
          this._alert.somethingWentWrong()
          return err
        })
      )
  }

  // collection
  getText(type, userid) {
    let json = {
      collection: type,
      userid: userid
    }
    return this.http.post<any>(this.url + '/getText', json, this._auth.getHeader())
      .pipe(
        catchError(err => {
          this._alert.somethingWentWrong()
          return err
        })
      )
  }

  getDb() {

    // this._fbDatabase.flexQuery('record').then((res)=>{
    //   const data: any = res;
    //   console.log(data);

    // })
    // this.http.get<any>(this.url+'/getDb').subscribe((res)=>{
    //   console.log("Test : ",res);
    // });

    return this.http.get<any>(this.url + '/getDb')
      .pipe(
        catchError(err => {
          this._alert.somethingWentWrong()
          return err
        })
      )
  }

  addFeedback(form: FormData) {
    return this.http.post<any>(this.url + '/addFeedback', form, this._auth.getHeader())
      .pipe(
        catchError(err => {
          this._alert.somethingWentWrong()
          return err
        })
      )

  }
}
