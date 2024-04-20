import { Component } from '@angular/core';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { Router } from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-create-real-works',
  standalone: true,
  imports: [NgIf],
  templateUrl: './create-real-works.component.html',
  styleUrl: './create-real-works.component.scss'
})
export class CreateRealWorksComponent {
  public text = null;
  popup1 = false
  popup2 = false
  popup3 = false

  constructor(
    private _changeLanguage: ChangeLanguageService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {

        this.text = language[res].landingPageV3Obj;




      }
    });
  }
  mediaCenter(){
    this.router.navigate(['/media'])
    .then((res) => {
      if (res) {
        // Trigger function to get language from url-path
        // this.getLanguageParam();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  navigateToUrl(url: string) {
    window.open(url, '_blank');
  }

}
