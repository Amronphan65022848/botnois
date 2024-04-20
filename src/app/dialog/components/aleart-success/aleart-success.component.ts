import { Component, OnInit } from '@angular/core';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-aleart-success',
  templateUrl: './aleart-success.component.html',
  styleUrls: ['./aleart-success.component.css']
})
export class AleartSuccessComponent implements OnInit {

  //#-----------------------------[Change Language]--------------------------------#

  // public successAddPronunciation = "บันทึกคำอ่านผิดเรียบร้อย";

  //#-----------------------------[Change Language]--------------------------------#

  constructor(
    private _chageLanguage : ChangeLanguageService,
  ) { }

  ngOnInit(): void {
    this._chageLanguage.language.subscribe((res)=>{
      if(res){
        this.text = language[res].dialogMessageObj
      }
    })
  }

  text = null;

}
