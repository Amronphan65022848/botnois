import { Component, OnInit } from '@angular/core';
import { SpeakerService } from 'src/app/shared/services/speaker.service';

@Component({
  selector: 'app-speaker-list',
  templateUrl: './speaker-list.component.html',
  styleUrls: ['./speaker-list.component.scss'],
})
export class SpeakerListComponent implements OnInit {
  public speakerList: any = JSON.parse(
    sessionStorage.getItem('speaker') || '[]'
  );
  public fileSample = new Audio();
  public isPlaying: boolean = false;
  public searchText!: string;
  public isSearchList: boolean = true;
  public tab: any = 'tab1';
  public checkList!: any;
  public tempList!: {}[];
  public isGenderShow: boolean = false;
  public isLangShow: boolean = false;
  public isStyleShow: boolean = false;
  public filterKey: string[] = ['all', 'all', 'all', 'all'];
  public voiceStyle: string[];
  public speechStyle: string[];
  ////////////////////////////////////////////////////////////
  public inputPlaceholder: string = 'ค้นหาเสียงแบบที่ต้องการ';
  ////////////////////////////////////////////////////////////

  constructor(private _speaker: SpeakerService) { }

  ngOnInit() {
    this.checkList = this.speakerList.map((speaker: any) => {
      return { ...speaker, isInCart: false, isFav: false };
    });

    this.tempList = this.checkList;

    this.findSpeechStyle();

    const fav = JSON.parse(localStorage.getItem('favorite'));
    if (!fav) {
      localStorage.setItem('favorite', '[]');
    }
  }

  findSpeechStyle() {
    const list = this.speakerList;
    const speechResult: any[] = [];
    const voicehResult: any[] = [];
    list.forEach((element: any) => {
      speechResult.push(...element.speech_style);
      voicehResult.push(...element.voice_style);
    });

    this.speechStyle = [...new Set([...speechResult])];
    this.voiceStyle = [...new Set([...voicehResult])];
  }

  checkTab(check: number) {
    if (check === 1) {
      this.isSearchList = true;
      this.tab = 'tab1';
      this.tempList = this.checkList;
    } else if (check === 2) {
      this.isSearchList = false;
      this.tab = 'tab2';
      const fav = JSON.parse(localStorage.getItem('favorite'));
      const favList = this.checkList.filter(({ speaker_id: id1 }: any) =>
        fav.some((id2: any) => id2 === id1)
      );
      this.tempList = favList;
    } else {
      this.isSearchList = false;
      this.tab = 'tab3';
      const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
      const cartList = this.checkList.filter(({ speaker_id: id1 }: any) =>
        cart.some(({ speaker_id: id2 }: any) => id2 === id1)
      );
      this.tempList = cartList;
    }
  }

  checkIsInCart(id: any) {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const cartFiltered = cart.filter(
      (speaker: any) => speaker.speaker_id === id
    );
    if (cartFiltered.length) {
      return true;
    } else {
      return false;
    }
  }

  checkFavorite(id: any) {
    const fav = JSON.parse(localStorage.getItem('favorite'));
    const favFiltered = fav.filter((speaker: string) => speaker === id);
    if (favFiltered.length) {
      return true;
    } else {
      return false;
    }
  }

  ///////////////////////////////////////////////

  clearText() {
    this.searchText = '';
  }

  toggleLangShow() {
    this.isLangShow = !this.isLangShow;
  }

  toggleGenderShow() {
    this.isGenderShow = !this.isGenderShow;
  }

  toggleStyleShow() {
    this.isStyleShow = !this.isStyleShow;
  }

  langClose() {
    this.isLangShow = false;
  }

  genderClose() {
    this.isGenderShow = false;
  }

  styleClose() {
    this.isStyleShow = false;
  }

  //////****find better solution****///////
  onFilter() {
    const [lang, gender, vStyle, sStyle] = this.filterKey;
    this.tempList = this.checkList;

    const list = this.tempList.filter((speaker: any) => {
      if (
        lang === 'all' &&
        gender === 'all' &&
        vStyle === 'all' &&
        sStyle != 'all'
      ) {
        return speaker.speech_style.includes(`${sStyle}`);
      } else if (
        lang === 'all' &&
        gender === 'all' &&
        vStyle != 'all' &&
        sStyle === 'all'
      ) {
        return speaker.voice_style.includes(`${vStyle}`);
      } else if (
        lang === 'all' &&
        gender != 'all' &&
        vStyle === 'all' &&
        sStyle === 'all'
      ) {
        return speaker.gender === `${gender}`;
      } else if (
        lang != 'all' &&
        gender === 'all' &&
        vStyle === 'all' &&
        sStyle === 'all'
      ) {
        return speaker.language.includes(`${lang}`);
      } else if (
        lang === 'all' &&
        gender != 'all' &&
        vStyle != 'all' &&
        sStyle != 'all'
      ) {
        return (
          speaker.gender === `${gender}` &&
          speaker.voice_style.includes(`${vStyle}`) &&
          speaker.speech_style.includes(`${sStyle}`)
        );
      } else if (
        lang != 'all' &&
        gender === 'all' &&
        vStyle != 'all' &&
        sStyle != 'all'
      ) {
        return (
          speaker.language.includes(`${lang}`) &&
          speaker.voice_style.includes(`${vStyle}`) &&
          speaker.speech_style.includes(`${sStyle}`)
        );
      } else if (
        lang != 'all' &&
        gender != 'all' &&
        vStyle === 'all' &&
        sStyle != 'all'
      ) {
        return (
          speaker.language.includes(`${lang}`) &&
          speaker.gender === `${gender}` &&
          speaker.speech_style.includes(`${sStyle}`)
        );
      } else if (
        lang != 'all' &&
        gender != 'all' &&
        vStyle != 'all' &&
        sStyle === 'all'
      ) {
        return (
          speaker.language.includes(`${lang}`) &&
          speaker.gender === `${gender}` &&
          speaker.voice_style.includes(`${vStyle}`)
        );
      } else if (
        lang === 'all' &&
        gender === 'all' &&
        vStyle != 'all' &&
        sStyle != 'all'
      ) {
        return (
          speaker.speech_style.includes(`${sStyle}`) &&
          speaker.voice_style.includes(`${vStyle}`)
        );
      } else if (
        lang === 'all' &&
        gender != 'all' &&
        vStyle === 'all' &&
        sStyle != 'all'
      ) {
        return (
          speaker.gender === `${gender}` &&
          speaker.speech_style.includes(`${sStyle}`)
        );
      } else if (
        lang === 'all' &&
        gender != 'all' &&
        vStyle != 'all' &&
        sStyle === 'all'
      ) {
        return (
          speaker.gender === `${gender}` &&
          speaker.voice_style.includes(`${vStyle}`)
        );
      } else if (
        lang != 'all' &&
        gender === 'all' &&
        vStyle === 'all' &&
        sStyle != 'all'
      ) {
        return (
          speaker.language.includes(`${lang}`) &&
          speaker.speech_style.includes(`${sStyle}`)
        );
      } else if (
        lang != 'all' &&
        gender === 'all' &&
        vStyle != 'all' &&
        sStyle === 'all'
      ) {
        return (
          speaker.language.includes(`${lang}`) &&
          speaker.voice_style.includes(`${vStyle}`)
        );
      } else if (
        lang != 'all' &&
        gender != 'all' &&
        vStyle === 'all' &&
        sStyle === 'all'
      ) {
        return (
          speaker.language.includes(`${lang}`) && speaker.gender === `${gender}`
        );
      } else if (
        lang === 'all' &&
        gender === 'all' &&
        vStyle === 'all' &&
        sStyle === 'all'
      ) {
        return speaker;
      } else {
        return (
          speaker.language.includes(`${lang}`) &&
          speaker.gender === `${gender}` &&
          speaker.voice_style.includes(`${vStyle}`) &&
          speaker.speech_style.includes(`${sStyle}`)
        );
      }
    });

    this.tempList = list;
  }

  onCheck(event: any, value: any) {
    if (event.target.checked) {
      if (event.target.name === 'lang') {
        this.filterKey[0] = value;
        // this.isLangShow = false;
      } else if (event.target.name === 'gender') {
        this.filterKey[1] = value;
        // this.isGenderShow = false;
      } else if (event.target.name === 'voiceStyle') {
        this.filterKey[2] = value;
        // this.isStyleShow = false;
      } else {
        this.filterKey[3] = value;
        console.log(this.filterKey);
      }

      this.onFilter();
    }
  }

  resetFilter() {
    this.tempList = this.checkList;
    this.filterKey[0] = 'all';
    this.filterKey[1] = 'all';
    this.filterKey[2] = 'all';
  }
  /////////////////

  setSpeakerCart(id: any) {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const addedSpeaker = this.speakerList.filter(
      (speaker: { speaker_id: any }) => speaker.speaker_id === id
    );
    let updateCart = [...cart, ...addedSpeaker];
    sessionStorage.setItem('cart', JSON.stringify(updateCart));

    this._speaker.setCart([id]);
  }

  async removeSpeakerCart(id: any) {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const updateCart = await cart.filter(
      (speaker: any) => speaker.speaker_id != id
    );
    sessionStorage.setItem('cart', JSON.stringify(updateCart));

    this._speaker.deleteCart([id]);

    if (this.tab === 'tab3') {
      this.tempList = JSON.parse(sessionStorage.getItem('cart') || '[]');
    }
  }

  addFavCart(id: any) {
    const favCart = JSON.parse(localStorage.getItem('favorite'));
    favCart.push(id);
    localStorage.setItem('favorite', JSON.stringify(favCart));
  }

  async removeFavCart(id: any) {
    const favCart = JSON.parse(localStorage.getItem('favorite'));
    const updateCart = await favCart.filter((speaker: any) => speaker != id);
    localStorage.setItem('favorite', JSON.stringify(updateCart));

    if (this.tab === 'tab2') {
      this.tempList = this.checkList.filter(({ speaker_id: id1 }: any) =>
        updateCart.some((id2: any) => id2 === id1)
      );
    }
  }

  /////////////

  playSample(data: any) {
    if (this.fileSample.currentTime > 0) {
      this.fileSample.pause();
      this.fileSample.currentTime = 0;
      this.isPlaying = false;
    } else {
      this.fileSample.src = data;
      this.fileSample.play();
      this.isPlaying = true;
    }
  }
}
