import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { DialogService } from '../../services/dialog.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { DynamicContractFormData } from './dynamic-contract-form-data';
import { DialogApiService } from '../../services/dialog-api.service';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';

@Component({
  selector: 'app-dynamic-contract-form',
  templateUrl: './dynamic-contract-form.component.html',
  styleUrls: ['./dynamic-contract-form.component.scss']
})
export class DynamicContractFormComponent implements OnInit {

  inputList: string[] = ['']
  getAllData = DynamicContractFormData
  isLoading = false
  fileName = ''

  //#-----------------------------[Change Language]--------------------------------#

  // public regidter = "ลงทะเบียนวันนี้";
  // public forOffer = "เพื่อรับข้อเสนอและส่วนลดพิเศษ";
  public pleasefill = "*กรุณากรอก";
  // public sentdata = "ส่งข้อมูล";

  //#-----------------------------[Change Language]--------------------------------#


  constructor(
    private _notify: NotificationService,
    private _dialog: DialogService,
    private _api: DialogApiService,
    private _changelanguage: ChangeLanguageService,
  ) {

    /* get array of form control name */
    this.inputList = Object.keys(this.getAllData.form.controls)
  }

  ngOnInit(): void {
    this._changelanguage.language.subscribe((res) => {
      if (res) {
        this.get_dataChangelanguage(res);
      }
    })
  }

  /** Fetching API for add contents to spreadsheet. */
  onSubmit() {
    this.isLoading = true
    this._api.contractToGoogleSheet(this.getAllData.form.value)
      .pipe(
        catchError(err => {
          this.isLoading = false
          return err
        })
      )
      .subscribe(
        resp => {
          this.isLoading = false
          if (resp.status == 200) {

            this._dialog.image(this.getAllData.dialogImageJs)
            this.getAllData.form.reset()

          } else {
            this._dialog.somethingWentWrong()
          }
        }
      )
  }

  text = null;

  get_dataChangelanguage(temp: any) {
    if (temp == 'TH') {
      this.text = TH.dialogMessageObj;
    }
    else if (temp == 'EN') {
      this.text = EN.dialogMessageObj;
    }
    this.pleasefill = "*" + this.text.pleasefill
  }

}

