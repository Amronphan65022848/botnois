import { Component, OnInit } from '@angular/core';
import { ChangeLanguageService } from '../../services/change-language.service';
import { language } from '../../change_language/language';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

  text = null

  constructor(
    private _language: ChangeLanguageService,
  ) { }

  ngOnInit(): void {
    this._language.language.subscribe(
      resp => {
        if(resp) {
          this.text = language[resp].maintenance
        }
      }
    )
  }

}
