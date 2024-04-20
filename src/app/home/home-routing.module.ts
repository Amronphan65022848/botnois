import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignComponent } from './components/campaign/campaign.component';
import { HomeComponent } from './home.component';
import { XmasComponent } from './components/xmas/xmas.component';
import { MediaCenterComponent } from './components/media-center/media-center.component';
import { CreateSoundV2Component } from './components/create-sound-v2/create-sound-v2.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'media',
    component: MediaCenterComponent,
  },
  // {
  //   path: 'xmas',
  //   component: XmasComponent,
  // },
  {
    path: 'text-to-speech-voices/:lang',
    component: CreateSoundV2Component,
  },
  {
    path: 'text-to-speech-voices',
    redirectTo: 'text-to-speech-voices/en'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
