import { Component, HostListener, OnInit } from '@angular/core';
import * as levenshtein from 'fast-levenshtein';
import { BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RecordServiceService } from 'src/app/payment/services/record-service.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogService } from 'src/app/dialog/services/dialog.service';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { UserAgentService } from 'src/app/shared/services/user-agent.service';
import { AudioRecordService } from '../../services/audio-record.service';
import { RecordApiService } from '../../services/record-api.service';
import { language } from 'src/app/shared/change_language/language';
import { UserData } from 'src/app/auth/models/auth-model';
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-record-voice',
  templateUrl: './record-voice.component.html',
  styleUrls: ['./record-voice.component.css'],
})
export class RecordVoiceComponent implements OnInit {
  userid = new BehaviorSubject('')
  isRecording = false;
  hasChange = false
  recordedTime;
  compareText: number
  readingtext: string;
  readingSubText: string = null
  textCounter: number = 0;
  counter: number = 0;
  audio = new Audio()
  isAudioSending = false;
  audioBlob
  audioTitle
  audioBtye
  /* speech recognition vars  */
  recognizer
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords;
  blobUrl
  /* scoring */
  score = 0
  displayScore: number = 0
  norm_x: number
  totalCounter: number = 0
  readingtextCounter:number = 0
  count
  totalText = []
  totalSubText = []
  totalTid = []

  readingTid
  masterText: string = ''
  score2audio
  scoreList = []
  isOutOfText = false
  /* svg */
  icon = '../assets/figma/text2speech/icon'
  iconSvg = '../assets/figma/text2speech/icon/svg'
  micIcon = this.iconSvg + '/microphone2-icon.png'
  minimicIcon = this.iconSvg + '/mini-microphone-icon.svg'
  stopIcon = this.iconSvg + '/stop-icon.png'
  blob: Blob
  catagoryType: string
  isLoadNewText = false
  userProgress = 0
  selectedCategory = ""
  isNoText = false
  getTextType: string
  categories : Array<string>

  isloadingWord = false
  isloadingCategory = false
  isIOS = false
  isMobile = false
  isAudioExist = false
  userData: UserData = null
  isTTSErr = false
  number = 0
  isPointChangeShow = false

  /* default is th-TH */
  languageLists = {
    "TH": "th-TH",
    "EN": "en-US",
    "JP": "ja",
    "CN": "zh-CN",
    "Myan": "ysm",
    "VN": "vi",
    "Bahasa": "id",
    "Lao": "lao",
  }

//#-----------------------------[Change Language]--------------------------------#

  public record_point = ['พอยท์จากการอัดเสียง','PT'];
  public next = 'ข้าม';
  public record_contain = ['อ่าน','จำนวนครั้งที่อ่าน','ครั้ง'];
  public read_again = 'อ่านใหม่อีกครั้ง';
  public sent_audio = 'ส่งไฟล์เสียง';
  public play_audio = 'เล่นเสียง';
  public err_redirect = {
      text_press_putMicrophoneBT : 'กดปุ่มไมค์เพื่ออ่านข้อความดังกล่าว',
      can_use_on_Chrome : 'ขณะนี้ระบบอัดเสียงรองรับเพียงบราวเซอร์ Chrome ขออภัยในความไม่สะดวก',
      wordOut : 'ข้อความหมดแล้ว',
      err_type_text : 'หมวดหมู่นี้ ยังไม่มีข้อความ',
  }

//#-----------------------------[Change Language]--------------------------------#


  constructor(
    private _audioRecord: AudioRecordService,
    private _record: RecordServiceService,
    private _auth: AuthService,
    private _agent: UserAgentService,
    private _recordApi: RecordApiService,
    private _alert: DialogService,
    private _changeLanguage:ChangeLanguageService,
  ) {

    this.isIOS = this._agent.getIOS()
    this.isMobile = this._agent.getAgent()
    try {
      this.recognizer = new webkitSpeechRecognition()
    } catch (err) {
      this.isTTSErr = true
    }
    if(!this.isTTSErr){
      this._record.userProgress.subscribe(
        userProgress => {
          this.userProgress = userProgress
        }
      )
    }
  }

  ngDoCheck(): void {
    this.totalCounter = this._record.counter
    this.displayScore = this._record.score
  }


  ngOnInit(): void {
    this._changeLanguage.language.subscribe(
      res => {
        if (res){
          this.dataappInfo = language[res].walletObj.record_voice
          this.getdataInfo();
        }
      }
    )
    if(!this.isTTSErr){
      this._auth.data.subscribe(
        res => {
          if(res) {
            this.userData = res

            if(this.userid.getValue() != res.user_id){
              this.userid.next(res.user_id)
            }
          }

          if(this.number == 0) {
            this.number = JSON.parse(JSON.stringify(this.userData.credits))
          }
        }
      )

      this.userid.subscribe(
        userid => {
          if(userid == '') return
          this.getDb(userid)
        }
      )

      this._record.categories.subscribe(res => {
        if(res == '') return
        setTimeout(() => { //for wait data load
          this.randomOriginText(res)
        }, 0);
        this.catagoryType = res
        //add EN categories
        /* list of lang -> https://r12a.github.io/app-subtags/ */
        /* more info -> https://stackoverflow.com/questions/14257598/what-are-language-codes-in-chromes-implementation-of-the-html5-speech-recogniti */
        const lang = Object.keys(this.languageLists).find(e => res.includes(e))

        // Handle anothercase
        this.recognizer.lang = this.languageLists[lang] ? this.languageLists[lang] : "th-TH";

      })

      this._audioRecord.recordingFailed().subscribe(() => {
        this.isRecording = false;
      });

      this._audioRecord.getRecordedTime().subscribe((time) => {
        this.recordedTime = time;
      });

      this._audioRecord.getRecordedBlob().subscribe((data) => {
        this.blobUrl = URL.createObjectURL(data.blob)
        this.blob = data.blob
        this.audio.src = this.blobUrl
        this.audio.load()
        this.audioTitle = data.title
        this.audioBlob = data.blob

      });



      if(!this.isMobile){
        this.recognizer.continuous = true;
        this.recognizer.interimResults = false;
        this.recognizer.addEventListener('result', (e) => {
          const transcript = Array.from<any>(e.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join('');
          this.text = transcript;
          this.compare(this.masterText, this.text)
        });

        this.recognizer.addEventListener('error', (e) => {
          console.log(e)
        });
        this.recognizer.addEventListener('end', (condition) => {
            this.recognizer.abort()
          }
        );
      }
    }

  }


  detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }

  onChangeCategory(event){
    this.getScore(this.userid.getValue(),event.value)
    this.resetAudio()
  }

  getScore(userid:string,collection:string){
    this._recordApi.getScore(userid,collection).subscribe(
      res => {
        const data = res.response
        this._record.inputCatagoryType(collection)
        this.isloadingCategory = false
        this._record.updateScoreCounter(data.score,data.count)
      }
    )
  }

  getDb(userid:string){
    this.isloadingCategory = true
    this._recordApi.getDb().subscribe(
      res => {
        if(res){
          this.categories = res.response.db_list
          this.selectedCategory = this.categories[0]
          this.getScore(userid,this.selectedCategory)
        }

      }
    )
  }

  compare(master, user) {
    const masterText = master.replace(/\s/g, '').toLowerCase()
    const userText = user.replace(/\s/g, '').toLowerCase()
    this.compareText = levenshtein.get(masterText, userText);
    this.normalization(this.compareText, masterText)
    this.scoring(this.score2audio)
  }

  normalization(x, userText) {
    this.score2audio = x / userText.length
  }

  scoring(x) {
    if (x <= 0.1) {
      this.score += 2
    }
    else if (x <= 0.5) {
      this.score += 1
    }
  }

  playAudio(){
    try {
      this.audio.play()
    } catch (error) {
      console.log(error);
    }
  }

  resetAudio(){
    try {
      this.audioBlob = null;
      this.audioTitle = null;
      this.blobUrl = null;
      this.isAudioExist = false

      // this.audio.load()
      this.audio.src = '';
    } catch (error) {
      console.log(error);

    }
  }

  sendAudio(){
    if(this.audioBlob){
      this.isAudioSending = false ;
      this.waitpassData(this.audioBlob,this.audioTitle)
      this.resetAudio()
    }
  }

  startRecording(): void {
    /* for ios block */
    // if(this.isIOS) return this._alert.microphoneNotSupportIOS()

    setTimeout(() => {
      if (!this.isRecording) {
        // this._agent.getAgent()
        if(!this._agent.getAgent()){
          this.recognizer.start();
        }
        this.isAudioExist = false
        this.isRecording = true;

        this._audioRecord.startRecording();
      }
    }, 0);
  }

  stopRecording(): void {
    setTimeout(() => {
      if (this.isRecording) {
        if(!this._agent.getAgent()){
          this.recognizer.stop();
          this.wordConcat()
        }
        this.isRecording = false;

        this.isAudioExist = true
        this._audioRecord.stopRecording();
        this.totalCounter += 1
        this.masterText = this.readingtext
        }
    }, 500);
  }

  wordConcat() {
    this.text = this.text + ' ' + this.tempWords + '.';
    this.tempWords = '';
  }

  randomOriginText(type) {
    this.isLoadNewText = false
    if(this.userid.getValue() == '' || type == '') return
    this._recordApi.getText(type, this.userid.getValue()).subscribe(
      data => {
        const res = data.response

        if(data.message === 'You have no more records left!') {
          return this.NoText()
        } else {
          this.isOutOfText = false

          if(res.sub_text){
            this.totalSubText = res.sub_text
            this.readingSubText = this.totalSubText[0]
          } else {
            this.totalSubText = []
            this.readingSubText = null
          }
          this.totalTid = res.tid
          this.totalText = res.text

          this.readingTid = this.totalTid[0]
          this.readingtext = this.totalText[0]

          if(this.readingtext == this.err_redirect.err_type_text){
            this.isNoText = true
          } else {
            this.isNoText = false
          }
        }
      }
    )
  }

  NoText() {
    this.isOutOfText = true
    this.readingSubText = null
    this.readingtext = this.err_redirect.wordOut // ข้อความหมดแล้ว
  }

  @HostListener('window:beforeunload', ['$event'])
  doSomething($event) {
    if(this.hasChange){
      // this._alert.warningAlert('ระบบกำลังบันทึกไฟล์เสียงของคุณ หากปิดเว็บไซต์หรือ Refresh หน้าเว็บ ไฟล์เสียงจะเสียหาย')
      $event.preventDefault();
      $event.returnValue = true;
      delete $event['returnValue'];
    }
  }

  randomText(btnClick:boolean) { //skip text
    if(btnClick){
      this._recordApi.skip(this.userid.getValue(),this.readingTid,this.catagoryType).subscribe()
    }
    if(this.getTextType == 'finish'){
      this.readingtext = this.err_redirect.wordOut // ข้อความหมดแล้ว
    } else {
      if(this.readingtextCounter >= this.totalText.length-1){
        this.isLoadNewText = true
        this.resetTextandTID()
        setTimeout(() => {
          this.randomOriginText(this.catagoryType)
        }, 1000);
        this.readingtextCounter = 0
      } else {
        this.isLoadNewText = false
        let counter = this.readingtextCounter += 1
        this.readingTid = this.totalTid[counter]
        this.readingtext = this.totalText[counter]
        this.readingSubText = this.totalSubText[counter]
        this.resetAudio()
      }
    }

  }

  resetTextandTID(){

    this.totalText = []
    this.totalTid = []
    this.totalSubText = []
    this.readingtext = 'Loading...'
    this.readingTid = ''
    this.readingSubText = null
  }

  async waitpassData(x, y) {
    await setTimeout(() => {
      this.passData(x, y)
    }, 1000);
  }

  isAPISending = false

  bodyData(audio, title){
    this.text = this.text.trim()

    if(this.text.includes('undefined')) {
      this.text = ''
    }
    const form = new FormData()
    if(this.isMobile){
      form.append('device','Mobile')
    } else {
      let strDist = String(this.score2audio)
      let strScore = String(this.score)
      if(strDist.includes('undefined')) {
        strDist = '0'
        strScore = '0'
      }

      form.append('usertext',this.text)
      form.append('score',strScore)
      form.append('dist',strDist)
    }
    form.append('audio', audio)
    form.append('text',this.masterText)
    form.append('title',title)
    form.append('userid',this.userid.getValue())
    form.append('db_name',this.catagoryType)
    form.append('tid',this.readingTid)
    form.append('picture','')
    //reset data
    this.masterText = ''
    this.score = 0

    return form
  }

  passData(audio, title) {
    //refresh while pass audio to back-end
    this.hasChange = true
    this._record.addScoreCounter(this.score, 1)
    //add userProgress
    this._record.userProgress.next(this.userProgress+1)
    //get Form Data
    const form = this.bodyData(audio, title)
    //reset text
    if(this.readingtextCounter >= this.totalText.length-1){
      this.resetTextandTID()
    }

    this._recordApi.sendAudio(form)
    .pipe(
      map(response => response),
      catchError(error => {
        // this._alert.errorAlert('Something went wrong, please try again.')
        return error
      })
    )
    .subscribe(
      res => {

        if(this.readingtextCounter >= this.totalText.length-1){
          this.readingtextCounter = 0
          this.randomOriginText(this.catagoryType)
        }
        const data = res.response
        if(this.isMobile) { //mobile add score
          this._record.score += data.score
        }

        /* point change */

        this.isPointChangeShow = true
        // const pointChange = setInterval(() => {
        //   this.number++

        //   if(this.number == data.credits){
        //     clearInterval(pointChange)
        //   }
        // },100)

        if(data?.credits) {
          Object.assign(this.userData, { credits: data.credits })
          this._auth.data.next(this.userData)
        }

        this.hasChange = false

      }
    );

    if(this.readingtextCounter < this.totalText.length-1){
      this.randomText(false)
    }
  }

  dataappInfo = null;


  getdataInfo(){
    this.record_point =   this.dataappInfo.record_point;
    this.next =           this.dataappInfo.next;
    this.record_contain = this.dataappInfo.record_contain;
    this.read_again =     this.dataappInfo.read_again;
    this.sent_audio =     this.dataappInfo.sent_audio;
    this.play_audio =     this.dataappInfo.play_audio;
    this.err_redirect =   this.dataappInfo.err_redirect;
  }


}
