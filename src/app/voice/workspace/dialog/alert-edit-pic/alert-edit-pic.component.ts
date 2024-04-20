import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-alert-edit-pic',
  templateUrl: './alert-edit-pic.component.html',
  styleUrls: ['./alert-edit-pic.component.scss'],
})
export class AlertEditPicComponent implements OnInit {
  public text = null;
  public imgSrc: any = '../../../assets/icons/v3/Rectangle 2777.png';
  public isAlert: boolean = false;
  public alertText: string = '';

  constructor(
    private dialogRef: MatDialogRef<AlertEditPicComponent>,
    private _changeLanguage: ChangeLanguageService
  ) {}

  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].workspaceObj.alertDialog[2];
      }
    });
  }

  onUploadImg(e: any) {
    const reader = new FileReader();
    this.isAlert = false;

    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      if (file.size > 10485760) {
        this.isAlert = true;
        this.alertText = this.text.sizeExceed;
      } else if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/webp' ||
        file.type === 'image/jpg'
      ) {
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.imgSrc = reader.result;
        };
      } else {
        this.isAlert = true;
        this.alertText = this.text.invalidType;
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close(this.imgSrc);
  }
}
