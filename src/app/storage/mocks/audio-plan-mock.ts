import { AudioPlanObj } from "../models/audio-plan-model";

export const audioPlanObj: AudioPlanObj[] = [{
  title: 'ฟรี',
  image: 'free',
  size: '100 MB',
  lists: [
    'พื้นที่เก็บข้อมูลขนาด 100 MB',
  ],
  price: {
    monthly: 'แพ็กเกจปัจจุบัน',
    yearly: 'แพ็กเกจปัจจุบัน'
  }
},
{
  title: 'พื้นฐาน',
  image: 'basic',
  size: '1 GB',
  lists: [
    'พื้นที่เก็บข้อมูลขนาด 1 GB',
    'ได้รับ 250 พอยท์ / เดือน',
  ],
  price: {
    monthly: '50 บาท / เดือน',
    yearly: '500 บาท / ปี'
  }
},
{
  title: 'มาตรฐาน',
  image: 'standard',
  size: '10 GB',
  lists: [
    'พื้นที่เก็บข้อมูลขนาด 10 GB',
    'ได้รับ 1,000 พอยท์ / เดือน',
  ],
  price: {
    monthly: '150 บาท / เดือน',
    yearly: '1,500 บาท / ปี'
  }
},
{
  title: 'พรีเมียม',
  image: 'premium',
  size: '100 GB',
  lists: [
    'พื้นที่เก็บข้อมูลขนาด 100 GB',
    'ได้รับ 4,000 พอยท์ / เดือน',
  ],
  price: {
    monthly: '500 บาท / เดือน',
    yearly: '5,000 บาท / ปี'
  }
}]

