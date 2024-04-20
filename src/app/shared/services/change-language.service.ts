import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Language, TypeCurrency } from '../models/shared-model';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class ChangeLanguageService {
  /* value should be default language */
  language = new BehaviorSubject<Language>("TH")
  // $currency = new BehaviorSubject<TypeCurrency>("usd")
  cookieName = '_bn_currency'
  constructor(
    private cookie: CookieService,
  ) { }

  setLanguage(lang: Language) {
    this.language.next(lang)
  }

  getLanguage(): Language {
    return this.language.getValue()
  }

  setCurrencyBasedLanguage(lang: Language): TypeCurrency {
    return lang === 'EN' ? 'usd' : 'thb'
  }

  // setCurrency(currency: TypeCurrency) {
  //   this.$currency.next(currency);
  // }

  // getCurrency(): TypeCurrency {
  //   return this.$currency.getValue()
  // }

  // setCurrencyCookie(currency: TypeCurrency) {
  //   this.cookie.set(this.cookieName, currency, null, '/')
  // }

  // getCurrencyCookie() {
  //   return this.cookie.get(this.cookieName) as TypeCurrency
  // }

  // deleteCurrencyCookie() {
  //   sessionStorage.removeItem('currency')
  // }
}
