import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AudioDataAPI } from 'src/app/storage/models/text2speech-model';
import { generateID } from '../../text2speech-v2/function/random';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';
import { MatIconModule } from '@angular/material/icon';
import { CancelDialogComponent } from '../../text2speech-v2/dialog/cancel-dialog/cancel-dialog.component';
import { WordstoreService } from 'src/app/dictionary/services/wordstore.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-add-words',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    // MatStepperModule,
    MatPaginatorModule,
  ],
  templateUrl: './add-words.component.html',
  styleUrl: './add-words.component.scss',
})
export class AddWordsComponent {
  /* History word */
  historyWord: any[];
  historyWordPaginated: any[];
  @Input() state_loading!: number;
  @Input() allsoundState!: boolean;

  writingText = '';
  readingText = '';

  page = 1;
  pageIndex = 0;
  firstIndexOfItem = 0;
  lastIndexOfItem = 4;

  public formWords: FormGroup;
  public isChangeWordExpand: boolean = false;

  text = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private el: ElementRef,
    private fb: FormBuilder,
    private _tts: TextspeechService,
    private _dictionary: WordstoreService,
    private dialog: MatDialog,
  ) {
    this.historyWord = data.history.reverse();
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

  playWord(event: any) {
    // this.playInSidebar.emit(event);
  }

  playHistoryWord(text: string) {
    // this.playHistorySidebar.emit(text);
  }

  playWordInSidebar(event: any) {
    // play from button in sidebar
    const text: string =
      event.srcElement.parentElement.parentElement.parentElement.children[1]
        .children[0].value;
    if (text.length > 0) {
      const temp: AudioDataAPI = {
        audio_id: generateID(),
        text: text,
        text_delay: text,
        speaker: '1',
        volume: '100',
        speed: '1',
        type_voice: 'wav',
      };
      this._tts.generateVoice(temp).subscribe((res: any) => {
        const audio = new Audio();
        audio.src = URL.createObjectURL(res);
        audio.play();
      });
    }
  }

  playHistoryInSidebar(event: string) {
    if (event.length > 0) {
      const temp: AudioDataAPI = {
        audio_id: generateID(),
        text: event,
        text_delay: event,
        speaker: '1',
        volume: '100',
        speed: '1',
        type_voice: 'wav',
      };
      this._tts.generateVoice(temp).subscribe((res: any) => {
        const audio = new Audio();
        audio.src = URL.createObjectURL(res);
        audio.play();
      });
    }
  }

  detectKey(event: any, data: any) {
    const input_element = this.el.nativeElement.querySelectorAll(
      '[data-ref=' + data.ref_id + ']',
    );

    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  editText(index: number) {
    this.historyWord[index].isEdit = true;
    console.log(this.historyWord[index]);
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
        console.log(data);
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

  handlePageEvent(event) {
    this.pageIndex = event.pageIndex;
    // calculate index to slice array
    const first = event.pageIndex * 4;
    const last = event.pageIndex * 4 + 4;
    this.firstIndexOfItem = first;
    this.lastIndexOfItem = last;
  }
}
