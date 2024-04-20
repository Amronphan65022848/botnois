const currency = {
  thb: 'บาท',
  usd: 'USD',
}

const inputPoint = {
  input: 'ระบุจำนวนพอยท์',
  point: 'พ้อยท์',
  currency,
}

const usagePriceOnLandingPage = {
  box1: {
    title: [
      'สร้างเสียงได้ในราคาเริ่มต้น',
      [1, ' / 40 ตัวอักษร'],
      ['(เฉลี่ย ', 10, ' / 1 นาที)'],
    ],
    btn: 'ซื้อพ้อยท์',
    paper: ['แปลงข้อความ', '1 A4 (1,600 ตัวอักษร)', ['≈ ', 40]],
    social: ['ทำคลิปลง TikTok', '30 วินาที (250 ตัวอักษร)', ['≈ ', 6]],
    media: ['ทำคลิปเล่าหนัง', '15 นาที (7,500 ตัวอักษร)', ['≈ ', 185]],
  },
  box2: {
    title: ['ยิ่งซื้อมาก ยิ่งถูกมาก', 'ลดสูงสุดมากกว่า 40%'],
    btn: 'ดูรายละเอียดเพิ่มเติม',
  },
}


export const sub = {
  inputPoint,
  currency,
  usagePriceOnLandingPage
}
