import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { SpeakerService } from 'src/app/shared/services/speaker.service';
import {
  MatDialog,
} from '@angular/material/dialog';
import { ExportDialogComponent } from '../dialog/exportDialog/exportDialog.component';
import { ImportDialogComponent } from '../dialog/importDialog/importDialog.component';

@Component({
  selector: 'app-importexport-t2s',
  templateUrl: './importexport-t2s.component.html',
  styleUrls: ['./importexport-t2s.component.scss'],
})
export class ImportexportT2sComponent implements OnInit {
  @Input() data!: any[];
  @Output() loadCSV = new EventEmitter();
  @Input() lang: string;
  //#-----------------------------[Change Language]--------------------------------#

  public err_redirect = {
    wrong_file_form: 'รูปแบบไฟล์ไม่ถูกต้อง',
  };
  public import_file = 'Import File';
  public export_file = 'Export File';

  speaker: any[] = null;

  //#-----------------------------[Change Language]--------------------------------#
  public imexOption: String;
  public showDelay = new FormControl<any>(400);
  public position = new FormControl<any>('above');

  constructor(
    private _dialog: DialogService,
    private _speaker: SpeakerService,
    private _gfunc: GlobalFunctionService,

    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._speaker.$speaker.subscribe((res) => (this.speaker = res));

    // this.get_dataChangeLanguage(this.lang)
  }

  ngOnChanges(): void {
    // Catch up the binding data on change
    if (this.lang) {
      this.get_dataChangeLanguage(this.lang);
    }
  }

  import(files: any) {
    files = files.files[0];
    console.log(files);
    let fileExtension = files.name.split('.').pop().toLowerCase();
    if (fileExtension == 'csv') {
      let reader = new FileReader();
      reader.readAsText(files);
      reader.onload = () => {
        let csvData = reader.result as any;
        let csvRecordsArray = csvData.split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(csvRecordsArray);
        let temp = this.getDataRecordsArrayFromCSVFile(
          csvRecordsArray,
          headersRow.length
        );
        this.loadcsvToData(temp);
      };
    } else {
      this._dialog.error(this.err_redirect.wrong_file_form);
    }
  }

  export() {
    // ["text_category", "text", "speaker_name", "speed", "text_with_delay", "volume", "downloaded"]
    // Prevent sync data change original variable
    const data = this._gfunc.deepclone(this.data);
    /* Empty array will return */
    if (data.length <= 0) return;

    let rows = [['text', 'speaker_name']];

    for (let d of data) {
      // If no speaker data, always set 1
      if (!d.speaker) d.speaker = '1';

      // Get speaker name by filtered
      const speakerName = this.speaker.filter(
        (s: any) => s.speaker_id == d.speaker
      )[0].thai_name;

      if (d.text.length > 0) {
        rows.push([d.text, speakerName]);
      } else {
        rows.push(['กรอกข้อความ', speakerName]);
      }
    }

    let csvContent =
      'data:text/csv;charset=utf-8,' +
      encodeURIComponent('\uFEFF' + rows.map((e) => e.join(',')).join('\n'));

    var link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'bnv-export.csv');

    document.body.appendChild(link);
    link.click();
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = csvRecordsArr[0].split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = csvRecordsArray[i].split(',');
      if (curruntRecord.length == headerLength) {
        csvArr.push(curruntRecord);
      }
    }
    return csvArr;
  }

  /* not use */
  readUTF8String(bytes) {
    var ix = 0;

    if (bytes.slice(0, 3) == '\xEF\xBB\xBF') {
      ix = 3;
    }

    var string = '';
    for (; ix < bytes.length; ix++) {
      var byte1 = bytes[ix].charCodeAt(0);
      if (byte1 < 0x80) {
        string += String.fromCharCode(byte1);
      } else if (byte1 >= 0xc2 && byte1 < 0xe0) {
        var byte2 = bytes[++ix].charCodeAt(0);
        string += String.fromCharCode(((byte1 & 0x1f) << 6) + (byte2 & 0x3f));
      } else if (byte1 >= 0xe0 && byte1 < 0xf0) {
        var byte2 = bytes[++ix].charCodeAt(0);
        var byte3 = bytes[++ix].charCodeAt(0);
        string += String.fromCharCode(
          ((byte1 & 0xff) << 12) + ((byte2 & 0x3f) << 6) + (byte3 & 0x3f)
        );
      } else if (byte1 >= 0xf0 && byte1 < 0xf5) {
        var byte2 = bytes[++ix].charCodeAt(0);
        var byte3 = bytes[++ix].charCodeAt(0);
        var byte4 = bytes[++ix].charCodeAt(0);
        var codepoint =
          ((byte1 & 0x07) << 18) +
          ((byte2 & 0x3f) << 12) +
          ((byte3 & 0x3f) << 6) +
          (byte4 & 0x3f);
        codepoint -= 0x10000;
        string += String.fromCharCode(
          (codepoint >> 10) + 0xd800,
          (codepoint & 0x3ff) + 0xdc00
        );
      }
    }

    return string;
  }

  csvStringtoArray(csvstring: string) {
    let csvarray = [];
    let csvstringarray = csvstring.split('\n');

    for (let row in csvstringarray) {
      let temp = this.limitData(csvstringarray[row].split(','));
      // csvarray.push(temp)
    }
    return csvarray;
  }

  /** Fuction for prevent wrong value on excel file.
   * @param data string
   */
  limitData(data: string[]) {
    /* comment for future pick */
    /* index 2 is speed */
    // const speed_arr = [0.25,0.50,0.75,1,1.25,1.50]
    // let speed = Number(data[2])
    // if(speed > 100) speed = 100
    // else if (speed < 10) speed = 10
    // data[2] = String(speed)

    /* index 1 is speaker */
    let speaker = data[1].replace('\r', '');
    // if(speaker > 100) speaker = 100
    // else if (speaker < 10) speaker = 10
    data[1] = String(speaker);

    return data;
  }

  loadcsvToData(csvarray: Array<Array<String>>) {
    this.loadCSV.emit(csvarray);
  }

  imexFunction(event: MatSelectChange) {
    if (event.value == 'import') {
      let input = document.createElement('input');
      input.type = 'file';
      input.click();
      input.onchange = (e) => {
        this.import(e.target);
      };
      this.imexOption = '';
    } else if (event.value == 'export') {
      this.export();
      this.imexOption = '';
    }
  }

  text = TH.text2speechObj.importexport_t2s;

  get_dataChangeLanguage(temp: any) {
    if (temp == 'TH') {
      this.text = TH.text2speechObj.importexport_t2s;
    } else if (temp == 'EN') {
      this.text = EN.text2speechObj.importexport_t2s;
    }
    this.getdataInfo();
  }

  getdataInfo() {
    this.err_redirect = this.text.err_redirect;
    this.import_file = this.text.import_file;
    this.export_file = this.text.export_file;
  }

  openDialogImport() {
    const dialogRef = this.dialog.open(ImportDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`ImportDialog result: `, result);
      if (result) {
        this.loadCSV.emit(result);
      }
    });
  }

  openDialogExport() {
    const data = this.data;

    const dialogRef = this.dialog.open(ExportDialogComponent, {
      data: data,
    });

    console.log('data to child ', data);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`ExportDialog result: `, result);
    });
  }
}
