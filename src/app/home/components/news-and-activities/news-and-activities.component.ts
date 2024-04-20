import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { ComponentQueueService } from '../../services/component-queue.service';
import { language } from 'src/app/shared/change_language/language';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-and-activities',
  templateUrl: './news-and-activities.component.html',
  styleUrls: ['./news-and-activities.component.scss'],
})
export class NewsAndActivitiesComponent implements OnInit, AfterViewInit {
  public text = null;

  constructor(
    private _compontentQueue: ComponentQueueService,
    private _changeLanguage: ChangeLanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].landingPageV3Obj.news;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._compontentQueue.$componentsLoaded.next(2);
    }, 1000);
  }

  navigate() {
    this.router.navigate(['/xmas']);
  }
}
