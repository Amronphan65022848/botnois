import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  MarketFilterPipe,
  MarketSearchPipe,
} from 'src/app/shared/pipes/speaker-filter.pipe';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { language } from 'src/app/shared/change_language/language';
import {
  tagNames,
  EN_tagNames,
} from 'src/app/home/components/sound-sample-v2/sound';
import { TH_EN_flag } from 'src/app/voice/mocks/conversation-mock';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { SpeakerService } from 'src/app/shared/services/speaker.service';
import { fadeInOut } from 'src/app/shared/animation/animation';
import { UnsubscribeService } from 'src/app/shared/services/unsubscribe.service';
import { AdsService } from 'src/app/voice/services/ads.service';
import { speakerDataMock } from '../../data/data';

type SpeakerCondition = {
  language: string[];
  voiceStyle: string[];
  speechStyle: string[];
  gender: string[];
};

@Component({
  selector: 'app-marketplace-v3',
  templateUrl: './marketplace-v3.component.html',
  providers: [MarketFilterPipe, MarketSearchPipe],
  styleUrls: ['./marketplace-v3.component.scss'],
  animations: [fadeInOut],
})
export class MarketplaceV3Component implements OnInit, OnDestroy {
  @Output() sendCart = new EventEmitter();
  @Input() isLoggedIn: boolean;

  public text = null;
  public inputPlaceholder = null;
  public lang = null;
  public searchText = '';

  // @Input() speakerList: any[] = [];
  public speakerList: any[] = null;
  public originalSpeakerList: any[];
  public cart: any = JSON.parse(sessionStorage.getItem('cart') || '[]');

  public combinedList: any[];
  public mutateList: any[];
  public originalMutateList: any[];
  public cartList: any[];

  // Hero Banner
  public heroSpeakerList: any[] = [];

  // Filter
  public filteredArrList = [];
  public speechStyle: string[];
  public voiceStyle: string[];
  public allGender: string[];
  public allLang: string[];
  public filterKey: SpeakerCondition = {
    gender: [],
    language: [],
    speechStyle: [],
    voiceStyle: [],
  };
  isLangShow: boolean;
  isVoiceShow: boolean;
  isSpeechShow: boolean;
  isGenderShow: boolean;
  public filterList: { name: string; type: string }[] = [];
  public flagList: any[] = TH_EN_flag;

  // Audio
  public isAudioPlay = false;
  public audio = new Audio();

  // PAGE CONTROLS
  public itemsPerPage: number = 15;
  public currentPage = 1;

  //
  isFirstOpen: boolean = true;
  tab: number = 1;
  public isSmallMobile: boolean = false;

  intervalId: any;
  isLoading: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth < 365) {
      this.isSmallMobile = true;
    } else {
      this.isSmallMobile = false;
    }
  }

  constructor(
    private _changeLanguage: ChangeLanguageService,
    private _styleFilter: MarketFilterPipe,
    private _searchFilter: MarketSearchPipe,
    private _gfunc: GlobalFunctionService,
    private _speaker: SpeakerService,
    private _unsub: UnsubscribeService,
    private _ads: AdsService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      const sub1 = this._changeLanguage.language.subscribe(async (res) => {
        if (res) {
          this.text = language[res].marketplaceV3Obj.free;
          this.inputPlaceholder =
            language[
              res
            ].marketplaceV3Obj.free.marketplace.filter.input_placeholder;

          this.lang = res;

          // Not logged in
          if (!this.isLoggedIn) {
            this.speakerList = this._gfunc.deepclone(speakerDataMock);
            this.heroSpeakerList = this._gfunc
              .deepclone(speakerDataMock)
              .filter((speaker) => {
                return speaker.language === this.lang;
              })
              .slice(0, 3);
            this.assignVarFlow();
            return;
          }

          if (this.isFirstOpen === true) {
            this.speakerList = await this.getSessionOrServiceData(
              'speaker'
            ).then((data) => {
              data = data.filter((speaker: any) => {
                return speaker.premier === false;
              });

              return data;
            });

            this.cart = await this.getSessionOrServiceData('cart');

            this.originalSpeakerList = this._gfunc.deepclone(this.speakerList);

            this.cartList = this.cart;
            this.isLoading = false;

            this.assignVarFlow();
          }

          this.heroSpeakerList = this.originalSpeakerList
            .filter((speaker) => {
              return speaker.language === this.lang;
            })
            .slice(0, 3);

          if (this.isFirstOpen === false) {
            this.assignVarFlow();
          }

          this.isFirstOpen = false;
        }
      });

      // prevent chat intercept add cart
      // const chat = document.getElementById('bn-root');
      // if (chat) {
      //   chat.style.display = 'none';
      // }

      // check screen
      if (window.innerWidth < 365) {
        this.isSmallMobile = true;
      } else {
        this.isSmallMobile = false;
      }

      this._unsub.add([sub1]);
    } catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy(): void {
    // const chat = document.getElementById('bn-root');
    // chat.style.display = 'block';
    clearInterval(this.intervalId);
    this.stopAll();
    this._unsub.unsubscribeAll();
  }

  // Prevent didn't come in time (BUT cart can be empty)
  getSessionOrServiceData(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.isLoading = true;
        let counter: number = 0;

        // Alreaady have the data
        if (key === 'speaker') {
          const speaker = this._speaker.$speaker.value;
          if (speaker.length) {
            resolve(speaker);
          }
        } else if (key === 'cart') {
          const cart = this._speaker.$cart.value;
          if (cart.length) {
            resolve(cart);
          }
        }

        // Set interval untill get the data
        this.intervalId = setInterval(() => {
          const item = JSON.parse(sessionStorage.getItem(key));
          if (key === 'cart') {
            if (counter < 200) {
              counter++;
            } else if (counter >= 200 && item) {
              // Item found, clear the interval and set the data
              resolve(item);
              clearInterval(this.intervalId);
            }
          }
          if (item && item.length) {
            // Item found, clear the interval and set the data
            resolve(item);
            clearInterval(this.intervalId);
          }
        }, 10);
      } catch (error) {
        reject(error);
      }
    });
  }

  assignVarFlow() {
    this.combinedList = this.combineCartAndSpeaker();

    this.mutateList = this.mutateArr(this.combinedList, this.lang);

    this.originalMutateList = this.mutateList;

    this.findAllStyle(this.lang);

    //get result from pipe and show
    this.filteredArrList = this._styleFilter.transform(
      this.mutateList,
      this.filterKey,
      this.lang
    );
  }

  //------------------------ Transform Array ------------------------//

  mutateArr(arr: any[], lang: string) {
    arr.forEach((speaker: any) => {
      for (let flag of this.flagList) {
        if (flag.value === speaker.language.toLowerCase()) {
          if (lang === 'TH') {
            speaker.language = flag.TH_name;
          } else {
            speaker.language = flag.EN_name;
          }
          speaker.flagImg = flag.flag;
        } else if (
          flag.EN_name === speaker.language ||
          flag.TH_name === speaker.language
        ) {
          if (lang === 'TH') {
            speaker.language = flag.TH_name;
          } else {
            speaker.language = flag.EN_name;
          }
        }
      }
      // If a match is found, update the language value to the corresponding name value
      // return { ...speaker, isPlaying: false };
    });

    return arr;
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

  //---------------------------------------------------------------//

  //--------------------------- Filter ----------------------------//

  findAllStyle(lang: string) {
    const list = this.mutateList;

    const speechResult: any[] = [];
    const voicehResult: any[] = [];
    const langResult: any[] = [];
    const genderResult: any[] = [];
    const ageResult: any[] = [];

    if (lang === 'TH') {
      list.forEach((element: any) => {
        speechResult.push(...element.speech_style);
        voicehResult.push(...element.voice_style);
        langResult.push(element.language);
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

  clearText() {
    this.searchText = '';
    this.onSearchSpeaker(this.searchText);
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

  //filter on search
  onSearchSpeaker(text: string) {
    this.currentPage = 1;
    this.filteredArrList = this._searchFilter.transform(
      this.mutateList,
      text,
      this.lang
    );
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

    this.filteredArrList = this._styleFilter.transform(
      this.mutateList,
      this.filterKey,
      this.lang
    );
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

  //add filter on click in dropdown
  addRemoveFilter(text: string, type: string) {
    this.currentPage = 1
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

    //get result from pipe and show
    this.filteredArrList = this._styleFilter.transform(
      this.mutateList,
      this.filterKey,
      this.lang
    );
  }

  removeFilterItem(name: string, type: string) {
    //remove on filterList
    const newfilterArr = this.filterList.filter((item) => item.name !== name);
    this.filterList = newfilterArr;

    //remove on filterKey
    const newArr = this.filterKey[type].filter((item) => item !== name);
    this.filterKey[type] = newArr;

    this.filteredArrList = this._styleFilter.transform(
      this.mutateList,
      this.filterKey,
      this.lang
    );
  }

  clearAllFilter(type: string) {
    this.filterKey[type] = [];
    const newArr = this.filterList.filter((item) => item.type !== type);
    this.filterList = newArr;

    this.filteredArrList = this._styleFilter.transform(
      this.mutateList,
      this.filterKey,
      this.lang
    );
  }

  clearFilterList() {
    this.filterList = [];
    this.filterKey.language = [];
    this.filterKey.voiceStyle = [];
    this.filterKey.speechStyle = [];
    this.filterKey.gender = [];

    this.filteredArrList = this._styleFilter.transform(
      this.mutateList,
      this.filterKey,
      this.lang
    );
  }

  //---------------------------------------------------------------//

  //---------------------------- CART -----------------------------//

  addRemoveFav(speaker: any) {
    const check = this.checkIsInCart(speaker.speaker_id);

    if (check === false) {
      this.sendCart.emit([speaker, 'add']);
    } else if (check === true) {
      this.sendCart.emit([speaker, 'del']);
    }
  }

  //Triggered from parent (marketplace)
  removeFavList(data: any) {
    const removedSpeaker = this.cartList.filter(
      (speaker: { speaker_id: any }) => speaker.speaker_id !== data.speaker_id
    );

    this.cartList = removedSpeaker;
  }

  //---------------------------------------------------------------//

  //--------------------------- AUDIO -----------------------------//

  playSampleHero(isPlaying: boolean, id: string, audioURL: string) {
    const speaker = this.heroSpeakerList.filter(
      (item) => item.speaker_id === id
    );
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

  playSample(audioURL: string, isPlaying: boolean, id: string) {
    const speaker = this.paginatedItems.filter(
      (item) => item.speaker_id === id
    );

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
    for (let speaker of this.heroSpeakerList) {
      speaker.isPlaying = false;
    }

    for (let speaker of this.mutateList) {
      speaker.isPlaying = false;
    }
  }

  //---------------------------------------------------------------//

  //------------------------- STYLING -----------------------------//

  tagColor(style: string) {
    if (this.lang === 'TH') {
      return tagNames.find((e) => {
        return e.style === style;
      })?.color;
    } else if (this.lang === 'EN') {
      return EN_tagNames.find((e) => e.style === style)?.color;
    }
  }

  //for styling button
  checkIsInCart(id: string) {
    if (!this.isLoggedIn) {
      return false;
    }

    const cartFiltered = this.cartList.filter(
      (speaker: any) => speaker.speaker_id === id
    );
    if (cartFiltered.length) {
      return true;
    } else {
      return false;
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

  onFlagError(speaker: any) {
    speaker.flagImg = 'no_flag.svg'
  }

  //---------------------------------------------------------------//

  //------------------------- CHECK -------------------------------//

  isTablet() {
    return window.innerWidth <= 1200; // 1200px or smaller
  }

  //---------------------------------------------------------------//

  //-------------------------PAGE CONTROLS-------------------------//
  get totalPages(): number {
    return Math.ceil(this.filteredArrList.length / this.itemsPerPage);
  }

  get paginatedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredArrList.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  goToPage(page: any): void {
    this.stopAll();
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const pageNumbers: any[] = [1];
    if (current >= 4) {
      pageNumbers.push('...');
    }

    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(total - 1, current + 1);
      i++
    ) {
      pageNumbers.push(i);
    }

    if (current <= total - 3) {
      pageNumbers.push('...');
    }
    pageNumbers.push(total);

    return pageNumbers;
  }

  //---------------------------------------------------------------//

  //--------------------------TAB CONTROLS-------------------------//
  changeSuggest(num: number) {
    this.tab = num;
    this.filterList = [];
    this.currentPage = 1;

    if (this.tab === 1) {
      this.mutateList = this.originalMutateList;
      this.filteredArrList = this.originalMutateList;

      // this.moveSpeakerToFirst();
    } else if (this.tab === 2) {
      this.mutateList = this.cartList;
      this.filteredArrList = this.cartList;
      // this.moveSpeakerToFirst();
    }
  }

  //---------------------------------------------------------------//

  updateAfterSaveCart(data: any[]) {
    const findSpeaker = this.mutateList.filter((obj) =>
      data.includes(obj.speaker_id)
    );
    this.cartList.push(...findSpeaker);
  }
}
