import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChangeLanguageService } from '../../services/change-language.service';
import { language } from '../../change_language/language';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss'],
})
export class AuthDialogComponent implements OnInit {

  constructor(
    private _language: ChangeLanguageService,
  ) {

  }

  ngOnInit(): void {

  }

}
