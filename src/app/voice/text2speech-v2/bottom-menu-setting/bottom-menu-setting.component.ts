import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  MatBottomSheet,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AleartSuccessComponent } from 'src/app/dialog/components/aleart-success/aleart-success.component';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { SpeakerService } from 'src/app/shared/services/speaker.service';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';
import { WordstoreService } from 'src/app/dictionary/services/wordstore.service';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';
import { highlight_fromArr } from '../function/replaceWord';
import { AudioDataAPI } from 'src/app/storage/models/text2speech-model';
import {
  Block,
  TLangListAll,
  TResponseFile,
} from '../../models/conversation-model';
import { Language } from 'src/app/shared/models/shared-model';
import {
  speedConfiguration,
  volumeConfiguration,
} from '../../mocks/conversation-mock';

interface Word {
  _id: string;
  before_text: string;
  after_text: string;
}

interface T2S {
  voiceVolume: string;
  voiceSpeaker: string;
  voiceLanguage: TLangListAll;
  voiceSpeed: string;
  nameSpeaker: string;
  edit_mode: boolean;
  lang: Language;
  data: Block;
}

@Component({
  selector: 'app-bottom-menu-setting',
  templateUrl: './bottom-menu-setting.component.html',
  styleUrls: ['./bottom-menu-setting.component.scss'],
})
export class BottomMenuSettingComponent implements OnInit {
  public data: Block[];

  public speakerIcon: any = [];

  public formWords: FormGroup;

  public currentMenuSetting: string = '';

  public edit_mode: boolean; // edit or create

  public historyWord: any[] = [];

  public voiceVolume: string = '100';
  public voiceSpeaker: string = '1';
  public voiceSpeed: string = '1';
  public voiceLanguage: TLangListAll = null;

  public iconSpeaker: string = null;
  public iconLanguage: string = null;

  public nameSpeaker: string;
  public nameLanguage: string;

  public typeslevelSound: string[] = volumeConfiguration;

  public speedSound = speedConfiguration;

  public loadingState: number;
  public nosoundClick = false;

  mainLang: string = null;
  addonsLang: string = null;
  public langListMain = [];
  public langListSub = [];
  public currentSpeakerLanguage = 'th';

  //#-----------------------------[Change Language]--------------------------------#

  public warn = 'กรุณาเลือกเสียงพากย์ก่อนกดปุ่มสร้างเสียง';
  public setSound = 'ตั้งค่าเสียง';
  public setLang = '';
  public _save = 'บันทึก';
  public selectVoiceover = 'เลือกเสียงพากย์';
  public editSpeed = 'ปรับความเร็วเสียง';
  public editVolumn = 'ปรับความดังเสียง';
  public editWringreading = 'แก้ไขคำอ่านผิด';
  public editWrongWord = 'แก้ไขคำผิด';
  public historyEdit = 'ประวัติการแก้ไข';
  public writing = 'คำเขียน';
  public _reading = 'พิมพ์คำอ่าน';
  public reading = 'คำอ่าน';
  public addAnotherWord = 'เพิ่มคำอื่น ๆ';
  public cancel = 'ยกเลิก';
  public save = 'บันทึก';
  public redirect = {
    emptyHistory: 'ยังไม่มีประวัติการแก้ไขคำอ่านผิด',
  };
  public alertNotfound = null;
  lang: Language = null;

  //#-----------------------------[Change Language]--------------------------------#

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data_from_t2s: T2S,
    public textService: TextspeechService,
    private wordStoreService: WordstoreService,
    private _snackBar: MatSnackBar,
    private _dialogService: DialogService,
    private speechService: TextspeechService,
    public _bottomSheet: MatBottomSheet,
    private _speaker: SpeakerService,
  ) {
    this.speakerIcon = this._speaker.getSpeaker();

    if (this.data_from_t2s) {
      this.voiceVolume = this.data_from_t2s.voiceVolume;
      this.voiceSpeaker = this.data_from_t2s.voiceSpeaker;
      this.voiceSpeed = String(this.data_from_t2s.voiceSpeed);
      this.voiceLanguage = this.data_from_t2s.voiceLanguage;

      const { main_lang, sub_lang } = this.data_from_t2s.data;
      this.langListMain = main_lang;
      this.langListSub = sub_lang;
      this.edit_mode = this.data_from_t2s.edit_mode;
      this.get_dataChangeLanguage(this.data_from_t2s.lang);
      // this.nameSpeaker = this.data_from_t2s.nameSpeaker;
    }

    this.formWords = this.fb.group({
      words: this.fb.array([]),
    });

    this.addWord('', '');

    // this.getMainLang();
  }

  ngOnInit(): void {
    this.wordStoreService.data.subscribe((word: any) => {
      this.historyWord = word;
    });

    this.speechService.data.subscribe((d: Block[]) => {
      this.data = d;
    });

    this.speechService.loadingState.subscribe((count: number) => {
      this.loadingState = count;
    });
  }

  get arrWord(): FormArray {
    return this.formWords.controls['words'] as FormArray;
  }

  getLabelSpeed(value: string) {
    const result = this.speedSound.find((speed) => {
      return speed.value == value;
    });
    return result.name;
  }

  onChangeLaugnage(voiceLanguage: TLangListAll, stepper: MatStepper) {
    this.currentMenuSetting = '';
    this.voiceLanguage = voiceLanguage;
    stepper.previous();
  }

  onChangeVolume(level: any, stepper: MatStepper) {
    this.currentMenuSetting = '';
    this.voiceVolume = level;
    stepper.previous();
  }

  onChangeSpeed(voiceSpeed: any, stepper: MatStepper) {
    this.currentMenuSetting = '';
    this.voiceSpeed = voiceSpeed;
    stepper.previous();
  }

  createSound() {
    if (this.voiceSpeaker) {
      const option = {
        message: 'create',
        data: {
          voiceSpeaker: this.voiceSpeaker,
          voiceVolume: this.voiceVolume,
          voiceSpeed: this.voiceSpeed,
          voiceLanguage: this.voiceLanguage,
        },
      };
      this._bottomSheet.dismiss(option);
    } else {
      this.showAlert();
    }
  }

  updateSetting() {
    const option = {
      message: 'update_setting',
      data: {
        voiceSpeaker: this.voiceSpeaker,
        voiceVolume: this.voiceVolume,
        voiceSpeed: this.voiceSpeed,
        voiceLanguage: this.voiceLanguage,
      },
    };
    this._bottomSheet.dismiss(option);
  }

  gotoSetting(stepper: MatStepper, menuSetting: string) {
    stepper.next();
    this.currentMenuSetting = menuSetting;
  }

  back(stepper: MatStepper, prevhome: boolean = true) {
    if (prevhome) this.currentMenuSetting = '';
    stepper.previous();
  }

  addWord(before: String, after: String) {
    const newWord = this.fb.group({
      before_text: new FormControl(before),
      after_text: new FormControl(after),
    });
    this.arrWord.push(newWord);
  }

  submitForm(stepper: MatStepper) {
    let formDataWord = this.formWords.value.words;
    formDataWord = formDataWord.filter((word: any) => word.before_text !== '');
    formDataWord = formDataWord.filter((word: any) => word.after_text !== '');

    if (formDataWord.length > 0) {
      this.submitFormReplaceWord(formDataWord);
      stepper.previous();
      this.currentMenuSetting = '';
    }

    this.formWords = this.fb.group({ words: this.fb.array([]) });
    this.addWord('', '');
  }

  playWordInSidebar(value: string) {}

  public async submitFormReplaceWord(data_replace_word: Word[]) {
    const all_text: string = this.data
      .map((item: Block) => {
        return item.text;
      })
      .join(' ');

    for (let i = 0; i < data_replace_word.length; i++) {
      if (!all_text.includes(data_replace_word[i].before_text)) {
        const not_found_word =
          this.text?.alertNotfound[0] +
          data_replace_word[i].before_text +
          this.text?.alertNotfound[1];

        this._snackBar.open(not_found_word, '', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3 * 1000,
          panelClass: ['not-found-word'],
        });
        return;
      }
    }

    let new_data_word = data_replace_word;

    //compare history
    new_data_word.map(async (item: any, index: number) => {
      // ถ้าคำที่ผู้ใช้กรอกเข้ามา เป็นคำที่มีอยู่แล้ว ให้ update คำอ่าน
      const old_data = this.historyWord.find(
        (word: any) => word.before_text === item.before_text,
      );

      //ถ้ามีข้อมูลที่ต้อง update
      if (old_data) {
        //ค้นหา คำเขียน จากข้อมูลใน form ที่ผู้ใช้กรอก เพื่อเอา คำเขียน คำอ่าน ไป update
        const word_update = new_data_word[index];

        const editWord: any = {
          _id: old_data._id,
          before_text: word_update.before_text,
          after_text: word_update.after_text,
        };

        //แก้ไขข้อมูลในประวัติ sidebar
        this.historyWord = this.historyWord.map((word: any) =>
          word.before_text === word_update.before_text
            ? {
                ...word,
                after_text: word_update.after_text, //อัพเดตคำอ่าน
              }
            : word,
        );

        // //ลบคำศัพท์นี้ออกจาก array ข้อมูลใหม่
        new_data_word = new_data_word.filter(
          (word: any) => word.before_text !== item.before_text,
        );

        //service update word
        this.wordStoreService.editWordStore(editWord).subscribe((res) => {});
      }
    });

    //เพิ่มคำศัพท์ใหม่เข้าไป
    this.historyWord = [...new_data_word, ...this.historyWord];
    this.wordStoreService.data.next([...this.historyWord]);

    //highlight and update word ทั้งหน้าเว็บ
    this.addWordToDatabase(new_data_word);

    //เพิ่มคำอ่านผิดใน database
    this.updateSoundTrack(data_replace_word);
  }

  private addWordToDatabase(new_data_word: Word[]) {
    new_data_word = new_data_word.map((item: any) => ({
      ...item,
      date_time: new Date(),
    }));

    this.wordStoreService.addWordStore(new_data_word).subscribe((res: any) => {
      if (res) {
        ///******* show snackbar when success */
        this._snackBar.openFromComponent(AleartSuccessComponent, {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3 * 1000,
        });
      }
    });
  }

  async updateSoundTrack(new_data_word: Word[]) {
    for (let i = 0; i < this.data.length; i++) {
      //ถ้า block นั้น เป็น soundtrack
      if (this.data[i].category == 'soundtrack') {
        const speaker = this.data[i].speaker;

        //วน loop ค้นหาว่าข้อความใน soundtrack นี้ มีคำเขียน ที่ผู้ใช้ป้อนเข้ามาใหม่หรือไม่ ?
        for (let j = 0; j < new_data_word.length; j++) {
          //ถ้าพบมีคำเขียน ที่ผู้ใช้ป้อนเข้ามาใหม่
          if (this.data[i].text.includes(new_data_word[j].before_text)) {
            let html_with_delay: any = String(this.data[i].text_with_delay);

            html_with_delay = html_with_delay.replaceAll(
              'delay{',
              '<span contenteditable="false"><input value="',
            );
            html_with_delay = html_with_delay.replaceAll(
              '}',
              '" type="text" ></span> ',
            );

            const { html, isReplace } = await highlight_fromArr(
              html_with_delay,
              this.historyWord,
            );
            const text_replace_with_delay = await highlight_fromArr(
              String(this.data[i].text_with_delay),
              this.historyWord,
            );
            const text_after = await highlight_fromArr(
              String(this.data[i].text),
              this.historyWord,
            );

            if (isReplace) {
              this.data[i].text_read_with_delay =
                text_replace_with_delay.soundtext;
              this.data[i].text_read = text_after.soundtext;
              this.data[i].isLoading = true;
              this.data[i].html = html;

              this.speechService.loadingState.next(this.loadingState + 1);
              const temp: AudioDataAPI = {
                audio_id: this.data[i]._id,
                text: this.data[i].text,
                text_delay: this.data[i].text,
                speaker: this.data[i].speaker,
                volume: '100',
                speed: '1',
                type_voice: 'wav',
              };
              this.speechService
                .generateVoice(temp)
                .pipe(
                  catchError((err) => {
                    this.speechService.loadingState.next(this.loadingState - 1);
                    this._dialogService.somethingWentWrong();
                    return throwError(err);
                  }),
                )
                .subscribe((file: any) => {
                  this.speechService.loadingState.next(this.loadingState - 1);

                  this.keepfileStorage(
                    String(text_replace_with_delay.soundtext),
                    speaker,
                    file,
                  );
                  this.data[i].isLoading = false;
                });
            }
            break;
          }
        }
      }
    }
    this.speechService.data.next([...this.data]);
  }

  keepfileStorage(
    text: string,
    speaker: string | undefined,
    file: TResponseFile,
  ) {
    const _text = text.trim();
    const new_file: any = [{ text: _text, speaker: speaker, file: file }];
    this.speechService.file.next([
      ...this.speechService.file.getValue(),
      ...new_file,
    ]);
  }

  getfileStorage(text: string, speaker: string | undefined) {
    const _text = text.trim();
    const result = this.speechService.file
      .getValue()
      .find((sound: any) => sound.text == _text && sound.speaker == speaker);
    return result;
  }

  showAlert() {
    if (!this.nosoundClick) {
      this.nosoundClick = true;
      setTimeout(() => {
        this.nosoundClick = false;
      }, 4000);
    }
  }

  text = TH.bottomMenuObj;

  get_dataChangeLanguage(temp: Language) {
    this.lang = temp;
    if (temp == 'TH') {
      this.text = TH.bottomMenuObj;
    } else if (temp == 'EN') {
      this.text = EN.bottomMenuObj;
    }

    this.getdataInfo();
  }

  getCountryName(item: TLangListAll): string {
    return this.lang === 'EN' ? item.EN_name : item.TH_name;
  }

  getdataInfo() {
    this.warn = this.text.warn;
    this.setSound = this.text.setSound;
    this.setLang = this.text.setLang;
    this._save = this.text._save;
    this.selectVoiceover = this.text.selectVoiceover;
    this.editSpeed = this.text.editSpeed;
    this.editVolumn = this.text.editVolumn;
    this.editWringreading = this.text.editWringreading;
    this.editWrongWord = this.text.editWrongWord;
    this.historyEdit = this.text.historyEdit;
    this.writing = this.text.writing;
    this._reading = this.text._reading;
    this.reading = this.text.reading;
    this.addAnotherWord = this.text.addAnotherword;
    this.cancel = this.text.cancel;
    this.save = this.text.save;
    this.redirect = this.text.redirect;
    this.mainLang = this.text.mainLang;
    this.addonsLang = this.text.addonsLang;
  }
}
