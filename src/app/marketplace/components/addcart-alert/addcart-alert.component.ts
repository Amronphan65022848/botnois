import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-addcart-alert',
  templateUrl: './addcart-alert.component.html',
  styleUrls: ['./addcart-alert.component.scss']
})
export class AddcartAlertComponent implements OnInit {
  @Output() saveandlink = new EventEmitter();
  @Output() link = new EventEmitter();
  @Output() close = new EventEmitter();

//#-----------------------------[Change Language]--------------------------------#

  // public text_1 = 'ต้องการออกจากหน้านี้ใช่ไหม';
  // public text_2 = 'คุณยังไม่ได้บันทึกข้อมูลการเพิ่มเสียงในสตูดิโอ';
  // public text_3 = 'แน่ใจหรือไม่ว่าต้องการออกโดยที่ยังไม่ได้บันทึกข้อมูล';
  // public exit = 'ออกจากหน้านี้';
  // public exitSave = 'บันทึกข้อมูลและออกจากหน้านี้';

//#-----------------------------[Change Language]--------------------------------#

  constructor(
    private _changeLanguage:ChangeLanguageService,
  ) { }

  ngOnInit(): void {
    this._changeLanguage.language.subscribe(
      res => {
        if (res){
          this.text = language[res].addcartAlertObj
        }
      }
    )
  }

  closeAlert(){
    this.close.emit();
  }
  RouterLink(){
    this.link.emit();
  }
  saveAndRouterLink(){
    this.saveandlink.emit();
  }

  text = null
}
