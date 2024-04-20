import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { language } from 'src/app/shared/change_language/language';
import { Block } from '../../models/conversation-model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { WordstoreService } from 'src/app/dictionary/services/wordstore.service';
import { MatDialog } from '@angular/material/dialog';
import { CancelDialogComponent } from '../../text2speech-v2/dialog/cancel-dialog/cancel-dialog.component';
import { Router } from '@angular/router';
import { HistoryAllDialogComponent } from '../../text2speech-v2/dialog/history-all-dialog/history-all-dialog.component';
import { UserData } from 'src/app/auth/models/auth-model';
import { Language } from 'src/app/shared/models/shared-model';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';
import { WalletService } from 'src/app/payment/services/wallet.service';
import { SurveyComponent } from 'src/app/dialog/components/survey/survey.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-panel-replaceword',
  templateUrl: './panel-replaceword.component.html',
  styleUrls: ['./panel-replaceword.component.scss'],
})
export class PanelReplacewordComponent implements OnInit {
  /* Subscription */
  @Input() user: UserData;

  /* Play download */
  @Input() isPlayAll!: boolean;
  @Input() data: Block[];
  @Input() selectionLength: number;
  @Input() totalPayPoint: number;
  @Input() isReadyPlayAll!: boolean;
  @Input() isReadyDownloadAll!: boolean;
  @Input() mobileText: string;
  @Input() isMobile: boolean;
  @Input() mode_button: string;
  @Input() loadingState: number;

  @Input() lang: Language;

  @Output() _createSound = new EventEmitter<any>();
  @Output() _playAll = new EventEmitter<any>();
  @Output() _pauseAll = new EventEmitter<any>();
  @Output() _downloadAll = new EventEmitter<any>();

  /* Tools */
  @Output() _loadCSV = new EventEmitter<any>();

  /* History word */
  @Input() historyWord!: any[];
  @Input() state_loading!: number;
  @Input() allsoundState!: boolean;

  @Output() submitFormReplaceWord = new EventEmitter<any>();
  @Output() playInSidebar = new EventEmitter<any>();
  @Output() playHistorySidebar = new EventEmitter<any>();

  /* General */
  @Input() page: 1 | 2; // Number in value is mean book page and conversation page respectively

  public formWords: FormGroup;

  public isChangeWordExpand: boolean = false;
  public isImportExportExpand: boolean = false;
  public isTotalPointExpand: boolean = true;
  private limitHistoryShow: number = 5;

  public text = language['TH'].text2speechObj.panel_replaceword;
  public image: string = null;

  get freeUser() {
    return this.user?.subscription === 'Free';
  }

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private _changeLanguage: ChangeLanguageService,
    private _notify: NotificationService,
    private _globalFunc: GlobalFunctionService,
    private _dictionary: WordstoreService,
    private dialog: MatDialog,
    private router: Router,
    public _wallet: WalletService,
    private cookie: CookieService,
  ) {}

  cookiesurvey: boolean = false;
  getSurveyCookie(name: string) {
    const cookieValue = this.cookie.get(name);
    if (cookieValue === 'true') {
      return cookieValue;
    } else {
      return false;
    }
  }
  surveyStatus() {
    // console.log(this.user)

    if (this.user?.survey === false || this.user?.survey === undefined) {
      return true;
    } else if (this.user?.survey === true) {
      return false;
    }

    if (this.getSurveyCookie('_bn_survey_completed') === 'true') {
      this.cookiesurvey =
        this.getSurveyCookie('_bn_survey_completed') === 'true';
      return false;
    }
    if (this.getSurveyCookie('_bn_survey_cd') === 'true') {
      this.cookiesurvey = this.getSurveyCookie('_bn_survey_cd') === 'true';
      return true;
    } else {
      return false;
    }
  }
  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.lang = res;
        this.text = language[res].text2speechObj.panel_replaceword;
        setTimeout(() => {
          const url = this._notify.notifyJson.getValue()['ads']['studio'];
          // if Url is valid, Replace {x} to insert EN or TH
          if (url) {
            // Decode the URL component, Avoid Url-encoded
            const decodedUrl = decodeURIComponent(url);
            this.image = decodedUrl.replace('{x}', res);
          }
        }, 1000);
      }
    });

    this.formWords = this.fb.group({
      words: this.fb.array([]),
    });

    this.addWord('', '');

    this.updateEditHistory();
  }

  ngOnChanges(): void {
    // Catch up the binding data on change
    if (this.lang) {
      this.text = language[this.lang].text2speechObj.panel_replaceword;
    }
  }

  loadcsvToData(e) {
    this._loadCSV.emit(e);
  }

  playAll() {
    this._playAll.emit();
  }

  pauseAll() {
    this._pauseAll.emit();
  }

  downloadAll() {
    this._downloadAll.emit();
  }

  get arrWord(): FormArray {
    return this.formWords.controls['words'] as FormArray;
  }

  /** Add row form array word in sidebar */
  addWord(before: String, after: String) {
    const newWord = this.fb.group({
      before_text: new FormControl(before),
      after_text: new FormControl(after),
    });
    this.arrWord.push(newWord);
  }

  async onsubmit() {
    let formDataWord = this.formWords.value.words;
    formDataWord = await formDataWord.filter(
      (word: any) => word.before_text !== '',
    );
    formDataWord = await formDataWord.filter(
      (word: any) => word.after_text !== '',
    );

    if (formDataWord.length > 0) {
      this.submitFormReplaceWord.emit(formDataWord);
    }

    this.formWords = this.fb.group({ words: this.fb.array([]) });
    this.addWord('', '');
  }

  playTestExample(src: string) {
    const au = new Audio();
    au.src = src;
    au.play();
  }

  playWord(event: any) {
    this.playInSidebar.emit(event);
  }

  playHistoryWord(text: string) {
    this.playHistorySidebar.emit(text);
  }

  updateEditHistory() {
    const addIsEdit = setInterval(() => {
      for (let item of this.historyWord) {
        item.isEdit = false;
        item.ref_id = this._globalFunc.generateID();
      }
      if (this.historyWord.length > 0) {
        clearInterval(addIsEdit);
      }
    }, 500);
  }

  editText(index: number) {
    this.historyWord[index].isEdit = true;
    // console.log(this.historyWord[index]);
  }

  editDone(data: any, index: number) {
    const input_element = this.el.nativeElement.querySelectorAll(
      '[data-ref=' + data.ref_id + ']',
    );

    const editedWord: any = {
      before_text: input_element[0].value,
      after_text: input_element[1].value,
    };

    const old = {
      user_id: data.user_id,
      before_text: data.before_text,
      after_text: data.after_text,
    };

    const temp = {
      old,
      new: editedWord,
    };

    if (
      editedWord.after_text?.replace(/\s/g, '').length <= 0 ||
      editedWord.before_text?.replace(/\s/g, '').length <= 0
    ) {
      return;
    }

    this._dictionary.editWordStore(temp).subscribe({
      next: (data) => {
        // console.log(data);
        this.historyWord[index].before_text = input_element[0].value;
        this.historyWord[index].after_text = input_element[1].value;
      },
      error: (e) => {
        console.log('error : ', e);
      },
      complete: () => {
        console.log('complete!!!');
        this.historyWord[index].isEdit = false;
      },
    });
  }

  editCancel(index: number) {
    this.historyWord[index].isEdit = false;
  }

  deleteHistoryWord(item: any) {
    const dialogRef = this.dialog.open(CancelDialogComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        let delete_id: any = [];
        delete_id.push({
          user_id: item.user_id,
          before_text: item.before_text,
          after_text: item.after_text,
        });
        const arr_id: any = {
          delete: delete_id,
        };

        // this.dataSource.data = delete_in_web;
        this._dictionary.deleteWordStore(arr_id).subscribe(() => {
          const deleteHistory = this.historyWord.findIndex(
            (obj) => obj.before_text === item.before_text,
          );

          if (deleteHistory !== -1) {
            this.historyWord.splice(deleteHistory, 1);
          }
        });
      }
    });
  }

  toPayment() {
    this.router.navigate(['/payment']);
    // this.router.navigate(['/xmas']);
  }

  detectKey(event: any, data: any) {
    const input_element = this.el.nativeElement.querySelectorAll(
      '[data-ref=' + data.ref_id + ']',
    );

    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  viewAll() {
    this.dialog.open(HistoryAllDialogComponent, {
      data: this.historyWord,
    });
  }

  toSub() {
    this.router.navigate(['/payment'], { queryParams: { page: 1 } });
  }

  openSurvey() {
    this.dialog.open(SurveyComponent, {
      disableClose: true,
    });
  }
}
