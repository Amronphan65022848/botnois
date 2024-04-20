import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-leave-dialog',
  templateUrl: './leave-dialog.component.html',
  styleUrls: ['./leave-dialog.component.scss'],
})
export class LeaveDialogComponent implements OnInit {
  @Output() confirmEvent = new EventEmitter<boolean>();

  text = null;

  constructor(private _changeLanguage: ChangeLanguageService) {}

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res];
        // this.lang = res;
      }
    });
  }

  onConfirm() {
    this.confirmEvent.emit(true);
  }

  onCancel() {
    this.confirmEvent.emit(false);
  }
}
