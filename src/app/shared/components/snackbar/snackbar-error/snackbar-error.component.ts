import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

interface SnackData {
  text: string;
  icon: string;
}

@Component({
  selector: 'app-snackbar-error',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './snackbar-error.component.html',
  styleUrl: './snackbar-error.component.scss',
})
export class SnackbarErrorComponent {
  text: string;
  icon: string;
  snackBarRef = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackData) {
    this.text = data.text;
    this.icon = data.icon;
  }
}
