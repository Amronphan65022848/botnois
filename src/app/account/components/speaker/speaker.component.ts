import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackbarObj } from 'src/app/dialog/mocks/dialog-mock';
import { SpeakerInviteComponent } from './speaker-invite/speaker-invite.component';
import { SpeakerPriceComponent } from './speaker-price/speaker-price.component';

@Component({
  selector: 'app-speaker',
  templateUrl: './speaker.component.html',
  styleUrls: ['./speaker.component.scss']
})
export class SpeakerComponent implements OnInit {

  text = {
    title: "จัดการเสียงพากย์",
    button: {
      invite: 'เพิ่ม / ลบ / บล็อคผู้ใช้เสียง',
      history: 'ประวัติการใช้เสียง'
    },
    table: {
      thead: ["ครั้งที่","ข้อความ","ประเภท","วัน / เดือน / ปี","UID"]
    },
    price: {
      text: 'ราคาเสียง ',
      list: [1,2,3,4,5,10]
    }
  }

  speaker_list = [
    {
      image: 'https://yt3.ggpht.com/ep7q2Pohq4dNV12-WB4Y1glnjzrwfPl4GlSl-tH1MziPGnw40xAJG5fTd9usdb-R6gmNgMK3=s88-c-k-c0x00ffffff-no-rj',
      name: 'speaker_1'
    },
    {
      image: 'https://yt3.ggpht.com/ep7q2Pohq4dNV12-WB4Y1glnjzrwfPl4GlSl-tH1MziPGnw40xAJG5fTd9usdb-R6gmNgMK3=s88-c-k-c0x00ffffff-no-rj',
      name: 'speaker_2'
    },
    {
      image: 'https://yt3.ggpht.com/ep7q2Pohq4dNV12-WB4Y1glnjzrwfPl4GlSl-tH1MziPGnw40xAJG5fTd9usdb-R6gmNgMK3=s88-c-k-c0x00ffffff-no-rj',
      name: 'speaker_3'
    },
  ]

  speaker_table = [
    {
      text: "ใครกำลังเจอปัญหาส้นเท้าแตก นี้เลยผลิตภัณฑ์ดูแลผิว ช่วยบำรุงฟื้นฟูผิว ให้กลับมาดีขึ้นภายใน 7 วัน รับประกันหายขาดแน่นอนค่ะ ตอนนี้ทางร้านจัดโปรพิเศษ ราคาเพียง 150 บาท ส่งฟรี มีเก็บเงินปลายทาง สนใจสั่งซื้อทักแชทได้เลยค่ะ",
      channel: "download",
      date: "2023-02-08 14:15:23",
      uid: "1c0660cb-79e1-5b6e-a9e3-006912a7320c",
    },
    {
      text: "สอดแทรกคุณนะธัมก่อนเข้าสู่บทเรียน",
      channel: "play",
      date: "2023-02-08 14:15:23",
      uid: "1c0660cb-79e1-5b6e-a9e3-006912a7320c",
    },
    {
      text: "ใครกำลังเจอปัญหาส้นเท้าแตก นี้เลยผลิตภัณฑ์ดูแลผิว ช่วยบำรุงฟื้นฟูผิว ให้กลับมาดีขึ้นภายใน 7 วัน รับประกันหายขาดแน่นอนค่ะ ตอนนี้ทางร้านจัดโปรพิเศษ ราคาเพียง 150 บาท ส่งฟรี มีเก็บเงินปลายทาง สนใจสั่งซื้อทักแชทได้เลยค่ะ",
      channel: "api",
      date: "2023-02-08 14:15:23",
      uid: "1c0660cb-79e1-5b6e-a9e3-006912a7320c",
    },
  ]

  price = 1

  speaker = this.speaker_list[0]

  openHistory = false


  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {

  }
  /* Open speaker invite dialog */
  openInvite(){
    this.dialog.open(SpeakerInviteComponent,{
      width: "400px",
      height: "70%",
    })
  }

  /* Choose speaker by index number and navigate user to control panel page */
  onChooseSpeaker(i: number){
    this.speaker = this.speaker_list[i]
  }

  /* Open edit price dialog */
  onEditPrice(){
    const ref = this.dialog.open(SpeakerPriceComponent,{
      height: '20%',
      width: '400px',
    })
    ref.afterClosed().subscribe(
      res => {
        if(typeof res === 'number') {
          this.price = res;
          this.snackbar.open("อัพเดทสำเร็จ","", snackbarObj.success)
        }
      }
    )
  }

  /* Open and hide speaker history table */
  toggleHistory(){
    this.openHistory = !this.openHistory
  }

}
