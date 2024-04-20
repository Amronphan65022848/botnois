import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RecommendPackagePopUp } from '../../models/dialog-model';

@Component({
  selector: 'app-dialog-recommend-package',
  templateUrl: './dialog-recommend-package.component.html',
  styleUrls: ['./dialog-recommend-package.component.scss']
})
export class DialogRecommendPackageComponent implements OnInit {

  text = null
  currency = null
  point = 0
  bonus = 0
  constructor(
    @Inject(MAT_DIALOG_DATA) data: RecommendPackagePopUp,

  ) {
    this.text = data.language.recommend_popup
    this.currency = data.language.point
    this.point = data.point
    this.bonus = data.bonus
  }

  ngOnInit(): void {

  }

  onOffer(){

  }

  onBack(){

  }

}
