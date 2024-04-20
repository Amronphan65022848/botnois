import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-sound',
  templateUrl: './snack-sound.component.html',
  styleUrls: ['./snack-sound.component.scss'],
})
export class SnackSoundComponent implements OnInit {
  text = null;
  action = null;
  icon = null;
  color = null;

  constructor(
    public snackBarRef: MatSnackBarRef<SnackSoundComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {
    this.text = data?.text;
    this.action = data?.action;
    this.icon = data?.icon;
    this.color = data?.color;
  }

  ngOnInit(): void {}
}
