import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SpeakerService } from 'src/app/shared/services/speaker.service';
import { AuthService } from '../auth/services/auth.service';
import { EN } from '../shared/change_language/EN';
import { TH } from '../shared/change_language/TH';
import { TrackSoundSample } from '../shared/models/shared-model';
import { SharedApiService } from '../shared/services/shared-api.service';
import { ChangeLanguageService } from '../shared/services/change-language.service';
import { language } from '../shared/change_language/language';
import { tagNames } from '../home/components/sound-sample-v2/sound';

import { MarketplaceV3Component } from './components/marketplace-v3/marketplace-v3.component';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent implements OnInit, OnDestroy {
  public isLoggedIn: boolean = null;

  public speaker = [];
  public soundCart = [];
  public finishLoadCart = false;

  public audio = new Audio();
  public isSoundPlay = false;
  public searchwordList = [];
  public floatingMessage = [];
  public clickDelete = false;
  public messageShow = false;
  public deletePerson: any;
  public isMoblie =
    (window.innerWidth > 0 ? window.innerWidth : screen.width) < 1020
      ? true
      : false;
  public playnowButton = '';
  public _addlist = [];
  public isopenCart = true;
  public panelOpenState = false;
  public deletePersonCount = 1;
  public searchText = '';

  language = language; // Language variable

  @ViewChild(MarketplaceV3Component) _marketPlaceV3: MarketplaceV3Component;

  constructor(
    private _speaker: SpeakerService,
    private _auth: AuthService,
    private _sharedAPI: SharedApiService,
    private _language: ChangeLanguageService
  ) { }

  ngOnInit(): void {
    if (this._auth.getToken()) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
      return;
    }

    this._speaker.$speaker.subscribe((res) => {
      if (res) {
        this.speaker = res;
      }
    });

    this._speaker.$cart.subscribe((res) => {
      if (res) {
        this.soundCart = res;
        this.soundCart.map((e) => (e.check_status = false));
        this.CheckChooseinCart();
      }
    });

    this._language.language.subscribe((res) => {
      this.get_dataChangelanguage(res);
    });
    this.loadaddcart();
  }

  ngOnDestroy(): void {
    this.audio.pause();
    this._sharedAPI.fetchTrackSoundSample(this.trackSoundSample);
  }

  formatSpeakerData(lang: string, e: any) {
    const TH_text = TH.marketplaceObj.marketplace_search;
    const EN_text = EN.marketplaceObj.marketplace_search;
    if (lang === 'EN') {
      e.name = e.eng_name;
      e.global_gender = e.gender === 'ผู้ชาย' ? 'Male' : 'Female';
      e.global_speech_style = this.replaceThaiArray(e, TH_text, e.speech_style);
      this.replaceStyle(EN_text);
    } else {
      e.name = e.thai_name;
      e.global_gender = e.gender;
      e.global_speech_style = e.speech_style;
      this.replaceStyle(TH_text);
    }
    return e;
  }

  replaceStyle(arr: any) {
    tagNames.map((e, i) => {
      e.style = arr.filterSearch.soundStyle[i];
    });
  }

  replaceThaiArray(e: any, TH_text: any, arr: any) {
    let temp = [];
    arr.forEach((e) => {
      const index = TH_text.filterSearch.soundStyle.findIndex((el) => e == el);
      temp.push(
        EN.marketplaceObj.marketplace_search.filterSearch.soundStyle[index]
      );

      // index_temp.push()
    });
    return temp;
  }

  text = null; // Stored main language
  sub_text = null; // Stored secondary language
  get_dataChangelanguage(temp: any) {
    if (temp == 'TH') {
      this.text = TH.marketplaceObj.marketplace_alert;
      this.sub_text = TH.marketplaceObj.marketplace_search;
    } else if (temp == 'EN') {
      this.text = EN.marketplaceObj.marketplace_alert;
      this.sub_text = EN.marketplaceObj.marketplace_search;
    }
  }

  CheckChooseinCart() {
    if (this.soundCart != null) {
      for (let s of this.speaker) {
        if (
          this.soundCart.some((obj) => {
            return obj.speaker_id == s.speaker_id;
          })
        ) {
          s.choose = '1';
        } else {
          s.choose = '0';
        }
      }
    } else {
      for (let s = 0; s < this.speaker.length; s++) {
        this.speaker[s].choose = '0';
      }
    }
    this.finishLoadCart = true;
  }

  //Cart Function ตะกร้าเสียง
  addlist(person: any) {
    if (!this._addlist.some((e) => e.speaker_id == person.speaker_id)) {
      this.speaker.find((e) => e.speaker_id == person.speaker_id).choose = '2';
      this._addlist.push(person);
      this.panelOpenState = true;
      this.loadaddcart();
    }
    this.stopSound();
  }
  removelist(person: any) {
    this._addlist.splice(this._addlist.indexOf(person), 1);
    this.speaker.find((e) => e.speaker_id == person.speaker_id).choose = '0';
    this.loadaddcart();
    if (this._addlist.length <= 0) {
      this.panelOpenState = false;
    }
  }
  changeOpenState() {
    this.panelOpenState = this.panelOpenState ? false : true;
  }

  //Sound Function
  playSound(audio: any) {
    const getNumber = Number(audio[1].match(/\d+/, '')[0]);
    const speaker = String(getNumber + 1);
    this.addSoundSampleHistory(speaker);

    let audioURL = audio[0];
    this.playnowButton = audio[1];
    this.isSoundPlay = true;
    this.audio.src = audioURL;
    this.audio.play();
  }

  trackSoundSample: TrackSoundSample[] = [];
  addSoundSampleHistory(speaker: string) {
    const { user_id } = this._auth.getUserData();
    this.trackSoundSample.push({
      speaker,
      datetime: new Date().toISOString(),
      page: 'Select Voice',
      user_id,
    });
  }

  stopSound() {
    let allbtn: HTMLCollectionOf<Element> =
      document.getElementsByClassName('personplay');
    for (let i = 0; i < allbtn.length; i++) allbtn[i].innerHTML = 'play_arrow';
    this.audio.pause();
  }

  //Cart Manage Function
  checkCart(personset: any) {
    if (personset[1] == 'add') this.addlist(personset[0]);
    else this.deleteCart(personset[0]);
  }
  setCart() {
    let addcartlist = [];

    for (let a of this._addlist) {
      addcartlist.push(a.speaker_id);
      this.speaker.find((e) => e.speaker_id == a.speaker_id).choose = '1';
      this.soundCart.push(a);
      this.soundCart.map((e) => {
        if (e.check_status == undefined) e.check_status = false;
      });
    }

    while (this._addlist.length > 0) this._addlist.pop();
    this.panelOpenState = false;

    this._speaker.setCart(addcartlist);

    this._marketPlaceV3.updateAfterSaveCart(addcartlist);

    sessionStorage.setItem('cart', JSON.stringify(this.soundCart));
    this._speaker.$cart.next(this.soundCart);

    this.displayFloating(this.text.addOnCart);

    this.loadaddcart();
    this.stopSound();
  }

  deleteCart(person: any) {
    this.deletePerson = person;
    this.deletePersonCount =
      this.deletePerson.length == undefined ? 1 : this.deletePerson.length;
    this.stopSound();
    this.openAlert();
  }

  //Search&Filter Feature
  changeSearchWord(wordset: any) {
    //add&delete
    if (wordset[1] == 'add') {
      if (!this.searchwordList.includes(wordset[0]))
        this.searchwordList.push(wordset[0]);
    } else {
      if (this.searchwordList.includes(wordset[0]))
        this.searchwordList.splice(this.searchwordList.indexOf(wordset[0]), 1);
    }
  }
  clearSearchWord() {
    while (this.searchwordList.length > 0) {
      this.searchwordList.pop();
    }
  }

  changeSearchText(text: string) {
    this.searchText = text;
  }

  //Alert
  openAlert() {
    this.clickDelete = true;
  }
  closeAlert() {
    this.clickDelete = false;
  }
  submitRemove() {
    this.clickDelete = false;
    if (this.deletePerson.length == undefined) {
      let person = this.deletePerson;
      this.soundCart.splice(
        this.soundCart.findIndex((e) => person.speaker_id == e.speaker_id),
        1
      );

      this.speaker.find((e) => person.speaker_id == e.speaker_id).choose = '0';
      this._speaker.deleteCart([person.speaker_id]);
    } else {
      for (let d of this.deletePerson) {
        this.soundCart.splice(
          this.soundCart.findIndex((e) => d == e.speaker_id),
          1
        );
        this.speaker.find((e) => d == e.speaker_id).choose = '0';
      }

      this._speaker.deleteCart(this.deletePerson);
    }

    this._marketPlaceV3.removeFavList(this.deletePerson);

    sessionStorage.setItem('cart', JSON.stringify(this.soundCart));
    this._speaker.$cart.next(this.soundCart);
    // this.displayFloating(this.alertText.replaceVoiceover) // replaceVoiceover : 'เอาเสียงออกจากสตูดิโอสร้างเสียงของคุณแล้ว',
    this.displayFloating(this.text.removeOnCart);
  }
  async displayFloating(message: string) {
    this.floatingMessage.push(message);
    this.messageShow = true;
    setTimeout(() => {
      this.floatingMessage.splice(0, 1);
      if (this.floatingMessage.length <= 0) this.messageShow = false;
    }, 4000);
  }

  loadaddcart() {
    sessionStorage.setItem('addcart', JSON.stringify(this._addlist));
  }
}
