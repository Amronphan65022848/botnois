import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { language } from 'src/app/shared/change_language/language';
import { Language } from 'src/app/shared/models/shared-model';
import { MatSliderModule } from '@angular/material/slider';
@Component({
  selector: 'app-promotion-box',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSliderModule
  ],
  templateUrl: './promotion-box.component.html',
  styleUrl: './promotion-box.component.scss'
})
export class PromotionBoxComponent {
  constructor(
    private _language: ChangeLanguageService,

  ) { }
  text = language['TH'].promotionEnterpriseObj;
  lang: Language;
  packagetype:string = 'year';
  isactive:boolean = false;
  monthly:number = 18000;
  yearly: number = 18000;

  ngOnInit(): void {
    this._language.language.subscribe((resp) => {
      this.lang = resp
      this.text = language[resp].promotionEnterpriseObj;

    });
  }
  toCompanyForms() {
    const url =
      'https://forms.gle/uLT2DoXZArLYduLb8';
    window.open(url, '_blank');
  }
  toggleType(type) {
    if (this.packagetype !== type){
      this.packagetype = type
      this.isactive = !this.isactive
    }
  }
}
