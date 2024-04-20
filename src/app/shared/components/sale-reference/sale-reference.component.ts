import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { WalletService } from 'src/app/payment/services/wallet.service';
import { TAPIResponse } from '../../models/shared-model';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TitleCasePipe } from '@angular/common';
import { TH_EN_flag } from 'src/app/voice/mocks/conversation-mock';

type TItemList = {
  label: string;
  value: string;
};

@Component({
  selector: 'app-sale-reference',
  templateUrl: './sale-reference.component.html',
  styleUrls: ['./sale-reference.component.css'],
  standalone: true,
  imports: [MatSelectModule, ReactiveFormsModule, TitleCasePipe],
})
export class SaleReferenceComponent implements OnInit {
  data: TAPIResponse<string> = null;

  // contentStyleList = [
  //   { label: 'creative', value: 'creativeObj' },
  //   { label: 'storytelling', value: 'storytellingObj' },
  // ];
  contentStyleList = ['creative', 'storytelling'];

  contentStyleForm = new FormControl(this.contentStyleList[0]);
  currentStyle = this.contentStyleList[0];
  creativeObj = {
    topicList: [
      { label: 'แคปชั่นขายของ', value: 'sales caption' },
      { label: 'คำอธิบายสินค้า', value: 'Product description' },
      { label: 'สอนการใช้งานผลิตภัณฑ์', value: 'Teach how to use the product' },
      { label: 'ประโยคเปิดคลิป', value: 'Clip opening sentence' },
      { label: 'สคริปต์วิดีโอ', value: 'Video script' },
      { label: 'แคปชั่นโซเซียล', value: 'Social captions' },
    ],
    styleList: [
      { label: 'จูงใจให้ใช้สนุกสนาน', value: 'Incentive to use' },
      { label: 'สนุกสนาน', value: 'fun' },
      { label: 'มืออาชีพ', value: 'professional' },
      { label: 'น่าเชื่อถือ', value: 'reliable' },
      { label: 'สาระน่ารู้', value: 'Interesting information' },
      { label: 'เข้าประเด็น', value: 'Get to the point' },
    ],
  };

  storytellingObj = {
    topicList: [
      { label: 'เล่าเรื่องผี', value: 'Ghost stories' },
      { label: 'เล่านิทาน', value: 'Stories' },
    ],
    styleList: [
      { label: 'สนุกสนาน', value: 'fun' },
      { label: 'เร้าอารมณ์', value: 'dramatic' },
      { label: 'เศร้าโศก', value: 'sorrowful' },
      { label: 'โกรธเคือง', value: 'angry' },
      { label: 'โบราณออเจ้า', value: 'retro thai' },
    ],
  };

  rangeList = [
    { label: 'สั้น', value: '50' },
    { label: 'ปานกลาง', value: '125' },
    { label: 'ยาว', value: '200' },
  ];

  openAIModelList = [
    { label: 'gpt-3.5-turbo-0125', value: 'gpt-3.5-turbo-0125' },
    { label: 'gpt-4-0125-preview', value: 'gpt-4-0125-preview' },
  ];

  languageList = TH_EN_flag;

  submitForm = new FormGroup({
    text: new FormControl(''),
    topic: new FormControl(this.getListBasedOnStyle('topicList')[0].value),
    style: new FormControl(this.getListBasedOnStyle('styleList')[0].value),
    range: new FormControl(this.rangeList[0].value),
    model: new FormControl(this.openAIModelList[0].value),
    emoji: new FormControl(false),
    generateCount: new FormControl(1),
    language: new FormControl(this.languageList[0].EN_name),
  });
  constructor(
    private http: HttpClient,
    private _auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.contentStyleForm.valueChanges.subscribe((val) => {
      this.currentStyle = val;
    });
  }

  getListBasedOnStyle(key: 'topicList' | 'styleList'): TItemList[] {
    return this[`${this.currentStyle}Obj`][key];
  }

  onSubmit() {
    const { text, topic, style, range, model, emoji, language, generateCount } =
      this.submitForm.value;
    // const webapi = 'http://localhost:4444';
    const webapi = 'https://khtkfkm1-4444.asse.devtunnels.ms';
    const apiName = `/api/marketplace/get_prompt`;
    const queryParams = `?text=${text}&topic=${topic}&style=${style}&range=${range}&model=${model}&emoji=${emoji}&generateCount=${generateCount}&language=${language}`;
    const url = `${webapi}${apiName}${queryParams}`;
    console.log(url);

    this.http
      .get<TAPIResponse<string>>(url, this._auth.getHeader())
      .subscribe((res) => (this.data = res));
  }
}
