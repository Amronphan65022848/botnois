import { Component, OnInit } from '@angular/core';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-success-copy',
  templateUrl: './success-copy.component.html',
  styleUrls: ['./success-copy.component.css']
})
export class SuccessCopyComponent implements OnInit {


  // public copyComplete = "คัดลอกลิงค์สำเร็จ";


  constructor(
    private _changelanguage : ChangeLanguageService,
  ) { }

  ngOnInit(): void {
    this._changelanguage.language.subscribe((res)=>{
      if(res){
        this.get_dataChangelanguage(res);
      }
    })
  }

  text = TH.dialogMessageObj;

  get_dataChangelanguage(temp:any){
    if(temp == 'TH'){
      this.text = TH.dialogMessageObj;
    }
    else if (temp == 'EN'){
      this.text = EN.dialogMessageObj;
    }
  }

}
