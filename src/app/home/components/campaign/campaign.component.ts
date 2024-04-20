import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { EN } from 'src/app/shared/change_language/EN';
import { TH } from 'src/app/shared/change_language/TH';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { UserAgentService } from 'src/app/shared/services/user-agent.service';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit {


  //#-----------------------------[Change Language]--------------------------------#

  // public description1 = "BOTNOI Voice เป็น AI ที่สามารถใช้แปลงข้อความเป็นเสียง เหมาะสำหรับครู อาจารย์ ที่จะนำไปใช้ทำสื่อการเรียนการสอน ทีมงาน BOTNOI เล็งเห็นความสำคัญในการสร้าง";
  // public description2 = "สื่อการเรียนการสอนยุคใหม่ จึงจัดตั้งโครงการนี้ขึ้นเพื่อให้ครูอาจารย์ได้ใช้ AI นี้ในการทำสื่อการเรียนการสอน";
  // public seemoreWorkshop = "สามารถดูผลงานตัวอย่าง ได้ที่";
  // public textli = [
  //   "Point เริ่มต้นเมื่อสมัคร = 100 points",
  //   "เมื่อเข้ากลุ่มและกรอกข้อมูลแล้ว ทุกวันระบบจะทำการเช็ค ถ้า Point ต่ำกว่า 500 points ระบบจะเติมให้อัตโนมัติ +10,000 points",
  //   "ครูอาจารย์ที่มี account อยู่แล้วและมี point มากกว่า 500, เมื่อ point ต่ำกว่า 500 pts, ระบบจะทำการเติมให้",
  //   "เมื่อทำคลิปวิดีโอลงบน Social รบกวนติด #BotnoiVoice #teacherXbotnoivoice",
  //   "ผลงานใครน่าสนใจลุ้นเป็น Partner กับทางบอทน้อย!",
  // ]
  // public conditionTopic = "เงื่อนไขในการเข้าร่วม";
  // public warning = "Credit ที่ให้สำหรับการสร้างสื่อการเรียนการสอนเท่านั้น หากพบเจอว่านำไปใช้ทำอย่างอื่น ขอสงวนสิทธิ์ไม่ให้ Credit เพิ่ม";
  // public contact = [
  //   "หากคุณครูหรืออาจารย์ ท่านไหนสนใจสามารถกดลิงค์นี้ เพื่อเข้ากลุ่ม Open Chat  หรือ สแกน Qr Code ด้านล่าง",
  //   "ลิงค์เข้าร่วม",
  // ];

  //#-----------------------------[Change Language]--------------------------------#

  constructor(
    private _changelanguage : ChangeLanguageService
  ) { }
  isExpanded = false
  ngOnInit(): void {
    this._changelanguage.language.subscribe((res)=>{
      if(res){
        this.get_dataChangelanguage(res);
      }
    })
  }


  redirect(){
    window.open('https://forms.gle/GvQ65tE1zvm3e1hd8','_blank')
  }

  downloadBotnoiVoiceLogo(){
    saveAs('../../../assets/main_page_img/campaign/botnoi-voice-logo.png','botnoi-voice-logo.png')
  }

  text = TH.campaignObj;

  get_dataChangelanguage(temp:any){
    if(temp == 'TH'){
      this.text = TH.campaignObj;
    }
    else if (temp == 'EN'){
      this.text = EN.campaignObj;
    }
  }

}
