import { Component, OnInit } from '@angular/core';
import { InviteService } from 'src/app/shared/services/invite.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessCopyComponent } from 'src/app/dialog/components/success-copy/success-copy.component';
import { TH } from 'src/app/shared/change_language/TH';
import { EN } from 'src/app/shared/change_language/EN';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { WalletService } from '../../services/wallet.service';
@Component({
  selector: 'app-invite-page',
  templateUrl: './invite-page.component.html',
  styleUrls: ['./invite-page.component.css']
})
export class InvitePageComponent implements OnInit {
  public fakeqr: any = "../../assets/img/fake_qr.png"
  public linkCode: any;
  public linkInvite: any;
  public countInvite: any;
  public qrLink: any;

  //#-----------------------------[Change Language]--------------------------------#

  public main_text_invite = null
  public invite_one = null
  public invite_ten = null
  public invite_100 = null
  public sub_text_invite = null
  public link_invite = null
  public noted = null
  public copy_link = null
  public number_link = null
  public qr_maintext = null

  //#-----------------------------[Change Language]--------------------------------#

  constructor(
    private inviteService: InviteService,
    private snackBar: MatSnackBar,
    private _changeLanguage: ChangeLanguageService,
    public _wallet: WalletService,
  ) {


  }

  ngOnInit(): void {
    this._changeLanguage.language.subscribe(
      res => {
        if (res) {
          this.get_dataChangeLanguage(res)
        }
      }
    )
    new Promise((resolve) => {

      if (this.inviteService.data_invite.getValue()) {

        this.linkCode = this.inviteService.data_invite.getValue();
        resolve("success")

      }
      else {
        this.inviteService.getInviteCoupon().subscribe((res) => {

          this.linkCode = res.data
          resolve("success")
        })
      }

    }).then(() => {

      const base_url = location.origin;

      this.linkInvite = base_url + "/invite?code=" + this.linkCode.coupon_id;
      this.qrLink = this.linkInvite
      this.countInvite = this.linkCode.invite_count;

    })
  }

  copytoClipboard() {
    navigator.clipboard.writeText(this.qrLink);
    this.snackBar.openFromComponent(SuccessCopyComponent, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3 * 1000,
      panelClass: ["success-copy-link"]
    });

  }

  text = TH.walletObj.invite_page;

  get_dataChangeLanguage(temp: any) {
    if (temp == 'TH') {
      this.text = TH.walletObj.invite_page;
    }
    else if (temp == 'EN') {
      this.text = EN.walletObj.invite_page;
    }
    this.getdataInfo();
  }

  getdataInfo() {
    this.main_text_invite = this.text.main_text_invite
    this.invite_one = this.text.invite_one
    this.invite_ten = this.text.invite_ten
    this.invite_100 = this.text.invite_100
    this.sub_text_invite = this.text.sub_text_invite
    this.link_invite = this.text.link_invite
    this.noted = this.text.noted
    this.copy_link = this.text.copy_link
    this.number_link = this.text.number_link
    this.qr_maintext = this.text.qr_maintext
  }

}


















