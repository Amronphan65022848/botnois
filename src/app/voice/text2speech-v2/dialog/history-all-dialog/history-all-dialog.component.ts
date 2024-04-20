import {
  Component,
  Inject,
  OnInit,
  HostListener,
  ElementRef,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CancelDialogComponent } from '../cancel-dialog/cancel-dialog.component';
import { WordstoreService } from 'src/app/dictionary/services/wordstore.service';
import { AudioDataAPI } from 'src/app/storage/models/text2speech-model';
import { generateID } from '../../function/random';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';

@Component({
  selector: 'app-history-all-dialog',
  templateUrl: './history-all-dialog.component.html',
  styleUrls: ['./history-all-dialog.component.scss'],
})
export class HistoryAllDialogComponent implements OnInit {
  public isMobile: boolean;
  public historyData: any[];
  public itemsPerPage: number = 5;
  public currentPage = 1;

  // @HostListener('window:resize', ['$event'])
  // onResize(event: any) {
  //   if (event.target.innerWidth < 650) {
  //     this.isMobile = true;
  //     this.itemsPerPage = 5;
  //   } else {
  //     this.isMobile = false;
  //     this.itemsPerPage = 10;
  //   }
  // }

  // 650

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private el: ElementRef,
    private _dictionary: WordstoreService,
    private dialog: MatDialog,
    private _tts: TextspeechService
  ) {
    this.historyData = data;
  }

  ngOnInit() {
    // if (window.innerWidth < 650) {
    //   this.isMobile = true;
    //   this.itemsPerPage = 5;
    // } else {
    //   this.isMobile = false;
    //   this.itemsPerPage = 10;
    // }
  }

  get totalPages(): number {
    return Math.ceil(this.historyData.length / this.itemsPerPage);
  }

  get paginatedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.historyData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: any): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const pageNumbers: any[] = [1];
    if (current >= 4) {
      pageNumbers.push('...');
    }

    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(total - 1, current + 1);
      i++
    ) {
      pageNumbers.push(i);
    }

    if (current <= total - 3) {
      pageNumbers.push('...');
    }
    pageNumbers.push(total);

    return pageNumbers;
  }

  playHistoryWord(text: string) {
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

  detectKey(event, item) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  editText(index: number) {
    this.historyData[index].isEdit = true;
    console.log(this.historyData[index]);
  }

  editDone(data: any, index: number) {
    const input_element = this.el.nativeElement.querySelectorAll(
      '[data-ref=' + data.ref_id + ']'
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
        this.historyData[index].before_text = input_element[0].value;
        this.historyData[index].after_text = input_element[1].value;
      },
      error: (e) => {
        console.log('error : ', e);
      },
      complete: () => {
        console.log('complete!!!');
        this.historyData[index].isEdit = false;
      },
    });
  }

  editCancel(index: number) {
    this.historyData[index].isEdit = false;
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
          const deleteHistory = this.historyData.findIndex(
            (obj) => obj.before_text === item.before_text
          );

          if (deleteHistory !== -1) {
            this.historyData.splice(deleteHistory, 1);
          }
        });
      }
    });
  }
}
