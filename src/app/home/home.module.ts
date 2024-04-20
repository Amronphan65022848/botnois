import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { CampaignComponent } from './components/campaign/campaign.component';
import { SoundSampleV3Component } from './components/sound-sample-v3/sound-sample-v3.component';
import { StudioComponent } from './components/studio/studio.component';
import { CompareContentComponent } from './components/compare-content/compare-content.component';
import { CarouselV3Component } from './components/carousel-v3/carousel-v3.component';
import { NewsAndActivitiesComponent } from './components/news-and-activities/news-and-activities.component';
import { StepsComponent } from './components/steps/steps.component';
import { FeaturesUpdateComponent } from './components/features-update/features-update.component';
import { CardListComponent } from './components/card-list/card-list.component';
import { BottomBannerComponent } from './components/bottom-banner/bottom-banner.component';
import { WhyUsComponent } from './components/why-us/why-us.component';
import { ReviewComponent } from './components/review/review.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { XmasComponent } from './components/xmas/xmas.component';
import { CreateSoundComponent } from './components/create-sound/create-sound.component';
import { MediaCenterComponent } from './components/media-center/media-center.component';
import { CreateSoundV2Component } from './components/create-sound-v2/create-sound-v2.component';
import { GenSoundSampleComponent } from '../shared/components/gen-sound-sample/gen-sound-sample.component';
import { PointListComponent } from '../shared/components/payment/point-group/point-box/point-list/point-list.component';
import { ExperienceComponent } from '../shared/components/experience/experience.component';
import { ActivityNewsComponent } from './components/activity-news/activity-news.component';
import { LogoPlatformComponent } from './components/logo-platform/logo-platform.component';
import { CreateRealWorksComponent } from './components/create-real-works/create-real-works.component';
import { StickySidebarComponent } from './components/sticky-sidebar/sticky-sidebar.component';
import { PartnerComponent } from './components/partner/partner.component';
import { DiscoverUsersComponent } from './components/discover-users/discover-users.component';

const modules = [MatExpansionModule];

const standalone = [
  GenSoundSampleComponent,
  PointListComponent,
  ExperienceComponent,
  ActivityNewsComponent,
  LogoPlatformComponent,
  CreateRealWorksComponent,
  StickySidebarComponent,
  PartnerComponent,
  DiscoverUsersComponent,
];

@NgModule({
  declarations: [
    HomeComponent,
    CampaignComponent,
    SoundSampleV3Component,
    StudioComponent,
    CarouselV3Component,
    NewsAndActivitiesComponent,
    StepsComponent,
    FeaturesUpdateComponent,
    CardListComponent,
    BottomBannerComponent,
    WhyUsComponent,
    ReviewComponent,
    ContactUsComponent,
    XmasComponent,
    MediaCenterComponent,
    CreateSoundComponent,
    CreateSoundV2Component,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    ...standalone,
  ].concat(modules),
})
export class HomeModule {}
