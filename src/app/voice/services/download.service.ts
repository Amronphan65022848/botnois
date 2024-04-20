import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscriber, lastValueFrom, of } from 'rxjs';
import { UserData } from 'src/app/auth/models/auth-model';
import { DialogUpsellComponent } from 'src/app/dialog/components/dialog-upsell/dialog-upsell.component';
import { DialognconfirmpaidComponent } from 'src/app/dialog/components/dialognconfirmpaid/dialognconfirmpaid.component';
import {
  Language,
  TAPIResponseMessage,
  TBuyState,
  TState,
} from 'src/app/shared/models/shared-model';
import {
  TGenerateVoicePayload,
  TResponseConfirmPaid,
} from '../models/voice-model';
import { Block } from '../models/conversation-model';
import { TDialogPaidData } from 'src/app/payment/models/wallet-model';
import { WalletService } from 'src/app/payment/services/wallet.service';
import { DowloadsuccessComponent } from 'src/app/dialog/components/dowloadsuccess/dowloadsuccess.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { Router } from '@angular/router';
import { NoPointDialogComponent } from '../text2speech-v2/dialog/no-point-dialog/no-point-dialog.component';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { DownloadSigleComponent } from '../text2speech-mobile-first/download-sigle/download-sigle.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const { webapi, voice, voice_path_aws } = environment;
import JSZip from 'jszip';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';

type TPayloadJson = {
  audio_list: TGenerateVoicePayload[];
  save_file: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  constructor(
    private dialog: MatDialog,
    private _wallet: WalletService,
    private _auth: AuthService,
    private _dialog: DialogService,
    private router: Router,
    private _language: ChangeLanguageService,
    private http: HttpClient,
    private _workspace: WorkspaceService,
  ) {}

  getHeader() {
    const tokenString = this._auth.getToken();
    const token = 'Bearer ' + tokenString;
    const header = new HttpHeaders({
      Authorization: token,
    });

    return header;
  }

  /**
   * Starter function for download audio.
   * @param isPointEnough boolean of point enough
   * @returns Observable
   */
  startDownload(isPointEnough: boolean, paidPoint: number) {
    return new Observable<TBuyState | TState>((sub) => {
      if (!isPointEnough) {
        // Point not enough, Display dialog
        this.openUpsellDialog(sub, paidPoint);
        // this.openNoPointDialog(sub)
      } else {
        // Point is enough to download audio
        sub.next('Downloading');
      }
    });
  }

  /**
   * Open up-sell dialog and close dialog with value
   * @param sub Subscriber
   */
  private openUpsellDialog(
    sub: Subscriber<TBuyState | TState>,
    paidPoint: number,
  ): void {
    const dialogRef = this.dialog.open(DialogUpsellComponent, {
      width: '600px',
      height: '80%',
      data: {
        paidPoint,
      },
      autoFocus: true,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe({
      next: (resp: TBuyState) => {
        if (resp) {
          sub.next(resp);
          sub.complete();
        }
      },
    });
  }

  /**
   * Handle user activity state between point enough or not enough.
   * @param resp Status of point is enough or not
   * @param point Needed points for generate audio
   * @param paidPoint Price of points
   * @returns If point not enough open payment dialog, otherwise open download dialog
   */
  handleDownloadState(resp: TState | TBuyState) {
    // Check string type like 'Completed' or 'Failed'
    if (typeof resp === 'string') {
      return of(resp as TState);
    } else {
      // Not string should be JSON-Object type
      const { point, price, price_discount, us_price, us_price_discount } =
        resp?.item;
      let dialogData: TDialogPaidData = {
        point: point,
        bonus: 0,
      };
      if (resp.action === 'point') {
        dialogData['price'] = price;
      } else {
        // const currency = this._language.getCurrency()
        const lang = this._language.getLanguage();
        const currency = this._language.setCurrencyBasedLanguage(lang);
        if (currency === 'usd') {
          dialogData['price'] = price_discount ? us_price_discount : us_price;
        } else {
          dialogData['price'] = price_discount ? price_discount : price;
        }
      }

      return this._wallet.openDialogPaid(dialogData);
    }
  }

  /**
   * Open confirm paid dialog and close dialog with value.
   * @param point
   * @param user
   * @param item
   * @returns Observable of confim paid dialog
   */
  openConfirmationDialog(point: number, user: UserData, item: Block | Block[]) {
    return new Observable<TGenerateVoicePayload | TGenerateVoicePayload[]>(
      (sub) => {
        const dialogRef = this.dialog.open(DialognconfirmpaidComponent, {
          panelClass: 'dialog-size450',
          autoFocus: false,
          data: {
            point,
            subscription: user.subscription,
          },
        });

        dialogRef.afterClosed().subscribe((resp: TResponseConfirmPaid) => {
          let payload: TGenerateVoicePayload | TGenerateVoicePayload[];
          const isArray = Array.isArray(item);
          if (isArray) {
            const tempArray: TGenerateVoicePayload[] = [];
            item.forEach((e) => {
              if (e.text && e.category === 'soundtrack')
                tempArray.push(this.getPayload(resp, e));
            });
            payload = tempArray;
          } else {
            payload = this.getPayload(resp, item);
          }

          sub.next(payload);
          sub.complete();
        });
      },
    );
  }

  /**
   * Open confirm paid dialog and close dialog with value.
   * @param point
   * @param user
   * @param item
   * @returns Observable of confim paid dialog
   */
  openConfirmationDialogMobile(
    point: number,
    user: UserData,
    item: Block | Block[],
  ) {
    return new Observable<TGenerateVoicePayload | TGenerateVoicePayload[]>(
      (sub) => {
        const dialogRef = this.dialog.open(DownloadSigleComponent, {
          autoFocus: false,
          width: '100vw',
          maxWidth: '100vw',
          position: { bottom: '62px' },
          panelClass: 'dialog-floating',
          disableClose: true,
          data: {
            point,
            subscription: user.subscription,
          },
        });

        dialogRef.afterClosed().subscribe((resp: TResponseConfirmPaid) => {
          let payload: TGenerateVoicePayload | TGenerateVoicePayload[];
          const isArray = Array.isArray(item);
          if (isArray) {
            const tempArray: TGenerateVoicePayload[] = [];
            item.forEach((e) => {
              if (e.text && e.category === 'soundtrack')
                tempArray.push(this.getPayload(resp, e));
            });
            payload = tempArray;
          } else {
            payload = this.getPayload(resp, item);
          }

          sub.next(payload);
          sub.complete();
        });
      },
    );
  }

  /**
   * Handle state from confirm paid dialog
   * @param resp Response of confirm paid dialog
   * @param item Audio track data
   * @returns API Payload
   */
  private getPayload(resp: TResponseConfirmPaid, item: Block) {
    if (resp.file_type) {
      const volume = String(item.volume);
      const speed = String(item.speed);
      const speaker = String(item.speaker);
      const language = item.language.value;

      return {
        audio_id: item._id,
        text: String(item.text_read),
        text_delay: String(item.text_read_with_delay),
        speaker,
        volume,
        speed,
        type_media: resp.file_type,
        save_file: resp.saveFiles,
        language,
      } as TGenerateVoicePayload;
    }
  }

  /**
   * HTML+Javascript for download audio file.
   * @param blob Audio blob file
   * @param filename Audio file name
   */
  private downloadFile(blob: Blob | string, filename: string) {
    if ((window as any).navigator.msSaveOrOpenBlob) {
      // For Internet Explorer
      (window as any).navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      // For other browsers
      const a = document.createElement('a');
      let url;
      if (blob instanceof Blob) {
        url = URL.createObjectURL(blob as Blob);
      } else {
        url = blob;
      }

      a.href = url;
      a.download = filename;
      a.style.display = 'none';

      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  }

  /**
   * Trigger when download completed.
   * @param resp audio blob data
   * @param fileName name of file
   * @param point total point to pay for audio
   */
  private downloadCompleted(
    resp: string | Blob,
    fileName: string,
    point: number,
    user: UserData,
    item?: Block,
  ) {
    this.dialog.open(DowloadsuccessComponent, {
      autoFocus: false,
      panelClass: 'dialog-size450',
    });
    // this.calculatePoint();
    this.downloadFile(resp, fileName);

    this._workspace.setSave(false);

    if (item?.language?.value !== 'zh') {
      this.caculatedWithoutCallAPI(point, user);
    }
  }

  async handleSubscribe(
    res: string | Blob,
    type: TGenerateVoicePayload['type_voice'],
    dialogText: string[],
    point: number,
    user: UserData,
    payload?: TGenerateVoicePayload | TPayloadJson,
    item?: Block,
  ) {
    //**TODO Wait for storage design  */
    // Check Storage if save file === true
    // if (payload.save_file) {
    //   let isStorageFull;

    //   if ('audio_list' in payload) {
    //     isStorageFull = await this.checkStorage(payload.audio_list.length);
    //   } else {
    //     isStorageFull = await this.checkStorage(1);
    //   }

    //   if (isStorageFull) return;
    // }

    // Deduct point and save data to database
    await this.handleDataSave(dialogText, payload, point);

    //**TODO Wait for storage design  */
    // Set Storage if save_file === true

    let file_name = '';

    if (item) {
      const { text_read } = item;
      const name = this.shortText(text_read);
      file_name = `${name}.${type}`;

      item.isDownload = true;
      item.freeze = true;
    } else {
      file_name = 'BNV_' + new Date().getTime() + '.zip';
    }

    this.downloadCompleted(res, file_name, point, user, item);
  }

  private async checkStorage(sumUrls: number) {
    const header = this.getHeader();
    const url = voice + '/api/storage/check_storage';

    return this.http
      .post<TAPIResponseMessage>(
        url,
        { sum_url: sumUrls },
        { headers: header, observe: 'response' },
      )
      .subscribe({
        next: (res) => {
          if (res.status === 200) {
            return false;
          } else {
            this._dialog.error(res.body.message);
            return true;
          }
        },
        error: (err) => {
          this._dialog.error('Something went wrong!');
          return true;
        },
      });
  }

  private async handleDataSave(
    dialogText: string[],
    payload: any,
    point: number,
  ) {
    //  Handle Data
    let dataPayload;
    if (payload.audio_list) {
      // download all
      let dataTemp = [];
      payload.audio_list.map((item: any) => {
        const { save_file, volume, type_voice, text_delay, speed, ...data } =
          item;

        dataTemp.push(data);
      });
      dataPayload = { data: dataTemp, save_file: payload.save_file };
    } else {
      // single download
      const { save_file, volume, type_voice, text_delay, speed, ...data } =
        payload;
      dataPayload = { data: [data], save_file };
    }

    // Call APIs
    this.updatePointAndSaveText(
      dataPayload.data,
      point,
      dataPayload.save_file,
    ).subscribe({
      next: (res) => {},
      error: (err) => {
        console.log(err.message);
        return true;
      },
    });

    return false;
  }

  private shortText(text: string) {
    return String(text).length > 30
      ? String(text).slice(0, 30) + '...'
      : String(text);
  }

  /** Calculate numeric user profile data without call API to prevent IOS bugs. */
  public caculatedWithoutCallAPI(textCount: number, user: UserData) {
    const profile = this._auth.data.getValue();

    // Not calculated point for unlimited package
    if (user.subscription === 'Unlimited') return;

    // Minus credits without negative number
    profile.credits = Math.max(profile.credits - textCount, 0);

    // const maxPlayQuota = SubscriptionPackage[this.user?.subscription]?.play_quota;
    // const multiple = 3;
    // profile.play_quota = profile.play_quota + textCount * multiple;

    // Check
    // if (profile.play_quota >= maxPlayQuota) {
    //   profile.play_quota = maxPlayQuota;
    // }

    // Update the profile data
    this._auth.data.next(profile);
  }

  // Function to download a single file and add it to the zip
  public async addFileToZip(
    zip: any,
    url: string,
    filename: string,
    index: number,
    fileType: string,
  ) {
    try {
      const response = await fetch(url, { method: 'GET' });
      const blob = await response.blob();
      return zip.file(String(index) + '-' + filename + `.${fileType}`, blob);
    } catch (error) {
      return Promise.reject('Error downloading file: ' + error);
    }
  }

  // Function to create a zip file with multiple audio files from URLs
  public createZipWithAudioFiles(
    urls: string[],
    filenames: string[],
    fileType: string,
  ) {
    const zip = new JSZip();
    const promises = [];

    urls.forEach((url, index) => {
      const filename = filenames[index];
      promises.push(this.addFileToZip(zip, url, filename, index, fileType));
    });

    return Promise.all(promises)
      .then(() => zip.generateAsync({ type: 'blob' }))
      .catch((error) => {
        return Promise.reject('Error creating zip file');
      });
  }

  public updatePointAndSaveText(data: any, point: number, save: boolean) {
    const header = this.getHeader();
    const url = voice + '/download/v1/download_voice';
    const temp = {
      point: point,
      data: data,
      save_storage: save,
    };

    return this.http.post<TAPIResponseMessage>(url, temp, { headers: header });
  }

  // Delete single audio in S3
  public deleteBox(data: any) {
    const header = this.getHeader();
    const url = voice + '/voice/v1/del_s3';

    const temp = {
      keyname: [data.replace(voice_path_aws, '')],
    };

    return this.http.post<any>(url, temp, { headers: header });
  }
}
