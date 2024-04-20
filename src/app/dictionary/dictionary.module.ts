import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DictionaryRoutingModule } from './dictionary-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { DictionaryComponent } from './dictionary.component';
import { AddworddialogComponent } from './components/addworddialog/addworddialog.component';

/** library modules is only use on the specific module  */
const modules = [
  MatTableModule
]

@NgModule({
  declarations: [
    DictionaryComponent,
    AddworddialogComponent,
  ],
  imports: [
    CommonModule,
    DictionaryRoutingModule,
    SharedModule,
  ].concat(modules)
})
export class DictionaryModule { }
