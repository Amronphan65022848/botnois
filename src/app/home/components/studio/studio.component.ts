import { Component, OnInit } from '@angular/core';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
@Component({
  selector: 'app-studio',
  templateUrl: './studio.component.html',
  styleUrls: ['./studio.component.scss'],
})
export class StudioComponent implements OnInit {

  text = null
  constructor(
    private _language: ChangeLanguageService,
  ) {

  }

  ngOnInit(): void {
    this._language.language.subscribe(
      resp => {
        this.text = language[resp].landingPageObj
      }
    )
  }


  get_dataChangeLanguage(temp: any) {
    if (temp == 'TH') {
      this.text = TH.landingPageObj;
    } else if (temp == 'EN') {
      this.text = EN.landingPageObj;
    }
  }
}
