import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EN } from '../../change_language/EN';
import { TH } from '../../change_language/TH';
import { ChangeLanguageService } from '../../services/change-language.service';

@Component({
  selector: 'app-blacklist',
  templateUrl: './blacklist.component.html',
  styleUrls: ['./blacklist.component.scss']
})
export class BlacklistComponent implements OnInit {

  //#-----------------------------[Change Language]--------------------------------#

  public title1 = "บัญชีของคุณอยู่ใน Blacklist";
  public title2 = "หากมีข้อสงสัย กรุณาติดต่อเรา";

  //#-----------------------------[Change Language]--------------------------------#

  constructor(
    private _changelanguage : ChangeLanguageService
  ) {

  }

  ngOnInit(): void {
    this.changeHeightMain()
    this._changelanguage.language.subscribe((res)=>{
      if(res){
        this.get_dataChangelanguage(res);
      }
    })

  }

  changeHeightMain(){
    const classItems = document.getElementsByClassName('app-content') as any
    classItems[0].style.height = '100%'
  }

  text = TH.blacklistObj;

  get_dataChangelanguage(temp:any){
    if(temp == 'TH'){
      this.text = TH.blacklistObj;
    }
    else if (temp == 'EN'){
      this.text = EN.blacklistObj;
    }
    this.getdataInfo()
  }

  getdataInfo(){
    this.title1 = this.text.title1;
    this.title2 = this.text.title2;
  }



}
