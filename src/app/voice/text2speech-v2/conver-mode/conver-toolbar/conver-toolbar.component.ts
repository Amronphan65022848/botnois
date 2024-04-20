import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSelectChange } from '@angular/material/select';
import { Device } from 'src/app/model/core-model';
import { SpeakerService } from 'src/app/shared/services/speaker.service';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import {
  Block,
  DropdownAttribute,
  TEnqueueParams,
  TLangListAll,
} from 'src/app/voice/models/conversation-model';
import { MatDialog } from '@angular/material/dialog';
import {
  TH_EN_flag,
  speedConfiguration,
  volumeConfiguration,
} from 'src/app/voice/mocks/conversation-mock';
import { FadeInOut } from '../../function/animation';
import { language } from 'src/app/shared/change_language/language';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { Language } from 'src/app/shared/models/shared-model';

@Component({
  selector: 'app-conver-toolbar',
  templateUrl: './conver-toolbar.component.html',
  styleUrls: ['./conver-toolbar.component.scss'],
  animations: [FadeInOut(300, 300, false)],
})
export class ConverToolbarComponent implements OnInit {
  @Input() isOpenToolbar!: boolean | undefined;
  @Input() isSettingSound!: boolean;
  @Input() isPlaying!: boolean | undefined;
  @Input() isLoading!: boolean | undefined;
  @Input() isDownload = false;
  @Input() public box: HTMLDivElement;
  @Input() set _voiceSpeaker(val: string) {
    if (val) this.voiceSpeaker = val;
  }

  voiceSpeaker = null;
  @Input() voiceVolume = '100';
  @Input() voiceSpeed = '1';
  @Input() device: Device = 'Desktop';
  @Input() inputText = '';
  // @Input() data: Block = null;
  @Input() set _data(val: Block) {
    // Comparing between new and old value
    if (JSON.stringify(val) !== JSON.stringify(this.data)) {
      this.data = val;
      this.formatMainSubLanguage();
    }
  }
  data: Block = null;
  main_lang: Block['language'][] = [];
  sub_lang: Block['language'][] = [];

  @Input() index: number = 0;
  @Output() triggerDropdown = new EventEmitter<DropdownAttribute>();

  // @Output() _onChangeSpeaker = new EventEmitter<any>();
  @Output() _onChangeSpeed = new EventEmitter<any>();
  @Output() _onChangeVolume = new EventEmitter<any>();
  @Output() _onChangeLanguage = new EventEmitter<Block['language']>();
  @Output() _onChangeMainSubLang = new EventEmitter<any>();

  @Output() _playInToolbar = new EventEmitter<any>();
  @Output() _createSound = new EventEmitter<TEnqueueParams>();
  @Output() _saveSettingSound = new EventEmitter<any>();
  @Output() _editSound = new EventEmitter<boolean>();

  // สำหรับโหมด enter
  @Input() iconSpeaker: string = ''; // Image of selected speaker
  @Input() nameSpeaker: string = ''; // Name of selected speaker

  // Keep old text for comparing with new inserted text
  oldData = {
    text: '',
    speaker: '',
    voiceLanguage: '',
  };
  public showDelay = new FormControl<any>(400);
  public position = new FormControl<any>('above');

  public speakerIcon = []; //จากไฟล์ speaker.ts
  public showdropdown = false;
  public nosoundClick = false;
  public showLangDropdown = false;

  public langListAll: TLangListAll[] = this._gfunc.deepclone(TH_EN_flag);
  public voiceLanguage: Block['language'] = null;

  volumeConfig = volumeConfiguration;
  speedConfig = speedConfiguration;

  currentSpeaker: any = null;
  lang: Language = null;
  constructor(
    private _speaker: SpeakerService,
    private _bottomSheet: MatBottomSheet,
    private _tts: TextspeechService,
    private cd: ChangeDetectorRef,
    private _changeLanguage: ChangeLanguageService,
    private dialog: MatDialog,
    private _gfunc: GlobalFunctionService,
  ) {}

  ngOnInit(): void {
    this._speaker.$speaker.subscribe((res) => {
      if (res) {
        this.speakerIcon = res;
      }
    });

    setTimeout(() => {
      this._changeLanguage.language.subscribe((res) => {
        if (res) {
          this.text = language[res].text2speechObj.conver_mode.toolbar;
          this.lang = res;
          // this.cd.detectChanges();
          this.formatMainSubLanguage();
        }
      });
    }, 100);

    this._tts.$inputLang.subscribe((value) => {
      if (value) {
        // Posivite value
        const lang = this.langListAll.find((item) => item.value === value);
        // this.onChangeLanguage(lang)
      }
    });

    if (this.voiceVolume == null) this.voiceVolume = '100';
    if (this.voiceSpeed == null) this.voiceSpeed = '1';

    this._onChangeLanguage.emit(this.voiceLanguage);
    this._onChangeSpeed.emit(this.voiceSpeed);
    this._onChangeVolume.emit(this.voiceVolume);
  }

  /** Format main and sub language data from string[] to language[] interface.  */
  formatMainSubLanguage() {
    const main_lang = this.data.main_lang as Block['language'][];
    const sub_lang = this.data.sub_lang as Block['language'][];
    const noFlag = 'no_flag.svg';
    this.voiceLanguage = this.data.language;

    if (main_lang && sub_lang) {
      // Prepare main language
      const main_value = main_lang[0].value;
      let main_array: Block['language'] = this.langListAll.find(
        (e) => e.value === main_value,
      );

      // If language dosn't exist on data
      // Just add it
      if (!main_array) {
        main_array = { flag: noFlag, value: main_value, name: main_value };
      }

      // Prepare sub language
      const sub_array = [];

      // For-loop to get avaliable language base on sub-language
      sub_lang.forEach((sub_lang) => {
        // Filtering language and JSON value for found data
        let filtered = this.langListAll.find((e) => e.value === sub_lang.value);
        if (!filtered) {
          filtered = {
            flag: noFlag,
            value: sub_lang.value,
            EN_name: sub_lang.value,
            TH_name: sub_lang.value,
          };
        }
        if (filtered) sub_array.push(filtered);
      });

      // Assigning global variable
      this.main_lang = [main_array];
      this.sub_lang = sub_array;
      if (!this.voiceLanguage) {
        this.voiceLanguage = main_array;
      }
    } else {
      const main = this.langListAll[0];
      const sub = this.langListAll.filter((lang) => {
        return lang.value !== 'th';
      });
      this.main_lang = [main];
      this.sub_lang = sub;
      this.voiceLanguage = main;
    }
  }

  // openButtonSheet(index: number) {
  //   if (this.isSettingSound) {
  //     /* store var */
  //     const isDownload = this.data.isDownload;

  //     /* return data state to before create audio state */
  //     this._editSound.emit(true);
  //     this.currentSpeaker = null;

  //     /* only trigger after download audio */
  //     if (isDownload) return;
  //   }

  //   setTimeout(() => {
  //     const bottom_menusetting = this._bottomSheet.open(
  //       BottomMenuSettingComponent,
  //       {
  //         data: {
  //           voiceSpeaker: this.voiceSpeaker,
  //           voiceSpeed: this.voiceSpeed,
  //           voiceVolume: this.voiceVolume,
  //           voiceLanguage: this.voiceLanguage.value,
  //           nameSpeaker: this.nameSpeaker,
  //           // main_lang: this.main_lang,
  //           // sub_lang: this.sub_lang,
  //           edit_mode: false,
  //           lang: this.lang,
  //         },
  //       }
  //     );

  //     bottom_menusetting.afterDismissed().subscribe((res: any) => {
  //       if (res?.message == 'create') {
  //         /* assign vars */
  //         const data = res.data;

  //         this.voiceSpeaker = data.voiceSpeaker;
  //         this.voiceVolume = data.voiceVolume;
  //         this.voiceSpeed = data.voiceSpeed;
  //         this.voiceLanguage = data.voiceLanguage;

  //         this.currentSpeaker = this.speakerIcon.filter(
  //           (s) => s.speaker_id == res.data.voiceSpeaker
  //         )[0];

  //         /* change speaker */
  //         this.onChangeSpeaker(this.voiceSpeaker, 'bottom_menu');

  //         /* generate audio */
  //         this.handleClickCreate(index);
  //       }
  //     });
  //   }, 100);
  // }

  onDel(i: any) {
    if (this.voiceSpeaker == i) {
      this.voiceSpeaker = undefined;
    }
  }

  onChangeLanguage(event: MatSelectChange) {
    const data = this.langListAll.find((e) => e.value === event.value);
    this.voiceLanguage = data;

    this._onChangeLanguage.emit(this.voiceLanguage);
  }

  onChangeSpeed(event: MatSelectChange) {
    this.voiceSpeed = event.value;
    this._onChangeSpeed.emit(this.voiceSpeed);
  }

  onChangeVolume(event: MatSelectChange) {
    this.voiceVolume = event.value;
    this._onChangeVolume.emit(this.voiceVolume);
  }

  // handleClickCreate(index: number) {
  //   if (this.voiceSpeaker != '') {
  //     // Generate audio
  //     this._createSound.emit({
  //       speaker: this.voiceSpeaker,
  //       speed: this.voiceSpeed,
  //       volume: this.voiceVolume,
  //       language: this.voiceLanguage.value,
  //       index,
  //       box: this.box,
  //       text: this.inputText,
  //     });
  //   } else {
  //     // Alert no speaker data
  //     this.showAlert();
  //   }
  // }

  handleSaveSetting() {
    this._saveSettingSound.emit();
  }

  playInToolbar() {
    this._playInToolbar.emit();
  }

  showAlert() {
    if (!this.nosoundClick) {
      this.nosoundClick = true;
      setTimeout(() => {
        this.nosoundClick = false;
      }, 4000);
    }
  }

  onImageError(event: ErrorEvent) {
    console.log(event);
  }

  text = null;

  getCountryName(item: Block['language']) {
    const foundItem = this.langListAll.find((e) => e.value === item.value);
    return this.lang === 'EN' ? foundItem.EN_name : foundItem.TH_name;
  }
}
