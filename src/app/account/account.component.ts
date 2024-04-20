import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {  } from "./mocks/account-mock";
import { ChangeLanguageService } from '../shared/services/change-language.service';
import { language } from '../shared/change_language/language';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  image = ['user','creditcard','clock','cog']
  // ,'ประวัติการใช้งาน','ตั้งค่า'
  pages = 0 // Default is 0 (profile page)
  text = []
  constructor(
    private route: ActivatedRoute,
    private _language: ChangeLanguageService,
  ) {

  }

  ngOnInit(): void {

    this._language.language.subscribe(
      resp => {
        if(resp) {
          this.text = language[resp].userObj.list
        }
      }
    )

    this.route.queryParams.subscribe(
      (param: any) => {
        if(param.page){
          this.pages = Number(param.page)
        }
      }
    )
  }

  /* Assign index number to pages variable to define the current page */
  onChoose(i:number){
    this.pages = i
  }
}
