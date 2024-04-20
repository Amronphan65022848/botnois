import {
  Component,
  OnInit,
  Inject,
  HostListener,
  OnDestroy,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TH_EN_flag } from '../../mocks/conversation-mock';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { language } from 'src/app/shared/change_language/language';
import { SpeakerService } from 'src/app/shared/services/speaker.service';
import { tagNames } from 'src/app/home/components/sound-sample-v2/sound';
import { EN_tagNames } from 'src/app/home/components/sound-sample-v2/sound';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertSelectVoiceComponent } from 'src/app/dialog/components/alert-select-voice/alert-select-voice.component';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SpeakerData } from '../../models/conversation-model';
import { filter, take } from 'rxjs';
import { AdsService } from '../../services/ads.service';

interface SpeakerCondition {
  language: string[];
  voiceStyle: string[];
  speechStyle: string[];
  gender: string[];
}

@Component({
  selector: 'app-speaker-dialog',
  templateUrl: './speaker-dialog.component.html',
  styleUrls: ['./speaker-dialog.component.scss'],
})
export class SpeakerDialogComponent implements OnInit, OnDestroy {
  public speakerList: SpeakerData[] = [];
  public cart: SpeakerData[] = [];

  public combinedList: any[];

  public mutateList: any[];

  public originalMutateList: any[];
  public popularList: any[];
  public newSpeakerList: any[];

  public cartList: any[];

  public originalCartIdList: string[] = [];

  //------------------Lang----------------//
  public inputPlaceholder: string = 'ค้นหาชื่อเสียงพากย์ที่ต้องการ เช่น เอวา';
  public text = null;
  public lang: string;
  //------------------Lang----------------//

  public currentSpeaker: any;
  public searchText: string = '';
  public isFilterShow: boolean = true;
  public suggest: number = 1;
  public flagList = [];
  public isLangShow: boolean = false;
  public isSpeechShow: boolean = false;
  public isVoiceShow: boolean = false;
  public isGenderShow: boolean = false;
  public speechStyle: string[];
  public voiceStyle: string[];
  public allGender: string[];
  public allLang: string[];
  public isMobile: boolean;
  public isSmallMobile: boolean;
  public isSpeechShift: boolean;
  public isGenderShift: boolean;

  public selectedVoice: string;
  public selectedVoiceData: any[];

  public isFavShow: boolean = true;
  public isAllShow: boolean = true;

  popularCount: number = 0;
  newSpeakerCount: number = 0;

  secondInput: boolean = false;
  languageSubscription: any;

  user: any = null;

  //------------------Audio-------------------//
  public audio = new Audio();
  public isAudioPlay: boolean = false;
  //------------------Audio-------------------//

  public filterKey: SpeakerCondition = {
    gender: [],
    language: [],
    speechStyle: [],
    voiceStyle: [],
  };

  public filterList: { name: string; type: string }[] = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth <= 798) {
      this.secondInput = true;
    } else {
      this.secondInput = false;
    }

    if (event.target.innerWidth < 785) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }

    if (event.target.innerWidth < 410) {
      this.isSmallMobile = true;
    } else {
      this.isSmallMobile = false;
    }
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SpeakerDialogComponent>,
    private _speaker: SpeakerService,
    private _changeLanguage: ChangeLanguageService,
    private _snackBar: MatSnackBar,
    private el: ElementRef,
    private renderer: Renderer2,
    private _gfunc: GlobalFunctionService,
    private _auth: AuthService,
    private _ads: AdsService
  ) {
    if (data) {
      this.currentSpeaker = data;
    }
  }

  ngOnInit() {
    this.languageSubscription = this._changeLanguage.language.subscribe(
      (res) => {
        if (res) {
          this.text = language[res].selectVoiceObj;
          this.lang = res;

          if (res === 'TH') {
            this.flagList = TH_EN_flag;
            this.inputPlaceholder = 'ค้นหาชื่อเสียงพากย์ที่ต้องการ เช่น เอวา';
          } else if (res === 'EN') {
            this.flagList = TH_EN_flag;
            this.inputPlaceholder = 'Search for voice actor name ex. Ava';
          }
        }
      }
    );

    // Get data from Behavior subject instead of sessionStorage
    this._speaker.$speaker
      .pipe(
        filter((speaker) => !!speaker),
        take(1)
      )
      .subscribe((speaker) => {
        // Assign speaker data
        this.speakerList = speaker;

        // Assign speaker data
        const cart = this._speaker.$cart.getValue();
        this.cart = cart;
      });

    this._auth.data.subscribe((res) => {
      if (res) {
        // Assgin data to user variable
        this.user = this._gfunc.deepclone(res);
      }
    });

    if (window.innerWidth < 785) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }

    if (window.innerWidth < 410) {
      this.isSmallMobile = true;
    } else {
      this.isSmallMobile = false;
    }

    if (window.innerWidth <= 798) {
      this.secondInput = true;
    } else {
      this.secondInput = false;
    }

    this.cartList = this.cart;

    this.combinedList = this.removePremium(this.combineCartAndSpeaker());

    this.mutateList = this.mutateArr(this.combinedList);

    // save cart id before change //
    this.originalCartIdList = this.cartList.map(
      (speaker) => speaker.speaker_id
    );

    //save arr for switch all/popular/new to reduce for loop//
    this.originalMutateList = this.mutateList;
    // this.popularList = this.mutateList.filter((speaker) => {
    //   return speaker.popularity === 'ยอดนิยม';
    // });
    // this.newSpeakerList = this.mutateArr(this.speakerList)
    //   .reverse()
    //   .slice(0, 25);
    //------------------------------------------------------//

    this.findCurrentSpeaker(this.mutateList);

    this.moveSpeakerToFirst();

    //find all style for filter
    this.findAllStyle();

    //Prevent focus when click outside
    this.renderer.listen('window', 'click', (event: Event) => {
      // Check if the click event happened outside the dialog
      if (!this.el.nativeElement.contains(event.target)) {
        // Remove focus from any input element in the dialog
        const inputElement = this.el.nativeElement.querySelector('input');
        if (inputElement) {
          inputElement.blur(); // Remove focus
        }
      }
    });

    this.mutateList;
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
    this.stopAll();
    this.renderer.destroy();
  }

  combineCartAndSpeaker() {
    //find cart in speaker
    const sameContent = this.speakerList.filter((item) =>
      this.cart.some((cartItem) => cartItem.speaker_id === item.speaker_id)
    );
    //sort cart 1st then speaker
    const resultArray = [
      ...this.cart,
      ...this.speakerList.filter((item) => !sameContent.includes(item)),
    ];
    return resultArray;
  }

  removePremium(arr: any[]) {
    const uid = this.user.uid;

    // const array = arr;
    const resultArray = arr.filter((speaker: any) => {
      return speaker.allow_uid.includes(uid) || speaker.premier === false;
    });

    return resultArray;
  }

  bringFavToTop() {
    const sameContent = this.mutateList.filter((item) =>
      this.cartList.some((cartItem) => cartItem.speaker_id === item.speaker_id)
    );

    const resultArray = [
      ...sameContent,
      ...this.mutateList.filter((item) => !sameContent.includes(item)),
    ];

    this.mutateList = resultArray;
  }

  // sortedFavoriteFirst(speaker) {
  //   // let speaker: any[] = this._gfunc.deepclone(this.speakerList)
  //   let cart: any[] = this._gfunc.deepclone(this.cart);

  //   // Combine array 'cart' and the filtered items from array 'speaker'
  //   this.mutateList = [
  //     ...cart,
  //     ...speaker.filter(
  //       (speakerItem) =>
  //         !cart.some(
  //           (cartItem) => cartItem.speaker_id === speakerItem.speaker_id
  //         )
  //     ),
  //   ];
  // }

  findAllStyle() {
    const list = this.mutateArr(this.speakerList);
    const speechResult: any[] = [];
    const voicehResult: any[] = [];
    const langResult: any[] = [];
    const genderResult: any[] = [];
    const ageResult: any[] = [];

    if (this.lang === 'TH') {
      list.forEach((element: any) => {
        speechResult.push(...element.speech_style);
        voicehResult.push(...element.voice_style);
        langResult.push(element.language.replace('ภาษา', ''));
        genderResult.push(element.gender);
        ageResult.push(element.age_style);
      });
    } else {
      list.forEach((element: any) => {
        speechResult.push(...element.eng_speech_style);
        voicehResult.push(...element.eng_voice_style);
        langResult.push(element.language);
        genderResult.push(element.eng_gender);
        ageResult.push(element.eng_age_style);
      });
    }

    this.speechStyle = [...new Set([...speechResult])];

    this.voiceStyle = [...new Set([...voicehResult])].filter(
      (item) => item !== null
    );

    this.allGender = [...new Set([...genderResult, ...ageResult])];
    this.allLang = [...new Set([...langResult])];
  }

  mutateArr(arr: any[]) {
    arr.map((speaker: any) => {
      for (let flag of this.flagList) {
        if (flag.value === speaker.language.toLowerCase()) {
          if (this.lang === 'TH') {
            speaker.language = flag.TH_name;
          } else {
            speaker.language = flag.EN_name;
          }
          speaker.flagImg = flag.flag;
        } else if (
          flag.EN_name === speaker.language ||
          flag.TH_name === speaker.language
        ) {
          if (this.lang === 'TH') {
            speaker.language = flag.TH_name;
          } else {
            speaker.language = flag.EN_name;
          }
        }
      }

      return { ...speaker, isPlaying: false };
    });

    return arr;
  }

  moveSpeakerToFirst() {
    let currentIndex = this.mutateList.findIndex((speaker: any) => {
      return speaker.speaker_id === this.selectedVoice;
    });

    if (currentIndex !== -1) {
      let movedItem = this.mutateList.splice(currentIndex, 1)[0];
      this.mutateList.unshift(movedItem);
    }
  }

  findCurrentSpeaker(arr: any[]) {
    arr.map((speaker: any) => {
      if (speaker.name === this.currentSpeaker) {
        this.selectedVoice = speaker.speaker_id;
        this.selectedVoiceData = speaker;
      }
    });
  }

  //for styling button
  checkIsInCart(id: string) {
    const cartFiltered = this.cartList.filter(
      (speaker: any) => speaker.speaker_id === id
    );
    if (cartFiltered.length) {
      return true;
    } else {
      return false;
    }
  }

  tagColor(style: string) {
    if (this.lang === 'TH') {
      return tagNames.find((e) => {
        return e.style === style;
      })?.color;
    } else if (this.lang === 'EN') {
      return EN_tagNames.find((e) => e.style === style)?.color;
    }
  }

  // Return flag name .svg
  getFlagByName(flag: String) {
    for (let item of TH_EN_flag) {
      const flagName = this.lang === 'TH' ? item.TH_name : item.EN_name;
      if (flagName === flag) {
        return item.flag;
      }
    }
  }

  getFlagByValue(flag: string) {
    const text = flag.replace(/ /g, '');
    let item = TH_EN_flag.find(item => item.value === text)

    // Not existed language
    // Add mock language
    if (!item) {
      item = { 'EN_name': text, 'TH_name': text, 'flag': 'no_flag.svg', 'value': text }
    }
    return item

  }

  trackByFunction(index: number, item: any): number {
    return item.speaker_id; // Unique identifier property of item
  }

  clearText() {
    this.searchText = '';
  }

  toggleFilter() {
    this.isFilterShow = !this.isFilterShow;
  }

  toggleLangDropdown(type: string) {
    if (type === 'Lang') {
      this.isLangShow = !this.isLangShow;
    } else if (type === 'Voice') {
      this.isVoiceShow = !this.isVoiceShow;
    } else if (type === 'Speech') {
      this.isSpeechShow = !this.isSpeechShow;
    } else if (type === 'Gender') {
      this.isGenderShow = !this.isGenderShow;
    }
  }

  closeLangPopup() {
    this.isLangShow = false;
  }

  closeVoicePopup() {
    this.isVoiceShow = false;
  }

  closeSpeechPopup() {
    this.isSpeechShow = false;
  }

  closeGenderPopup() {
    this.isGenderShow = false;
  }

  changeSuggest(num: number) {
    this.suggest = num;
    if (this.suggest === 1) {
      this.mutateList = this.originalMutateList;
      this.moveSpeakerToFirst();
    } else if (this.suggest === 2) {
      if (this.popularCount === 0) {
        this.popularList = this.mutateList.filter((speaker) => {
          return speaker.popularity === 'ยอดนิยม';
        });
        this.popularCount++;
      }
      this.mutateList = this.popularList;
      this.moveSpeakerToFirst();
    } else if (this.suggest === 3) {
      if (this.newSpeakerCount === 0) {
        this.newSpeakerList = this.mutateArr(this.speakerList)
          .reverse()
          .slice(0, 25);
        this.newSpeakerCount++;
      }
      this.mutateList = this.newSpeakerList;
      this.bringFavToTop();
      this.moveSpeakerToFirst();
    } else if (this.suggest === 4) {
      // Cart
      this.mutateList = this.cartList;
    }
  }

  addRemoveFilter(text: string, type: string) {
    //check is in filterKey
    if (this.filterKey[type].some((item) => item.includes(text))) {
      // remove
      const newArr = this.filterKey[type].filter((item) => item !== text);
      this.filterKey[type] = newArr;
      const newfilterArr = this.filterList.filter((item) => item.name !== text);
      this.filterList = newfilterArr;
    } else {
      // add
      this.filterKey[type].push(text);
      this.filterList.push({ name: text, type: type });
    }
  }

  addRemoveFav(id: string) {
    const check = this.checkIsInCart(id);

    if (check === false) {
      const addedSpeaker = this.mutateList.filter(
        (speaker: { speaker_id: any }) => speaker.speaker_id === id
      );

      let updateCart = [...this.cartList, ...addedSpeaker];
      sessionStorage.setItem('cart', JSON.stringify(updateCart));

      this.cartList.push(...addedSpeaker);
    } else if (check === true) {
      const removedSpeaker = this.cartList.filter(
        (speaker: { speaker_id: any }) => speaker.speaker_id !== id
      );

      sessionStorage.setItem('cart', JSON.stringify(removedSpeaker));
      this.cartList = removedSpeaker;
    }
  }

  removeFilterItem(name: string, type: string) {
    //remove on filterList
    const newfilterArr = this.filterList.filter((item) => item.name !== name);
    this.filterList = newfilterArr;

    //remove on filterKey
    const newArr = this.filterKey[type].filter((item) => item !== name);
    this.filterKey[type] = newArr;
  }

  selectAllFilter(type: string) {
    if (type === 'language') {
      this.filterKey.language = this.allLang;
    } else if (type === 'voiceStyle') {
      this.filterKey.voiceStyle = this.voiceStyle;
    } else if (type === 'speechStyle') {
      this.filterKey.speechStyle = this.speechStyle;
    } else if (type === 'gender') {
      this.filterKey.gender = this.allGender;
    }

    this.showSelectAllInFilterList(type);
  }

  showSelectAllInFilterList(type: string) {
    const transform = this.filterKey[type].map((item) => {
      return { name: item, type: type };
    });
    const combineArr = [...this.filterList, ...transform];

    const removedDupArr = combineArr.filter(
      (item, index, self) =>
        index === self.findIndex((i) => i.name === item.name)
    );

    this.filterList = removedDupArr;
  }

  clearAllFilter(type: string) {
    this.filterKey[type] = [];
    const newArr = this.filterList.filter((item) => item.type !== type);
    this.filterList = newArr;
  }

  clearFilterList() {
    this.filterList = [];
    this.filterKey.language = [];
    this.filterKey.voiceStyle = [];
    this.filterKey.speechStyle = [];
    this.filterKey.gender = [];
  }

  playSample(audioURL: string, isPlaying: boolean, id: string) {
    const speaker = this.mutateList.filter((item) => item.speaker_id === id);

    const adsSound = this._ads.getAllAds();

    let random = this._gfunc.getRandomSoundSpeaker(id, adsSound);
    if (!random) {
      random = {
        url: audioURL,
      };
    }

    // this.mutateList[index].isPlaying = !this.mutateList[index].isPlaying;
    if (!this.isAudioPlay) {
      this.stopAll();
      this.audio.src = random.url;
      this.audio.play();
      this.isAudioPlay = true;
      speaker[0].isPlaying = true;
    } else if (this.isAudioPlay && !isPlaying) {
      this.stopAll();
      this.audio.src = random.url;
      this.audio.play();
      this.isAudioPlay = true;
      speaker[0].isPlaying = true;
    } else if (isPlaying) {
      this.stopAll();
    }

    this.audio.addEventListener('ended', () => {
      this.stopAll();
    });
  }

  stopAll() {
    this.isAudioPlay = false;
    this.audio.pause();
    for (let speaker of this.mutateList) {
      speaker.isPlaying = false;
    }
  }

  selectSpeaker(index: number, selectSpeaker: any) {
    if (selectSpeaker.speaker_id === this.selectedVoice) {
      return;
    }

    this.selectedVoice = selectSpeaker.speaker_id;
    this.selectedVoiceData = selectSpeaker;

    const isInCart = this.cartList.some(
      (item) => item.speaker_id === selectSpeaker.speaker_id
    );

    if (isInCart === false) {
      this.cartList.push(selectSpeaker);
      sessionStorage.setItem('cart', JSON.stringify(this.cartList));
    }

    // Select speaker then submit and close pop-up
    this.onSubmit();
  }

  onSubmit() {
    if (this.selectedVoice) {
      const cartIdListNew = this.cartList.map((speaker) => speaker.speaker_id);

      const temp = {
        speaker_id: this.selectedVoice,
        speakerData: this.selectedVoiceData,
      };
      if (this.areArraysEqual(this.originalCartIdList, cartIdListNew)) {
        this.dialogRef.close(temp);
        return;
      }
      // else {
      //   this._speaker.setCart(cartIdListNew);
      //   this._speaker.$cart.next(this.cartList);
      // }

      this.dialogRef.close(temp);
    } else {
      this._snackBar.openFromComponent(AlertSelectVoiceComponent, {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 3000,
      });
    }
  }

  areArraysEqual(array1: any, array2: any) {
    if (array1.length !== array2.length) {
      return false;
    }

    return array1.every((element, index) => element === array2[index]);
  }

  onCloseDialog() {
    this.dialogRef.close(null);
  }

  onFlagError(speaker: any) {
    speaker.flagImg = 'no_flag.svg'
  }
}
