import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';
import { AudioDataAPI } from 'src/app/storage/models/text2speech-model';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';
import { ChangeLanguageService } from '../../../shared/services/change-language.service';
@Component({
  selector: 'app-addworddialog',
  templateUrl: './addworddialog.component.html',
  styleUrls: ['./addworddialog.component.scss']
})
export class AddworddialogComponent implements OnInit {
  soundDummy ='อูเบอร์'
  soundDummy01 ='อู-เบ้อ'
  soundSample_write = ''
  soundSample_read = ''
  public formWords = this.fb.group({
    words: this.fb.array([])
  })

//#-----------------------------[Change Language]--------------------------------#

  // public addWrongWord  = 'เพิ่มคำอ่านผิด';
  // public writing_ex    = ['ตัวอย่างคำเขียน','อูเบอร์'];
  // public reading_ex    = ['ตัวอย่างคำอ่าน','อู-เบ้อ'];
  // public writing       = 'คำเขียน';
  // public reading       = 'คำอ่าน';
  public typeWrite     = 'พิมพ์คำเขียน';
  public typeRead      = 'พิมพ์คำอ่านสะกดคำ';
  // public typeReaded    = 'พิมพ์คำอ่าน';
  // public addAnother    = 'เพิ่มคำอื่นๆ';
  // public save          = 'บันทึก';
  // public cancel        = 'ยกเลิก';

//#-----------------------------[Change Language]--------------------------------#



  constructor(
    public dialogRef: MatDialogRef<AddworddialogComponent>,
    private fb: FormBuilder,
    private speechService: TextspeechService,
    private changeLanguage:ChangeLanguageService,
  ){
    this.addWord()
  }

  get arrWord(): FormArray {
    return this.formWords.controls['words'] as FormArray;
  }

  addWord() {


      const newWord = this.fb.group({
        before_text: new FormControl('',
          [
            Validators.pattern('^[a-zA-Z]$')
          ]),
        after_text: new FormControl('',
          [
            Validators.pattern('^[a-zA-Z]$')
          ]),
      })
     this.arrWord.push(newWord);

  }

  submit() {
    this.dialogRef.close(this.formWords.value.words);
  }

  cancle(){
    this.dialogRef.close();

  }
  ngOnInit(): void {
    this.changeLanguage.language.subscribe(
      res => {
        if (res){
          this.get_dataChangeLanguage(res)
        }
      }
    )
  }
  onClickSoundDummy() {
    const text = this.soundDummy;
    const speaker = '1';

    if (text.length > 0) {
      const temp:AudioDataAPI = {
        text: text,
        text_delay: text,
        speaker: speaker,
        volume: "100",
        speed: "1",
        type_voice: 'wav'
      }
      this.speechService.generateVoice(temp).subscribe((res:any) => {
        const audio_file = new Audio();
        audio_file.src = URL.createObjectURL(res);
        audio_file.play();
      });
    }
  }
  onClickSoundDummy01() {
    const text = this.soundDummy;
    const speaker = '1';

    if (text.length > 0) {
      const temp:AudioDataAPI = {
        text: text,
        text_delay: text,
        speaker: speaker,
        volume: "100",
        speed: "1",
        type_voice: 'wav'
      }
      this.speechService.generateVoice(temp).subscribe((res:any) => {
        const audio_file = new Audio();
        audio_file.src = URL.createObjectURL(res);
        audio_file.play();
      });
    }
  }
  onClickSoundSample_write(write:any) {


    const text =write.value.before_text;
    const speaker = '1';

    if (text.length > 0) {
      const temp:AudioDataAPI = {
        text: text,
        text_delay: text,
        speaker: speaker,
        volume: "100",
        speed: "1",
        type_voice: 'wav'
      }
      this.speechService.generateVoice(temp).subscribe((res:any) => {
        const audio_file = new Audio();
        audio_file.src = URL.createObjectURL(res);
        audio_file.play();
      });
    }
  }

  onClickSoundSample_read(read:any) {
    const text =read.value.after_text;
    const speaker = '1';

    if (text.length > 0) {
      const temp:AudioDataAPI = {
        text: text,
        text_delay: text,
        speaker: speaker,
        volume: "100",
        speed: "1",
        type_voice: 'wav'
      }
      this.speechService.generateVoice(temp).subscribe((res:any) => {
        const audio_file = new Audio();
        audio_file.src = URL.createObjectURL(res);
        audio_file.play();
      });
    }
  }
  close_dialog(){
    this.dialogRef.close();
  }

  text = TH.addworddialogObj;

  get_dataChangeLanguage(temp: any){
    if(temp == 'TH'){
      this.text = TH.addworddialogObj;
    }
    else if (temp == 'EN'){
      this.text = EN.addworddialogObj;
    }
    this.typeWrite     = this.text.typeWrite + "...";
    this.typeRead      = this.text.typeRead + "...";
  }

}
