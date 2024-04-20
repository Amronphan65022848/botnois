import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

interface SnackData {
  text: string;
  icon: string;
}

@Component({
  selector: 'app-snackbar-success',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './snackbar-success.component.html',
  styleUrl: './snackbar-success.component.scss',
})
export class SnackbarSuccessComponent {
  text: string;
  icon: string;
  snackBarRef = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackData) {
    this.text = data.text;
    this.icon = data.icon;
  }
}
