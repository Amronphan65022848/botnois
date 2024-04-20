import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
const { webapi } = environment
import { DialogService } from '../../dialog/services/dialog.service';
import { SignInData, SignUpData, NewPasswordData } from '../models/auth-model';

@Injectable({
  providedIn: 'root'
})
export class AuthAPIService {
  $loading = new BehaviorSubject<boolean>(false)
  $auth = new BehaviorSubject<string>(null)
  constructor(
    private http: HttpClient,
    private _dialog: DialogService,
    private router: Router,
  ) { }

  getToken() {
    return sessionStorage.getItem("token");
  }

  /** Set loading to true. */
  loading(){
    this.$loading.next(true)
  }

  /** Set loading to false.*/
  finish(){
    this.$loading.next(false)
  }
  /** Redirect to error page. */
  errPage(){
    // this.router.navigate(['/auth'],{ queryParams: { page: 'success', type: 'error' }})
  }

  // ##- - - - - - - [Auth Social] - - - - - - - -##
  fetchGoogle(){
    const url = webapi + '/dashboard/google_login';
    return this.http
    .get<any>(url)
    .pipe(
      catchError(err => {
        this.finish()
        this.errPage()
        return throwError(err)
      })
    );
  }
  fetchGoogleToken(token:any){

    const token_str = 'state=' + token.state + '&code=' + token.code + '&scope=' + token.scope + '&authuser=' + token.authuser + '&prompt=' + token.prompt
    const url = webapi + '/dashboard/token?' + token_str;

    return this.http
    .get<any>(url)
    .pipe(
      catchError(err => {
        this.finish()
        this.errPage()
        return throwError(err)
      })
    );
  }

  fetchFacebook(){
    const url = webapi + '/dashboard/facebook_login';
    return this.http
    .get<any>(url)
    .pipe(
      catchError(err => {
        this.finish()
        this.errPage()
        return throwError(err)
      })
    );
  }
  fetchFacebookToken(token:any){
    const scope = String(token.scope).replace(/ /g,'+')
    const token_str = 'state=' + token.state + '&code=' + token.code
    const url = webapi + '/dashboard/facebook_callback?' + token_str;
    return this.http
    .get<any>(url)
    .pipe(
      catchError(err => {
        this.finish()
        this.errPage()
        return throwError(err)
      })
    );
  }
  // ##- - - - - - - [Auth Social] - - - - - - - -##

  fetchSignIn(data:SignInData){
    const url = webapi + '/dashboard/login_botnoivoice';
    return this.http
    .post<any>(url, data)
    .pipe(
      catchError(err => {
        this.finish()
        this.errPage()
        return throwError(err)
      })
    );
  }

  fetchSignUp(data:SignUpData){
    const url = webapi + '/dashboard/registration';
    return this.http
    .post<any>(url, data)
    .pipe(
      catchError(err => {
        this.finish()
        this.errPage()
        return throwError(err)
      })
    );
  }

  fetchVerification(token:string){
    const url = webapi + '/dashboard/verification';
    return this.http
    .get<any>(url+'?token='+token)
    .pipe(
      catchError(err => {
        this.finish()
        this.errPage()
        return throwError(err)
      })
    );
  }

  fetchForgotPassword(email:string){
    const url = webapi + '/dashboard/forgot_password';
    const data = { email: email }
    return this.http
    .post<any>(url, data)
    .pipe(
      catchError(err => {
        this.finish()
        this.errPage()
        return throwError(err)
      })
    );
  }

  fetchResetPassword(data:NewPasswordData,token:string){
    const header = new HttpHeaders({
      Authorization: `${'Bearer ' + token}`,
    });
    const url = webapi + '/dashboard/reset_password';
    return this.http
    .post<any>(url, data, {headers: header})
    .pipe(
      catchError(err => {
        this.finish()
        this.errPage()
        return throwError(err)
      })
    );
  }

  fetchCheckRemember(token:string){
    const url = webapi + '/dashboard/check_remember';
    const data = { token: token }
    return this.http
    .post<any>(url, data)
    .pipe(
      catchError(err => {
        this.finish()
        this.errPage()
        return throwError(err)
      })
    );
  }

  fetchLogout(){
    const url = webapi + '/dashboard/logout';
    return this.http
    .get<any>(url)
    .pipe(
      catchError(err => {
        this.finish()
        this.errPage()
        return throwError(err)
      })
    );
  }

}
