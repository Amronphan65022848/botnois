import { Component, OnInit } from '@angular/core';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-alert-select-voice',
  templateUrl: './alert-select-voice.component.html',
  styleUrls: ['./alert-select-voice.component.scss'],
})
export class AlertSelectVoiceComponent implements OnInit {
  public text: any;

  constructor(private _chageLanguage: ChangeLanguageService) {}

  ngOnInit(): void {
    this._chageLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].selectVoiceObj;
      }
    });
  }
}
