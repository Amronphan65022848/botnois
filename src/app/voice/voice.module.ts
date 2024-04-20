import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VoiceRoutingModule } from './voice-routing.module';
import { VoiceComponent } from './voice.component';
import { SharedModule } from '../shared/shared.module';
import { Text2speechV2Component } from './text2speech-v2/text2speech-v2.component';
import { BottomMenuSettingComponent } from './text2speech-v2/bottom-menu-setting/bottom-menu-setting.component';
import { ImportexportT2sComponent } from './text2speech-v2/importexport-t2s/importexport-t2s.component';
import { ConverToolbarComponent } from './text2speech-v2/conver-mode/conver-toolbar/conver-toolbar.component';
import { ConverModeComponent } from './text2speech-v2/conver-mode/conver-mode.component';
import { DialogModule } from '../dialog/dialog.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { ApiTutorialComponent } from './api-tutorial/api-tutorial.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';
import { Text2speechV3Component } from './text2speech-v3/text2speech-v3.component';
import { SideToolbarComponent } from './text2speech-v3/side-toolbar/side-toolbar.component';
import { ConverToolComponent } from './text2speech-v3/conver-tool/conver-tool.component';
import { InstructionComponent } from './text2speech-v3/instruction/instruction.component';
import { VoiceStudioComponent } from './text2speech-v3/voice-studio/voice-studio.component';
import { AdviceCoProjectComponent } from './text2speech-v3/advice-co-project/advice-co-project.component';
import { SpeakerListComponent } from './text2speech-v3/conver-tool/speaker-list/speaker-list.component';
import { SearchPipe } from './text2speech-v3/search.pipe';
import { WorkspaceComponent } from './workspace/workspace.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ExportDialogComponent } from './text2speech-v2/dialog/exportDialog/exportDialog.component';
import { ImportDialogComponent } from './text2speech-v2/dialog/importDialog/importDialog.component';
import { LeaveDialogComponent } from './text2speech-v2/dialog/leaveDialog/leave-dialog/leave-dialog.component';
import { CancelDialogComponent } from './text2speech-v2/dialog/cancel-dialog/cancel-dialog.component';
import { HistoryAllDialogComponent } from './text2speech-v2/dialog/history-all-dialog/history-all-dialog.component';
import { SpeakerDialogComponent } from './new-component/speaker-dialog/speaker-dialog.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PanelReplacewordComponent } from './text2speech-v2/panel-replaceword/panel-replaceword.component';
import { AlertProjFullComponent } from './workspace/dialog/alert-proj-full/alert-proj-full.component';
import { NoPointDialogComponent } from './text2speech-v2/dialog/no-point-dialog/no-point-dialog.component';
import { TextExceedLimitDialogComponent } from './text2speech-v2/dialog/text-exceed-limit-dialog/text-exceed-limit-dialog.component';
import { CantSaveDialogComponent } from './text2speech-v2/dialog/cant-save-dialog/cant-save-dialog.component';
import { AlertEditPicComponent } from './workspace/dialog/alert-edit-pic/alert-edit-pic.component';
import { AlertEditNameComponent } from './workspace/dialog/alert-edit-name/alert-edit-name.component';
import { AlertFlexComponent } from './workspace/dialog/alert-flex/alert-flex.component';
import { LeaveFreeDialogComponent } from './text2speech-v2/dialog/leave-free-dialog/leave-free-dialog.component';
import { FlexDialogComponent } from './text2speech-v2/dialog/flex-dialog/flex-dialog.component';
import { TooltipListPipe } from '../shared/pipes/tooltip-list.pipe';
import { AlertRemoveVoiceComponent } from './text2speech-v2/dialog/alert-remove-voice/alert-remove-voice.component';
import { WaveComponent } from './layout/wave/wave.component';
import { TextEditableComponent } from './text2speech-v2/text-editable.directive';

const modules = [
  MatStepperModule,
  MatListModule,
  ClipboardModule,
  MatBottomSheetModule,
  DragDropModule,
  MatMenuModule,
  // MatProgressSpinnerModule,
  ScrollingModule,
];

@NgModule({
  declarations: [
    VoiceComponent,
    Text2speechV2Component,
    BottomMenuSettingComponent,
    ImportexportT2sComponent,
    ConverModeComponent,
    ConverToolbarComponent,
    ApiTutorialComponent,
    Text2speechV3Component,
    SideToolbarComponent,
    ConverToolComponent,
    InstructionComponent,
    VoiceStudioComponent,
    AdviceCoProjectComponent,
    SpeakerListComponent,
    SearchPipe,
    WorkspaceComponent,
    ExportDialogComponent,
    ImportDialogComponent,
    LeaveDialogComponent,
    CancelDialogComponent,
    HistoryAllDialogComponent,
    SpeakerDialogComponent,
    PanelReplacewordComponent,
    AlertProjFullComponent,
    NoPointDialogComponent,
    TextExceedLimitDialogComponent,
    CantSaveDialogComponent,
    AlertEditPicComponent,
    AlertEditNameComponent,
    AlertFlexComponent,
    LeaveFreeDialogComponent,
    FlexDialogComponent,
    TooltipListPipe,
    AlertRemoveVoiceComponent,
    WaveComponent,
  ],
  imports: [
    CommonModule,
    VoiceRoutingModule,
    SharedModule,
    DialogModule,
    TextEditableComponent,
  ].concat(modules),
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VoiceModule { }
