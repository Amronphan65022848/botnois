import { Component, OnInit } from '@angular/core';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { ComponentQueueService } from '../../services/component-queue.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  text = null;
  headerText = null;

  constructor(
    private _compontentQueue: ComponentQueueService,
    private _changeLanguage: ChangeLanguageService
  ) {}

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].landingPageObj.feedback;
        this.headerText = language[res].landingPageV3Obj.review;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._compontentQueue.$componentsLoaded.next(6);
    }, 5000);
  }
}
