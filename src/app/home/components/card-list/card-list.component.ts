import { Component, OnInit } from '@angular/core';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit {
  text = null;
  text_arr = [];
  icon_arr = [
    'robot_gradient',
    'world_gradient',
    'delay_gradient',
    'ribbon_gradient',
    'volume_gradient',
    'pencil_gradient',
    'phone_gradient',
    'eyes_gradient',
    'cloud_gradient',
  ];

  constructor(private _changeLanguage: ChangeLanguageService) {}

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text_arr = [];
        this.text = language[res].landingPageV3Obj.card_list;
        for (let item in this.text) {
          this.text_arr.push(this.text[item]);
        }
      }
    });
  }
}
