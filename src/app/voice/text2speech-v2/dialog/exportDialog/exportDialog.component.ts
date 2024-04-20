import { Component, Inject, Input } from '@angular/core';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { SpeakerService } from 'src/app/shared/services/speaker.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import * as XLSX from 'xlsx';
declare let XLSX: any;
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { TH } from 'src/app/shared/change_language/TH';
import { EN } from 'src/app/shared/change_language/EN';

@Component({
  templateUrl: './exportDialog.html',
  styleUrls: ['./exportDialog.component.scss'],
})
export class ExportDialogComponent {
  public selectedFileType: string;
  speaker: any[] = null;

  //#-----------------------------[Change Language]--------------------------------#
  public lang = 'TH';
  public text: any;
  public exportFile: string = 'นำไฟล์ออก';
  public selectType: string = 'เลือกประเภทไฟล์';
  public cancel: string = 'ยกเลิก';
  public exportConfirm: string = 'นำออก';

  //#-----------------------------[Change Language]--------------------------------#

  constructor(
    private _changeLanguage: ChangeLanguageService,
    private _speaker: SpeakerService,
    private _globalFunc: GlobalFunctionService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this._speaker.$speaker.subscribe((res) => (this.speaker = res));

    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.get_dataChangeLanguage(res);
      }
    });

    this.selectedFileType = 'csv';
  }

  export(type: string) {
    // console.log(this.data.toString())
    console.log('data from parent ', this.data);

    const data = this._globalFunc.deepclone(this.data);

    if (data.length <= 0) return;

    let rows = [['text', 'speaker_name']];

    for (let d of data) {
      if (!d.speaker) d.speaker = '1';

      const speakerName = this.speaker.filter(
        (s: any) => s.speaker_id == d.speaker
      )[0].name;

      if (d.text.length > 0) {
        rows.push([d.text, speakerName]);
      } else {
        rows.push(['กรอกข้อความ', speakerName]);
      }
    }

    if (type === 'csv') {
      // let csvContent =
      //   'data:text/csv;charset=utf-8,' +
      //   encodeURIComponent('\uFEFF' + rows.map((e) => e.join(',')).join('\n'));

      let csvContent =
        'data:text/csv;charset=utf-8,' +
        encodeURIComponent(
          '\uFEFF' +
            rows
              .map((row) => {
                return row
                  .map((field) => {
                    if (field.includes(',') || field.includes('"')) {
                      // Encapsulate the field with double quotes and handle escaping double quotes
                      return `"${field.replace(/"/g, '""')}"`;
                    }
                    return field;
                  })
                  .join(',');
              })
              .join('\n')
        );

      var link = document.createElement('a');
      link.setAttribute('href', csvContent);
      link.setAttribute('download', 'bnv-export.csv');

      document.body.appendChild(link);
      link.click();
    } else {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      const excelData = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'binary',
      });

      const arrayBuffer = new ArrayBuffer(excelData.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < excelData.length; i++) {
        view[i] = excelData.charCodeAt(i) & 0xff;
      }

      const blob = new Blob([arrayBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'bnv-export.xlsx';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  get_dataChangeLanguage(temp: string) {
    if (temp == 'TH') {
      this.text = TH.importexportObj;
    } else if (temp == 'EN') {
      this.text = EN.importexportObj;
    }
    this.lang = temp;
    this.getdataInfo();
  }

  getdataInfo() {
    this.exportFile = this.text.exportFile;
    this.selectType = this.text.selectType;
    this.cancel = this.text.cancel;
    this.exportConfirm = this.text.exportConfirm;
  }
}
