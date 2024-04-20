import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user = null
  text = null
  copied = false
  toggleSpeaker = 0


  constructor(
    private _auth: AuthService,
    private _cb: Clipboard,
    private _language: ChangeLanguageService,
  ) { }

  ngOnInit(): void {

    this._language.language.subscribe(
      resp => {
        if(resp) {
          this.text = language[resp].userObj.profile
        }
      }
    )

    this._auth.data.subscribe(
      res => {
        if(res) this.user = res
      }
    )
  }

  copyUID(copy:HTMLSpanElement,done:HTMLSpanElement){
    this._cb.copy(this.user.uid)

    this.copied = true

    /* Display done icon */
    copy.style.display = 'none'
    done.style.display = 'block'

    /* After 1 second, display copy icon */
    setTimeout(() => {
      copy.style.display = 'block'
      done.style.display = 'none'

    }, 1000);

    setTimeout(() => {
      this.copied = false
    }, 0);
  }


  toggleSpeakerPage(page: number){
    this.toggleSpeaker = page === 0 ? 1 : 0
  }
}
