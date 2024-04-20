import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, OperatorFunction, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DialogService } from 'src/app/dialog/services/dialog.service';


@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  responseCache = new Map();
  constructor(
    private _dialog: DialogService,
  ) { }

  /** Main interceptor function. */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    /* Check should API cache on API list. */
    if (!this.canCache(request)) {

      return next.handle(request).pipe(
        this.handleError()
      )
    }



    /* fetching API and cache response data. */
    return next.handle(request)
      .pipe(
        this.handleError(),
        tap(res => this.responseCache.set(request.urlWithParams, res)
        )
      );
  }

  /** Check the API names which system should cache them. */
  canCache(request: HttpRequest<unknown>): boolean {
    const APIArray = ['alert_message', 'get_profile', 'https://api-staging-text2speech.botnoi.ai/api/payment/package']
    return APIArray.includes(request.urlWithParams)
  }

  /** Handle error with catchError, will handle error code. */
  handleError(): OperatorFunction<HttpEvent<any>, HttpEvent<unknown>> {
    return catchError((error: HttpErrorResponse) => {

      this.handleErrorCase(error)
      return throwError(() => error)
    })
  }

  private handleErrorCase(error: HttpErrorResponse) {
    switch (error.status) {
      case 403:
        return console.log(`${error.status} ${JSON.stringify(error.error)}`)
      case 405:
        return console.log(`${error.status} ${JSON.stringify(error.error)}`);
    }
  }

}
