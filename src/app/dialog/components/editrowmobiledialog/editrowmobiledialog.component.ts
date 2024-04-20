import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';
import { AudioDataAPI } from 'src/app/storage/models/text2speech-model';

@Component({
  selector: 'app-editrowmobiledialog',
  templateUrl: './editrowmobiledialog.component.html',
  styleUrls: ['./editrowmobiledialog.component.css'],
})
export class EditrowmobiledialogComponent implements OnInit {
  editword: any;
  firstWord: any;
  secondWord: any;
  id: any;
  public file = new Audio();

  //#-----------------------------[Change Language]--------------------------------#

  // public topicEditword = "แก้ไขคำอ่านผิด";
  // public writing = "คำเขียน";
  // public reading = "คำอ่าน";
  // public cancel_ = "ยกเลิก";
  // public save_ = "บันทึก";

  //#-----------------------------[Change Language]--------------------------------#

  constructor(
    public dialogRef: MatDialogRef<EditrowmobiledialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private textService: TextspeechService,
    private _changelanguage: ChangeLanguageService,
  ) {
    this.editword = data;
    this.id = data._id;
    this.firstWord = data.before_text;
    this.secondWord = data.after_text;
  }
  playCurrentText(data: any) {
    const text = data;
    const voice = 1;
    const result = this.getfileStorage(text);

    // TEST NEW FLOW
    if (result.length == 1) {
      // this.file.src = URL.createObjectURL(result[0].file);

      this.file.play();
    } else {
      const temp: AudioDataAPI = {
        audio_id: data._id,
        text: data.text,
        text_delay: data.text,
        speaker: data.speaker,
        volume: '100',
        speed: '1',
        type_voice: 'wav',
      };
      this.textService.generateVoice(temp).subscribe((file: any) => {
        this.keepfileStorage(text, file);
        this.file.src = URL.createObjectURL(file);
        this.file.play();
      });
    }
  }

  cancle() {
    this.dialogRef.close(false);
  }
  submit() {
    const firstword = document.getElementById('firstWord') as HTMLInputElement;
    const secondword = document.getElementById(
      'secondWord',
    ) as HTMLInputElement;

    const arrMobile: any = {
      _id: this.data._id,
      before_text: firstword.value,
      after_text: secondword.value,
    };

    this.dialogRef.close(arrMobile);
  }

  ngOnInit(): void {
    this._changelanguage.language.subscribe((res) => {
      if (res) {
        this.get_dataChangelanguage(res);
      }
    });
  }
  close_dialog() {
    this.dialogRef.close(false);
  }

  getfileStorage(text: string) {
    const _text = text;

    const result = this.textService.file
      .getValue()
      .filter((sound: any) => sound.text == _text);
    return result;
  }
  keepfileStorage(text: string, file: Blob) {
    const _text = text;
    const new_file: any = [{ text: _text, file: file }];
    this.textService.file.next([
      ...this.textService.file.getValue(),
      ...new_file,
    ]);
  }

  text = TH.dialogMessageObj;

  get_dataChangelanguage(temp: any) {
    if (temp == 'TH') {
      this.text = TH.dialogMessageObj;
    } else if (temp == 'EN') {
      this.text = EN.dialogMessageObj;
    }
  }
}
