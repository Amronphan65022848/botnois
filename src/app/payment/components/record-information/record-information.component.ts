import { Platform } from '@angular/cdk/platform';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { TH } from 'src/app/shared/change_language/TH';
import { EN } from 'src/app/shared/change_language/EN';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';

@Component({
  selector: 'app-record-information',
  templateUrl: './record-information.component.html',
  styleUrls: ['./record-information.component.css']
})
export class RecordInformationComponent implements OnInit {
  panelOpenState = false;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  //#-----------------------------[Change Language]--------------------------------#

  public recommend = 'คำแนะนำในการอัดเสียง';
  public text_right = ['กรุณาอัดเสียงในบริเวณที่ไม่มีเสียงรบกวนและ', 'ใช้ไมโครโฟนในการอัดเสียงเพื่อคุณภาพเสียงที่ดีขึ้น'];
  public stepRecord = 'ขั้นตอนการอัดเสียง';
  public pushMic = 'กดปุ่มไมค์';
  public begidRecord = 'เพื่อเริ่มต้นการอัดเสียง';
  public recordMethod = [
    'อ่านข้อความข้างต้นดังกล่าวจนจบ',
    'ระบบจะทำการอัดเสียงของผู้ใช้งานเอาไว้',
    'เมื่ออ่านจบแล้วให้กดที่ไมค์อีกครั้งเพื่อหยุด',
    'เมื่อสักครู่ให้กดปุ่มเล่นเสียง',
    'หากผู้ใช้งานต้องการฟังเสียงของตัวเองที่อัดไป',
    'หรือหากอยากอัดเสียงใหม่อีกรอบให้กดปุ่ม อ่านใหม่อีกครั้ง',
    'เมื่อพอใจในเสียงที่อัดแล้ว ให้กดปุ่มส่งไฟล์เสียง',
    'ก็เป็นอันเสร็จสิ้นและเริ่มอ่านข้อความถัดไป',
    'ผู้ใช้งานสามารถเปลี่ยนหมวดของข้อความที่อ่านได้และ',
    'สามารถกดข้ามเพื่อเปลี่ยนข้อความใหม่ได้ตามต้องการ',
  ]

  //#-----------------------------[Change Language]--------------------------------#

  constructor(
    private _changelanguage : ChangeLanguageService,
    public platform: Platform,
  ) { }

  ngOnInit(): void {
    this._changelanguage.language.subscribe((res)=>{
      if(res){
        this.get_dataChangelanguage(res);
      }
    })

  }
  ngAfterViewInit(): void {

    setTimeout(() => {
      if (this.platform.ANDROID || this.platform.IOS) {
        this.accordion.closeAll()
      }
      else {
        this.accordion.openAll()
      }

    }, 500);


  }


  text = TH.walletObj.record_voice.record_information;

  get_dataChangelanguage(temp: any){
    if(temp == 'TH'){
      this.text = TH.walletObj.record_voice.record_information;
    }else if (temp == 'EN'){
      this.text = EN.walletObj.record_voice.record_information;
    }
    this.getdataInfo();
  }

  getdataInfo(){
    this.recommend = this.text.recommend ;
    this.stepRecord = this.text.stepRecord           ;
    this.text_right = this.text.text_right           ;
    this.pushMic = this.text.pushMic                 ;
    this.begidRecord = this.text.begidRecord         ;
    this.recordMethod = this.text.recordMethod       ;
  }



}


