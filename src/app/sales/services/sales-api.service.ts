import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
const { webapi } = environment
import { MonthAndYear } from '../models/sales-model';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class SalesApiService {
  url = webapi + '/payment'
  constructor(
    private http: HttpClient,
    private _auth: AuthService,
  ) { }

  getSalesInfo(data: MonthAndYear) {
    const url = this.url + '/get_sales_object_data?month=' + data.month + '&year=' + data.year
    return this.http.get<any>(url, this._auth.getHeader())
      .pipe(
        catchError(err => { //ไม่เข้า respond
          // this._alert.somethingWentWrong()
          return err
        })
      )
  }

  /* Get sales data and user transactions. */
  getSalesData(data: MonthAndYear) {
    const url = this.url + '/get_sales_transaction_data?month=' + data.month + '&year=' + data.year
    return this.http.get<any>(url, this._auth.getHeader())
  }

  fetchWithdraw() {
    return this.http.get<any>(this.url + '/update_sales_withdraw', this._auth.getHeader())
  }


}
