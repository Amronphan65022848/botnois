import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-partner',
  standalone: true,
  imports: [],
  templateUrl: './partner.component.html',
  styleUrl: './partner.component.scss',
})
export class PartnerComponent {
  public text = null;
  private languageSubscription: Subscription;

  constructor(private _changeLanguage: ChangeLanguageService) {}

  ngOnInit() {
    this.languageSubscription = this._changeLanguage.language.subscribe(
      (res) => {
        if (res) {
          this.text = language[res].landingPageV3Obj.partner;
        }
      },
    );
  }

  contract() {
    window.open('https://forms.gle/uLT2DoXZArLYduLb8', '_blank');
  }

  ngOnDestroy() {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }
}
