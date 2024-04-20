import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { TResponseAds } from 'src/app/payment/models/ads-model';
import { SubscriptionAPIService } from 'src/app/payment/services/subscription-api.service';
import { language } from 'src/app/shared/change_language/language';
import { Language, TypeCurrency } from 'src/app/shared/models/shared-model';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { SpeakerService } from 'src/app/shared/services/speaker.service';

@Component({
  selector: 'app-dialog-ads',
  templateUrl: './dialog-ads.component.html',
  styleUrls: ['./dialog-ads.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAdsComponent implements OnInit {
  public text = language['TH'].dialogAds;
  public adsCounter: number;
  public audioCounter: number;
  public $adsCounter = new Subscription();
  public $audioCounter = new Subscription();
  public progressSpinnerData = {
    color: 'primary',
    mode: 'determinate' as ProgressSpinnerMode,
    value: 0,
  };

  public progressBarData = {
    color: 'primary',
    mode: 'determinate' as ProgressBarMode,
    value: 0,
  };

  public data: TResponseAds;

  public canSkip = false;
  private atPayment = false;

  private audio = new Audio();
  public duration = 0;
  public formattedDuration: string = '00:00';
  public currentSpeaker = null;
  public backgroundData: any = null;
  lang: Language = null;
  noAdsPrice: number = null
  currency: TypeCurrency = 'usd'
  mock_background = [
    {
      value: 'sell',
      path: '../../../../assets/dialog-ads/bnv_sell.webp',
      name: 'ขายของ',
      EN_name: 'Sell products',
    },
    {
      value: 'comics',
      path: '../../../../assets/dialog-ads/bnv_comics.webp',
      name: 'อ่านการ์ตูน',
      EN_name: 'Read comics',
    },
    {
      value: 'storytelling',
      path: '../../../../assets/dialog-ads/bnv_storytelling.webp',
      name: 'เล่าเรื่องผี',
      EN_name: 'Storytelling',
    },
    {
      value: 'news',
      path: '../../../../assets/dialog-ads/bnv_news.webp',
      name: 'อ่านข่าวพยากรณ์อากาศ',
      EN_name: 'Weather forecast',
    },
    {
      value: 'member',
      path: '../../../../assets/dialog-ads/bnv_member.webp',
      name: 'สมัครสมาชิก',
      EN_name: 'Botnoi Voice member',
    },
    {
      value: 'download',
      path: '../../../../assets/dialog-ads/bnv_download.webp',
      name: 'ดาวน์โหลด',
      EN_name: 'Botnoi Voice Download',
    },
    {
      value: 'xmas1',
      path: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/ads/16-9-xmas1.png',
      name: 'บอทน้อย คริสมาสต์',
      EN_name: 'Botnoi Voice Christmas',
    },
    {
      value: 'xmas2',
      path: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/ads/16-9-xmas2.png',
      name: 'บอทน้อย คริสมาสต์',
      EN_name: 'Botnoi Voice Christmas',
    },
    {
      value: 'xmas3',
      path: 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com/ads/16-9-xmas3.png',
      name: 'บอทน้อย คริสมาสต์',
      EN_name: 'Botnoi Voice Christmas',
    },
  ];

  constructor(
    private _language: ChangeLanguageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<DialogAdsComponent>,
    private _speaker: SpeakerService,
    private _subAPI: SubscriptionAPIService,
    @Inject(MAT_DIALOG_DATA) private _data: TResponseAds
  ) {
    this.data = this._data; // Assiging data to the variable
  }

  ngOnInit(): void {
    this._language.language.subscribe((resp) => {
      this.text = language[resp].dialogAds;
      this.lang = resp;
      this.currency = this._language.setCurrencyBasedLanguage(resp)
      // this.currency = this._language.getCurrency()
    });

    this._subAPI.$package_addon.subscribe(
      res => {
        if (res) {
          // Find No Ads package
          const foundItem = res.find(e => e.add_id === '3')
          if (foundItem) {
            const { price_discount, us_price_discount } = foundItem;
            this.noAdsPrice = this.currency === 'usd' ? us_price_discount : price_discount;
          }
        }
      }
    )

    this.sequenceFunction();
    // this.handleData(this.data)
    // this.countdownAds()
    if (this.data.url) {
      this.extractIdFromUrl();
      this.extractCategoryFromUrl();
    }
  }

  private extractIdFromUrl() {
    const split = this.data.url.split('/');
    const idText = split[4];
    // Use a regular expression to match numbers
    const speakerId = idText.match(/\d+/g);

    this.findSpeakerById(speakerId[0]);
  }

  public extractCategoryFromUrl() {
    const split = this.data.url.split('/');
    // find category
    const category = split[5];
    const result = this.mock_background.find((item) => {
      return item.value === category;
    });

    this.backgroundData = result;

    return `url(${result.path})`;
  }

  private findSpeakerById(id: string) {
    const speaker = this._speaker.$speaker.getValue();
    const foundSpeaker = speaker.filter((item) => {
      return item.speaker_id === id;
    });

    this.currentSpeaker = foundSpeaker[0];
  }

  private async sequenceFunction() {
    await this.handleData(this.data);
    this.playAudio();
    this.countdownAds();
  }

  private async handleData(data: TResponseAds) {
    const { url } = data;
    this.audio.src = url; // Set audio URL
    this.audio.volume = 0.8; // Set volume
    this.audio.onloadedmetadata = () => {
      const { duration } = this.audio;
      this.adsCounter = Math.floor(duration) > 10 ? 10 : Math.floor(duration);
      this.formattedDuration = this.formatTime(duration);
      this.audioCounter = duration;
    };
  }

  private playAudio() {
    this.audio.play();
    this.audio.ontimeupdate = () => {
      let { currentTime, duration } = this.audio;
      const progress = (currentTime / duration) * 100;
      this.progressBarData.value = progress;
      this.cdr.markForCheck();
    };

    this.countdownAudio();
  }

  /**
   * Navigate user and close pop-up.
   */
  public toPayment() {
    this.router.navigate(['/payment'], { queryParams: { page: 1 } })
      .then(res => {
        if (res) { // Go to path, disabled ads sound
          this.atPayment = true;
          this.onClose();
        }
      })
  }

  /**
   * Countdown ads remaining.
   */
  private countdownAds() {
    this.$adsCounter = interval(1000).subscribe(() => {
      // Coundown ads remaining time
      this.adsCounter--;

      // Countup spinner number
      this.progressSpinnerData.value = 100 - this.adsCounter * 10;

      if (this.adsCounter <= 0) {
        this.stopCountdown();
      }

      // Check on push
      this.cdr.markForCheck();
    });
  }

  /**
   *
   */
  private countdownAudio() {
    this.$audioCounter = interval(1000).subscribe(() => {
      this.formattedDuration = this.formatTime(this.audioCounter--);

      // Coundown ads remaining time
      if (this.audioCounter <= 0) {
        this.$audioCounter?.unsubscribe();
      }

      // Check on push
      this.cdr.markForCheck();
    });
  }

  /**
   * Format time to minute:second string
   * @param time number
   * @returns mm:ss string
   */
  private formatTime(time: number): string {
    if (time < 0) return `00:00`;
    if (Number.isNaN(time)) return '00:00';
    const minutes: string = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    const seconds: string = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');

    return `${minutes}:${seconds}`;
  }

  /**
   * Stop countdown and unsubscribe variable.
   */
  private stopCountdown() {
    // User can skip
    this.canSkip = true;

    // Unsubscribe
    this.$adsCounter?.unsubscribe();

    // Delay 2 secs before close
    // setTimeout(() => {
    //   this.onClose();
    // }, 3000);
  }

  /**
   * Navigate user to user
   */
  public toUrl() {
    // TODO Waiting for user client url
    // Existed URL
    // if (this.data?.url?.length > 0) {
    //   window.location.href = this.data.url
    // } else { // Default navigate
    //   this.toPayment()
    // }

    this.toPayment();
  }

  /**
   * Close pop-up.
   */
  public onClose() {
    this.audio.pause();
    if (this.canSkip) {
      this.dialogRef.close(this.atPayment ? true : undefined);
    }
  }

  ngOnDestroy(): void {
    this.audio.pause();
    this.stopCountdown();
  }
}
