import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-auth-options',
  standalone: true,
  imports: [MatCheckboxModule],
  templateUrl: './auth-options.component.html',
  styleUrl: './auth-options.component.scss',
})
export class AuthOptionsComponent {
  @Input() text: any;
  @Output() _forgotPassword = new EventEmitter();
  @Output() _rememberPassword = new EventEmitter();
  constructor() {}

  onRememberPassword() {
    this._rememberPassword.emit();
  }

  onForgotPassword() {
    this._forgotPassword.emit();
  }
}
