import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Language } from 'src/app/shared/models/shared-model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { language } from 'src/app/shared/change_language/language';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DialogService } from '../../services/dialog.service';
const { webapi } = environment;

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent implements OnInit {
  @ViewChild('textInputEmail') textInput: ElementRef;

  focusInput() {
    this.textInput.nativeElement.focus();
  }
  constructor(
    public dialogRef: MatDialogRef<SurveyComponent>,
    private _auth: AuthService,
    private _language: ChangeLanguageService,
    private cookie: CookieService,
    private http: HttpClient,
    private _dialog: DialogService,
  ) {}

  countryoptions: any[] = [];
  filteredOptions: Observable<any[]>;
  text = language['TH'].surveyObj;
  lang: Language;
  countryControl = new FormControl(null);
  user = null;
  currentstep: number = 1;
  selectedCareerId: number = 0;
  otherchoice: string = '';
  othercareer: string = '';
  age: string = '';
  selectedCountry: string = '';
  selectedCareer: string = '';
  selectedChoice: string = '';
  isClassToRemoveApplied: boolean = true;
  email = new FormControl<string>('', [
    Validators.required,
    Validators.email,
    Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
  ]);
  haveEmail: boolean = false;
  surveyComplete: object = {};
  isShowClose: boolean = false;
  isShowCloseButton: boolean = true;
  dontShowMore: boolean = false;
  isOtherCareer: boolean = false;
  selectedAgeButtonIndex = null;
  selectedUseFor = null;
  selectedYoudo = null;

  ngOnInit(): void {
    // this.deleteCookie('_bn_survey_close')
    this._language.language.subscribe((resp) => {
      this.lang = resp;
      this.text = language[resp].surveyObj;
      this.countryControl = new FormControl('', [
        this.countryInArrayValidator(this.text.countries),
      ]);
    });

    this._auth.data.subscribe((res) => {
      if (res && res.email != 'No Email') {
        this.email = new FormControl<string>(res.email, [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ]);
        this.email.disable();
      }
    });
    this.email.valueChanges.pipe(debounceTime(1000)).subscribe();
    this.countryoptions = this.text.countries;
    this.filteredOptions = this.countryControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.countryoptions.slice())),
    );
    this.countryControl.valueChanges.subscribe();
  }

  private _filter(value: string): string[] {
    return this.countryoptions.filter((option) =>
      option.name.toLowerCase().includes(value.toLowerCase()),
    );
  }
  countryInArrayValidator(countryOptions: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (
        value &&
        !countryOptions.find((option) => option.name === value.name)
      ) {
        return { countryNotFound: true };
      }
      return null;
    };
  }
  selectAge(event: any, index: number, item: any) {
    this.age = item.value;
    this.selectedAgeButtonIndex = index;
  }
  selectCareer(item: any, index: number) {
    if (this.selectedCareerId !== item.id) {
      this.selectedYoudo = null;
    }
    this.selectedCareerId = item.id;
    this.selectedCareer = item.value;
    this.selectedUseFor = index;

    setTimeout(() => {
      this.currentstep = 2;
    }, 1000);
  }
  getChoiceById() {
    return this.text.careerChoice.find((e) => e.id == this.selectedCareerId)
      .choice;
  }
  public close() {
    this.dialogRef.close();
    if (this.dontShowMore === true) {
      this.setCookie('_bn_survey_cd', true);
      // this.deleteCookie('_bn_survey_close')
      // this.deleteCookie('_bn_survey_completed')
    } else {
      // this.setCookie('_bn_survey_close', true)
    }
  }
  showClose() {
    this.isShowClose = true;
  }
  toggledontShowMore() {
    this.dontShowMore = !this.dontShowMore;
  }
  goBackToSurvey() {
    this.isShowClose = false;
    this.isShowCloseButton = false;
  }
  selectChoice(event: any, index: number, item: any) {
    const lastObjectId = this.text.careerChoice
      .find((e) => e.id == this.selectedCareerId)
      .choice.slice(-1)[0].id;
    if (lastObjectId === item.id) {
      setTimeout(() => {
        this.isOtherCareer = true;
      }, 1000);
    } else {
      this.isOtherCareer = false;
      setTimeout(() => {
        this.currentstep = 3;
      }, 1000);
    }
    this.selectedYoudo = index;
    this.selectedChoice = item.value;
  }
  sendOther(input: string) {
    setTimeout(() => {
      this.currentstep = 3;
    }, 1000);
    this.selectedChoice = input;
  }
  private setCookie(name: string, value: any) {
    this.cookie.set(name, value, 2, '/');
  }

  private deleteCookie(name: string): void {
    this.cookie.delete(name, '/');
  }

  goBack() {
    this.currentstep = this.currentstep - 1;
    this.isOtherCareer = false;
    const lastObjectValue = this.text.careerChoice
      .find((e) => e.id == this.selectedCareerId)
      .choice.slice(-1)[0].value;
    if (lastObjectValue == this.selectedChoice) {
      this.currentstep = 2;
      this.isOtherCareer = false;
    }
  }
  getOptionText(option) {
    return option.name;
  }
  finishForm() {
    if (this.countryControl.valid) {
      this.currentstep = 4;
      this.surveyComplete = {
        email: this.email.value,
        age: this.age,
        country: this.countryControl.value.code,
        career: this.selectedCareer.trim(),
        choice: this.selectedChoice.trim(),
      };
      this.addSurvey(this.surveyComplete).subscribe({
        next: (resp) => {
          this.setCookie('_bn_survey_completed', true);
          // this.deleteCookie('_bn_survey_cd')
          this._auth.getUpdateUser();
        },
        error: (err) => {
          this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
        },
      });
      setTimeout(() => {
        this.close();
      }, 3000);
    }
  }
  compareByCountryName(a, b) {
    return a.name.localeCompare(b.name);
  }
  public getToken() {
    return this.cookie.get('_bn_token');
  }
  addSurvey(data: any) {
    const token = 'Bearer ' + this.getToken();
    const header = new HttpHeaders({
      Authorization: token,
      'ngrok-skip-browser-warning': '564',
    });
    return this.http.post(webapi + '/payment/v2/add_survey', data, {
      headers: header,
    });
  }
}
