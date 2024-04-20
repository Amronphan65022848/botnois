import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData } from 'src/app/auth/models/auth-model';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { MatIconModule } from '@angular/material/icon';
import { NgxLoadingModule } from 'ngx-loading';
import { PointListComponent } from './point-list/point-list.component';
import { TPackageType, Pages } from 'src/app/payment/models/buy-point-model';
import { Language } from 'src/app/shared/models/shared-model';
import { analyticId } from 'src/app/shared/mocks/analyticId-mock';

@Component({
  selector: 'app-point-box',
  standalone: true,
  imports: [CommonModule, MatIconModule, NgxLoadingModule, PointListComponent],
  templateUrl: './point-box.component.html',
  styleUrl: './point-box.component.scss',
})
export class PointBoxComponent {
  text = language['TH'].walletObj.buy_points;
  lang: Language = null;
  packageEventTypes: TPackageType = {
    type: 1,
    isExpand: true,
    class: 'event-pack',
    expandColor: '#D40101',
  };
  @Input() user: UserData;
  @Input() page: Pages = 'payment' || 'quote' || 'seo' || 'studio';
  @Input() $typeIndex: number;
  @Input() packageType: TPackageType;
  @Input() isSaleEvent = false;
  @Input() triggerType: any;
  isLoadPackage: boolean = false;
  analyticId = analyticId.payment.buyPoint.expand;
  get getPackageTagClass() {
    return this.isSaleEvent ? 'event-tag' : 'package-tag';
  }

  get gradientBorderClass() {
    return this.isSaleEvent ? 'gradient-border-event' : 'gradient-border';
  }

  get getSelectedClass() {
    return this.isSaleEvent
      ? this.packageEventTypes.class
      : this.packageType.class;
  }

  get getSelectedExpandColor() {
    return this.isSaleEvent
      ? this.packageEventTypes.expandColor
      : this.packageType.expandColor;
  }

  get getPackageType() {
    return this.isSaleEvent ? this.packageEventTypes : this.packageType;
  }

  get notShowEventOnQuote() {
    return this.getPackageType.class === 'event-pack' && this.page === 'quote';
  }

  constructor(private _language: ChangeLanguageService) {}

  ngOnInit(): void {
    // Get language
    this._language.language.subscribe((resp) => {
      this.text = language[resp].walletObj.buy_points;
      this.lang = resp;
    });
  }

  toggleExpand() {
    this.packageType.isExpand = !this.packageType.isExpand;
  }
}
