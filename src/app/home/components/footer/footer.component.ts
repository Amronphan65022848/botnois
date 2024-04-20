import { Component, OnInit } from '@angular/core';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  //#-----------------------------[Change Language]--------------------------------#

  public left = 'BY iBOTNOI';
  public right = 'Privacy Policy';

  //#-----------------------------[Change Language]--------------------------------#
  constructor(
    private _changeLanguage: ChangeLanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.get_dataChangeLanguage(res);
      }
    });
  }

  onNavigate() {
    this.router.navigate(['/Privacy&Policy']);
  }

  onNavigateToAgreement() {
    this.router.navigate(['/agreement']);
  }

  text = TH.landingPageObj;

  get_dataChangeLanguage(temp: any) {
    if (temp == 'TH') {
      this.text = TH.landingPageObj;
    } else if (temp == 'EN') {
      this.text = EN.landingPageObj;
    }
  }
}
