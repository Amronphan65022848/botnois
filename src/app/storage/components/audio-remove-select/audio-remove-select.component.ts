import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AudioStorageApiService } from 'src/app/storage/services/audio-storage-api.service';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';

@Component({
  selector: 'app-audio-remove-select',
  templateUrl: './audio-remove-select.component.html',
  styleUrls: ['./audio-remove-select.component.scss']
})
export class AudioRemoveSelectComponent implements OnInit {


  //#-----------------------------[Change Language]--------------------------------#

  public acceptDeleted = "ยืนยันการลบไฟล์เสียง";
  public deleteSeleted = "คุณต้องการลบรายการที่เลือกไว้";
  public confirm = "ใช่หรือไม่";
  public cancel_ = "ยกเลิก";
  public accept_ = "ยืนยัน";
  count = null
  isLoading = false
  //#-----------------------------[Change Language]--------------------------------#


  deleting = false;
  audioData : any
  constructor(
    public dialogRef: MatDialogRef<AudioRemoveSelectComponent>,
    private _audioStorageApi: AudioStorageApiService,
    @Inject(MAT_DIALOG_DATA) data,
    private _changelanguage : ChangeLanguageService,
    // private snackbar: MatSnackBar
  ) {
    this.audioData = data
  }

  ngOnInit(): void {
    this._changelanguage.language.subscribe((res)=>{
      if(res){
        this.get_dataChangelanguage(res);
      }
    })
  }


  remove(){
    this.deleting = true
    this.isLoading = true
    this._audioStorageApi.removeFile(this.audioData)
    .pipe(catchError((err => {
      this.isLoading = false
      return throwError(err)
    })))
    .subscribe(
      res => {
        if(res){
          this.dialogRef.close(res)
        }
        this.isLoading = false
      }
    )
  }

  text = TH.audioObj.removeAudio;

  get_dataChangelanguage(temp:any){
    if(temp == 'TH'){
      this.text = TH.audioObj.removeAudio;
    }
    else if (temp == 'EN'){
      this.text = EN.audioObj.removeAudio;
    }
    this.getdataInfo()
  }

  getdataInfo(){
    this.acceptDeleted = this.text.acceptDeleted;
    this.deleteSeleted = this.text.deleteSeleted;
    this.confirm = this.text.confirm;
    this.cancel_ = this.text.cancel_;
    this.accept_ = this.text.accept_;
    this.count = this.text.count;
  }

}
