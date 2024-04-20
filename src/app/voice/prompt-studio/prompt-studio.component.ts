import { CategoryPipe } from './../../shared/pipes/category.pipe';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  signal,
  ViewChild,
  Output,
  Input,
  SimpleChanges,
} from '@angular/core';
import { Block } from '../models/conversation-model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TH_EN_flag } from '../mocks/conversation-mock';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TAPIResponse } from 'src/app/shared/models/shared-model';
import { CategoriesBarComponent } from './categories-bar/categories-bar.component';
import { Language } from '../../shared/models/shared-model';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { TLangListAll } from 'src/app/voice/models/conversation-model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangeLanguageService } from '../../shared/services/change-language.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface Result {
  title: string;
  result: Block[];
}

type TItemList = {
  label: string;
  value: string;
};
interface MyDataObject {
  text: string;
  data: string;
}

@Component({
  selector: 'app-prompt-studio',
  standalone: true,
  imports: [
    CommonModule,
    CategoriesBarComponent,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './prompt-studio.component.html',
  styleUrl: './prompt-studio.component.scss',
})
export class PromptStudioComponent {
  data: TAPIResponse<string> = null;

  @Input() categoryName: string;
  @Output() resultData = new EventEmitter<MyDataObject>();

  resultObject: MyDataObject | null = null;

  CategoryObj = {
    styleList: [
      { label: 'จูงใจให้ใช้สนุกสนาน', value: 'Incentive to use' },
      { label: 'สนุกสนาน', value: 'fun' },
      { label: 'มืออาชีพ', value: 'professional' },
      { label: 'น่าเชื่อถือ', value: 'reliable' },
      { label: 'สาระน่ารู้', value: 'Interesting information' },
      { label: 'เข้าประเด็น', value: 'Get to the point' },
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
  resultsList = [
    { label: '1x', value: 1 },
    { label: '2x', value: 2 },
    { label: '3x', value: 3 },
    { label: '4x', value: 4 },
    { label: '5x', value: 5 },
  ];

  openAIModelList = [
    { label: 'gpt-3.5-turbo-0125', value: 'gpt-3.5-turbo-0125' },
    { label: 'gpt-4-0125-preview', value: 'gpt-4-0125-preview' },
  ];

  languageList = TH_EN_flag;
  textLang: Language;
  currentFlag: string = '';
  lang: any = null;
  currentLangSelect: string;
  textAreaValue: any = '';
  text: any;
  styleName: string = '';
  resultNumber: number = this.resultsList[0].value;
  loading: boolean = false;
  selectedRange: string = '';
  platform: string = 'Facebook';
  selectedIcon: 'basic' | 'pro' = 'basic';

  onTopicSelected(topicValue: string): void {
    this.submitForm.patchValue({ topic: topicValue });
    // console.log('Topic selected and form updated with:', topicValue);
  }

  submitForm: FormGroup;
  private initializeForm() {
    this.submitForm = new FormGroup({
      text: new FormControl(''),
      topic: new FormControl(this.categoryName),
      style: new FormControl(this.styleName),
      range: new FormControl(this.selectedRange),
      model: new FormControl(this.openAIModelList[0].value),
      emoji: new FormControl(false),
      generateCount: new FormControl(1),
      language: new FormControl(this.languageList[0].EN_name),
    });
  }
  constructor(
    private http: HttpClient,
    private _auth: AuthService,
    private _language: ChangeLanguageService,
  ) {}

  private $destroy = new Subject();

  ngOnInit(): void {
    this.initializeForm();

    this._language.language
      .pipe(takeUntil(this.$destroy))
      .subscribe(async (res) => {
        if (res) {
          this.textLang = res;
        }
      });
    this.selectIcon(this.selectedIcon);
  }

  onSubmit() {
    this.loading = true;
    const formValues = this.submitForm.value;
    const { text, topic, style, range, model, emoji, language, generateCount } =
      this.submitForm.value;
    const webapi = 'https://api-voice-staging.botnoi.ai';
    const apiName = `/api/marketplace/get_prompt`;
    const queryParams = `?text=${text}&topic=${topic}&style=${style}&range=${range}&model=${model}&emoji=${emoji}&generateCount=${generateCount}&language=${language}`;
    console.log(queryParams);
    const url = `${webapi}${apiName}${queryParams}`;
    console.log(url);

    this.http.get<TAPIResponse<string>>(url, this._auth.getHeader()).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
        console.log('API Response:', res.data);

        try {
          const dataObject = JSON.parse(res.data);

          this.resultObject = {
            text: formValues.text,
            data: dataObject, // array จากการแปลง JSON
          };

          // console.log('Emitting resultObject:', this.resultObject);
        } catch (error) {
          console.error('Error parsing JSON data:', error);
        }
      },
      error: (error) => {
        console.error('There was an error!', error);
        this.loading = true;
      },
    });
  }

  public switchLang(event: MatSelectChange) {
    const languageCode = event.value;
    this.currentLangSelect = languageCode;

    this.getFlagAndLang(languageCode);
  }
  getFlagAndLang(language: string) {
    const data = this.languageList.find((item) => {
      return item.value === language;
    });

    this.lang = data;
    this.currentFlag = data?.flag;
  }

  public switstyle(event: MatSelectChange) {
    const style = event.value;
    this.styleName = style;
    // console.log(this.styleName);

    this.submitForm.patchValue({ style: style });
  }

  public switresults(event: MatSelectChange) {
    const results = event.value;
    this.resultNumber = results;
    // console.log(this.resultNumber);
  }

  getCountryName(item: TLangListAll): string {
    return this.textLang === 'EN' ? item.EN_name : item.TH_name;
  }
  clearText() {
    this.textAreaValue = '';
  }

  selectRange(rangeValue: string) {
    this.selectedRange = rangeValue;
    // console.log(this.selectedRange);

    // Update form control value
    this.submitForm.patchValue({ range: rangeValue });
  }

  selectPlatform(platform: string, id: number): void {
    this.platform = platform;
    // console.log(`Platform selected: ${platform}`);
  }

  selectIcon(iconType: 'basic' | 'pro') {
    this.selectedIcon = iconType;
    // console.log(this.selectedIcon);

    const modelValue =
      iconType === 'basic'
        ? this.openAIModelList[0].value
        : this.openAIModelList[1].value;

    this.submitForm.patchValue({ model: modelValue });
  }
}
