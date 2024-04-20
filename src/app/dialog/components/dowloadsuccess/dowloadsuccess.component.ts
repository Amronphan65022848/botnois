import { Component, OnInit } from '@angular/core';
import {  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
@Component({
  selector: 'app-dowloadsuccess',
  templateUrl: './dowloadsuccess.component.html',
  styleUrls: ['./dowloadsuccess.component.css']
})
export class DowloadsuccessComponent implements OnInit {
  public isLoading:boolean;

  //#-----------------------------[Change Language]--------------------------------#

  // public successfulDownloadSound = "ดาวน์โหลดไฟล์เสียงสำเร็จ";
  // public successfulDownload = "การดาวน์โหลดไฟล์สำเร็จแล้ว";
  // public agree_ = "ตกลง";

  //#-----------------------------[Change Language]--------------------------------#


  constructor(
    private dialogRef: MatDialogRef<DowloadsuccessComponent>,
    private _changelanguage: ChangeLanguageService,
  ) {
    this.isLoading = true;
   }

  ngOnInit(): void {
    this._changelanguage.language.subscribe((res)=>{
      if(res){
        this.get_dataChangelanguage(res);
      }
    })

  }

  close(){
    this.dialogRef.close(true);
  }

  text = TH.dialogMessageObj;

  get_dataChangelanguage(temp:any){
    if(temp == 'TH'){
      this.text = TH.dialogMessageObj;
    }
    else if (temp == 'EN'){
      this.text = EN.dialogMessageObj;
    }
  }

}

