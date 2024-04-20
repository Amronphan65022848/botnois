import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  effect,
  model,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Block } from '../../models/conversation-model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarSuccessComponent } from 'src/app/shared/components/snackbar/snackbar-success/snackbar-success.component';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddWordsComponent } from '../add-words/add-words.component';
import { PlayAllComponent } from '../play-all/play-all.component';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { DownloadSigleComponent } from '../download-sigle/download-sigle.component';
import { SnackbarErrorComponent } from 'src/app/shared/components/snackbar/snackbar-error/snackbar-error.component';
import { TotalBoxComponent } from '../total-box/total-box.component';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { language } from 'src/app/shared/change_language/language';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PlayAllComponent,
  ],
})
export class BottomNavComponent implements OnInit {
  // Signal
  // Two way binding
  data = model<Block[]>([]);
  @Output() dataChange = new EventEmitter<Block[]>();
  @Input() focusIndex: number;
  @Output() focusIndexChange = new EventEmitter<number>();

  isSelecting = model<boolean>();
  selectedList = model<string[]>();
  countSelect = model<number>();
  navState = signal<string>('');
  navActivated = signal<string>('');
  //
  @Input() workspaceId: string;
  @Input() historyWord: string[];
  //
  @Output() downloadSound = new EventEmitter<any>();
  //
  scrollStrategy: ScrollStrategy;

  isSaving: boolean = false;
  isEdit: boolean = false;
  //
  text;
  lang;

  constructor(
    private _workspace: WorkspaceService,
    private _dialog: DialogService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private sso: ScrollStrategyOptions,
    private _changeLanguage: ChangeLanguageService,
  ) {
    effect(
      () => {
        if (this.isSelecting()) {
          this.navState.set('selecting');
          this.bottomDialog();
        } else {
          this.navState.set('default');
          this.dialog.closeAll();
        }
      },
      {
        allowSignalWrites: true,
      },
    );

    this.scrollStrategy = this.sso.noop();
  }

  ngOnInit() {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].studioMobileFirstObj.bottomNav;
        this.lang = res;
      }
    });
  }

  onSaveText() {
    if (this.isSaving) return;
    // else if (this.isFreeUser) return this.dialog.open(CantSaveDialogComponent);
    // this._dialog.warning('Free user')

    this.isSaving = true; // On saving progress

    const result = this.data()
      .filter((item) => item.text && item.text.length > 0)
      .map((item) => ({
        text: item.text,
        speaker: Number(item.speaker) ?? 1, // replace 1 (Ava) when null
      }));

    // Prepare data by const
    const workspace = {
      workspace_id: this.workspaceId,
      text_list: result,
    };

    // Fetching API
    this._workspace.saveTextWorkspace(workspace).subscribe({
      next: () => {
        // Set true instantly when get response
        this._workspace.setSave(true);

        setTimeout(() => {
          this.isSaving = false; // after that user can save again
          this._snackBar.openFromComponent(SnackbarSuccessComponent, {
            data: {
              text: this.text.save_success,
              icon: 'check_circle_filled_dynamic',
            },
            panelClass: 'snackbar-success-green',
            verticalPosition: 'bottom',
          });
        }, 2000);
      },
      error: (err) => {
        this._dialog.error(err.error.message ?? JSON.stringify(err?.error));
      },
    });
  }

  bottomDialog() {
    let ref: any;

    ref = this.dialog.open(TotalBoxComponent, {
      autoFocus: false,
      disableClose: true,
      hasBackdrop: false,
      scrollStrategy: this.scrollStrategy,
      width: '100vw',
      maxWidth: '100vw',
      position: { bottom: '62px' },
      panelClass: 'dialog-floating',
    });
  }

  toggleDialog(type: string) {
    let ref: MatDialogRef<any>;

    if (type === this.navActivated()) {
      this.navActivated.set('');
      return this.dialog.closeAll();
    } else if (this.navActivated().length > 0) {
      this.dialog.closeAll();
      this.navActivated.set(type);
    } else {
      this.navActivated.set(type);
    }

    this.dialog.afterAllClosed.subscribe((res) => {
      this.navActivated.set('');
    });

    setTimeout(() => {
      switch (type) {
        case 'edit-words':
          ref = this.dialog.open(AddWordsComponent, {
            data: { history: this.historyWord },
            autoFocus: false,
            width: '100vw',
            maxWidth: '100vw',
            position: { bottom: '62px' },
            panelClass: 'dialog-no-bottom-shadow',
          });
          this.navActivated.set(type);
          break;

        case 'play-all':
          ref = this.dialog.open(PlayAllComponent, {
            autoFocus: false,
            backdropClass: 'transparent-backdrop',
            scrollStrategy: this.scrollStrategy,
            width: '100vw',
            maxWidth: '100vw',
            position: { bottom: '62px' },
            panelClass: 'dialog-floating',
          });
          this.navActivated.set(type);
          break;

        case 'download':
          // call function download
          if (
            !this.data()[this.focusIndex].isEdit &&
            this.data()[this.focusIndex].category === 'soundtrack'
          ) {
            this.navActivated.set(type);
            this.downloadSound.emit(this.data()[this.focusIndex]);
          } else {
            this.navActivated.set('');
            this._snackBar.openFromComponent(SnackbarErrorComponent, {
              data: {
                text: this.text.download_alert,
                icon: 'danger_dynamic',
              },
              panelClass: 'snackbar-error-red',
              verticalPosition: 'bottom',
            });
          }

          break;

        case 'generate-selected':
          console.log('generating', this.selectedList());

          break;

        case 'delete-selected':
          break;

        case 'download-selected':
          break;

        case 'change-speaker-selected':
          break;

        default:
          break;
      }
    }, 0);
  }
}
