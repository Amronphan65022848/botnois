import { Component, OnInit, Output, EventEmitter, Input, } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { popupObj } from 'src/app/payment/mocks/sales-mock';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { SalesComponent } from '../../sales.component';

@Component({
  selector: 'app-popup-bg',
  templateUrl: './popup-bg.component.html',
  styleUrls: ['./popup-bg.component.scss']
})
export class PopupBgComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Input() index: number = 0
  popupObj = popupObj

  constructor(
    public sales: SalesComponent,
    private _changelanguage : ChangeLanguageService,
  ) { }

  ngOnInit(): void {
    this._changelanguage.language.subscribe((res)=>{
      if(res){
        this.get_dataChangelanguage(res);
      }
    })
  }

  closePopup(){
    // this.close.emit();
    this.sales.data.messageShow = false;
  }

  text = TH.popupObj;

  get_dataChangelanguage(temp:any){
    if(temp == 'TH'){
      this.text = TH.popupObj;
    }
    else if (temp == 'EN'){
      this.text = EN.popupObj;
    }
    this.getdataInfo()
  }

  getdataInfo(){
    this.popupObj = this.text;
  }

}
