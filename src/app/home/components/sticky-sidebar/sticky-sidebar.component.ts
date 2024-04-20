import { Component } from '@angular/core';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sticky-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sticky-sidebar.component.html',
  styleUrl: './sticky-sidebar.component.scss'
})
export class StickySidebarComponent {
  public text = null;
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
  
  navigateToUrl(url: string) {
    window.open(url, '_blank');
  }
}
