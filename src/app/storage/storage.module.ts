import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageRoutingModule } from './storage-routing.module';
import { StorageComponent } from './storage.component';
import { SharedModule } from '../shared/shared.module';


import { AudioDownloadDialogComponent } from './components/audio-download-dialog/audio-download-dialog.component';

import { audioSearchPipe } from '../shared/pipes/search.pipe';
import { AudioDownloadSelectComponent } from './components/audio-download-select/audio-download-select.component';
import { AudioRemoveSelectComponent } from './components/audio-remove-select/audio-remove-select.component';
import { MatSliderModule } from '@angular/material/slider';

const modules = [MatSliderModule]

@NgModule({
  declarations: [
    StorageComponent,
    AudioDownloadDialogComponent,
    AudioRemoveSelectComponent,
    AudioDownloadSelectComponent,
    audioSearchPipe,
  ],
  imports: [
    CommonModule,
    StorageRoutingModule,
    SharedModule,

  ].concat(modules)
})
export class StorageModule { }
