import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { LeaveDialogComponent } from './text2speech-v2/dialog/leaveDialog/leave-dialog/leave-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WorkspaceService } from '../shared/services/workspace.service';
import { DialogService } from '../dialog/services/dialog.service';
import { AuthService } from '../auth/services/auth.service';
import { LeaveFreeDialogComponent } from './text2speech-v2/dialog/leave-free-dialog/leave-free-dialog.component';
import { AdsService } from './services/ads.service';

@Injectable({
  providedIn: 'root',
})
export class LeavePageGuard  {
  dialogRef: MatDialogRef<LeaveDialogComponent> | null = null;

  public user = null;

  constructor(
    private dialog: MatDialog,
    private _workspace: WorkspaceService,
    private _dialog: DialogService,
    private _auth: AuthService,
    private _ads: AdsService,
  ) { }

  canDeactivate(
    component: any
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isSaved = this._workspace.getSave();
    const data = component.data;
    const workspace_id = component.workspaceId;

    // Update ads if existed value
    this._ads.fetchUpdateAds()

    // Set cookie when user leave studio page
    this._ads.setAdsCookie()

    this._auth.data.subscribe((res) => {
      if (res) this.user = res;
    });

    const text_list = data
      .filter((item) => item.text && item.text.length > 0)
      .map((item) => ({
        text: item.text,
        speaker: Number(item.speaker) ?? null, // Check null
      }));

    // Prepare data by const
    const workspace = {
      workspace_id,
      text_list,
    };

    // if (this.user.subscription === 'Free' && !isSaved) {

    //   const ref = this.dialog.open(LeaveFreeDialogComponent, {
    //     disableClose: true,
    //   });


    //   return new Promise<boolean>((resolve) => {
    //     ref.afterClosed().subscribe(
    //       resp => {
    //         if(resp) {
    //           resolve(true)
    //         } else {
    //           resolve(false)
    //         }
    //       }
    //     )
    //   });
    // } else
    if (isSaved) {
      return true;
    } else {
      // Show the confirmation dialog
      this.dialogRef = this.dialog.open(LeaveDialogComponent, {
        disableClose: true, // Prevent closing the dialog by clicking outside or pressing Escape
      });

      // Return a promise that resolves when the user confirms or cancels the navigation
      return new Promise<boolean>((resolve) => {
        this.dialogRef.componentInstance.confirmEvent.subscribe(
          (confirmed: boolean) => {
            if (confirmed === false) {
              this.dialogRef?.close();
              resolve(confirmed);
            } else {
              this._workspace.saveTextWorkspace(workspace).subscribe({
                next: () => { },
                error: (err) => {
                  this._dialog.error(err.error.message ?? JSON.stringify(err?.error));
                },
              });
              this.dialogRef?.close();
              resolve(confirmed);
            }
          }
        );
      });
    }
  }
}
