import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
const { webapi } = environment
import { AuthService } from 'src/app/auth/services/auth.service';
import { catchError } from 'rxjs/operators';
import { DialogService } from 'src/app/dialog/services/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class WordstoreService {

  public data = new BehaviorSubject<any>([]);

  public data_edit = new BehaviorSubject<any>([]);

  constructor(
    private http: HttpClient,
    private _auth: AuthService,
    private _dialog: DialogService,
  ) {   }

  // async getWordStore() {
  //   const { user_id } = this._auth.getUserData()
  //   return await this._fbDatabase.flexQuery("dictionary", "user_id", "==", user_id)
  // }

  getWordStore() {
    const token = "Bearer " + this._auth.getToken();

    const header = new HttpHeaders(
      {
        "Authorization": token,
      })


    const url = webapi + "/dictionary/get_dictionary"
    return this.http.get(url, { headers: header })
    .pipe(
      catchError((
        err => {
          this._dialog.somethingWentWrong()
          return throwError(err)
        }
      ))
    )
  }

  addWordStore(data: any) {
    const token = "Bearer " + this._auth.getToken();

    const header = new HttpHeaders(
      {
        "Authorization": token,
      })

    const url = webapi + "/dictionary/insert_dictionary"
    return this.http.post(url, data, { headers: header })
    .pipe(
      catchError((
        err => {
          this._dialog.somethingWentWrong()
          return throwError(err)
        }
      ))
    )

  }
  editWordStore(wordEdit: any) {
    const token = "Bearer " + this._auth.getToken();
    const header = new HttpHeaders(
      {
        "Authorization": token,
      })

    const url = webapi + "/dictionary/edit_dictionary"
    return this.http.post(url, wordEdit, { headers: header })
    .pipe(
      catchError((
        err => {
          this._dialog.somethingWentWrong()
          return throwError(err)
        }
      ))
    )
  }

  deleteWordStore(data: any) {
    const token = "Bearer " + this._auth.getToken();
    const header = new HttpHeaders(
      {
        "Authorization": token,
      })

    const url = webapi + "/dictionary/delete_dictionary"

    return this.http.post(url, data, { headers: header })
    .pipe(
      catchError((
        err => {
          this._dialog.somethingWentWrong()
          return throwError(err)
        }
      ))
    )
  }


}
