import { Component, OnInit } from '@angular/core';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-payment-footer',
  templateUrl: './payment-footer.component.html',
  styleUrls: ['./payment-footer.component.scss']
})
export class PaymentFooterComponent implements OnInit {

  text = null
  constructor(
    private _language: ChangeLanguageService,
  ) { }

  ngOnInit(): void {
    this._language.language.subscribe(
      resp => {
        this.text = language[resp].report
      }
    )
  }

  toPageFb() {
    const url = 'https://www.facebook.com/texttospeech.botnoi';
    window.open(url, '_blank');
  }

}
