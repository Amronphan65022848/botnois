import { Component, OnInit, Inject } from '@angular/core';
import { SpeakerService } from 'src/app/shared/services/speaker.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { TH } from 'src/app/shared/change_language/TH';
import { EN } from 'src/app/shared/change_language/EN';

@Component({
  templateUrl: './importDialog.html',
  styleUrls: ['./importDialog.component.scss'],
})
export class ImportDialogComponent implements OnInit {
  showSubContent: Boolean = true;
  showSubContentFail: Boolean = true;

  //#-----------------------------[Change Language]--------------------------------#
  public lang = 'TH';
  public text: any;
  public importFile: string = 'นำไฟล์เข้า';
  public supportFile: string = 'รองรับไฟล์ประเภท .csv';
  public templateCSV: string = 'ดาวน์โหลด template.csv';
  public templateXLSX: string = 'ดาวน์โหลด template.xlsx';
  public sampleFile: string = 'ตัวอย่างไฟล์';
  public cancel: string = 'ยกเลิก';
  public selectFile: string = 'เลือกไฟล์';
  public uploadSuccess: string = 'อัพโหลดไฟล์สำเร็จ';
  public confirm: string = 'ยืนยัน';
  public uploadFailed: string = 'อัพโหลดไฟล์ล้มเหลว';
  public selectAgain: string = 'กรุณาเลือกไฟล์อีกครั้ง';
  public tableExample: string;

  //#-----------------------------[Change Language]--------------------------------#

  speaker: any[] = null;

  constructor(
    private _changeLanguage: ChangeLanguageService,
    private _speaker: SpeakerService,
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this._speaker.$speaker.subscribe((res) => (this.speaker = res));

    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.get_dataChangeLanguage(res);
      }
    });
  }

  downloadXlsx() {
    window.open('', '_blank');
  }

  downloadCsv() {
    window.open('', '_blank');
  }

  selectedFileName: any = null;
  selectedFile: any = null;

  onFileSelected(event: any): void {
    this.selectedFile = event.target;
    this.selectedFileName = event.target.files[0] ?? null;
  }

  import() {
    let files = this.selectedFile;
    files = files.files[0];
    let fileExtension = files.name.split('.').pop().toLowerCase();
    if (fileExtension === 'csv') {
      let reader = new FileReader();
      reader.readAsText(files);
      reader.onload = (e: any) => {
        let csvData = e.target.result;
        let csvRecordsArray = csvData.replace(/""/g, '').split(/\r?\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);
        let temp = this.getDataRecordsArrayFromCSVFile(
          csvRecordsArray,
          headersRow.length
        );
        this.loadcsvToData(temp);

        if (headersRow.length === 1 && headersRow[0] === '') {
          this.ShowFailButton();
          this.resetDialog();
        } else if (headersRow.length !== 1 && headersRow[0] !== '') {
          this.ShowSuccessButton();
          this.resetDialog();
          this.dialogRef.close(temp);
        }
      };
    } else {
      console.log('err');
    }
  }

  ShowSuccessButton() {
    this.showSubContent = this.showSubContent ? false : true;
  }

  ShowFailButton() {
    this.showSubContentFail = this.showSubContentFail ? false : true;
  }

  resetDialog() {
    this.showSubContent = true;
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
      if (csvRecordsArray[i].length) {
        let curruntRecord = csvRecordsArray[i].match(
          /(".*?"|[^",]+)(?=\s*,|\s*$)/g
        );


        let transformData = curruntRecord.map((item) =>
          item.replace(/^"(.*)"$/, '$1')
        );


        if (transformData.length == headerLength) {
          csvArr.push(transformData);
        }
      }
    }
    return csvArr;
  }

  loadcsvToData(csvarray: Array<Array<String>>) {
    if (
      !(
        csvarray.length === 1 &&
        csvarray[0].length === 1 &&
        csvarray[0][0] === ''
      )
    ) {
      this.dialogRef.close(csvarray);
    }
  }

  get_dataChangeLanguage(temp: string) {
    if (temp == 'TH') {
      this.text = TH.importexportObj;
      this.tableExample = '../../../../assets/img/table_example_TH.png';
    } else if (temp == 'EN') {
      this.text = EN.importexportObj;
      this.tableExample = '../../../../assets/img/table_example_EN.png';
    }
    this.lang = temp;
    this.getdataInfo();
  }

  getdataInfo() {
    this.importFile = this.text.importFile;
    this.supportFile = this.text.supportFile;
    this.templateCSV = this.text.templateCSV;
    this.templateXLSX = this.text.templateXLSX;
    this.sampleFile = this.text.sampleFile;
    this.cancel = this.text.cancel;
    this.selectFile = this.text.selectFile;
    this.uploadSuccess = this.text.uploadSuccess;
    this.confirm = this.text.confirm;
    this.uploadFailed = this.text.uploadFailed;
    this.selectAgain = this.text.selectAgain;
  }
}
