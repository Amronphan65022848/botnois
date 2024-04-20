import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';

@Component({
  selector: 'app-add-cart',
  templateUrl: './add-cart.component.html',
  styleUrls: ['./add-cart.component.scss']
})
export class AddCartComponent implements OnInit {
  public cartbody:HTMLCollectionOf<Element>;
  @Input() _addlist = [];
  @Input() panelOpenState = true;
  @Output() del_addlist = new EventEmitter();
  @Output() changeopenstate = new EventEmitter();
  @Output() save_addlist = new EventEmitter();

//#-----------------------------[Change Language]--------------------------------#

  // public header = 'เสียงที่ต้องการเพิ่มไปยังสตูดิโอสร้างเสียง';
  // public result_false = 'คุณยังไม่ได้ทำการเพิ่มเสียงไปยังสตูดิโอสร้างเสียง';
  // public add_btn = ['กดปุ่ม','เพื่อเพิ่มเสียง'];
  // public result = ['เพิ่มทั้งหมด','รายการ'];
  // public total = ['รวมทั้งหมด','เสียง'];
  // public saveSpeaker_ = 'บันทึกข้อมูล';

//#-----------------------------[Change Language]--------------------------------#

  constructor(
    private _changeLanguage:ChangeLanguageService,
  ) { }

  ngOnInit(): void {
    this._changeLanguage.language.subscribe(
      res => {
        if (res){
          this.get_dataChangeLanguage(res)
        }
      }
    )
    this.cartbody = document.getElementsByClassName('cartbody');
  }

  onWheel(event: WheelEvent): void {
    if(event.deltaY>0){
      this.cartbody[0].scrollLeft += 125;
    }else{
      this.cartbody[0].scrollLeft -= 125;
    }
    event.preventDefault();
  }

  changeOpenState(){
    this.changeopenstate.emit();
  }

  delperson(person:any){
    this.del_addlist.emit(person);
  }

  saveSpeaker(){
    this.save_addlist.emit();
  }

  text = TH.marketplaceObj.add_cart;

  get_dataChangeLanguage(temp: any){
    if(temp == 'TH'){
      this.text = TH.marketplaceObj.add_cart;
    }
    else if (temp == 'EN'){
      this.text = EN.marketplaceObj.add_cart;
    }
  }

}
