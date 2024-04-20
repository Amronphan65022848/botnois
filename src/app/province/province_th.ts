// https://th.wikipedia.org/wiki/จังหวัดของประเทศไทย
// 77 จังหวัด
const province_th = [
  'กรุงเทพฯ',
  'กระบี่',
  'กาญจนบุรี',
  'กาฬสินธุ์',
  'กำแพงเพชร',
  'ขอนแก่น',
  'จันทบุรี',
  'ฉะเชิงเทรา',
  'ชลบุรี',
  'ชัยนาท',
  'ชัยภูมิ',
  'ชุมพร',
  'เชียงใหม่',
  'เชียงราย',
  'ตรัง',
  'ตราด',
  'ตาก',
  'นครนายก',
  'นครปฐม',
  'นครพนม',
  'นครราชสีมา',
  'นครศรีธรรมราช',
  'นครสวรรค์',
  'นนทบุรี',
  'นราธิวาส',
  'น่าน',
  'บึงกาฬ',
  'บุรีรัมย์',
  'ปทุมธานี',
  'ประจวบคีรีขันธ์',
  'ปราจีนบุรี',
  'ปัตตานี',
  'พระนครศรีอยุธยา',
  'พะเยา',
  'พังงา',
  'พัทลุง',
  'พิจิตร',
  'พิษณุโลก',
  'เพชรบุรี',
  'เพชรบูรณ์',
  'แพร่',
  'ภูเก็ต',
  'มหาสารคาม',
  'มุกดาหาร',
  'แม่ฮ่องสอน',
  'ยโสธร',
  'ยะลา',
  'ร้อยเอ็ด',
  'ระนอง',
  'ระยอง',
  'ราชบุรี',
  'ลพบุรี',
  'ลำปาง',
  'ลำพูน',
  'เลย',
  'ศรีสะเกษ',
  'สกลนคร',
  'สงขลา',
  'สตูล',
  'สมุทรปราการ',
  'สมุทรสงคราม',
  'สมุทรสาคร',
  'สระแก้ว',
  'สระบุรี',
  'สิงห์บุรี',
  'สุโขทัย',
  'สุพรรณบุรี',
  'สุราษฎร์ธานี',
  'สุรินทร์',
  'หนองคาย',
  'หนองบัวลำภู',
  'อ่างทอง',
  'อำนาจเจริญ',
  'อุดรธานี',
  'อุตรดิตถ์',
  'อุทัยธานี',
  'อุบลราชธานี',
];

const province_en = [
  "Amnatcharoen",
  "Angthong",
  "Ayutthaya",
  "Bangkok",
  "Betong",
  "Buriram",
  "Chachoengsao",
  "Chainat",
  "Chaiyaphum",
  "Chanthaburi",
  "Chiangmai",
  "Chiangrai",
  "Chonburi",
  "Chumphon",
  "Kalasin",
  "Kamphaengphet",
  "Kanchanaburi",
  "Khonkaen",
  "Krabi",
  "Lampang",
  "Lamphun",
  "Loei",
  "Lopburi",
  "Maehongson",
  "Mahasarakham",
  "Mukdahan",
  "Nakhonnayok",
  "Nakhonpathom",
  "Nakhonphanom",
  "Nakhonratchasima",
  "Nakhonsawan",
  "Nakhonsithammarat",
  "Nan",
  "Narathiwat",
  "Nongbualamphu",
  "Nongkhai",
  "Nonthaburi",
  "Pathumthani",
  "Pattani",
  "Phangnga",
  "Phatthalung",
  "Phayao",
  "Phetchabun",
  "Phetchaburi",
  "Phichit",
  "Phitsanulok",
  "Phrae",
  "Phuket",
  "Prachinburi",
  "Prachuapkhirikhan",
  "Ranong",
  "Ratchaburi",
  "Rayong",
  "Roiet",
  "Sakaeo",
  "Sakonnakhon",
  "Samutprakan",
  "Samutsakhon",
  "Samutsongkhram",
  "Saraburi",
  "Satun",
  "Singburi",
  "Sisaket",
  "Songkhla",
  "Sukhothai",
  "Suphanburi",
  "Suratthani",
  "Surin",
  "Tak",
  "Trang",
  "Trat",
  "Ubonratchathani",
  "Udonthani",
  "Uthaithani",
  "Uttaradit",
  "Yala",
  "Yasothon"
]

const province_th_map = {
  'krabi': 'กระบี่',
  'bangkok': 'กรุงเทพมหานคร',
  'kanchanaburi': 'กาญจนบุรี',
  'kalasin': 'กาฬสินธุ์',
  'kamphaengphet': 'กำแพงเพชร',
  'khonkaen': 'ขอนแก่น',
  'chanthaburi': 'จันทบุรี',
  'chachoengsao': 'ฉะเชิงเทรา',
  'chonburi': 'ชลบุรี',
  'chainat': 'ชัยนาท',
  'chaiyaphum': 'ชัยภูมิ',
  'chumphon': 'ชุมพร',
  'chiangrai': 'เชียงราย',
  'chiangmai': 'เชียงใหม่',
  'trang': 'ตรัง',
  'trat': 'ตราด',
  'tak': 'ตาก',
  'nakhonnayok': 'นครนายก',
  'nakhonpathom': 'นครปฐม',
  'nakhonphanom': 'นครพนม',
  'nakhonratchasima': 'นครราชสีมา',
  'nakhonsithammarat': 'นครศรีธรรมราช',
  'nakhonsawan': 'นครสวรรค์',
  'nonthaburi': 'นนทบุรี',
  'narathiwat': 'นราธิวาส',
  'nan': 'น่าน',
  'buriram': 'บุรีรัมย์',
  'pathumthani': 'ปทุมธานี',
  'prachuapkhirikhan': 'ประจวบคีรีขันธ์',
  'prachinburi': 'ปราจีนบุรี',
  'pattani': 'ปัตตานี',
  'ayutthaya': 'พระนครศรีอยุธยา',
  'phayao': 'พะเยา',
  'phangnga': 'พังงา',
  'phatthalung': 'พัทลุง',
  'phichit': 'พิจิตร',
  'phitsanulok': 'พิษณุโลก',
  'phetchaburi': 'เพชรบุรี',
  'phetchabun': 'เพชรบูรณ์',
  'phrae': 'แพร่',
  'phuket': 'ภูเก็ต',
  'mahasarakham': 'มหาสารคาม',
  'mukdahan': 'มุกดาหาร',
  'maehongson': 'แม่ฮ่องสอน',
  'yasothon': 'ยโสธร',
  'yala': 'ยะลา',
  'roiet': 'ร้อยเอ็ด',
  'ranong': 'ระนอง',
  'rayong': 'ระยอง',
  'ratchaburi': 'ราชบุรี',
  'lopburi': 'ลพบุรี',
  'loei': 'เลย',
  'lampang': 'ลำปาง',
  'lamphun': 'ลำพูน',
  'sisaket': 'ศรีสะเกษ',
  'sakonnakhon': 'สกลนคร',
  'songkhla': 'สงขลา',
  'satun': 'สตูล',
  'samutprakan': 'สมุทรปราการ',
  'samutsongkhram': 'สมุทรสงคราม',
  'samutsakhon': 'สมุทรสาคร',
  'sakaeo': 'สระแก้ว',
  'saraburi': 'สระบุรี',
  'singburi': 'สิงห์บุรี',
  'sukhothai': 'สุโขทัย',
  'suphanburi': 'สุพรรณบุรี',
  'suratthani': 'สุราษฎร์ธานี',
  'surin': 'สุรินทร์',
  'nongkhai': 'หนองคาย',
  'nongbualamphu': 'หนองบัวลำภู',
  'angthong': 'อ่างทอง',
  'amnatcharoen': 'อำนาจเจริญ',
  'udonthani': 'อุดรธานี',
  'uttaradit': 'อุตรดิตถ์',
  'uthaithani': 'อุทัยธานี',
  'ubonratchathani': 'อุบลราชธานี',
  'betong': 'เบตง'
}

export const province = {
  province_th: province_th,
  province_en: province_en,
  province_th_map: province_th_map,
}