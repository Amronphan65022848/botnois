import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-patch-note',
  templateUrl: './patch-note.component.html',
  styleUrls: ['./patch-note.component.scss']
})
export class PatchNoteComponent implements OnInit {

  text = null
  image = []
  isNeverShow = false
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private _language: ChangeLanguageService,
    private dialogRef: MatDialogRef<PatchNoteComponent>
  ) {
    // this.image = this.data.image
    // this.text = this.data.text
  }

  ngOnInit(): void {
    this._language.language.subscribe(
      resp => {
        this.text = language[resp].patchNoteObj
      }
    )
  }

  onClose() {
    if(this.isNeverShow) {
      this.dialogRef.close('never')
    } else {
      this.dialogRef.close()
    }
  }
}
