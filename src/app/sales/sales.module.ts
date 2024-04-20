import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { SharedModule } from '../shared/shared.module';
import { PopupBgComponent } from './components/popup-bg/popup-bg.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [SalesComponent, PopupBgComponent],
  imports: [CommonModule, SalesRoutingModule, SharedModule, MatTooltipModule],
  exports: [PopupBgComponent],
})
export class SalesModule {}
