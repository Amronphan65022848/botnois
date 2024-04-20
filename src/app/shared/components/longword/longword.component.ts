import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SubscriptionPackage } from 'src/app/voice/mocks/conversation-mock';
import { EN } from '../../change_language/EN';
import { TH } from '../../change_language/TH';
import { ChangeLanguageService } from '../../services/change-language.service';
import { GlobalFunctionService } from '../../services/global-function.service';

@Component({
  selector: 'app-longword',
  templateUrl: './longword.component.html',
  styleUrls: ['./longword.component.css']
})
export class LongwordComponent implements OnInit {
  public main_text: any;
  public sub_text: any;

  //#-----------------------------[Change Language]--------------------------------#

  public mainSelection: string = '';
  public subSelection: string = '';
  public mainLongword: string = '';
  public subLongword: string = '';

  //#-----------------------------[Change Language]--------------------------------#

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private _changelanguage: ChangeLanguageService,
    private _gfunc: GlobalFunctionService,
    private _auth: AuthService,
  ) {

  }

  ngOnInit(): void {
    this._changelanguage.language.subscribe((res) => {
      if (res) {
        this.get_dataChangelanguage(res);
      }
    })
    if (this.data == "Selection") {
      this.main_text = this.mainSelection;
      this.sub_text = this.subSelection;
    }
    else if (this.data == "Longword") {
      this.main_text = this.mainLongword;
      this.sub_text = this.subLongword;
    }
  }

  text = TH.longwordObj;

  get_dataChangelanguage(temp: any) {
    if (temp == 'TH') {
      this.text = TH.longwordObj;
    }
    else if (temp == 'EN') {
      this.text = EN.longwordObj;
    }
    this.getdataInfo()
  }

  getdataInfo() {
    const rank = this._auth.data.getValue().subscription
    const limit_text = SubscriptionPackage[rank].limit_text
    this.mainSelection = this.text.mainSelection.replace('x', this._gfunc.numberWithCommas(limit_text))
    this.subSelection = this.text.subSelection
    this.mainLongword = this.text.mainLongword.replace('x', this._gfunc.numberWithCommas(limit_text))
    this.subLongword = this.text.subLongword
  }

}
