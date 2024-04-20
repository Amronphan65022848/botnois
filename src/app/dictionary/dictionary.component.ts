import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogDeleteRowComponent } from '../dialog/components/dialog-delete-row/dialog-delete-row.component';
import { DialognconfirmpaidComponent } from '../dialog/components/dialognconfirmpaid/dialognconfirmpaid.component';
import { EditrowmobiledialogComponent } from '../dialog/components/editrowmobiledialog/editrowmobiledialog.component';
import { ChangeLanguageService } from '../shared/services/change-language.service';
import { TextspeechService } from '../shared/services/textspeech.service';
import { AudioDataAPI } from '../storage/models/text2speech-model';
import { AddworddialogComponent } from './components/addworddialog/addworddialog.component';
import { WordstoreService } from './services/wordstore.service';
import { language } from '../shared/change_language/language';
@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss'],
})
export class DictionaryComponent implements OnInit {
  private progress = 0;

  @ViewChild('bar') bar: ElementRef;

  get progressPercentage() {
    return Math.floor(this.progress * 100);
  }
  public showDelay = new FormControl<any>(400);
  public position = new FormControl<any>('above');

  public checks: boolean;
  public file = new Audio();
  public selectState = false;
  public center: boolean = false;
  public firstClick: boolean = false;

  public hasValue: any;
  display = false;
  displayedColumn = [
    'select',
    'date_time',
    'before_text',
    'after_text',
    'listen-to-sound',
    'edit',
  ];
  selection = new SelectionModel<any>(true, []);
  dataSource = new MatTableDataSource<any>();
  data: any;
  textSearch!: String;

  //#-----------------------------[Change Language]--------------------------------#

  // public topic_word = 'คลังคำศัพท์';
  // public addWrongWord = 'เพิ่มคำอ่านผิด';
  public searching = 'ค้นหา';
  // public searchingWord = 'ค้นหาคำเขียน';
  // public dateTime = ['วันที่/เวลา','น.'];
  // public reading = 'คำอ่าน';
  // public writing = 'คำเขียน';
  // public edit_writing = 'คำอ่านที่ถูกแก้ไข';
  // public listening = 'ฟังเสียง';
  // public liste = 'ฟัง';
  // public edit = 'แก้ไข';
  // public accept = 'ตกลง';
  // public cancel = 'ยกเลิก';
  // public remove = 'ลบ';
  // public err_redirect = {
  //     not_found : 'ไม่พบข้อมูล',
  // }

  //#-----------------------------[Change Language]--------------------------------#

  constructor(
    private el: ElementRef,
    public dialog: MatDialog,
    private _dictionary: WordstoreService,
    private textService: TextspeechService,
    private _changeLanguage: ChangeLanguageService,
  ) {
    this.checkState = false;
    this.checks = false;
  }
  ngOnInit(): void {
    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].wordStoreObj;
        this.searching = this.text.searching + '...';
      }
    });
    this.getDataWord();
    setInterval(() => {
      this.progress += 0.001;
      if (this.progress >= 1) {
        this.progress = 0;
      }
    }, 0);
  }
  ngDoCheck() {
    this.checkVa();
    this.checkAll();
  }

  checkVa() {
    if (this.dataSource.data.length == 0) {
      this.hasValue = false;
    } else {
      this.hasValue = true;
    }
  }
  checkState!: Boolean;
  date: any;
  stateChange = false;

  textForm = new FormGroup<any>({
    before: new FormArray([]),
    after: new FormArray([]),
  });
  showText: any;
  storeOldForm: any;
  isEdit = false;
  isSubmit = false;

  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   this.a1 = numSelected;
  //   const numRows = this.dataSource.data.length;
  //   this.a2 = numRows;
  //   return numSelected === numRows;
  // }

  masterToggle(event: any) {
    this.dataSource.data = this.dataSource.data.map((item: any) => ({
      ...item,
      selected: event.checked,
    }));
  }

  generateID() {
    let result_id = '';
    const length = 10;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    for (var i = 0; i < length; i++) {
      result_id += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result_id;
  }

  open_confirm() {
    this.dialog.open(DialognconfirmpaidComponent, {});
  }

  getDataWord() {
    const data = this._dictionary.data.getValue();
    this.data = data.map((word: any) => ({
      ...word, // JSON
      isEdit: false,
      selected: false,
      isLoadSound: false,
      ref_id: this.generateID(),
    }));

    this.data = this.data.sort(function (a: any, b: any) {
      const c: any = new Date(a.date_time);
      const d: any = new Date(b.date_time);
      return d - c;
    });

    // this.data = data.response.map((v: any) => ({ ...v, selected: false }))
    this.textForm.value.before = [];
    this.textForm.value.after = [];

    let beforeControls = this.textForm.get('before') as FormArray;
    let afterControls = this.textForm.get('after') as FormArray;
    beforeControls.clear();
    afterControls.clear();
    this.data.forEach((e: any) => {
      beforeControls.push(
        new FormGroup({
          text: new FormControl(e.before_text),
        }),
      );
      afterControls.push(
        new FormGroup({
          text: new FormControl(e.after_text),
        }),
      );
    });

    this.storeOldForm = this.textForm.value;

    this.dataSource.data = this.data;
    this._dictionary.getWordStore().subscribe((data: any) => {
      if (data.status == 200) {
        // this.data = data.response
        const temp = data.response.map((word: any) => ({
          ...word, // JSON
          isEdit: false,
          selected: false,
          isLoadSound: false,
          ref_id: this.generateID(),
        }));
        this.dataSource.data = this.data = temp;
      }
    });
  }

  detectkey(e: any, data: any) {
    if (e.key == 'Enter') {
      e.preventDefault();
      this.editDone(data);
    }
  }
  search(event: any) {
    let filterValue = '';
    if (event) {
      filterValue = (event.target as HTMLInputElement).value;
    }

    this.dataSource.filter = filterValue;

    // this.getDataWord();
  }

  checkAll() {
    let checks: boolean = true;
    if (this.dataSource.data.length == 0) {
      return false;
    } else {
      this.dataSource.data.map((word: any) => {
        if (word.selected == false) {
          checks = false;
        }
      });
      return checks;
    }
  }
  clearSearch() {
    this.textSearch = '';

    this.dataSource.filter = '';
  }

  openSelectState() {
    this.selectState = true;
    this.firstClick = !this.firstClick;
  }

  // ---------------------------------------------
  playWord(data: any) {
    const text = data.after_text;
    // const btn_play = this.el.nativeElement.querySelectorAll("#btn-playtext")[0];

    const result = this.getfileStorage(text);

    // TEST NEW FLOW
    if (result.length == 1) {
      data.isLoadSound = false;
      // this.file.src = URL.createObjectURL(result[0].file);

      this.file.play();
    } else {
      data.isLoadSound = true;

      const temp: AudioDataAPI = {
        audio_id: data._id,

        text: text,
        text_delay: text,

        speaker: '1',
        volume: '100',
        speed: '1',
        type_voice: 'wav',
      };
      this.textService.generateVoice(temp).subscribe((file: any) => {
        this.keepfileStorage(text, file);
        this.file.src = URL.createObjectURL(file);
        this.file.play();
        data.isLoadSound = false;
      });
    }
  }

  getfileStorage(text: string) {
    const _text = text.replace(/\s/g, '');

    const result = this.textService.file
      .getValue()
      .filter((sound: any) => sound.text == _text);
    return result;
  }
  keepfileStorage(text: string, file: Blob) {
    const _text = text.replace(/\s/g, '');

    const new_file: any = [{ text: _text, file: file }];
    this.textService.file.next([
      ...this.textService.file.getValue(),
      ...new_file,
    ]);
  }

  checked(id: string) {
    // this.dataSource.data[i].selected = !this.dataSource.data[i].selected;

    this.dataSource.data = this.dataSource.data.map((word: any) =>
      word._id === id
        ? {
            ...word,
            selected: !word.selected,
          }
        : word,
    );
  }

  editRow(id: string) {
    // olddata.isEdit = !olddata.isEdit;

    this.dataSource.data = this.dataSource.data.map((word: any) =>
      word._id === id
        ? {
            ...word,
            isEdit: true,
          }
        : word,
    );
  }

  // --------------------------------------------------------------
  editDone(data: any) {
    const input_element = this.el.nativeElement.querySelectorAll(
      '[data-ref=' + data.ref_id + ']',
    );
    const editWord: any = {
      _id: data._id,
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
      new: editWord,
    };

    if (
      editWord.after_text?.replace(/\s/g, '').length <= 0 ||
      editWord.before_text?.replace(/\s/g, '').length <= 0
    )
      return;

    this.dataSource.data = this.dataSource.data.map((word: any) =>
      word._id === data._id
        ? {
            ...word,
            isEdit: false,
            before_text: input_element[0].value,
            after_text: input_element[1].value,
          }
        : word,
    );

    let data_update_t2s_page = this._dictionary.data_edit.getValue();
    data_update_t2s_page.push(editWord);

    this._dictionary.data_edit.next(data_update_t2s_page);

    this._dictionary.editWordStore(temp).subscribe((res: any) => {
      if (res) {
      }
    });
  }

  closeEdit(id: string) {
    this.dataSource.data = this.dataSource.data.map((word: any) =>
      word._id === id
        ? {
            ...word,
            isEdit: false,
          }
        : word,
    );
  }

  longtext(data: any) {
    if (data.length >= 15) {
      let newdata = data.slice(0, 6);
      return newdata + '...';
    } else {
      return data;
    }
  }

  get_Month(m: any) {
    if (m == 'Jan') {
      return '01';
    } else if (m == 'Feb') {
      return '02';
    } else if (m == 'Mar') {
      return '03';
    } else if (m == 'Apr') {
      return '04';
    } else if (m == 'May') {
      return '05';
    } else if (m == 'Jun') {
      return '06';
    } else if (m == 'Jul') {
      return '07';
    } else if (m == 'Aug') {
      return '08';
    } else if (m == 'Sep') {
      return '09';
    } else if (m == 'Oct') {
      return '10';
    } else if (m == 'Nov') {
      return '11';
    } else return '12';
  }
  get_Year(y: any) {
    let x: number = +y;

    return x + 543;
  }

  async addWrongword() {
    const dialogRef = this.dialog.open(AddworddialogComponent, {
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        result = await result.filter((word: any) => word.before_text !== '');
        result = await result.filter((word: any) => word.after_text !== '');

        if (result.length > 0) {
          result = await result.map((item: any) => ({
            ...item,
            date_time: new Date().toISOString(),
            isEdit: false,
            ref_id: this.generateID(),
            selected: false,
            _id: this.generateID(),
          }));

          const data = await result.map((item: any) => ({
            ...item,
          }));

          let fake_data = result.concat(this.dataSource.data);
          this.dataSource.data = fake_data;

          this._dictionary.data_edit.next([
            ...this._dictionary.data_edit.getValue(),
            ...result,
          ]);
          await this._dictionary.addWordStore(data).subscribe();
        }
      }
    });
  }

  removeRow() {
    let b: any = 0;
    let delete_in_web: any;
    b = this.dataSource.data.filter((row) => {
      return row.selected == true;
    });
    delete_in_web = this.dataSource.data.filter((row) => {
      return row.selected == false;
    });

    if (b.length == 0) {
      this.firstClick = false;
      this.selectState = false;
    } else {
      const dialogRef = this.dialog.open(DialogDeleteRowComponent, {
        data: b.length,
        panelClass: 'full-width-dialog',
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result === true) {
          this.checkState = !this.checkState;

          let delete_id: any = [];
          b.map((item: any) => {
            delete_id.push({
              user_id: item.user_id,
              before_text: item.before_text,
              after_text: item.after_text,
            });
          });

          this._dictionary.data_edit.next([
            ...this._dictionary.data_edit.getValue(),
            ...b,
          ]);

          const arr_id: any = {
            delete: delete_id,
          };
          this.dataSource.data = delete_in_web;
          this._dictionary.deleteWordStore(arr_id).subscribe(() => {});
        }
      });
    }
  }

  get before() {
    return this.textForm.get('before') as FormArray;
  }
  get after() {
    return this.textForm.get('after') as FormArray;
  }

  editRowMobile(data: any) {
    let a: any = data;
    const dialogRef = this.dialog.open(EditrowmobiledialogComponent, {
      data: a,
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == false) {
        return;
      }

      const old = {
        user_id: data.user_id,
        before_text: data.before_text,
        after_text: data.after_text,
      };

      const temp = {
        old,
        new: result,
      };

      this.dataSource.data = this.dataSource.data.map((word: any) =>
        word._id === result._id
          ? {
              ...word,
              isEdit: false,
              before_text: result.before_text,
              after_text: result.after_text,
            }
          : word,
      );

      let data_update_t2s_page = this._dictionary.data_edit.getValue();
      data_update_t2s_page.push(result);

      this._dictionary.data_edit.next(data_update_t2s_page);

      this._dictionary.editWordStore(temp).subscribe((res: any) => {
        if (res) {
        }
      });
    });
  }
  onEdit() {
    this.isEdit = !this.isEdit;
  }

  onSubmit() {
    this.isEdit = false;
    let afterArray = this.textForm.value.after;
    let beforeArray = this.textForm.value.before;

    for (let index = 0; index < afterArray.length; index++) {
      this.showText[index].before_text = beforeArray[index].text;
      this.showText[index].after_text = afterArray[index].text;
    }
    this.storeOldForm = this.textForm.value;
  }

  onCancel() {
    this.isEdit = false;
    this.textForm.reset(this.storeOldForm);
  }

  text = null;
}
