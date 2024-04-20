import { Component } from '@angular/core';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-activity-news',
  standalone: true,
  imports: [],
  templateUrl: './activity-news.component.html',
  styleUrl: './activity-news.component.scss'
})
export class ActivityNewsComponent {
  public text = null;

  constructor(
    private _changeLanguage: ChangeLanguageService,

  ) { }

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {

        this.text = language[res].landingPageV3Obj;




      }
    });
  }

}
