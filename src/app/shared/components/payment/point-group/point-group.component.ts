import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData } from 'src/app/auth/models/auth-model';
import { PointBoxComponent } from './point-box/point-box.component';
import { TPackageType, Pages } from 'src/app/payment/models/buy-point-model';

@Component({
  selector: 'app-point-group',
  standalone: true,
  imports: [CommonModule, PointBoxComponent],
  templateUrl: './point-group.component.html',
  styleUrl: './point-group.component.scss',
})
export class PointGroupComponent {
  packageTypes: TPackageType[] = [
    { type: 1, isExpand: true, class: 'default-pack', expandColor: '#01BFFB' },
    { type: 2, isExpand: true, class: 'regular-pack', expandColor: '#822549' },
    { type: 3, isExpand: true, class: 'pro-pack', expandColor: '#FFBB54' },
    {
      type: 4,
      isExpand: true,
      class: 'unlimited-pack',
      expandColor: '#FFBB54',
    },
  ];

  @Input() user: UserData;
  @Input() page: Pages = 'payment' || 'quote' || 'seo';

  constructor() {}
}
