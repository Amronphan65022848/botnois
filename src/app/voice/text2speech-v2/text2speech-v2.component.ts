import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  HostListener,
  ViewChild,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { generateID } from '../text2speech-v2/function/random';
import {
  catchError,
  filter,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { firstValueFrom, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { ActivatedRoute, Router } from '@angular/router';
import { highlight_fromArr } from '../text2speech-v2/function/replaceWord';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Device } from 'src/app/model/core-model';
import { TextspeechService } from 'src/app/shared/services/textspeech.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { WordstoreService } from 'src/app/dictionary/services/wordstore.service';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { AleartSuccessComponent } from 'src/app/dialog/components/aleart-success/aleart-success.component';
import { ScreenSizeService } from 'src/app/shared/services/screen-size.service';
import {
  Block,
  DropdownAttribute,
  SpeakerData,
  TResponseFile,
} from '../models/conversation-model';
import { AudioDataAPI } from 'src/app/storage/models/text2speech-model';
import { SpeakerService } from 'src/app/shared/services/speaker.service';
import { GlobalFunctionService } from 'src/app/shared/services/global-function.service';
import { TH_EN_flag } from '../mocks/conversation-mock';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { language } from 'src/app/shared/change_language/language';
import { SubscriptionAPIService } from 'src/app/payment/services/subscription-api.service';
import { UserData } from 'src/app/auth/models/auth-model';
import { InsertPayload } from '../models/workspace-model';
import { AlertEditNameComponent } from '../workspace/dialog/alert-edit-name/alert-edit-name.component';
import { AlertProjFullComponent } from '../workspace/dialog/alert-proj-full/alert-proj-full.component';
import { UnsubscribeService } from 'src/app/shared/services/unsubscribe.service';
import { DownloadService } from '../services/download.service';
import { TGenerateVoicePayload, TGetStoreFile } from '../models/voice-model';
import { ConverModeComponent } from './conver-mode/conver-mode.component';
import { GenerateService } from '../services/generate.service';
import { AdsService } from '../services/ads.service';
import { DialogAdsComponent } from 'src/app/dialog/components/dialog-ads/dialog-ads.component';
import { Language, TAPIResponse } from 'src/app/shared/models/shared-model';

import { environment } from 'src/environments/environment';
const { voice_path_aws } = environment;

interface Word {
  _id: string;
  before_text: string;
  after_text: string;
}

interface StudioParam {
  id?: string;
  name?: string;
}

type TPayloadJson = {
  audio_list: TGenerateVoicePayload[];
  save_file: boolean;
};

@Component({
  selector: 'app-text2speech-v2',
  templateUrl: './text2speech-v2.component.html',
  styleUrls: ['./text2speech-v2.component.scss'],
})
export class Text2speechV2Component implements OnInit {
  device: Device = 'Desktop';

  // Style
  @ViewChild('disk', { read: ElementRef }) disk: ElementRef<HTMLImageElement>;
  @ViewChild('loading', { read: ElementRef })
  loading: ElementRef<HTMLDivElement>;
  @ViewChild('done', { read: ElementRef }) done: ElementRef<HTMLSpanElement>;

  @ViewChild(ConverModeComponent) converMode: ConverModeComponent;

  // ตัวแปร pin
  public pinned_tts: Array<string>;
  public pinned_status = [];
  public data: Block[] = [];

  // ตัวแปรระบุ mode
  public mode_button: string = '1';

  //position toolbar create
  public x: number = 20;
  public y: number = 0;
  dropdownAttr: DropdownAttribute = {
    left: 0,
    top: 0,
  };
  //ตัวแปร speaker
  public speakerIcon: SpeakerData[] = [];

  public alertstorageFull =
    'พื้นที่สำหรับเก็บไฟล์เสียงเต็ม! กรุณาลบไฟล์เสียงบางส่วน';
  public storageDirec = 'ไปคลังเสียง';

  public isPlayAll: boolean = false;
  public isReadyPlayAll: boolean = false;
  public isReadyDownloadAll: boolean = false;
  public isReadyCreate: boolean = false;
  public totalPayPoint: number = 0;
  private isPointEnough: boolean = false; // point พอที่จะจ่ายหรือไม่ ?

  // ตัวตั้งค่าเสียง
  // public isOpenToolbar: boolean = false;
  public voiceSpeed: string = '1';
  public voiceSpeaker: string = '';
  public voiceVolume: string = '100';

  // ตัวแปรที่ยังไม่รู้เอามาทำไม
  public creatSound = false;
  public caret_on: boolean; //คลุมข้อความเพื่อสร้างเสียง
  public mobileText: string = ''; //var for input mobile text
  public text_selected: any;
  public current_text_length: number = 0; //limit this.limitText charecter
  public limitText = 1000; // max texts
  public limitBox = 100; // max texts
  public playQuota = 0; // max play quota
  public loadingState: number = 0; //loading voice from server
  public currentUserPackage = null;

  //เสียง
  private file = new Audio(); // file sound
  public currentTime: number = 0;
  public duration: number = 0;
  private bgFile = new Audio();

  // Audio progress bar
  public currentIndex: number = 0;
  public previousTextLength: number = 0;
  public previousSpeaker: string = null;
  public sliderValue: number;
  public onloadedPlay: number = 0; // progress bar during play sound

  public focusSoundtrackID: string; //id element current focus
  public historyWord: any = [];
  public allsoundState: boolean = false;

  //speaker icon
  public iconSpeaker: string;
  public nameSpeaker: string;

  //selection
  private selectionStart: number = 0;
  private selectionEnd: number = 0;
  private selectionId: string; //id element at selection
  public selectionLength: number = 0;

  // get canPlayAll() { return this.getDataState() }
  //dropdown
  public indexnowSetting = 999;
  public showdropdown = false;

  isLoading = false;
  isSaving = false;
  // isSaved = false;
  isFreeUser = null;
  user: UserData = null;
  lang: Language = 'TH'; // false is thai

  workspaceName: string = null;
  workspaceId: string = null;
  projectAuto: string = null;
  public workspace: any[] = [];
  public currentWorkspace = null;
  public maxProject = 100;

  text = language['TH'].text2speechObj;
  text_dialog = language['TH'].walletObj;

  warning_text: string = '';
  hideWarning = false;

  intervalId: any;

  // Single & all audio play
  playAudioQueue: number[] = [];
  currentAudioPlayIndex = 0;

  public langListAll: Block['language'][] = this._gfunc.deepclone(TH_EN_flag);
  constructor(
    public _bottomSheet: MatBottomSheet,
    private _tts: TextspeechService,
    private _auth: AuthService,
    private renderer: Renderer2,
    private el: ElementRef,
    public dialog: MatDialog,
    private _dialog: DialogService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    protected _dictionary: WordstoreService,
    private _screen: ScreenSizeService,
    private _changeLanguage: ChangeLanguageService,
    private _speaker: SpeakerService,
    private _gfunc: GlobalFunctionService,
    private _notify: NotificationService,
    private _workspace: WorkspaceService,
    private _subAPI: SubscriptionAPIService,
    private _globalFunc: GlobalFunctionService,
    private _unsub: UnsubscribeService,
    private _download: DownloadService,
    private _generate: GenerateService,
    private _ads: AdsService,
  ) {
    // Wait for the audio to be loaded
    this.bgFile.onloadedmetadata = () => {
      // Set the volume property
      this.bgFile.volume = 0.18;
    };

    this.bgFile.onended = () => {
      if (!this.file.paused) {
        this.bgFile.currentTime = 0;
        this.bgFile.play();
      }
    };
  }

  async ngOnInit(): Promise<void> {
    /* prevent no auto re-size while sign-in with redirect token */
    this._screen.getScreenSize();

    this._changeLanguage.language.subscribe((res) => {
      if (res) {
        this.text = language[res].text2speechObj;
        this.text_dialog = language[res].walletObj;
        this.lang = res;
        this.projectAuto = language[res].text2speechObj.workspace.project;
      }
    });

    await this.getSpeakers();

    this._screen.$device.subscribe((res) => {
      this.device = res;
    });

    this._auth.data
      .pipe(
        filter((user) => !!user), // Existed value
        tap((user) => (this.user = user)), // Assign the value
        switchMap(() => this._subAPI.$package_addon), // Subscribe another observable
        filter((value) => !!value), // Existed value
        take(1), // Do only once then unsubscribe
      )
      .subscribe((value) => {
        const addonList = this.user?.list_add_on;
        if (addonList && addonList?.length > 0) {
          const isHasLimitText = addonList.find(
            (e) => e.add_on === 'Limit_text',
          );
          if (isHasLimitText) {
            const limitText = value.find(
              (e) => e.name === 'Limit_text',
            )?.text_limit;
            this.limitText = limitText;
          }
        }
      });

    this.getWarning();

    // Get alert text notification
    this._notify.notifyJson.subscribe((res) => {
      if (res) {
        if (res?.warning.length > 0) {
          this.warning_text = res.warning;
        } else {
          this.hideWarning = true;
        }
      }
    });

    this.getHistoryWord();

    this.getQueryParam();

    this._workspace.setSave(true);

    // calculate point
    setTimeout(() => {
      this.calculatePoint();
    }, 0);
  }

  @HostListener('window:beforeunload', ['$event'])
  public onBeforeUnload($event: BeforeUnloadEvent) {
    // Show a confirmation dialog
    let isSaved = this._workspace.getSave();

    // Update ads if existed value
    this._ads.fetchUpdateAds();

    // Set cookie when user leave studio page
    this._ads.setAdsCookie();
    if (!isSaved) {
      $event.returnValue = 'Are you sure you want to leave this page?';
    }
  }

  //----------- Workspace ------------//

  /** Check if user has workspace. If not, Create and use workspace */
  checkWorkspace() {
    this.isLoading = true;

    const $workspace = this._workspace.$workspace;
    // Check is data store in service
    if (!$workspace.getValue()) {
      this._workspace.getWorkspace().subscribe({
        next: (res) => {
          // If user has workspace. Find the most recent workspace and show
          if (res?.message?.list_project?.length) {
            // Get recent project
            const recent = this.getRecentProject(res.message.list_project);
            // Assing vars
            this.workspace = res.message.list_project.reverse();

            this.currentWorkspace = recent;
            this._workspace.updateWorkspace(this.workspace);
            this.data = [];
            // Go to workspace (Add params to URL)
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { id: recent.workspace_id, name: recent.name },
            });
          } else {
            // If user has no workspace. Create and navigate
            this.data = [];
            this.createWorkspaceAuto();
          }
        },
        error: (err) => {
          this.isLoading = false;
          this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
        },
      });
    } else {
      $workspace.subscribe((data) => {
        if (data.length) {
          const recent = this.getRecentProject(data);
          this.currentWorkspace = recent;
          this.workspace = data;
          this.data = [];
          this.isLoading = false;
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { id: recent.workspace_id, name: recent.name },
          });
        } else {
          this.data = [];
          this.createWorkspaceAuto();
        }
      });
    }
  }

  createWorkspaceAuto() {
    const project_name = `${this.projectAuto} 1`;
    const workspace_id = this._globalFunc.generateID();

    const temp: InsertPayload = {
      workspace_id: workspace_id,
      workspace: project_name,
      type_workspace: 'conversation',
    };

    this._workspace.insertWorkspace(temp).subscribe({
      next: (res) => {
        if (res) {
          //Update workspace
          this.workspace.push({
            workspace_id,
            name: project_name,
            picture:
              'https://images-ext-1.discordapp.net/external/0qQzMrsYKoBNvWTu9UzB8xXBeGg4mi09QeKIkDj3dPs/https/botnoi-voice.s3.ap-southeast-1.amazonaws.com/image/workspace/U7b1f00b4e1502093a3327e1743150bf5_%25E0%25B9%2582%25E0%25B8%259B%25E0%25B8%25A3%25E0%25B9%2580%25E0%25B8%2588%25E0%25B8%2584%2B2.jpg?width=393&height=245',
            recent_use: new Date().toLocaleString(),
            speaker_list: [],
            type_workspace: 'conversation',
          });
          this._workspace.updateWorkspace(this.workspace);

          //
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              id: workspace_id,
              name: project_name,
            },
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
      },
    });
  }

  createWorkspace() {
    if (this.workspace.length >= this.maxProject) {
      const ref = this.dialog.open(AlertProjFullComponent);
      return;
    }

    const ref = this.dialog.open(AlertEditNameComponent, {
      data: { type: 'create' },
    });
    ref.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.isLoading = true;
      // send API
      const workspace_id = this._globalFunc.generateID();
      const temp: InsertPayload = {
        workspace_id: workspace_id,
        workspace: res,
        type_workspace: 'conversation',
      };

      this._workspace.insertWorkspace(temp).subscribe({
        next: (createRes) => {
          this.isLoading = false;
          if (createRes) {
            //Update all workspace
            this.workspace.push({
              workspace_id,
              name: res,
              picture:
                'https://images-ext-1.discordapp.net/external/0qQzMrsYKoBNvWTu9UzB8xXBeGg4mi09QeKIkDj3dPs/https/botnoi-voice.s3.ap-southeast-1.amazonaws.com/image/workspace/U7b1f00b4e1502093a3327e1743150bf5_%25E0%25B9%2582%25E0%25B8%259B%25E0%25B8%25A3%25E0%25B9%2580%25E0%25B8%2588%25E0%25B8%2584%2B2.jpg?width=393&height=245',
              recent_use: new Date().toLocaleString(),
              speaker_list: [],
              type_workspace: 'conversation',
            });
            this._workspace.updateWorkspace(this.workspace);
            // Clear box
            this.data = [];
            // Navigate
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { id: workspace_id, name: res },
            });
          }
        },
        error: (err) => {
          this.isLoading = false;
          this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
        },
      });
    });
  }

  getRecentProject(arr: any[]) {
    const time = arr.map((item) => new Date(item.recent_use).getTime());
    const maxTime = Math.max(...time);
    return arr.find((obj) => new Date(obj.recent_use).getTime() === maxTime);
  }

  /** Get query param to check workspace_id */
  getQueryParam() {
    // Get workspace name by query params
    this.route.queryParams.subscribe((param: StudioParam) => {
      // Get param from workspace
      if (param?.id) {
        // Assign data to vars
        this.workspaceName = param?.name;
        this.workspaceId = param?.id;
        // Get workspace from param
        const $workspace = this._workspace.$workspace;
        if (!$workspace.getValue()) {
          this._workspace.getWorkspace().subscribe({
            next: (res) => {
              if (res?.message?.list_project?.length) {
                const selected = res.message.list_project.filter(
                  (item) => item.workspace_id === param.id,
                );
                this.currentWorkspace = selected[0];
                this.workspace = res.message.list_project.reverse();
                this._workspace.updateWorkspace(this.workspace);
              }
            },
            error: (err) => {
              this._dialog.error(
                err?.error.message ?? JSON.stringify(err?.error),
              );
            },
          });
        } else {
          $workspace.subscribe((data) => {
            if (data) {
              const selected = data.filter(
                (item) => item.workspace_id === param.id,
              );

              this.currentWorkspace = selected[0];
              this.workspace = data;
            }
          });
        }

        this.isLoading = false;

        // Prevent empty box when paid at stripe
        // const text = JSON.parse(sessionStorage.getItem('free_text_save'));
        // if (text) return;

        // Call function
        this.getSavedText(param);
      } else {
        // No param, get recent wsp OR create wsp if user has no wsp
        this.checkWorkspace();
        // If can't find workspace param, Let user can create audio without saving
        // this.addInputTextconver('');
      }
    });
  }

  /** Back to workspace */
  goBack() {
    this.router.navigate(['tts']);
  }

  switchWorkspace(event: any) {
    if (!event.value) return;

    const selectedWorkspace = event.value;
    if (selectedWorkspace.workspace_id === this.workspaceId) return;
    this.data = [];
    this.currentWorkspace = selectedWorkspace;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        id: selectedWorkspace.workspace_id,
        name: selectedWorkspace.name,
      },
    });
  }

  /** Get saved text from cache or fetching API */
  getSavedText(param: StudioParam) {
    // Get the current textlist
    const textlist = this._workspace.$textlist.getValue();

    // Check if textlist exists and if a specific workspace entry exists
    const filtered = textlist?.find((e) => e.workspace_id === this.workspaceId);
    if (filtered) {
      // If the workspace entry exists, set the data to the text_list
      this.data = filtered.text_list;

      setTimeout(() => {
        this.converMode.checkDelay();
      }, 300);
    } else {
      // If the workspace entry doesn't exist, fetch it from the server
      this.fetchGetSavedText(param);
    }
  }

  /** Get text saved from fetching API. */
  async fetchGetSavedText(param) {
    this.isLoading = true;

    try {
      // Fetching API
      const resp: any = await this._workspace
        .getTextWorkspace(param.id)
        .toPromise();

      this.isLoading = false;

      if (resp.message?.text_list) {
        // Get Text list
        const data: any[] = resp.message.text_list;

        data.forEach((item) => {
          if (item.speaker == 0 || !item.speaker) {
            item.speaker = '1';
          }
        });

        // If no workspace data and no old data inside workspace
        if (data?.length <= 0 && this.data.length <= 0) {
          await this.addInputTextconver('');
        } else {
          // If has workspace data
          const addInputPromises = data.map((e) =>
            this.addInputTextconver(
              e.text,
              e.speaker,
              e.url,
              e.audio_id,
              e.status_download,
            ),
          );
          await Promise.all(addInputPromises);
          setTimeout(() => {
            this.converMode.checkDelay();
            this.calculatePoint();
          }, 300);
        }

        // Update final data to global stored variable
        this.updateTextList();
      } else {
        this._dialog.info(resp?.message);
        this.router.navigate(['tts']);
      }
    } catch (err) {
      this.isLoading = false;
      // this._dialog.error(err.error?.message ?? JSON.stringify(err?.error));
      console.log(err);
    }
  }

  /** Update text list in stored var */
  updateTextList() {
    // Get the current textlist or initialize it as an empty array
    const textlist = this._workspace.$textlist.getValue() || [];

    // Check if data with the same workspace_id exists in the textlist
    const isExist = textlist.some((e) => e.workspace_id === this.workspaceId);

    // If data with the same workspace_id does not exist, add it to the textlist
    if (!isExist) {
      // Create a new entry with workspace_id and the data
      const temp = {
        workspace_id: this.workspaceId,
        text_list: this.data,
      };

      // Push the new entry to the textlist
      textlist.push(temp);

      // Update the textlist with the modified array
      this._workspace.updateTextList(textlist);
    }
  }

  /** Save text to database with fetching API */
  onSaveText() {
    // Catching save progress
    if (this.isSaving) return;
    // else if (this.isFreeUser) return this.dialog.open(CantSaveDialogComponent);

    // this._dialog.warning('Free user')

    this.isSaving = true; // On saving progress
    this.disk.nativeElement.style.display = 'none';
    // this.disk.nativeElement.style.width = '0px';
    // this.disk.nativeElement.style.height = '0px';
    this.loading.nativeElement.style.display = 'block';

    const result = this.data
      .filter((item) => item.text && item.text.length > 0)
      .map((item) => {
        if (item.category === 'soundtrack') {
          const audioData = this._generate.getfileStorage(
            item.text_read,
            item.speaker,
            item.language.value,
            item._id,
          );

          if (item.isDownload || item.isDownloaded) {
            return {
              text: item.text,
              speaker: Number(item.speaker) ?? 1, // replace 1 (Ava) when null
              audio_id: audioData._id,
              url: audioData.file.replace(voice_path_aws, ''),
              status_download: true,
            };
          } else {
            return {
              text: item.text,
              speaker: Number(item.speaker) ?? 1, // replace 1 (Ava) when null
              audio_id: audioData._id,
              url: audioData.file.replace(voice_path_aws, ''),
              status_download: false,
            };
          }
        } else {
          return {
            text: item.text,
            speaker: Number(item.speaker) ?? 1, // replace 1 (Ava) when null
          };
        }
      });

    // Prepare data by const
    const workspace = {
      workspace_id: this.workspaceId,
      text_list: result,
    };

    // Fetching API
    this._workspace.saveTextWorkspace(workspace).subscribe({
      next: () => {
        // Set true instantly when get response
        this._workspace.setSave(true);

        setTimeout(() => {
          this.loading.nativeElement.style.display = 'none';
          this.done.nativeElement.style.display = 'block';
        }, 1000);

        setTimeout(() => {
          this.done.nativeElement.style.display = 'none';
          // this.disk.nativeElement.style.display = 'block';
          this.isSaving = false; // after that user can save again
        }, 2000);
      },
      error: (err) => {
        this._dialog.error(err.error.message ?? JSON.stringify(err?.error));
      },
    });
  }

  async getSpeakers() {
    return new Promise((resolve, reject) => {
      try {
        this.isLoading = true;
        this.intervalId = setInterval(() => {
          const item = JSON.parse(sessionStorage.getItem('speaker'));
          if (item && item.length) {
            // Item found, clear the interval and set the data
            this.speakerIcon = this._speaker.speechStyleFormat(item);
            resolve(item);
            clearInterval(this.intervalId);
          }
        }, 0);
      } catch (error) {
        reject(error);
      }
    });
  }

  closeWarn(number: number) {
    let pin = document.getElementsByClassName(
      'message-pinned',
    ) as HTMLCollectionOf<HTMLElement>;
    number != 19
      ? (pin[number].style.display = 'none')
      : (pin[this.pinned_tts.length].style.display = 'none');
    this.pinned_status[number] = 0;
    sessionStorage.setItem('pinned_status', JSON.stringify(this.pinned_status));
  }

  loadWarn() {
    if (sessionStorage.getItem('pinned_status')) {
      this.pinned_status = JSON.parse(sessionStorage.getItem('pinned_status'));
    } else {
      sessionStorage.setItem(
        'pinned_status',
        JSON.stringify(new Array(20).fill(1)),
      );
      this.pinned_status = JSON.parse(sessionStorage.getItem('pinned_status'));
    }
  }

  //เปลื่ยน mode ใช้งาน , checkmode

  modechange(i: any) {
    this.mode_button = i;
  }

  mode_check() {
    if (this.mode_button == '0') {
      return 'book';
    }
    if (this.mode_button == '1') {
      return 'conver';
    }
  }

  /* Get history word data from API */
  getHistoryWord() {
    if (this._dictionary.data.getValue().length > 0) {
      this.historyWord = this._dictionary.data.getValue();
    } else {
      setTimeout(() => {
        this._dictionary.getWordStore().subscribe((res: any) => {
          if (res) {
            this.historyWord = res.response;
            this._dictionary.data.next(res.response);
          }
        });
      }, 0);
    }
  }

  // Load file to csv function
  loadcsvToData(csvarray: Array<Array<string>>) {
    this.data = [];

    for (let r = 0; r < csvarray.length; r++) {
      let block: Block;
      let soundtrack_id = generateID();

      if (csvarray[r][0].length > 0) {
        block = {
          _id: soundtrack_id,
          text: csvarray[r][0],
          text_read: csvarray[r][0],
          text_with_delay: csvarray[r][0],
          text_read_with_delay: csvarray[r][0],
          display_text: csvarray[r][0],
          html: csvarray[r][0],
          category: 'soundtrack',
          speaker: this.speakerIcon.filter(
            (s) => s.eng_name == csvarray[r][1],
          )[0]?.speaker_id, // add ? before .speaker_id to prevent undefined error
          speed: '1',
          volume: '100',
          isEdit: true,
          isLoading: false,
          isPlaying: false,
          isDownload: csvarray[r][5] === 'true',
          point: csvarray[r][0].length,
          text_length: csvarray[r][0].length,
          speaker_name: csvarray[r][1],
          mode: this.mode_check(),
        };
      }

      this.data.push(block);
    }

    this.isReadyPlayAll = false;
    this.isReadyDownloadAll = false;
  }

  pauseSoundTrack(i: number) {
    this.file.pause();
    this.bgFile.pause();

    //sountrack นี้ กำลังเล่นอยู่ ให้หยุด
    this.data[i].isPlaying = false;
  }

  playSoundTrack(index: number, result?: TGetStoreFile) {
    // Index is null that should stop play all function
    if (typeof index === 'undefined') {
      this.currentAudioPlayIndex = 0;
      this.isPlayAll = false;
      return;
    }

    this.file.pause();
    this.bgFile.pause();

    let data = this.data[index];

    // Find other audios was stuck on [isPlaying = true] state
    const foundItem = this.data.find(
      (item) => item.isPlaying && item._id !== data._id,
    );
    if (foundItem) foundItem.isPlaying = false;

    if (data.isPlaying) {
      data.isPlaying = false;
    } else {
      this.handlePlayAudio(index, result);
    }
  }

  private handlePlayAudio(index: number, result?: TGetStoreFile): void {
    this.data[index].isPlaying = true;

    if (!result) {
      result = this._generate.getfileStorage(
        String(this.data[index].text_read),
        String(this.data[index].speaker),
        String(this.data[index].language.value),
        String(this.data[index]._id),
      );
    }

    if (
      this.previousTextLength == this.data[index].text_length &&
      this.sliderValue > 0
    ) {
      this.file.currentTime = this.sliderValue / 1000;
      this.sliderValue = 0;
      this.file.play();
      this.bgFile.play();
    } else if (
      this.previousTextLength == this.data[index].text_length &&
      this.currentTime > 0 &&
      this.previousSpeaker == this.data[index].speaker
    ) {
      this.file.currentTime = this.currentTime / 1000;
      this.file.play();
      this.bgFile.play();
    } else {
      this.playAudioFile(index, result);
    }

    // Set default width = 0%
    this.onloadedPlay = 0;

    // Slide background currentTime play
    const timing: NodeJS.Timeout = setInterval(() => {
      this.onloadedPlay = this.onProgressPlay(
        this.file.currentTime,
        this.file.duration,
      );
      this.currentTime = this.file.currentTime * 1000;
      this.duration = this.file.duration * 1000;
    }, 10);

    this.file.onended = () => {
      this.bgFile.pause();
      clearInterval(timing);
      this.data[index].isPlaying = false;
      this.onloadedPlay = 0;
      this.currentTime = 0;
      this.file.currentTime = 0;
      if (this.isPlayAll) {
        this.currentAudioPlayIndex += 1;
        this.playSoundTrack(this.playAudioQueue[this.currentAudioPlayIndex]);
      }
    };

    // Assign value to slide variables
    this.currentIndex = index;
    this.previousTextLength = this.data[index].text_length;
    this.previousSpeaker = this.data[index].speaker;
  }

  private playAudioFile(index: number, result: TGetStoreFile): void {
    if (result?.ads) {
      this.data[index].isPlaying = false;

      this.dialog
        .open(DialogAdsComponent, {
          disableClose: true,
          data: result.ads,
        })
        .afterClosed()
        .subscribe((bool: boolean) => {
          delete result.ads;
          if (!bool) {
            // this._ads.resetMax()
            setTimeout(() => {
              this.data[index].isPlaying = true;
              this.playAudioFile(index, result);
            }, 1000);
          }
        });
    } else {
      // If ads exist then play ads URL first
      // NEW FLOW
      this.file.src = result.file;
      this.bgFile.src = '../../../assets/audio/botnoi (1).mp3';
      this.file.volume = Number(this.data[index].volume) / 100;
      this.file.playbackRate = Number(this.data[index].speed);
      this.bgFile.play();
      this.file.play();
    }
  }

  playAll() {
    // Pause Audio before play all audio
    // this.file.pause();

    // Check data existed and item more than 0
    if (this.data && this.data.length > 0) {
      this.isPlayAll = true;
      // Storing can playable audio in Array
      this.playAudioQueue = this.data.reduce((prev, current, index) => {
        if (current.category === 'soundtrack') prev.push(index);
        return prev;
      }, [] as number[]);
      // Run function once
      this.playSoundTrack(this.playAudioQueue[this.currentAudioPlayIndex]);
    }
  }

  setSliderValue(value: number) {
    this.sliderValue = value;
    this.file.currentTime = this.sliderValue / 1000;
    this.sliderValue = 0;
  }

  setPreviousToDefaultState(stop?: boolean) {
    if (this.focusSoundtrackID !== '') {
      for (let i = 0; i < this.data.length; i++) {
        const item = this.data[i];

        if (
          item._id === this.focusSoundtrackID &&
          item.category === 'soundtrack'
        ) {
          this.data[i].isSetting = false;

          if (this.data[i].isEdit) {
            const index = this.data.findIndex(
              (item) => item._id === this.focusSoundtrackID,
            );
          }
          if (stop) {
            this.data[i].isPlaying = false;
          }

          break;
        }
      }
      this._tts.data.next(this.data);
    }
  }

  addTextBox(text: string) {
    this.addInputTextconver(text ? text : '');
    this._workspace.setSave(false);
  }

  public addInputTextconver(
    text: string,
    speaker_id?: string,
    audio_url?: string,
    audio_id?: string,
    isDownloaded?: boolean,
  ): Promise<void> {
    // Re-type the argument
    if (speaker_id) speaker_id = String(speaker_id);

    return new Promise<void>((resolve) => {
      let data: Block;
      const removeDelayText = this._gfunc.replaceBetweenParentheses(text);
      if (audio_id && audio_url) {
        if (isDownloaded) {
          data = {
            _id: generateID(),
            text: text,
            text_read: removeDelayText,
            text_with_delay: text,
            text_read_with_delay: text,
            point: 0,
            text_length: removeDelayText.length,
            html: text,
            category: 'soundtrack',
            isEdit: false,
            isLoading: false,
            isAds: false,
            isDownload: false,
            isPlaying: false,
            isDownloaded: true,
            mode: 'conver',
            speaker: speaker_id,
            display_text: text,
            speed: '1',
            volume: '100',
            workspace_name: this.workspaceName,
          };
        } else {
          data = {
            _id: generateID(),
            text: text,
            text_read: removeDelayText,
            text_with_delay: text,
            text_read_with_delay: text,
            point: removeDelayText.length,
            text_length: removeDelayText.length,
            html: text,
            category: 'soundtrack',
            isEdit: false,
            isLoading: false,
            isAds: false,
            isDownload: false,
            isPlaying: false,
            mode: 'conver',
            speaker: speaker_id,
            display_text: text,
            speed: '1',
            volume: '100',
            workspace_name: this.workspaceName,
          };
        }
      } else {
        data = {
          _id: generateID(),
          text: text,
          html: text,
          category: 'text',
          isEdit: true,
          isLoading: false,
          isAds: false,
          mode: 'conver',
          speaker: speaker_id,
          display_text: text,
          workspace_name: this.workspaceName,
        };
      }

      if (speaker_id) data = this.formatSpeaker(data);

      if (audio_id && audio_url) {
        this._generate.setfileStorage(
          removeDelayText,
          speaker_id,
          voice_path_aws + audio_url,
          data._id,
          data.language?.value,
        );
      }

      this.data.push(data);

      const temp: any[] = this._tts.data.getValue();

      /* Handle audio store without disappear data */
      if (temp.length <= 0) {
        this._tts.data.next(this.data);
      }

      //Resolve
      resolve();
    });
  }

  formatSpeaker(data: Block) {
    const currentSpeaker = this.speakerIcon.find(
      (e) => e.speaker_id === data.speaker,
    );

    if (!currentSpeaker) return data; // Check exist value
    let { available_language, language } = currentSpeaker;

    const langObj = this.langListAll.find(
      (e) => e.value === language.toLowerCase(),
    );
    // Lowercase string
    language = language.toLowerCase();

    // Remove main language in sub language list then uppercase string array
    const sub = available_language
      .filter((lang) => lang !== language)
      .map((lang) => {
        return { value: lang };
      });

    // Assigning data
    data.language = langObj;
    data.main_lang = [{ value: language }];
    data.sub_lang = sub;

    // Prepare temp varialbe
    return data;
  }

  downloadTrack(item: Block): void {
    this.setPreviousToDefaultState();
    // Get current audio point cost
    let point: number;

    if (item.isDownloaded) {
      point = 0;
    } else {
      point = String(item.text_read).length;
    }

    // Prevent alert leave page and point deducted but got no file
    this._workspace.setSave(true);

    // Point rate from the current package
    // const pointRate = this.currentUserPackage[0].point_per_thb;

    // Point required to pay
    // const paidPoint = Math.ceil(point / pointRate);

    this.checkEnoughPoint(point);

    this._download
      .startDownload(this.isPointEnough, point)
      .pipe(
        takeUntil(this._unsub.$destroy),
        switchMap((resp) => {
          return this._download.handleDownloadState(resp);
        }),
        filter((resp) => resp === 'Downloading'), // Only download state can pass
        switchMap(() =>
          this._download.openConfirmationDialog(point, this.user, item),
        ),
      )
      .subscribe(async (payload) => {
        let res: TAPIResponse<string> = null;
        // Value existed and value is JSON
        if (payload && !Array.isArray(payload)) {
          this.isLoading = true;

          // if user select file type not mp3
          if (payload.type_media != 'mp3') {
            const { save_file, ...data } = payload;
            try {
              res = (await firstValueFrom(
                this._tts.generateVoice(data),
              )) as TAPIResponse<string>;
            } catch (err) {
              this._dialog.error('Something went wrong!');
            }
          }

          this.fetchDownloadAudio(payload, item, point, res?.data);
        }
      });
  }

  async downloadAlltrack() {
    // calculate total pay point
    // this.calculatePoint();

    // get total point cost
    const point: number = this.totalPayPoint;

    // Prevent alert leave page and point deducted but got no file
    this._workspace.setSave(true);

    // Point rate from the current package
    // const pointRate = this.currentUserPackage[0].point_per_thb;

    this.checkEnoughPoint(point);

    this._download
      .startDownload(this.isPointEnough, point)
      .pipe(
        takeUntil(this._unsub.$destroy),
        switchMap((resp) => this._download.handleDownloadState(resp)),
        filter((resp) => resp === 'Downloading'), // Only download state can pass
        switchMap(() =>
          this._download.openConfirmationDialog(point, this.user, this.data),
        ),
      )
      .subscribe((resp) => {
        let saveFile = JSON.parse(localStorage.getItem('storage_save'));
        if (!saveFile) {
          saveFile = false;
        }

        if (resp[0].type_media != 'mp3' && Array.isArray(resp)) {
          this.isLoading = true;
          const promises = resp.map(async (item, index) => {
            const { save_file, ...data } = item;
            try {
              const res = (await firstValueFrom(
                this._tts.generateVoice(data),
              )) as TAPIResponse<string>;

              return { file: res?.data, text: resp[index].text };
            } catch (err) {
              this.isLoading = false;
              this._dialog.error('Something went wrong!');
              return;
            }
          });

          Promise.all(promises)
            .then((temp) => {
              this.fetchDownloadAudioAll(
                { audio_list: resp, save_file: saveFile },
                point,
                temp,
                resp[0].type_media,
              );
            })
            .catch((err) => {
              this.isLoading = false;
              this._dialog.error('Something went wrong!');
              return;
            });
        } else if (resp && Array.isArray(resp)) {
          this.isLoading = true;
          this.fetchDownloadAudioAll(
            { audio_list: resp, save_file: saveFile },
            point,
            [],
            'mp3',
          );
        }
      });
  }

  /**
   * Fetching API to download audio
   * @param payload Request body of API
   * @param item Audio track data
   * @param point Needed point to pay
   */
  private fetchDownloadAudio(
    payload: TGenerateVoicePayload,
    item: Block,
    point: number,
    changedFile?: string,
  ) {
    let file: any = null;

    if (changedFile) {
      file = {
        ads: null,
        file: changedFile,
        language: payload.language,
        speaker: payload.speaker,
        text: payload.text,
        _id: payload.audio_id,
      };
    } else {
      file = this._generate.getfileStorage(
        payload.text,
        payload.speaker,
        payload.language,
        payload.audio_id,
      );
    }

    if (file) {
      this._download
        .handleSubscribe(
          file.file,
          payload.type_voice,
          this.text.storage.full_storage,
          point,
          this.user,
          payload,
          item,
        )
        .then(() => {
          this.onSaveText();
          this.data.map((box) => {
            if (box._id === item._id) {
              box.point = 0;
            }
          });
          this.calculatePoint();
        })
        .catch((err) => {
          this._dialog.error('Something went wrong!');
        });

      this._ads.genCount = 0;
      sessionStorage.setItem('genCount', '0');

      this.isLoading = false;
    } else {
      this.isLoading = false;
      this._dialog.error('Something went wrong!');
    }

    // this._tts.downloadVoice(payload).subscribe({
    //   next: async (res) => {
    //     this.isLoading = false;
    //     this._download.handleSubscribe(
    //       res,
    //       payload.type_voice,
    //       this.text.storage.full_storage,
    //       point,
    //       this.user,
    //       item,
    //     );

    //     this._ads.genCount = 0;
    //     sessionStorage.setItem('genCount', '0');
    //   },
    //   error: (err) => {
    //     this.isLoading = false;
    //     this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
    //   },
    // });
  }

  /**
   * Fetching API to download multiple audio files.
   * @param payload
   * @param point
   */
  fetchDownloadAudioAll(
    payload: TPayloadJson,
    point: number,
    changedFile?: { file: string; text: string }[],
    fileType?: string,
  ) {
    const data = payload.audio_list;
    let file = [];
    let filename = [];

    if (changedFile && changedFile.length > 0) {
      changedFile.map((item) => {
        file.push(item.file);
        filename.push(item.text);
      });
    } else {
      data.map((item) => {
        const path = this._generate.getfileStorage(
          item.text,
          item.speaker,
          item.language,
          item.audio_id,
        );

        file.push(path.file);
        filename.push(path.text);
      });
    }

    this._download
      .createZipWithAudioFiles(file, filename, fileType)
      .then((blob) => {
        if (blob.size === 0) {
          this.isLoading = false;
          this._dialog.error('Error creating zip file.');
          return;
        }

        this.isLoading = false;
        const type = payload?.audio_list[0]?.type_voice;
        this._download
          .handleSubscribe(
            blob,
            type,
            this.text.storage.full_storage,
            point,
            this.user,
            payload,
          )
          .then(() => {
            // Handle downloaded audio to set point to 0
            this.data.forEach((item) => {
              if (item.category === 'soundtrack') {
                item.isDownloaded = true;
                item.point = 0;
              }
            });
            // Save workspace
            this.onSaveText();
          })
          .catch((err) => {
            this._dialog.error('Something went wrong!');
          });

        this._ads.genCount = 0;
        sessionStorage.setItem('genCount', '0');
      })
      .catch((err) => {
        this.isLoading = false;
        this._dialog.error(err);
        return;
      });

    // this._tts.downloadAll(payload).subscribe({
    //   next: async (res) => {
    //     this.isLoading = false;
    //     const type = payload?.audio_list[0]?.type_voice;
    //     this._download.handleSubscribe(
    //       res,
    //       type,
    //       this.text.storage.full_storage,
    //       point,
    //       this.user,
    //     );

    //     this._ads.genCount = 0;
    //     sessionStorage.setItem('genCount', '0');
    //   },
    //   error: (err) => {
    //     this.isLoading = false;
    //     this._dialog.error(err?.error.message ?? JSON.stringify(err?.error));
    //   },
    // });
  }

  public checkEnoughPoint(price: any) {
    this._auth.data.subscribe((res: any) => {
      // Not display not enough coin for Unlimited user
      if (res.credits >= price || res.subscription == 'Unlimited') {
        this.isPointEnough = true;
        return;
      } else {
        this.isPointEnough = false;
        return;
      }
    });
  }

  calculatePoint() {
    let _isReadyDownloadAll = false;
    let _isReadyPlayAll = false;

    const initialSum = {
      paidPoint: 0,
    };

    const { paidPoint } = this.data.reduce(
      (sum: any, item: Block, index: number) => {
        if (item.category == 'soundtrack') {
          _isReadyPlayAll = true;

          if (!item.isDownload) {
            // if item has audio saved from workspace)
            if (item.isDownloaded) {
              // Do nothing
            } else {
              // พร้อมที่จะ download All
              _isReadyDownloadAll = true;
              const text_len = String(
                this._gfunc.replaceBetweenParentheses(item.text_read),
              ).replace(/\s/g, '').length;

              this.data[index].text_length = text_len;
              this.data[index].point = text_len;

              sum.paidPoint += text_len;
            }
          }
        }
        return sum;
      },
      initialSum,
    );

    this.totalPayPoint = paidPoint;
    this.isReadyDownloadAll = _isReadyDownloadAll;

    this.isReadyPlayAll = _isReadyPlayAll;

    this._tts.data.next(this.data);
  }

  onProgressPlay(current: number, during: number) {
    if (current && during) {
      return (current / during) * 100;
    }
    return 0;
  }

  numberWithCommas(x: string | unknown) {
    return !x
      ? 0
      : String(x)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  meltSoundtrack() {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].category == 'soundtrack') {
        this.data[i].isPlaying = false;

        if (!this.data[i].isDownload) {
          this.data[i].freeze = false;
        }
      }
    }
  }

  pauseAll() {
    this.isPlayAll = false;
    this.file.pause();
    this.bgFile.pause();

    this.meltSoundtrack();
  }

  playWordInSidebar(event: any) {
    // play from button in sidebar
    const text: string =
      event.srcElement.parentElement.parentElement.parentElement.children[1]
        .children[0].value;
    if (text.length > 0) {
      const temp: AudioDataAPI = {
        audio_id: generateID(),
        text: text,
        text_delay: text,
        speaker: '1',
        volume: '100',
        speed: '1',
        type_voice: 'wav',
      };
      this._tts.generateVoice(temp).subscribe((res: any) => {
        if (this.minusPlayQuota(text.length)) return;

        const audio = new Audio();
        audio.src = res.data;
        audio.play();
      });
    }
  }

  playHistoryInSidebar(event: string) {
    if (event.length > 0) {
      const temp: AudioDataAPI = {
        audio_id: generateID(),
        text: event,
        text_delay: event,
        speaker: '1',
        volume: '100',
        speed: '1',
        type_voice: 'wav',
      };
      this._tts.generateVoice(temp).subscribe((res: any) => {
        if (this.minusPlayQuota(event.length)) return;

        const audio = new Audio();
        audio.src = res.data;
        audio.play();
      });
    }
  }

  getIconSpeaker() {
    if (this.voiceSpeaker == '') {
      return;
    } else {
      setTimeout(() => {
        const sp = this.speakerIcon.filter(
          (s: any) => s.speaker_id == this.voiceSpeaker,
        );
        this.iconSpeaker = sp[0].face_image;
        this.nameSpeaker = sp[0].thai_name;
      }, 0);
    }
  }

  /** Minus user of play quota without negative number. */
  minusPlayQuota(number: number): boolean {
    /* If Unlimited package not minus play quota */
    if (this.user.subscription === 'Unlimited') return;

    /* Minus play quota here */
    const play_quota = Math.max(this.user.play_quota - number, 0);
    this.user.play_quota = play_quota;

    if (play_quota <= 0) {
      return true;
    }
    return false;
  }

  freezeSoundtrack() {
    this.data = this.data.map((item) =>
      item.category == 'soundtrack'
        ? {
            ...item,
            freeze: true,
          }
        : item,
    );
  }

  submitFormReplaceWord(data: Word[]) {
    // Variable for check exists old data
    let alreadyExists = false;

    // Compare history
    data.map((item: any, index: number) => {
      // ถ้าคำที่ผู้ใช้กรอกเข้ามา เป็นคำที่มีอยู่แล้ว ให้ update คำอ่าน
      const old_data = this.historyWord.find(
        (word: any) => word.before_text === item.before_text,
      );

      // ถ้ามีข้อมูลที่ต้อง update
      if (old_data) {
        // Has exists data
        alreadyExists = true;

        // ค้นหา คำเขียน จากข้อมูลใน form ที่ผู้ใช้กรอก เพื่อเอา คำเขียน คำอ่าน ไป update
        const word_update = data[index];

        // Setup request body
        const { user_id } = this._auth.getUserData();

        // Old data
        const old = {
          user_id,
          before_text: old_data.before_text,
          after_text: old_data.after_text,
        };

        // New data
        const editWord: any = {
          _id: old_data._id,
          before_text: word_update.before_text,
          after_text: word_update.after_text,
        };

        // Merge old and new data
        const temp = {
          old,
          new: editWord,
        };

        // แก้ไขข้อมูลในประวัติ sidebar
        this.historyWord = this.historyWord.map((word: any) =>
          word.before_text === word_update.before_text
            ? {
                ...word,
                after_text: word_update.after_text, //อัพเดตคำอ่าน
              }
            : word,
        );

        // ลบคำศัพท์นี้ออกจาก array ข้อมูลใหม่
        data = data.filter(
          (word: any) => word.before_text !== item.before_text,
        );

        // Service update word
        this._dictionary.editWordStore(temp).subscribe((res) => {});
      }
    });

    //เพิ่มคำศัพท์ใหม่เข้าไป
    this.historyWord = [...data, ...this.historyWord];
    this._dictionary.data.next([...this.historyWord]);

    /* Not found old data, insert it instead */
    if (!alreadyExists) {
      let temp = [];
      data.forEach((e) => {
        temp.push({
          before_text: e.before_text,
          after_text: e.after_text,
          date_time: new Date().toISOString(),
          isEdit: false,
          ref_id: generateID(),
          selected: false,
          _id: generateID(),
        });
      });
      this._dictionary.addWordStore(temp).subscribe((res: any) => {
        if (res) {
          ///******* show snackbar when success */
          this._snackBar.openFromComponent(AleartSuccessComponent, {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 3000,
          });
        }
      });
    }

    //highlight and update word ทั้งหน้าเว็บ
    this.addWordToDatabase(data);

    //เพิ่มคำอ่านผิดใน database
    this.updateSoundTrack(data);
  }

  addWordToDatabase(new_data_word: Word[]) {
    new_data_word = new_data_word.map((item: any) => ({
      ...item,
      date_time: new Date(),
    }));
  }

  async updateSoundTrack(new_data_word: Word[]) {
    for (let i = 0; i < this.data.length; i++) {
      //ถ้า block นั้น เป็น soundtrack
      if (this.data[i].category == 'soundtrack') {
        let text = this.data[i].text;
        const speaker = this.data[i].speaker;

        //วน loop ค้นหาว่าข้อความใน soundtrack นี้ มีคำเขียน ที่ผู้ใช้ป้อนเข้ามาใหม่หรือไม่ ?
        for (let j = 0; j < new_data_word.length; j++) {
          //ถ้าพบมีคำเขียน ที่ผู้ใช้ป้อนเข้ามาใหม่
          if (text.includes(new_data_word[j].before_text)) {
            let html_with_delay: any = String(this.data[i].text_with_delay);
            let id = String(this.data[i]._id);

            let { html, isReplace } = await highlight_fromArr(
              html_with_delay,
              this.historyWord,
            );
            html = html.replaceAll(
              'delay{',
              '<span contenteditable="false"><input value="',
            );
            html = html.replaceAll('}', '" type="text" ></span> ');
            const text_replace_with_delay = await highlight_fromArr(
              String(this.data[i].text_with_delay),
              this.historyWord,
            );
            const text_after = await highlight_fromArr(
              String(this.data[i].text),
              this.historyWord,
            );

            this.data[i].text_read_with_delay =
              text_replace_with_delay.soundtext;
            this.data[i].text_read = text_after.soundtext;
            this.data[i].isLoading = true;
            this.data[i].html = html;

            this._tts.loadingState.next(this.loadingState + 1);
            const temp: AudioDataAPI = {
              audio_id: this.data[i]._id,
              text: this.data[i].text,
              text_delay: this.data[i].text,
              speaker: this.data[i].speaker,
              volume: '100',
              speed: '1',
              type_voice: 'wav',
            };
            this._tts
              .generateVoice(temp)
              .pipe(
                catchError((err) => {
                  this.data[i].isLoading = false;

                  this._tts.loadingState.next(this.loadingState - 1);
                  this._dialog.error(
                    err?.error.message ?? JSON.stringify(err?.error),
                  );
                  return throwError(err);
                }),
              )
              .subscribe((file: any) => {
                if (this.minusPlayQuota(temp.text.length)) return;
                this._tts.loadingState.next(this.loadingState - 1);

                this._generate.setfileStorage(
                  String(text_replace_with_delay.soundtext),
                  speaker,
                  file,
                  id,
                );
                this.data[i].isLoading = false;
              });

            break;
          }
        }
      }
    }
  }

  triggerdropdown(attr: DropdownAttribute) {
    let index = attr.index;
    if (
      (this.showdropdown && this.indexnowSetting == index) ||
      !this.showdropdown
    ) {
      this.showdropdown = this.showdropdown ? false : true;
    }
    /* default left is 76px */

    this.dropdownAttr.left = attr.left + 0;
    /* default top is 162px */
    /* default top is 194px */
    /* default top is -33px */
    this.dropdownAttr.top = attr.top + 106;
    this.indexnowSetting = index;
  }

  onChangeSpeaker(speakerId: string) {
    this.data[this.indexnowSetting].speaker = speakerId;
    this.showdropdown = false;
  }

  onDel(i: any) {
    if (this.data[this.indexnowSetting].speaker == i) {
      this.data[this.indexnowSetting].speaker = undefined;
    }
  }

  onWheel(event: WheelEvent): void {
    if (this.showdropdown) {
      this.showdropdown = false;
    }
  }

  toggleLoading(event: boolean) {
    this.isLoading = event;
  }

  getWarning() {
    this.hideWarning =
      sessionStorage.getItem('hide_warning') === 'true' ? true : false;
  }

  closeWarning() {
    this.hideWarning = true;
    sessionStorage.setItem('hide_warning', 'true');
  }

  downloadFileHelper(url: string, filename: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  setEditData(index: number) {
    this.data[index].isDownloaded = false;
  }

  deleteS3(data: any) {
    this._download.deleteBox(data.file).subscribe({
      next: (res) => {},
      error: (err) => {
        console.log(err);
      },
    });
    this._workspace.setSave(false);
  }

  ngOnDestroy(): void {
    this.file.pause(); // Pause audio
    this.bgFile.pause();

    this.data = this.data.map((item: Block) =>
      item.category === 'soundtrack'
        ? {
            ...item,
            isPlaying: false,
            isSetting: false,
            isEdit: false,
          }
        : item,
    );
    this._tts.data.next(this.data);
  }
}
