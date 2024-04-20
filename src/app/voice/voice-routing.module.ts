import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiTutorialComponent } from './api-tutorial/api-tutorial.component';
import { Text2speechV2Component } from './text2speech-v2/text2speech-v2.component';
import { Text2speechV3Component } from './text2speech-v3/text2speech-v3.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { LeavePageGuard } from './leave-page.guard';
import { Text2speechMobileFirstComponent } from './text2speech-mobile-first/text2speech-mobile-first.component';
import { PromptStudioComponent } from './prompt-studio/prompt-studio.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'workspace',
    pathMatch: 'full',
  },
  {
    path: 'tts',
    redirectTo: 'conversation',
    pathMatch: 'full',
  },
  {
    path: 'book',
    redirectTo: 'conversation',
  },
  {
    path: 'workspace',
    component: WorkspaceComponent,
  },
  {
    path: 'conversation',
    component: Text2speechV2Component,
    canDeactivate: [LeavePageGuard],
  },
  {
    path: 'conversation-v3',
    component: Text2speechV3Component,
  },
  {
    path: 'conversation-v2',
    component: Text2speechMobileFirstComponent,
  },
  {
    path: 'api-developer',
    component: ApiTutorialComponent,
  },
  {
    path: 'prompt-studio',
    component: PromptStudioComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoiceRoutingModule {}
