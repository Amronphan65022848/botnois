import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-dialog-delete-row',
  templateUrl: './dialog-delete-row.component.html',
  styleUrls: ['./dialog-delete-row.component.css']
})
export class DialogDeleteRowComponent implements OnInit {

  value:any

  //#-----------------------------[Change Language]--------------------------------#

  // public acceptDeletes = "ยืนยันการลบข้อมูล";
  // public confirmDelete = "คุณต้องการลบ";
  // public checkList = "รายการใช่หรือไม่";
  // public cancel_ = "ยกเลิก";
  // public accept_ = "ยืนยัน";

  //#-----------------------------[Change Language]--------------------------------#

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteRowComponent>,
    @Inject(MAT_DIALOG_DATA) public b: any,
    private _changelanguage : ChangeLanguageService,
    ) {
      this.value = b
    }

  ngOnInit(): void {
    this._changelanguage.language.subscribe((res)=>{
      if(res){
        this.text = language[res].dialogMessageObj
      }
    })
  }
  dialogClose() {
    this.dialogRef.close()
  }

  text = null;

}
