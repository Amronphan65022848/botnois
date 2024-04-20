import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { SpeakerService } from 'src/app/shared/services/speaker.service';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';
import { ComponentQueueService } from '../../services/component-queue.service';

@Component({
  selector: 'app-sound-sample-v3',
  templateUrl: './sound-sample-v3.component.html',
  styleUrls: ['./sound-sample-v3.component.scss']
})
export class SoundSampleV3Component implements OnInit, OnDestroy{
  public malespeaker:any = []
  public femalespeaker:any = []
  public allspeaker:any = []

  //style top desktop
  public toparray = [124, 48, 110, 126, 82, 48, 110]
  /* bottom array */
  public bottomarray = [60, 40, 110, 60, 102, 60, 76]
  //style mobile status
  public focussoundindex = 0;


  //audio status
  public audiotime = 0;
  public audio = new Audio;
  public nowhover = -1;
  public nowplay = -1;
  public nowaudioplay = -1;
  public soundcolumn = Array.from(Array(45).keys());
  public progress_array: String[] = [];
  public nowsoundplay = "";

//#-----------------------------[Change Language]--------------------------------#

  // public heading_text_h2 = 'ฟังตัวอย่างเสียงที่เนียนสมจริง';
  // public heading_text_p = 'จาก Botnoi Voice';
  // public maleSpeker_List = ['นายเบรด', 'สโม๊ค', 'อลัน', 'อาวอร์ม', 'เท็ดดี้', 'คริส', 'ผู้ใหญ่ลี'];
  // public femaleSpeaker_List = ['วนิลา', 'ไซเรน', 'ข้าวตอก', 'เอวา', 'นาเดียร์', 'อาจารย์หลิน', 'โบ'];
  // public allSpeaker_List = ['นายเบรด', 'สโม๊ค', 'อลัน', 'อาวอร์ม', 'เท็ดดี้', 'คริส', 'ผู้ใหญ่ลี','วนิลา', 'ไซเรน', 'ข้าวตอก', 'เอวา', 'นาเดียร์', 'อาจารย์หลิน', 'โบ'];
  // public anotherVoiceover = 'ดูเสียงพากย์อื่นๆ เพิ่มเติม';


//#-----------------------------[Change Language]--------------------------------#

  constructor(
    private router: Router,
    private _speaker: SpeakerService,
    private _changeLanguage:ChangeLanguageService,
    private _compontentQueue: ComponentQueueService,
  ) {
    for(let i=0; i<45; i++){
      this.progress_array.push('2');
    }
  }

  ngOnInit(): void {
    this.getSpeakers()
    this._changeLanguage.language.subscribe(
      res => {
        if (res){
          this.get_dataChangeLanguage(res)
        }
      }
    )
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      this._compontentQueue.$componentsLoaded.next(3)
    }, 3000);
  }

  getSpeakers(){
    this._speaker.$speaker.subscribe(
      speaker => {

        if(speaker){
          for(let s of speaker){

            if(['นายเบรด', 'สโม๊ค', 'อลัน', 'อาวอร์ม', 'เท็ดดี้', 'คริส', 'ผู้ใหญ่ลี'].includes(s.thai_name)){
              this.malespeaker.push(s)
              this.allspeaker.push(s)
            }
            else if(['วนิลา', 'ไซเรน', 'ข้าวตอก', 'เอวา', 'นาเดียร์', 'อาจารย์หลิน', 'โบ'].includes(s.thai_name)){
              this.femalespeaker.push(s)
              this.allspeaker.push(s)
            }
          }
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.audio.pause();
    this.nowaudioplay = -1;
  }

  hover(index:number){
    this.nowhover = index;
  }
  mouseout(){
    this.nowhover = -1;
  }

  //sound desktop
  playsound(audioURL:string, index:number){
    if(this.nowsoundplay != audioURL){
      this.audio.src = audioURL;
      this.nowsoundplay = audioURL;
    }
    this.focussoundindex = this.allspeaker.findIndex(e => e.audio == audioURL);
    this.audio.play();
    this.nowplay = index;
    this.nowaudioplay = index;

    this.audio.addEventListener("timeupdate", () => {
      this.audiotime = this.audio.currentTime / this.audio.duration * 45;
      for(let i=0; i<45; i++) this.progress_array[i] = String(Math.floor(Math.random() * 30));
    });
    this.audio.addEventListener("ended", () => {
      this.stopsound();
      this.nowsoundplay = ""
    });
  }
  stopsound(){
    this.nowaudioplay = -1;
    this.audio.pause();

    setTimeout(() => {
      for(let i=0; i<45; i++) this.progress_array[i] = '2';
    }, 100);
  }

  //sound moblie
  playsoundMoblie(){
    this.playsound(this.allspeaker[this.focussoundindex].audio, this.focussoundindex);
  }

  carouselBack(){
    this.stopsound()
    this.focussoundindex = this.focussoundindex-1<0 ? 13 : this.focussoundindex-1;
  }
  carouselForward(){
    this.stopsound()
    this.focussoundindex = (this.focussoundindex+1)%14;
  }

  checkRouter(path:any){
    let element = document.querySelector('.navbar') as HTMLElement;
    if(path != ('')){
      element.classList.add('navbar-to');
    } else {
      element.classList.remove('navbar-to')
    }
  }

  goto_selectVoice(path:string){
    this.checkRouter(path);
		this.router.navigate(['/'+path]);
	}

  text = TH.landingPageObj;

  get_dataChangeLanguage(temp: any){
    if(temp == 'TH'){
      this.text = TH.landingPageObj;
    }
    else if (temp == 'EN'){
      this.text = EN.landingPageObj;
    }
  }

}
