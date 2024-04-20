import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Input } from '@angular/core';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { SpeakerService } from 'src/app/shared/services/speaker.service';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { Device } from 'src/app/model/core-model';
import { TH } from 'src/app/shared/change_language/TH';
import { EN } from 'src/app/shared/change_language/EN';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import {
  Block,
  DropdownAttribute,
  SpeakerData,
  TEnqueueParams,
  TGenerateAudioParams,
  TLangListAll,
  TResponseFile,
} from '../../models/conversation-model';
import { AudioDataAPI } from 'src/app/storage/models/text2speech-model';
import { highlight_fromArr } from '../function/replaceWord';
import { UserAgentService } from 'src/app/shared/services/user-agent.service';
import { FormControl } from '@angular/forms';
import { TH_EN_flag } from 'src/app/voice/mocks/conversation-mock';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { TextExceedLimitDialogComponent } from '../dialog/text-exceed-limit-dialog/text-exceed-limit-dialog.component';
import { ConverToolbarComponent } from './conver-toolbar/conver-toolbar.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomMenuSettingComponent } from '../bottom-menu-setting/bottom-menu-setting.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackSoundComponent } from 'src/app/dialog/components/snack-sound/snack-sound.component';
import { SpeakerDialogComponent } from '../../new-component/speaker-dialog/speaker-dialog.component';
import { AlertRemoveVoiceComponent } from '../dialog/alert-remove-voice/alert-remove-voice.component';
import { GenerateService } from '../../services/generate.service';
import { language } from 'src/app/shared/change_language/language';
import { UserData } from 'src/app/auth/models/auth-model';
import { AdsService } from '../../services/ads.service';
import { BehaviorSubject, debounceTime, filter, take } from 'rxjs';
import { Language } from 'src/app/shared/models/shared-model';
import { WalletService } from 'src/app/payment/services/wallet.service';
import { speakerDataMock } from 'src/app/marketplace/data/data';
import { MatSelectChange } from '@angular/material/select';
// import * as franc from 'franc-min';

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
  selector: 'app-conver-mode',
  templateUrl: './conver-mode.component.html',
  styleUrls: ['./conver-mode.component.scss'],
})
export class ConverModeComponent implements OnInit {
  @Input() onloadedPlay = 0;
  @Input() data: Block[] = [];
  @Input() user: UserData;
  @Input() item = [];
  @Input() currentTime = 0;
  @Input() duration = 0;
  @Input() currentIndex = 0;
  @Input() device: Device;
  @Input() speaker: SpeakerData[] = []; //array เสียงทั้งหมด
  @Input() limitText: number; // Limit text
  @Input() limitBox: number; // Limit text
  @Input() currentUserPackage: any;
  @Input() historyWord: any[]; // Limit text

  @Output() addTextBox = new EventEmitter<string>();
  @Output() playSound = new EventEmitter<any>();
  @Output() stopSound = new EventEmitter<any>();
  @Output() downloadSound = new EventEmitter<any>();
  @Output() shareSound = new EventEmitter<any>();
  @Output() calpoint = new EventEmitter<string>();
  @Output() triggerDropdown = new EventEmitter<DropdownAttribute>();
  @Output() sliderValue = new EventEmitter<number>();
  @Output() setEditData = new EventEmitter<number>();
  @Output() deleteGenerated = new EventEmitter<any>();

  @Output() saveWorkspace = new EventEmitter<any>();
  @Output() checkPointAndSave = new EventEmitter<any>();
  @Output() toggleLoading = new EventEmitter<any>();

  @ViewChildren(ConverToolbarComponent)
  converToolbar!: QueryList<ConverToolbarComponent>;

  public focusIndex = 0;
  public nosoundClick = false;

  private defaultSpeaker: string[] = [];
  private file = new Audio();
  private soundQueue: TEnqueueParams[] = [];
  private processingQueue: boolean = false;

  public showDelay = new FormControl<any>(400);
  public position = new FormControl<any>('above');

  //detectLanguage
  public languageChangeSubscription = new BehaviorSubject<string>(null);
  public languageSupported: boolean;
  public detectedLanguageEntry = [];
  alertText = '';
  // textbox = {
  //   tips: {
  //     title: 'สามารถใส่ดีเลย์ได้โดยการกด',
  //     detail: ['Ctrl + Alt + D (Windows)', 'Ctrl + Options + D (IOS)'],
  //   },
  //   button: 'ฉันเข้าใจ',
  // };

  // Keep old text for comparing with new inserted text
  oldData = {
    text: '',
    speaker: '',
    voiceLanguage: '',
  };

  private showTipsBox = false;

  private isMobile = false;

  private countSpan: number = 0;
  private countAlertLimitText: number = 0;

  private langListAll: TLangListAll[] = this._gfunc.deepclone(TH_EN_flag);

  private lang: Language;
  public placeholder = 'พิมพ์ข้อความเพื่อสร้างเสียง';
  public add_word = 'เพิ่มประโยค';
  private err_redirect = {
    not_select_voiceover: 'กรุณาเลือกเสียงพากย์ก่อนทำการสร้างเสียง',
    len_message_overlimit: 'ข้อความที่สร้างเกินจำนวนที่กำหนดเอาไว้',
    alertSeleted: 'กรุณาเลือกเสียงพากย์ก่อนทำการสร้างเสียง',
  };
  public downloadText = '';
  public generateText = '';
  public closeText = '';
  public point = 'พอยท์';
  public bath = 'บาท';
  public downloadBtnText = 'ดาวน์โหลด';
  public cutTextHover = 'ตัดข้อความ';
  public delayHover = 'หน่วงเวลา';
  public play = 'เล่นเสียง';

  @ViewChild('textarea_inputbox') textarea_inputbox!: ElementRef;

  constructor(
    public _tts: TextspeechService,
    private _speaker: SpeakerService,
    public _gfunc: GlobalFunctionService,
    private _changeLanguage: ChangeLanguageService,
    private _device: UserAgentService,
    private _workspace: WorkspaceService,
    private _dialog: DialogService,
    public dialog: MatDialog,
    private _bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar,
    private renderer: Renderer2,
    private _generate: GenerateService,
    private _ads: AdsService,
    public _wallet: WalletService,
  ) {}

  ngOnInit(): void {
    this.speaker = this._speaker.getSpeaker();
    this.isMobile = this._device.getAgent();

    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.get_dataChangeLanguage(res);
        this.lang = res;
      }
    });

    this.getLocalStorage();

    setTimeout(() => {
      this.data.map((item) => {
        if (item.text.replace(/\s/g, '').length > this.limitText) {
          item.isTextExceed = true;
        }
      });
      // this.checkDelay();
    }, 2000);

    /* Call here for prevent data change error */
    setTimeout(() => {
      /* get speaker */

      this.checkDefaultSpeaker();
    }, 2000);
  }

  /** Get text in textarea and replace all space */
  getCurrentTextCounted(text: string) {
    return text.replace(/\s/g, '').length;
  }

  /** Get localstorage data */
  getLocalStorage() {
    const hide_tips = localStorage.getItem('hide_tips');
    this.showTipsBox = hide_tips === 'true' ? false : true;
  }

  /** Close tips box and set */
  onAgreedTipsBox() {
    localStorage.setItem('hide_tips', 'true');
    this.showTipsBox = false;
  }

  checkDefaultSpeaker() {
    const speakerId = this._tts.getDefaultSpeaker();

    if (speakerId) {
      const lastIndex = Number(this.data.length - 1);
      this.defaultSpeaker[lastIndex] = speakerId;
      this.setSpeaker(speakerId, lastIndex);
    }
  }

  findfaceimg(voiceSpeaker: string) {
    if (voiceSpeaker == undefined || this.speaker.length < 1) return undefined;
    return this.speaker.find((i) => i.speaker_id == voiceSpeaker)?.face_image;
  }

  findSpeakerName(voiceSpeaker: string) {
    if (voiceSpeaker == undefined) {
      return undefined;
    } else {
      if (this.lang === 'EN') {
        return this.speaker.find((i) => i.speaker_id == voiceSpeaker)?.eng_name;
      } else {
        return this.speaker.find((i) => i.speaker_id == voiceSpeaker)
          ?.thai_name;
      }
    }
  }

  // Hover focus function
  drop(event: any) {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
  }

  focus(i: number) {
    this.focusIndex = i;
  }

  focusOut() {
    this.focusIndex = -1;
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

  onPaste(event: ClipboardEvent, index: number) {
    // Break function when reach limit box
    if (this.data.length >= this.limitBox) return;

    // Get the pasted text from the clipboard
    const pastedText = event.clipboardData?.getData('text');
    this.limitText = 200;
    // Set timeout to prevent no data
    setTimeout(() => {
      // Only passed when text pasted over than limit text
      if (this.data[index].text.length > this.limitText) {
        // Get number of boxes with no decimal
        const box = Math.ceil(this.data[index].text.length / this.limitText);

        // Start and end substring position
        let start = 1; // Start substring position
        let end = 0;

        // Loop by the number of boxes
        for (let i = 0; i < box; i++) {
          // Substring text with start and end position
          const textRange = pastedText
            .substring(
              i == 0 ? 0 : (start += this.limitText),
              (end += this.limitText),
            )
            .trim();
          // Add box with split text
          this.add_textbox(textRange);
        }
        this.remove(index); // Remove original box after split box
      }
    }, 0);
  }

  setFocus(className: string) {
    setTimeout(() => {
      const classItems = document.getElementsByClassName(className) as any;
      classItems[classItems.length - 1].focus();
    }, 0);
  }

  // Detect data input
  detectInput(textarea_inputbox: HTMLTextAreaElement, device: string) {
    // Auto grow textarea size
    this._gfunc.autogrow(
      textarea_inputbox,
      device == 'Mobile' ? '34px' : '34px',
      0,
    );
  }

  updateData(index: any) {
    this.transformToDelayFormat(index);
    this._workspace.setSave(false);
  }

  // onlyNum(event: any, index: number) {
  //   const allowedCharacters = /^[0-9\.]*$/;
  //   const inputChar = event.key;
  //   const selection = window.getSelection();
  //   const range = selection.getRangeAt(0);
  //   const container = range.commonAncestorContainer;
  //   let node: any;
  //   if (container.nodeType === Node.TEXT_NODE) {
  //     node = container.parentNode;
  //   } else if (container.nodeType === Node.ELEMENT_NODE) {
  //     node = container;
  //   }

  //   const element = node as Element;
  //   const elementId = element.getAttribute('id');

  //   const editableSpan = document.getElementById(`${elementId}`);

  //   if (node && node instanceof Element && node.classList.contains('delay')) {
  //     // Check if the input character is a number or allowed special keys (e.g., backspace, delete)
  //     if (
  //       (inputChar.match(allowedCharacters) ||
  //         event.keyCode === 8 ||
  //         event.keyCode === 46 ||
  //         event.keyCode === 37 ||
  //         event.keyCode === 39) &&
  //       range.startContainer.parentNode.nodeName === 'SPAN'
  //     ) {
  //       const spanContent = editableSpan.textContent + inputChar;
  //       const numericContent = spanContent.replace(/[^0-9\.]/g, ''); // Remove any non-numeric characters

  //       if (parseFloat(numericContent) > 10) {
  //         event.preventDefault();
  //         return false;
  //       }

  //       // Check if the numeric content is below the min limit
  //       if (parseFloat(numericContent) < 0) {
  //         event.preventDefault();
  //         return false;
  //       }
  //       return true;
  //     } else if (range.startContainer.parentNode.nodeName === 'DIV') {
  //       return true;
  //     } else {
  //       event.preventDefault();
  //       return false;
  //     }
  //   }
  // }

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

  onPasteText(e: any) {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  }

  cutText(index: number) {
    // Break function when reach limit box
    if (this.data.length >= this.limitBox) return;

    const textarea = document.querySelector(
      `#textarea_inputbox_${index}`,
    ) as HTMLElement;

    const selection = document.getSelection();
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    let node: any;
    if (container.nodeType === Node.TEXT_NODE) {
      node = container.parentNode;
    } else if (container.nodeType === Node.ELEMENT_NODE) {
      node = container;
    }
    let rangeSec: any, textBeforeCursor: any, textAfterCursor: any;

    if (
      range.startContainer.parentNode.nodeName === 'SPAN' &&
      node instanceof Element &&
      node.classList.contains('delay')
    ) {
    } else {
      const spanContainer = textarea?.querySelectorAll('.delay-container');
      spanContainer.forEach((span) => {
        const spanText = span.querySelector('span');
        const prevText = spanText.textContent;
        const newText = `delay{${prevText}}`;
        this.renderer.setProperty(spanText, 'textContent', newText);
      });

      rangeSec = selection.getRangeAt(0).cloneRange();

      // Create a temporary range that includes the entire content of the editable div
      const tempRange = document.createRange();
      tempRange.selectNodeContents(textarea);

      // Set the end of the temporary range to the start of the selection range
      tempRange.setEnd(rangeSec.startContainer, rangeSec.startOffset);

      // Get the text before the cursor by extracting the content of the temporary range
      textBeforeCursor = tempRange.toString();

      // Create a temporary range that includes the entire content of the editable div
      var tempRange2 = document.createRange();
      tempRange2.selectNodeContents(textarea);

      // Set the end of the temporary range to the end of the selection range
      tempRange2.setStart(rangeSec.endContainer, rangeSec.endOffset);

      // Get the text after the cursor by extracting the content of the temporary range
      textAfterCursor = tempRange2.toString();

      // Remove any temporary ranges
      tempRange.detach();
      tempRange2.detach();
      textarea.textContent = textBeforeCursor;
      this.data[index].text = textBeforeCursor;
      this.add_textbox(textAfterCursor);
      setTimeout(() => {
        this.checkDelay();
      }, 100);
    }
  }

  delayText(index: any, value: string) {
    const textarea = document.querySelector(
      `#textarea_inputbox_${index}`,
    ) as HTMLElement;
    const selection = window.getSelection();

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      if (range.startContainer.textContent.includes('}' || '{')) {
        console.log('break');
      } else if (
        textarea.contains(range.commonAncestorContainer) &&
        range.startContainer.nodeType === Node.TEXT_NODE
      ) {
        const span = this.createSpanDelay(index, value);

        // Insert the delay span
        range?.insertNode(span);

        // Move the cursor to the end of the span
        range.setStartAfter(span);
        range.collapse(false);

        // Update the selection with the new range
        selection.removeAllRanges();
        selection.addRange(range);

        // Focus the textarea to allow typing
        textarea.focus();
      } else {
        console.log('break');
      }
    } else {
      console.log('no cursor');
    }

    this.transformToDelayFormat(index);
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
    this.renderer.setStyle(spanOut, 'fontSize', '10px');
    this.renderer.setStyle(spanOut, 'fontWeight', '600');
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

  // Trasform delay text format to delay span when load
  checkDelay() {
    const regexPattern = /delay\{([0-9]{1,2}(?:\.[0-9])?)\}/g;
    const length = this.data.length;

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

      this.data[index].text = newContent.join(' ');
    }
  }

  /* Detect Enter key  */
  detectKey(event: KeyboardEvent, index: number, box: HTMLDivElement) {
    // Break function when reach limit box
    if (this.data.length >= this.limitBox) return;

    /* var for empty box condition */
    const emptyBoxLength = this.getEmptyBoxLength(this.data);
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
        this.data[index].text = textBeforeCursor;
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
      this.data[index].speaker
    ) {
      const { isEdit, speaker, speed, volume, language, text, _id } =
        this.data[index];
      if (!isEdit) {
        this.data[index].isEdit = true;
        return event.preventDefault();
      }
      /* prevent var back to old speakerid */
      // if (this.defaultSpeaker.length > 0) {
      //   this.data[index].speaker = this.defaultSpeaker[index]
      // }

      if (!speed) {
        this.data[index].speed = '1';
      }

      if (!volume) {
        this.data[index].volume = '100';
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
    const { text, index, language, volume, speed } = data;
    // Get History word
    let { soundtext } = highlight_fromArr(text, this.historyWord);

    // Replace delay text
    const replaceBrackets = this._gfunc.replaceBetweenParentheses(soundtext);

    // Bug: Auto change audio_id prevent duplicate
    // this.data[index]._id = generateID();

    // Fetching API
    const temp: AudioDataAPI = {
      audio_id: this.data[index]._id,
      text: replaceBrackets,
      text_delay: soundtext,
      speaker: String(this.data[index].speaker),
      volume,
      speed,
      type_media: 'mp3',
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

  private handleErrorOnGenerateVoice(err: any, index: number) {
    this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
    this._tts.loadingState.next(0);
    // disable loading state for all boxes
    this.data.map((item) => {
      item.isLoading = false;
    });
    // this.data[index].isLoading = false;
    this.soundQueue = [];
    this.processNextRequest();
  }

  // TEST NEW FLOW
  private async handleGeneratedFile(data: TGenerateAudioParams) {
    const { file, index, text, speaker, language, _id } = data;
    // Decrease loading state number
    this._tts.loadingState.next(0);

    // if (file.type === 'application/json') {
    //   const msg: { message: string; status: number } = JSON.parse(
    //     await file.text(),
    //   );

    if (file.message !== 'Generate voice success') {
      this.data[index].isLoading = false;
      this.soundQueue = [];
      this.processNextRequest();
      return this._dialog.warning(file.message);
    }
    // }

    // Run checkAds function
    const ads = await this._ads.checkAds();
    if (ads) this.data[index].isAds = true;

    // //Decode JWT and BASE64
    // const base64File: any = jwtDecode(file.data);
    // const urlFile = atob(base64File.data);
    // const realURL = urlFile.replace(this.user.user_id, '');

    this._generate.setfileStorage(
      data.replaceBrackets,
      speaker,
      file.data,
      _id,
      language,
      ads,
    );

    // this.file.src = URL.createObjectURL(file);
    this.configureAudioFile(data);
    setTimeout(() => {
      this.checkDelay();
    }, 0);
    this.displaySuccessSnackbar();
    this.calpoint.emit();
    this.processNextRequest();
  }

  private configureAudioFile(data: TGenerateAudioParams) {
    const { index, text, speaker, speed, volume, replaceBrackets } = data;
    this.file.playbackRate = Number(speed);
    this.file.volume = Number(volume) / 100;

    this.data[index] = {
      ...this.data[index],
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
        this.data[index].duration = this.file.duration * 1000;
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

  enqueueData(data: TEnqueueParams) {
    const { speaker, index, box, text } = data;
    // Generate text over than limit text
    if (this.getCurrentTextCounted(text) > this.limitText) {
      return this.alertMessage(this.err_redirect.len_message_overlimit);
    }

    if (speaker && text.length > 0) {
      /* set box loading */
      this.data[index].isLoading = true;

      this.data[index].box_height = String(box.offsetHeight) + 'px';

      if (!this.processingQueue) {
        this.processingQueue = true;
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

  playsound(index: number) {
    this.playSound.emit(index);
  }

  stopsound(index: number) {
    this.stopSound.emit(index);
  }

  handleDownloadOrCreate(index: any, box: HTMLDivElement) {
    if (
      !this.data[index].isEdit &&
      this.data[index].category === 'soundtrack'
    ) {
      this.downloadSound.emit(this.data[index]);
      return;
    }
    if (
      this.oldData.text === this.data[index].text &&
      this.oldData.speaker === this.data[index].speaker &&
      this.oldData.voiceLanguage === this.data[index].language.value
    ) {
      this.data[index].isEdit = false;
      return;
    }

    if (this.device === 'Mobile') {
      this.handleMobile(index, box);
    } else {
      this.handleDesktopAndTablet(index, box);
    }
  }

  private handleMobile(index: number, box: HTMLDivElement) {
    if (!this.data[index].speaker) {
      this.openSpeakerDialog(index, box);
    } else {
      const foundItem = this.speaker.find(
        (e) => e.speaker_id === this.data[index].speaker,
      );
      this.languageSupported = foundItem.available_language.includes(
        this.detectedLanguageEntry[index]?.value,
      );
      this.formatSpeaker(foundItem, index);
      if (this.languageSupported) {
        this.setLanguage(this.detectedLanguageEntry[index], index);
        this.processBottomMenu(index, box);
      } else {
        this.processBottomMenu(index, box);
      }
    }
  }

  private openSpeakerDialog(index: number, box: HTMLDivElement) {
    const config = this.getSpeakerDialogConfig();
    this.speakerDialogHandle(config, index, box);
  }

  private processBottomMenu(index: any, box?: HTMLDivElement) {
    const { speaker, speed, volume, language, text, _id } = this.data[index];
    const bottomMenuData = {
      data: this.data[index],
      voiceSpeaker: speaker,
      voiceSpeed: speed,
      voiceVolume: volume,
      voiceLanguage: language,
      edit_mode: false,
      lang: this.lang,
    };
    const bottomMenuSettingRef = this._bottomSheet.open(
      BottomMenuSettingComponent,
      { data: bottomMenuData },
    );

    bottomMenuSettingRef.afterDismissed().subscribe((res: any) => {
      if (res?.message === 'create') {
        const data = res.data;
        this.enqueueData({
          box,
          index,
          speaker,
          speed: data?.voiceSpeed,
          volume: data?.voiceVolume,
          text,
          language: data?.voiceLanguage?.value,
          _id,
        });
      }
    });
  }

  private handleDesktopAndTablet(index: number, box: HTMLDivElement) {
    const { speaker, speed, volume, language, text, _id } = this.data[index];

    if (!speaker) {
      this.openSpeakerDialog(index, box);
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

  /* checks whether it is possible to open a dialog by verifying whether at least one day */
  canOpenDialogAfterTimeout(lastCloseTime: string): boolean {
    // const oneMinuteInMill = 5000;
    const oneMinuteInMill = 86400000;
    const currentTime = new Date().getTime();
    const lastClose = new Date(lastCloseTime).getTime();
    return currentTime - lastClose > oneMinuteInMill;
  }

  remove(i: any) {
    let audioUrl;
    if (this.data[i].category === 'soundtrack') {
      audioUrl = this._generate.getfileStorage(
        this.data[i].text_read,
        this.data[i].speaker,
        this.data[i].language.value,
        this.data[i]._id,
      );
    }

    const confirmClose = localStorage.getItem('confirmCloseRemoveVoice');
    if (!confirmClose || this.canOpenDialogAfterTimeout(confirmClose)) {
      const dialogRef = this.dialog.open(AlertRemoveVoiceComponent);
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.data.splice(i, 1);
          localStorage.setItem(
            'confirmCloseRemoveVoice',
            new Date().toISOString(),
          );
          this.file.pause();
          this.calpoint.emit();
          if (audioUrl) {
            this.deleteGenerated.emit(audioUrl);
          }
        }
      });
    } else {
      this.data.splice(i, 1);
      this.file.pause();
      this.calpoint.emit();
      if (audioUrl) {
        this.deleteGenerated.emit(audioUrl);
      }
    }
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

  setSpeaker(id: string, index: number) {
    if (index < 0) return;

    this.defaultSpeaker[index] = id;
    this.data[index].speaker = id;
    if (this.data[index]?.speaker) {
      let { available_language, language } = this.speaker.find(
        (e) => e.speaker_id === this.data[index]?.speaker,
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
      this.data[index].language = langObj;
      this.data[index].main_lang = [{ value: language }];
      this.data[index].sub_lang = sub;
    }
  }

  detectLanguage(character: any, index: number) {
    if (character && character.textContent !== undefined) {
      const textContent = character.textContent;
      const temp = {
        th: /[\u0E00-\u0E7F]/,
        en: /[A-Za-z]/,
        id: /[\u0400-\u04FF]/,
        ja: /[\u3040-\u309F\u30A0-\u30FF]/,
        lo: /[\u0E80-\u0EFF]/,
        my: /[\u1000-\u109F\uAA60-\uAA7F]/,
        vi: /[\u0100-\u024F\u1E00-\u1EFF]/,
        zh: /[\u4E00-\u9FFF]/,
      };
      const langCounts = Object.fromEntries(
        Object.keys(temp).map((lang) => [
          lang,
          (textContent.match(RegExp(temp[lang], 'g')) || []).length,
        ]),
      );
      //
      for (const lang in temp) {
        if (RegExp(temp[lang]).test(textContent)) {
          langCounts[lang] +=
            textContent.match(RegExp(temp[lang], 'g'))?.length || 0;
        }
      }
      let maxCount = 0;
      let dominantLang = 'unknown';
      for (const lang in langCounts) {
        if (langCounts[lang] > maxCount) {
          maxCount = langCounts[lang];
          dominantLang = lang;
        }
      }
      // Check Id Spaeaker
      let checkSpeakerid = this.data[index].speaker;
      const $inputSpeaker = speakerDataMock.find(
        (speaker) => speaker.speaker_id === checkSpeakerid,
      );
      // Check value language in textbox
      const $inputLang = this.langListAll.find(
        (lang) => lang.value === dominantLang,
      );
      if ($inputLang) {
        this.detectedLanguageEntry[index] = $inputLang;
        // Check speaker can speak language
        this.languageSupported = $inputSpeaker?.available_language.includes(
          this.detectedLanguageEntry[index]?.value,
        );
        // if speaker can speak language but speaker can't speaker language return main language speaker
        if (this.languageSupported) {
          this.converToolbar.forEach((child) => {
            if (child.index === index) {
              this.languageChangeSubscription
                .pipe(debounceTime(1000))
                .subscribe((value) => {
                  const val = { value: dominantLang } as MatSelectChange;
                  child.onChangeLanguage(val);
                });
            }
          });
        }
      }
    }
  }

  setLanguage(i: Block['language'], index: number) {
    this.data[index].language = i;
  }

  setMainSubLanguage(
    obj: { main_lang: any[]; sub_lang: any[] },
    index: number,
  ) {
    this.data[index].main_lang = obj.main_lang;
    this.data[index].sub_lang = obj.sub_lang;
  }

  setSpeed(i: string, index: number) {
    this.data[index].speed = i;
  }

  setvolume(i: string, index: number) {
    this.data[index].volume = i;
  }

  setEdit(boo: boolean, index: number) {
    this.data[index].isEdit = boo;
    this.data[index].isDownload = !boo;
    this.oldData = {
      text: this.data[index].text,
      speaker: this.data[index].speaker,
      voiceLanguage: this.data[index].language.value,
    };

    this.stopSound.emit(index);
    this.calpoint.emit();
    this.setEditData.emit(index);

    // setTimeout(() => {
    //   this.setLanguage(lang, index);
    //   this.converToolbar.forEach((child) => {
    //     if (child.index === index) {
    //       child.voiceLanguage = lang;
    //     }
    //   });
    // }, 0);
  }

  onProgressPlay(current: number, during: number) {
    if (current && during) {
      return (current / during) * 100;
    }
    return 0;
  }
  removeFileStorage(text: string, speaker: string | undefined) {
    /* clear left and right white space */
    const _text = text.trim();

    /* less var */
    let data: any[] = this._tts.file.getValue();

    /* find index */
    const index = data.findIndex(
      (sound: any) => sound.text == _text && sound.speaker == speaker,
    );

    /* remove specific array */
    data.splice(index, 1);

    /* assign new data */
    this._tts.file.next(data);
  }

  triggerdropdown(attr: DropdownAttribute) {
    this.triggerDropdown.emit(attr);
  }

  text = language['TH'].text2speechObj.conver_mode;

  get_dataChangeLanguage(temp: any) {
    if (temp == 'TH') {
      this.text = TH.text2speechObj.conver_mode;
      this.play = 'เล่นเสียง';
    } else if (temp == 'EN') {
      this.text = EN.text2speechObj.conver_mode;
      this.play = 'Play sound';
    }

    this.getdataInfo();
  }

  getdataInfo() {
    this.placeholder = this.text.placeholder;
    this.add_word = this.text.add_word;
    this.err_redirect = this.text.err_redirect;
    this.downloadText = this.text.toolbar.download;
    this.generateText = this.text.toolbar.generate;
    this.closeText = this.text.toolbar.close;
    this.point = this.text.toolbar.point;
    this.bath = this.text.toolbar.bath;
    this.downloadBtnText = this.text.toolbar.downloadBtnText;
    this.cutTextHover = this.text.toolbar.cutTextHover;
    this.delayHover = this.text.toolbar.delayHover;
  }

  // Controls when audio play
  onSliderInput(e: any) {
    this.currentTime = parseInt(e.target.value);
    this.sliderValue.emit(parseInt(e.target.value));
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
      this.data[index].isTextExceed = true;
    } else {
      this.data[index].isTextExceed = false;
    }
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
        position: { left: '0', bottom: '0' },
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
        if (!res) return;
        // Reset previous audio condition base on different speaker checked
        if (this.data[index]?.speaker !== res?.speaker_id) {
          this.data[index].isEdit = true; // Set to edit state
        }

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

        this.formatSpeaker(res?.speakerData, index);
        if (this.device === 'Mobile') {
          this.handleMobile(index, box);
          this.processBottomMenu(index, box);
        }
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

    const lang = this.langListAll.filter((e) => {
      if (isUppercase) {
        return e.value === String(language).toLowerCase();
      } else if (this.lang === 'TH') {
        return e.TH_name === String(language).replace('ภาษา', '');
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
    if (this.data) {
      const data = this.data[index];
      // Get language[] type of main-language
      const main_lang = [
        this.langListAll.find((e) => e.value === data.main_lang[0].value),
      ];
      const sub_lang = [];

      // Get language[] type of sub-language
      data.sub_lang.forEach((lang) => {
        // Filtering language and JSON value for found data
        const filtered = this.langListAll.find((e) => e.value === lang.value);
        if (filtered) sub_lang.push(filtered);
      });

      // Prepare temp varialbe
      const obj = { main_lang, sub_lang };

      // Set data to global variable
      this.setMainSubLanguage(obj, index);
      // this.setLanguage(lang, index);

      // Found speaker id
      const foundItem = this.speaker.find(
        (e) => e.speaker_id === this.data[index].speaker,
      );
      // check spaeker_id can speak language
      this.languageSupported = foundItem.available_language.includes(
        this.detectedLanguageEntry[index]?.value,
      );
      if (this.languageSupported) {
        this.setLanguage(this.detectedLanguageEntry[index], index);
      }
    }

    this.converToolbar.forEach((child) => {
      if (child.index === index) {
        child.voiceLanguage = lang;
      }
    });
  }
}
