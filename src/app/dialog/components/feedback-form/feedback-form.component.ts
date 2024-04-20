import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '../../services/dialog.service';
import { RecordApiService } from '../../../payment/services/record-api.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss'],
})
export class FeedbackFormComponent implements OnInit {

  category = [
    "เติมเงินไม่ได้พ้อยท์",
    "ปัญหาการใช้งานทั่วไป",
    "แนะนำและติชม",
    "ปัญหาเกี่ยวกับเสียงพากย์"
  ]
  fileName = ''

//#-----------------------------[Change Language]--------------------------------#


  feedbackForm = new FormGroup<any>({
    category: new FormControl('', [
      Validators.required
    ]),
    problem_message: new FormControl('', [
      Validators.required
    ]),
    image: new FormControl('', [

    ]),
    feedback_message: new FormControl('', [

    ]),
    name: new FormControl('', [
      Validators.required
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('[- +()0-9]+')
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

  })

  speakerProblemForm = new FormGroup<any>({
    text: new FormControl('', [
      Validators.required,
    ]),
    speaker: new FormControl('', [
      Validators.required,
    ]),
  })

//#-----------------------------[Change Language]--------------------------------#

  constructor(
    private _recordApi: RecordApiService,
    private _alert: DialogService,
    private _notify: NotificationService,
    private _changelanguage : ChangeLanguageService,
  ) {
    // _notify.notifyJson.subscribe(
    //   res => {
    //     if(!res) return
    //     this.category = res.problem_category
    //   }
    // )
  }

  ngOnInit(): void {
    this._changelanguage.language.subscribe((res)=>{
      if(res){
        this.get_dataChangelanguage(res);
      }
    })
  }

  //เหลือแก้ให้ลบไฟล์ภาพจาก input file ใน html
  removeImage(){
    this.fileName = ''
    this.feedbackForm.patchValue({
      image: ''
    })
  }

  onImageChange(event) {
    const files = event.target.files;
    if (files.length === 0) return;

    // const mimeType = files[0].type;
    // if (mimeType.match(/image\/*/) == null) return;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);

    this.fileName = files[0].name
    reader.onload = (_event) => {
      this.feedbackForm.patchValue({ image: reader.result });
    }
  }

  text = TH.feedbackFromObj;

  get_dataChangelanguage(temp:any){
    if(temp == 'TH'){
      this.text = TH.feedbackFromObj;
    }
    else if (temp == 'EN'){
      this.text = EN.feedbackFromObj;
    }
  }

  onSubmit(){
    let feedbackForm = this.feedbackForm.value
    if(feedbackForm.category == 'ปัญหาเกี่ยวกับเสียงพากย์'){
      feedbackForm = Object.assign({},feedbackForm,this.speakerProblemForm.value)
    }
    this._recordApi.addFeedback(feedbackForm).subscribe(
      res => {
        if(res){
          this._alert.success(this.text.alertText.successSending)
          this.feedbackForm.reset()
        } else {
          this._alert.somethingWentWrong()
        }
      }
    )
  }

}
