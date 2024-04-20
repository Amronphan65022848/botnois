import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';

@Component({
  selector: 'app-marketplace-alert',
  templateUrl: './marketplace-alert.component.html',
  styleUrls: ['./marketplace-alert.component.scss']
})
export class MarketplaceAlertComponent implements OnInit {
  @Input() count:number = 1;
  @Output() remove = new EventEmitter();
  @Output() close = new EventEmitter();

//#-----------------------------[Change Language]--------------------------------#

  public alert_text = 'ยืนยันการเอาเสียงพากย์นี้ออกจากสตูดิโอสร้างเสียง';
  public text_arr = ['คุณต้องการเอาออก','รายการใช่หรือไม่'];
  public cancel = 'ยกเลิก';
  public access = 'ยืนยัน';

//#-----------------------------[Change Language]--------------------------------#
  constructor(
    private _changeLanguage:ChangeLanguageService,
  ) { }

  ngOnInit(): void {
    this.get_dataChangeLanguage("EN");
    this._changeLanguage.language.subscribe(
      res => {
        if (res){
          this.get_dataChangeLanguage(res)
        }
      }
    )
  }

  closeAlert(){
    this.close.emit();
  }
  submitRemove(){
    this.remove.emit();
  }

  text = TH.marketplaceObj.marketplace_alert;

  get_dataChangeLanguage(temp: any){
    if(temp == 'TH'){
      this.text = TH.marketplaceObj.marketplace_alert;
    }
    else if (temp == 'EN'){
      this.text = EN.marketplaceObj.marketplace_alert;
    }
    this.getdataInfo();
  }

  getdataInfo(){
    this.alert_text = this.text.alert_text;
    this.text_arr =   this.text.text      ;
    this.cancel =     this.text.cancel    ;
    this.access =     this.text.access    ;
  }


}
