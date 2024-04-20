import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  Signal,
  model,
  signal,
} from '@angular/core';
import {
  Block,
  SpeakerData,
  TEnqueueParams,
  TGenerateAudioParams,
} from '../../models/conversation-model';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { language } from 'src/app/shared/change_language/language';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {
  CdkDrag,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { TextEditableComponent } from '../../text2speech-v2/text-editable.directive';
import { TextExceedLimitDialogComponent } from '../../text2speech-v2/dialog/text-exceed-limit-dialog/text-exceed-limit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { AudioDataAPI } from 'src/app/storage/models/text2speech-model';
import { SpeakerDialogComponent } from '../../new-component/speaker-dialog/speaker-dialog.component';
import { take } from 'rxjs';
import { SpeakerService } from 'src/app/shared/services/speaker.service';
import { highlight_fromArr } from '../../text2speech-v2/function/replaceWord';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { SnackSoundComponent } from 'src/app/dialog/components/snack-sound/snack-sound.component';
import { AdsService } from '../../services/ads.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { GenerateService } from '../../services/generate.service';
import { TH_EN_flag } from '../../mocks/conversation-mock';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { StudioMobileService } from 'src/app/shared/services/studio-mobile.service';
import { AlertRemoveVoiceComponent } from '../../text2speech-v2/dialog/alert-remove-voice/alert-remove-voice.component';
import { jwtDecode } from 'jwt-decode';
import { UserData } from 'src/app/auth/models/auth-model';

type TDialogConfig = {
  minWidth?: string;
  position?: {
    left: string;
    bottom: string;
  };
  data?: string;
  autoFocus?: boolean;
  maxWidth?: string;
};

@Component({
  selector: 'app-box-lists',
  standalone: true,
  templateUrl: './box-lists.component.html',
  styleUrl: './box-lists.component.scss',
  imports: [
    CommonModule,
    MatIconModule,
    MatDividerModule,
    DragDropModule,
    FormsModule,
    TextEditableComponent,
    MatTooltipModule,
    MatSelectModule,
    CdkDropList,
    CdkDrag,
    MatCheckboxModule,
    MatMenuModule,
  ],
})
export class BoxListsComponent {
  // Two way binding
  data = model<Block[]>();
  @Output() dataChange = new EventEmitter<Block[]>();
  isDraging = model<boolean>();
  @Output() isDragingChange = new EventEmitter<boolean>();

  selectedList = model<string[]>();
  isSelecting = model<boolean>();
  countSelect = model<number>();
  // @Output() dataChange = new EventEmitter<Block[]>();
  @Input() speaker: SpeakerData[] = [];
  @Input() historyWord: any[];
  @Input() limitText: number; // Limit text
  @Input() limitBox: number; // Limit text
  @Input() device: string;
  @Input() currentTime = 0;
  @Input() duration = 0;
  @Input() currentIndex = 0;
  @Input() user: UserData;
  //
  @Input() focusIndex;
  @Output() focusIndexChange = new EventEmitter<number>();

  @Output() calpoint = new EventEmitter<string>();
  @Output() addTextBox = new EventEmitter<string>();
  @Output() sliderValue = new EventEmitter<number>();
  @Output() playSound = new EventEmitter<any>();
  @Output() stopSound = new EventEmitter<any>();
  @Output() downloadSound = new EventEmitter<any>();
  @Output() addTextBoxByIndex = new EventEmitter<number>();
  //
  text: any = null;
  lang: string = null;
  placeholder = 'พิมพ์ข้อความเพื่อสร้างเสียง';
  // Toggle

  //
  isMobile: boolean = true;
  //
  countSpan: number = 0;
  countAlertLimitText: number = 0;
  //
  defaultSpeaker: string[] = [];
  file = new Audio();
  soundQueue: TEnqueueParams[] = [];
  processingQueue: boolean = false;

  //
  err_redirect = {
    not_select_voiceover: 'กรุณาเลือกเสียงพากย์ก่อนทำการสร้างเสียง',
    len_message_overlimit: 'ข้อความที่สร้างเกินจำนวนที่กำหนดเอาไว้',
    alertSeleted: 'กรุณาเลือกเสียงพากย์ก่อนทำการสร้างเสียง',
  };
  //

  nosoundClick = false;
  alertText = '';
  //

  // Keep old text for comparing with new inserted text
  oldData = {
    text: '',
    speaker: '',
    voiceLanguage: '',
  };

  constructor(
    private _changeLanguage: ChangeLanguageService,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private _workspace: WorkspaceService,
    public _tts: TextspeechService,
    private _speaker: SpeakerService,
    private _gfunc: GlobalFunctionService,
    private _ads: AdsService,
    private _snackBar: MatSnackBar,
    private _dialog: DialogService,
    private _generate: GenerateService,
    private _studioMobile: StudioMobileService,
  ) {}

  ngOnInit() {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.lang = res;
        this.text = language[res].studioMobileFirstObj.box;
      }
    });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {}

  focus(i: number) {
    this.focusIndex = i;
    this.focusIndexChange.emit(this.focusIndex);
  }

  focusOut() {
    this.focusIndex = -1;
    this.focusIndexChange.emit(this.focusIndex);
  }

  findfaceimg(voiceSpeaker: string) {
    if (voiceSpeaker == undefined || this.speaker.length < 1) return undefined;
    return this.speaker.find((i) => i.speaker_id == voiceSpeaker)?.face_image;
  }

  findSpeakerName(voiceSpeaker: string) {
    if (voiceSpeaker == undefined || this.speaker.length < 1) return undefined;
    if (this.lang === 'TH') {
      return this.speaker.find((i) => i.speaker_id == voiceSpeaker)?.thai_name;
    } else {
      return this.speaker.find((i) => i.speaker_id == voiceSpeaker)?.eng_name;
    }
  }

  drop(event: any) {
    moveItemInArray(this.data(), event.previousIndex, event.currentIndex);
    this.focus(event.currentIndex);
  }

  /** Get number of empty box.
   * @param data any
   */
  getEmptyBoxLength(data: any[]) {
    let emptyBoxLength = 0;
    data.forEach((e) => {
      if (e.text.length <= 0) emptyBoxLength += 1;
    });
    return emptyBoxLength;
  }

  /* Detect Enter key  */
  detectKey(event: KeyboardEvent, index: number, box: HTMLDivElement) {
    // Break function when reach limit box
    if (this.data().length >= this.limitBox) return;

    /* var for empty box condition */
    const emptyBoxLength = this.getEmptyBoxLength(this.data());
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const textBox = document.querySelector(
      `#textarea_inputbox_${index}`,
    ) as HTMLElement;
    const container = range.commonAncestorContainer;

    let rangeSec: any, textBeforeCursor: any, textAfterCursor: any;
    let node: any;
    if (container.nodeType === Node.TEXT_NODE) {
      node = container.parentNode;
    } else if (container.nodeType === Node.ELEMENT_NODE) {
      node = container;
    }

    //---------CUT FUNCTION----------//
    if (event.key == 'Enter' && event.ctrlKey) {
      if (
        range.startContainer.parentNode.nodeName === 'SPAN' &&
        node instanceof Element &&
        node.classList.contains('delay')
      ) {
        console.log('break');
      } else {
        rangeSec = selection.getRangeAt(0).cloneRange();

        // Create a temporary range that includes the entire content of the editable div
        const tempRange = document.createRange();
        tempRange.selectNodeContents(textBox);

        // Set the end of the temporary range to the start of the selection range
        tempRange.setEnd(rangeSec.startContainer, rangeSec.startOffset);

        // Get the text before the cursor by extracting the content of the temporary range
        textBeforeCursor = tempRange.toString();

        // Create a temporary range that includes the entire content of the editable div
        var tempRange2 = document.createRange();
        tempRange2.selectNodeContents(textBox);

        // Set the end of the temporary range to the end of the selection range
        tempRange2.setStart(rangeSec.endContainer, rangeSec.endOffset);

        // Get the text after the cursor by extracting the content of the temporary range
        textAfterCursor = tempRange2.toString();

        // Remove any temporary ranges
        tempRange.detach();
        tempRange2.detach();

        textBox.textContent = textBeforeCursor;
        this.data()[index].text = textBeforeCursor;
        this.add_textbox(textAfterCursor);

        setTimeout(() => {
          this.checkDelay();
        }, 0);
      }
    }

    if (
      event.key == 'Enter' &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !this.isMobile &&
      this.data()[index].speaker
    ) {
      const { isEdit, speaker, speed, volume, language, text, _id } =
        this.data()[index];
      if (!isEdit) {
        this.data()[index].isEdit = true;
        return event.preventDefault();
      }
      /* prevent var back to old speakerid */
      // if (this.defaultSpeaker.length > 0) {
      //   this.data[index].speaker = this.defaultSpeaker[index]
      // }

      if (!speed) {
        this.data()[index].speed = '1';
      }

      if (!volume) {
        this.data()[index].volume = '100';
      }

      /* no empty box can add text box */
      if (emptyBoxLength <= 0 && text.length <= this.limitText) {
        this.add_textbox();
      }

      this.setFocus('textarea_inputbox');

      this.enqueueData({
        speaker,
        speed,
        volume,
        language: language.value,
        index,
        box,
        text,
        _id,
      });

      /* prevent Enter pressed for new line textarea  */
      event.preventDefault();
    }
  }

  setFocus(className: string) {
    setTimeout(() => {
      const classItems = document.getElementsByClassName(className) as any;
      classItems[classItems.length - 1].focus();
    }, 0);
  }

  highlightText(target: any) {
    const text = target.textContent;

    if (target.textContent.replace(/\s/g, '').length > this.limitText) {
      let position = -1;
      let count = 0;

      for (let i = 0; i < text.length; i++) {
        if (text[i] !== ' ') {
          count++;
          if (count === this.limitText) {
            position = i + 1; // Add 1 to account for zero-based indexing
            break;
          }
        }
      }

      const exceededText = position;
      const cutText = target.textContent.substring(exceededText);
      const remainText = target.textContent.substring(0, exceededText);
      const highlightedText =
        '<span style="background-color: #f8797926">' + cutText + '</span>';
      target.innerHTML = remainText + highlightedText;
      document.execCommand('selectAll', false, null);
      // collapse selection to the end
      document.getSelection().collapseToEnd();
    }
  }

  // Trasform delay text format to delay span when load
  checkDelay() {
    const regexPattern = /delay\{([0-9]{1,2}(?:\.[0-9])?)\}/g;
    const length = this.data().length;

    for (let i = 0; i < length; i++) {
      const box = document.querySelector(`#textarea_inputbox_${i}`);
      const replaceText = box?.innerHTML.replace(
        regexPattern,
        (match, numMatched) => {
          const span = this.createSpanDelay(i, numMatched);
          return span.outerHTML;
        },
      );

      setTimeout(() => {
        const spanContainer = box?.querySelectorAll('.delay-container');
        spanContainer.forEach((span) => {
          const plus = span.querySelector('.plus');
          const minus = span.querySelector('.minus');

          this.renderer.listen(plus, 'click', () => {
            // Call your Angular function for minus action
            this.updateDelayValue(span, 0.5, 'plus', i); // Update the value
          });

          this.renderer.listen(minus, 'click', () => {
            // Call your Angular function for minus action
            this.updateDelayValue(span, -0.5, 'minus', i); // Update the value
          });
        });
      }, 0);

      // prevent error logs
      if (box) box.innerHTML = replaceText;
      // const plus = document.querySelector('.plus');
    }
  }

  // Create span element //
  createSpanDelay(index: number, initialValue: string) {
    //Try renderer2
    const spanOut = this.renderer.createElement('span');
    this.renderer.setAttribute(spanOut, 'contenteditable', 'false');
    this.renderer.setAttribute(spanOut, 'id', `delay_${this.countSpan}`);
    this.countSpan++;
    this.renderer.addClass(spanOut, 'delay');
    //--styles--//
    this.renderer.setStyle(spanOut, 'display', 'inline-flex');
    this.renderer.setStyle(spanOut, 'alignItems', 'center');
    this.renderer.setStyle(spanOut, 'gap', '5px');
    this.renderer.setStyle(spanOut, 'color', '#000');
    this.renderer.setStyle(spanOut, 'fontSize', '12px');
    this.renderer.setStyle(spanOut, 'fontWeight', '500');
    this.renderer.setStyle(spanOut, 'backgroundColor', '#e8f9fe');
    this.renderer.setStyle(spanOut, 'borderRadius', '5px');
    this.renderer.setStyle(spanOut, 'margin', '0px 4px');
    this.renderer.setStyle(spanOut, 'padding', '3px');
    this.renderer.setStyle(spanOut, 'user-select', 'none');
    //--styles--//

    // Create a container for the value and buttons
    const container = this.renderer.createElement('span');
    this.renderer.addClass(container, 'delay-container');
    this.renderer.setStyle(container, 'display', 'inline-flex');
    this.renderer.setStyle(container, 'alignItems', 'center');
    this.renderer.setStyle(container, 'gap', '5px');

    const minusBtn = this.renderer.createElement('button');
    this.renderer.setStyle(
      minusBtn,
      'backgroundImage',
      'url(../../../../assets/conversation/minus-circle-filled.svg)',
    );

    //--styles--//
    this.renderer.setStyle(minusBtn, 'display', 'inline-flex');
    this.renderer.setStyle(minusBtn, 'width', '12px');
    this.renderer.setStyle(minusBtn, 'height', '12px');
    this.renderer.setStyle(minusBtn, 'backgroundColor', 'transparent');
    this.renderer.setStyle(minusBtn, 'border', 'none');
    this.renderer.setStyle(minusBtn, 'margin', '0px');
    this.renderer.setStyle(minusBtn, 'padding', '0px');
    //--styles--//
    this.renderer.addClass(minusBtn, 'minus');

    this.renderer.listen(minusBtn, 'click', () => {
      // Call your Angular function for minus action
      this.updateDelayValue(container, -0.5, 'minus', index); // Update the value
    });

    // Create a span to display the delay value
    const delayValueSpan = this.renderer.createElement('span');
    this.renderer.setStyle(delayValueSpan, 'user-select', 'none');
    delayValueSpan.textContent = initialValue; // Initial value

    // Create the second button
    const plusBtn = this.renderer.createElement('button');
    this.renderer.setStyle(
      plusBtn,
      'backgroundImage',
      'url(../../../../assets/conversation/plus-circle-filled.svg)',
    );
    //--styles--//
    this.renderer.setStyle(plusBtn, 'display', 'inline-flex');
    this.renderer.setStyle(plusBtn, 'width', '12px');
    this.renderer.setStyle(plusBtn, 'height', '12px');
    this.renderer.setStyle(plusBtn, 'backgroundColor', 'transparent');
    this.renderer.setStyle(plusBtn, 'border', 'none');
    this.renderer.setStyle(plusBtn, 'margin', '0px');
    this.renderer.setStyle(plusBtn, 'padding', '0px');
    //--styles--//
    this.renderer.addClass(plusBtn, 'plus');

    this.renderer.listen(plusBtn, 'click', () => {
      // Call your Angular function for plus action
      this.updateDelayValue(container, 0.5, 'plus', index); // Update the value
    });

    // Append the buttons and value to the container
    this.renderer.appendChild(container, minusBtn);
    this.renderer.appendChild(container, delayValueSpan);
    this.renderer.appendChild(container, plusBtn);

    // Append the container to the delay span
    this.renderer.appendChild(spanOut, container);

    return spanOut;
  }

  // Function to update the delay value
  updateDelayValue(
    container: any,
    increment: number,
    type: string,
    index: number,
  ) {
    // Get the current value as a number
    let currentValue = parseFloat(container.querySelector('span').textContent);

    if (currentValue <= 0.1 && type === 'minus') {
      return;
    } else if (currentValue >= 10 && type === 'plus') {
      return;
    }

    // Update the value
    if (currentValue <= 0.5 && type === 'minus') {
      // currentValue = 0.1;
      currentValue -= 0.1;
      // } else if (currentValue <= 0.1 && type === 'plus') {
    } else if (currentValue < 0.5 && type === 'plus') {
      currentValue = 0.5;
      // currentValue += 0.1;
    } else {
      currentValue += increment;
    }

    // Update the displayed value
    container.querySelector('span').textContent = currentValue.toFixed(1);

    this.transformToDelayFormat(index);
  }

  // Transform delay num to delay string ( 0.5 --> delay{0.5} )
  transformToDelayFormat(index: number) {
    const divElement = document.querySelector(`#textarea_inputbox_${index}`);
    if (divElement) {
      const newContent: any = [];
      divElement.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          // If it's a text node, add the text as-is
          newContent.push(node.textContent);
        } else if (
          node.nodeType === Node.ELEMENT_NODE &&
          node instanceof HTMLElement &&
          node.tagName === 'SPAN'
        ) {
          // If it's a <span> element, get the text inside and wrap it with 'delay{ }'
          const spanText = node.textContent!.trim();
          if (spanText !== '') {
            newContent.push(`delay{${spanText}}`);
          }
        }
      });

      this.data()[index].text = newContent.join(' ');
    }
  }

  onPasteText(e: any) {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  }

  updateData(index: any) {
    this.transformToDelayFormat(index);
    this._workspace.setSave(false);
  }

  // Check text exceed limit
  textExceedLimit(target: any, index: number) {
    const text = target.textContent;

    if (text.replace(/\s/g, '').length > this.limitText) {
      if (this.countAlertLimitText < 1) {
        this.dialog.open(TextExceedLimitDialogComponent, {
          data: this.limitText,
        });
        this.countAlertLimitText++;
      }
      this.data()[index].isTextExceed = true;
    } else {
      this.data()[index].isTextExceed = false;
    }
  }

  /** Get text in textarea and replace all space */
  getCurrentTextCounted(text: string) {
    return text.replace(/\s/g, '').length;
  }

  add_textbox(text?: string) {
    this.addTextBox.emit(text);
    this.checkDefaultSpeaker();

    // Scroll to add button
    setTimeout(() => {
      const elementList = document.getElementsByClassName('generate-box');
      const almostLastIndex = elementList.length - 2;
      const el = elementList.item(almostLastIndex);
      el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  }

  checkDefaultSpeaker() {
    const speakerId = this._tts.getDefaultSpeaker();

    if (speakerId) {
      const lastIndex = Number(this.data().length - 1);
      this.defaultSpeaker[lastIndex] = speakerId;
      this.setSpeaker(speakerId, lastIndex);
    }
  }

  setSpeaker(id: string, index: number) {
    if (index < 0) return;

    this.defaultSpeaker[index] = id;
    this.data()[index].speaker = id;
    if (this.data()[index]?.speaker) {
      let { available_language, language } = this.speaker.find(
        (e) => e.speaker_id === this.data()[index]?.speaker,
      );

      const langObj = TH_EN_flag.find(
        (e) => e.value === language.toLowerCase(),
      );

      // Lowercase string
      language = language.toLowerCase();

      // Remove main language in sub language list then uppercase string array
      const sub = available_language
        .filter((lang) => lang !== language)
        .map((lang) => {
          return { value: lang };
        });

      // Assigning data
      this.data()[index].language = langObj;
      this.data()[index].main_lang = [{ value: language }];
      this.data()[index].sub_lang = sub;
    }
  }

  private handleErrorOnGenerateVoice(err: any, index: number) {
    this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
    this._tts.loadingState.next(0);
    this.data()[index].isLoading = false;
    this.soundQueue = [];
    this.processNextRequest();
  }

  private async handleGeneratedFile(data: TGenerateAudioParams) {
    const { file, index, text, speaker, language, _id } = data;
    // Decrease loading state number
    this._tts.loadingState.next(0);

    // if (file.type === 'application/json') {
    //   const msg: { message: string; status: number } = JSON.parse(
    //     await file.text(),
    //   );

    if (file.message !== 'Generate voice success') {
      this.data()[index].isLoading = false;
      this.soundQueue = [];
      this.processNextRequest();
      return this._dialog.warning(file.message);
    }
    // }

    // Run checkAds function
    const ads = await this._ads.checkAds();
    if (ads) this.data()[index].isAds = true;

    //Decode JWT and BASE64
    const base64File: any = jwtDecode(file.data);
    const urlFile = atob(base64File.data);
    const realURL = urlFile.replace(this.user.user_id, '');

    this._generate.setfileStorage(text, speaker, realURL, _id, language, ads);

    // this.file.src = URL.createObjectURL(file);
    this.configureAudioFile(data);
    setTimeout(() => {
      this.checkDelay();
    }, 0);
    this.displaySuccessSnackbar();
    console.log(this.data()[index]);

    this.calpoint.emit();
    this.processNextRequest();
  }

  private configureAudioFile(data: TGenerateAudioParams) {
    const { index, text, speaker, speed, volume, replaceBrackets } = data;

    this.file.playbackRate = Number(speed);
    this.file.volume = Number(volume) / 100;

    this.data()[index] = {
      ...this.data()[index],
      text,
      text_read: replaceBrackets,
      point: replaceBrackets.length,
      text_length: replaceBrackets.length,
      speaker_name: this.speaker.find((s) => s.speaker_id == speaker)
        ?.thai_name,
      text_with_delay: text,
      text_read_with_delay: text,
      html: text,
      category: 'soundtrack',
      speaker,
      speed,
      volume,
      isEdit: false,
      isLoading: false,
      isPlaying: false,
      isDownload: false,
      display_text: text,
    };

    this.file.addEventListener(
      'loadeddata',
      () => {
        this.data()[index].duration = this.file.duration * 1000;
      },
      { once: true },
    );
  }

  private displaySuccessSnackbar() {
    this._snackBar.openFromComponent(SnackSoundComponent, {
      data: {
        text: this.text.snackbar[0].sound_success,
        action: 'success',
        icon: 'ok_circle_dynamic',
        color: '#4CAF50',
      },
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success'],
      duration: 2000,
    });
  }

  /**
   * Get configuration for speaker dialog based on device type and optional speaker name.
   * @param speakerName - The name of the speaker (optional).
   * @returns The configuration object for the speaker dialog.
   */
  getSpeakerDialogConfig(speakerName?: string) {
    // Common configuration properties
    const commonConfig = {
      // disableClose: true,
      autoFocus: false,
    };

    // Device-specific configuration
    let config: TDialogConfig;

    if (this.device === 'Mobile') {
      config = {
        ...commonConfig,
        ...(speakerName && { data: speakerName }),
        minWidth: '100vw',
        position: { left: '0', bottom: '62px' },
      };
    } else {
      config = {
        ...commonConfig,
        ...(speakerName && { data: speakerName }),
        maxWidth: '95vw',
      };
    }

    return config;
  }

  triggerSelectSpeaker(id: string, index: number, box: HTMLDivElement) {
    const speakerName = this.findSpeakerName(id);

    const config = this.getSpeakerDialogConfig(speakerName);
    /* Catch data after close dialog */
    this.speakerDialogHandle(config, index, box);
  }

  // TODO Favorite shoud be save after close pop-up
  private speakerDialogHandle(
    config: TDialogConfig,
    index: number,
    box: HTMLDivElement,
  ) {
    // Get cart from sessionStorage and store data to old variable for compare
    const oldCart: SpeakerData[] = JSON.parse(sessionStorage.getItem('cart'));

    // Open Dialog
    const ref = this.dialog.open(SpeakerDialogComponent, config);

    // Detect value after close
    ref
      .afterClosed()
      .pipe(take(1))
      .subscribe((res: { speaker_id: string; speakerData: SpeakerData }) => {
        // Reset previous audio condition base on different speaker checked
        if (this.data()[index]?.speaker !== res?.speaker_id) {
          this.data()[index].isEdit = true; // Set to edit state
        }

        // set default speaker
        sessionStorage.setItem('default_speaker', String(res.speaker_id));

        // Get latest cart from sessionStorage
        const newCart: SpeakerData[] = JSON.parse(
          sessionStorage.getItem('cart'),
        );

        // If oldCart not equal newCart is mean data changed
        if (oldCart?.length !== newCart?.length) {
          const newCartId = newCart.map((item) => item.speaker_id);

          // Update data to API and global variable
          this._speaker.setCart(newCartId);
          this._speaker.$cart.next(newCart);
        }

        if (!res) return;
        this.formatSpeaker(res?.speakerData, index);
      });
  }

  /**
   * Format speaker data with main and available language.
   * @param res First index is speaker_id, second is speaker data.
   * @param index Index for data tracking
   */
  formatSpeaker({ speaker_id, language }: SpeakerData, index: number) {
    // Check language uppercase string
    const isUppercase = this._gfunc.isUpperCase(language);

    const lang = TH_EN_flag.filter((e) => {
      if (isUppercase) {
        return e.value === String(language).toLowerCase();
      } else if (this.lang === 'TH') {
        return e.TH_name === String(language);
      } else {
        return e.EN_name === String(language);
      }
    })[0];

    // Check exist speaker_id and set speaker
    if (speaker_id) {
      this._tts.saveDefaultSpeaker(speaker_id);
      this.setSpeaker(speaker_id, index);
    }

    // Check exist data
    if (this.data()) {
      const data = this.data()[index];
      // Get language[] type of main-language
      const main_lang = [
        TH_EN_flag.find((e) => e.value === data.main_lang[0].value),
      ];
      const sub_lang = [];

      // Get language[] type of sub-language
      data.sub_lang.forEach((lang) => {
        // Filtering language and JSON value for found data
        const filtered = TH_EN_flag.find((e) => e.value === lang.value);
        if (filtered) sub_lang.push(filtered);
      });

      // Prepare temp varialbe
      const obj = { main_lang, sub_lang };

      // Set data to global variable
      this.setMainSubLanguage(obj, index);
      // this.setLanguage(lang, index);

      // Found speaker id
      const foundItem = this.speaker.find(
        (e) => e.speaker_id === this.data()[index].speaker,
      );

      // // check spaeker_id can speak language
      // this.languageSupported = foundItem.available_language.includes(
      //   this.detectedLanguageEntry[index].value
      // );
      // if (this.languageSupported) {
      //   this.setLanguage(this.detectedLanguageEntry[index], index);
      // }
    }

    // this.converToolbar.forEach((child) => {
    //   if (child.index === index) {
    //     child.voiceLanguage = lang;
    //   }
    // });
  }

  setLanguage(i: Block['language'], index: number) {
    this.data()[index].language = i;
  }

  setMainSubLanguage(
    obj: { main_lang: any[]; sub_lang: any[] },
    index: number,
  ) {
    this.data()[index].main_lang = obj.main_lang;
    this.data()[index].sub_lang = obj.sub_lang;
  }

  setSpeed(i: string, index: number) {
    this.data()[index].speed = i;
  }

  setvolume(i: string, index: number) {
    this.data()[index].volume = i;
  }

  alertMessage(text: string) {
    this.alertText = text;
    if (!this.nosoundClick) {
      this.nosoundClick = true;
      setTimeout(() => {
        this.nosoundClick = false;
      }, 4000);
    }
  }

  onChangeLanguage(event: any, index: number) {
    const lang = TH_EN_flag.find((item) => item.value === event.value);
    this.setLanguage(lang, index);
  }

  //* -------------------------------- Data box ------------------------------------*//

  /* checks whether it is possible to open a dialog by verifying whether at least one day */
  canOpenDialogAfterTimeout(lastCloseTime: string): boolean {
    // const oneMinuteInMill = 5000;
    const oneMinuteInMill = 86400000;
    const currentTime = new Date().getTime();
    const lastClose = new Date(lastCloseTime).getTime();
    return currentTime - lastClose > oneMinuteInMill;
  }

  remove(i: any) {
    /* stop current audio playing */
    const confirmClose = localStorage.getItem('confirmCloseRemoveVoice');
    if (!confirmClose || this.canOpenDialogAfterTimeout(confirmClose)) {
      const dialogRef = this.dialog.open(AlertRemoveVoiceComponent);
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.data().splice(i, 1);
          this.dataChange.emit(this.data());
          localStorage.setItem(
            'confirmCloseRemoveVoice',
            new Date().toISOString(),
          );
        }
      });
    } else {
      this.data().splice(i, 1);
      this.dataChange.emit(this.data());
      this.file.pause();
      this.calpoint.emit();
    }
  }

  //*------------------------------------ Audio -----------------------------------*//
  // Controls when audio play
  onSliderInput(e: any) {
    this.currentTime = parseInt(e.target.value);
    this.sliderValue.emit(parseInt(e.target.value));
  }

  playsound(index: number) {
    this.playSound.emit(index);
  }

  stopsound(index: number) {
    this.stopSound.emit(index);
  }

  handleDownloadOrCreate(index: any, box: HTMLDivElement) {
    setTimeout(() => {
      if (
        !this.data()[index].isEdit &&
        this.data()[index].category === 'soundtrack'
      ) {
        this.downloadSound.emit(this.data()[index]);
        return;
      }
      if (
        this.oldData.text === this.data()[index].text &&
        this.oldData.speaker === this.data()[index].speaker &&
        this.oldData.voiceLanguage === this.data()[index].language.value
      ) {
        this.data.update((items) => {
          items[index].isEdit = false;
          return items;
        });
        return;
      }

      this.handleDesktopAndTablet(index, box);
    }, 100);
  }

  private handleDesktopAndTablet(index: number, box: HTMLDivElement) {
    const { speaker, speed, volume, language, text, _id } = this.data()[index];

    if (!speaker) {
      this.triggerSelectSpeaker('', index, box);
    } else {
      this.enqueueData({
        box,
        index,
        speaker,
        speed,
        volume,
        text,
        language: language?.value,
        _id,
      });
    }
  }

  enqueueData(data: TEnqueueParams) {
    const { speaker, index, box, text } = data;

    // Generate text over than limit text
    if (this.getCurrentTextCounted(text) > this.limitText) {
      return this.alertMessage(this.err_redirect.len_message_overlimit);
    }

    if (speaker && text.length > 0) {
      /* set box loading */
      this.data()[index].isLoading = true;

      this.data()[index].box_height = String(box.offsetHeight + 24) + 'px';

      if (!this.processingQueue) {
        this.processingQueue = true;
        console.log(this.data()[index]);
        this.generateAudio(data, box);
      } else {
        this.soundQueue.push(data);
      }
    } else {
      // this.alertMessage(this.err_redirect.not_select_voiceover);
      this.triggerSelectSpeaker('1', index, box);
    }
  }

  processNextRequest() {
    if (this.soundQueue.length > 0) {
      const nextData = this.soundQueue.shift();
      this.generateAudio(nextData);
    } else {
      this.processingQueue = false;
    }
  }

  private generateAudio(data: TEnqueueParams, box?: HTMLDivElement) {
    const { speaker, index, text } = data;
    // const [soundAttr, text, box] = data;

    // const [speakerId, speed, volume, language, index] = soundAttr;

    if (speaker && text.length > 0) {
      this.processAudioRequest(data);
    } else {
      this.triggerSelectSpeaker('1', index, box);
    }
  }

  private processAudioRequest(data: TEnqueueParams) {
    const { text, index, language } = data;
    // Get History word
    let { soundtext } = highlight_fromArr(text, this.historyWord);

    // Replace delay text
    const replaceBrackets = this._gfunc.replaceBetweenParentheses(soundtext);

    // Bug: Auto change audio_id prevent duplicate
    // this.data[index]._id = generateID();

    // Fetching API
    const temp: AudioDataAPI = {
      audio_id: this.data()[index]._id,
      text: replaceBrackets,
      text_delay: soundtext,
      speaker: String(this.data()[index].speaker),
      volume: '100',
      speed: '1',
      type_voice: 'wav',
      language: language,
    };

    this._tts.generateVoice(temp).subscribe({
      next: async (file: any) => {
        this.handleGeneratedFile({
          ...data,
          replaceBrackets,
          file,
        });
      },
      error: (err) => {
        this.handleErrorOnGenerateVoice(err, index);
      },
    });
  }

  //*----------------------------------- Selecting ---------------------------------*//
  toggleSelect(event: boolean, id: string) {
    if (event) {
      this.selectedList.update((items) => [...items, id]);
      this.countSelect.update((count) => count + 1);
      this._studioMobile.setSelectedBoxes(this.countSelect());
    } else {
      this.selectedList.update((items) => items.filter((item) => item != id));
      this.countSelect.update((count) => count - 1);
      this._studioMobile.setSelectedBoxes(this.countSelect());
    }
  }

  //*----------------------------------- Draging ---------------------------------*//

  toggleDrag() {
    this.isDraging.set(true);
    this.isDragingChange.emit(this.isDraging());
  }

  //*----------------------------------- Insert Box ---------------------------------*//

  addTextBoxMenu(index: number, type: string) {
    if (type === 'above') {
      this.addTextBoxByIndex.emit(index);
    } else {
      this.addTextBoxByIndex.emit(index + 1);
    }
  }
}
