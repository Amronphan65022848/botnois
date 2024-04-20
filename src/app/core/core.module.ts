import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NavbarV2Component } from './components/navbar-v2/navbar-v2.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from '../dialog/dialog.module';
import { SaleEventDirective } from '../shared/directives/sale-event.directive';

/** library modules is only use on the specific module  */
const modules = [
  MatSidenavModule,
  MatMenuModule,
  CommonModule,
  HttpClientModule,
  BrowserAnimationsModule,
  SharedModule,
  DialogModule,
];

const components = [NavbarV2Component];

@NgModule({
  declarations: components,
  imports: modules,
  exports: components,
})
export class CoreModule {}
