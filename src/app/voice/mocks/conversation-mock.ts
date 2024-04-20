import {
  DefineDeviceBaseOnPage,
  TLangListAll,
} from '../models/conversation-model';

export const defineDeviceBaseOnPage: DefineDeviceBaseOnPage = {
  conversation: {
    desktop: 1246,
    tablet: 712,
  },
  premiumvoice: {
    mobile: 425,
    smallMobile: 375,
  },
};

export const TH_EN_flag: TLangListAll[] = [
  { EN_name: 'English', TH_name: 'อังกฤษ', value: 'en', flag: 'EN.svg' },
  { EN_name: 'Thai', TH_name: 'ไทย', value: 'th', flag: 'TH.svg' },
  { EN_name: 'Chinese', TH_name: 'จีน', value: 'zh', flag: 'CN.svg' },
  { EN_name: 'Japanese', TH_name: 'ญี่ปุ่น', value: 'ja', flag: 'JPN.svg' },
  { EN_name: 'Burmese', TH_name: 'เมียนมาร์', value: 'my', flag: 'MMR.svg' },
  { EN_name: 'Lao', TH_name: 'ลาว', value: 'lo', flag: 'LA.svg' },
  { EN_name: 'Vietnamese', TH_name: 'เวียดนาม', value: 'vi', flag: 'VN.svg' },
  {
    EN_name: 'Indonesian',
    TH_name: 'อินโดนีเซีย',
    value: 'id',
    flag: 'ID.svg',
  },
  { EN_name: 'Cambodia', TH_name: 'กัมพูชา', value: 'km', flag: 'KM.svg' },
  {
    EN_name: 'Pilipinas',
    TH_name: 'ฟิลิปปินส์',
    value: 'fil',
    flag: 'FIL.svg',
  },
  { EN_name: 'Arabic', TH_name: 'อาหรับ', value: 'ar', flag: 'AR.svg' },
  { EN_name: 'German', TH_name: 'เยอรมัน', value: 'de', flag: 'DE.svg' },
  { EN_name: 'Spanish', TH_name: 'สเปน', value: 'es', flag: 'ES.svg' },
  { EN_name: 'French', TH_name: 'ฝรั่งเศส', value: 'fr', flag: 'FR.svg' },
  { EN_name: 'Dutch', TH_name: 'ดัตช์', value: 'nl', flag: 'NL.svg' },
  { EN_name: 'Korea', TH_name: 'เกาหลี', value: 'ko', flag: 'KO.svg' },
];

export const languageObj = {
  en: 'english',
  id: 'indonesian',
  ja: 'japanese',
  lo: 'lao',
  my: 'burmese',
  th: 'thai',
  vi: 'vietnamese',
  zh: 'chinese',
  km: 'khmer',
  fil: 'pilipinas',
  ar: 'arabic',
  de: 'german',
  es: 'spanish',
  fr: 'french',
  nl: 'dutch',
};

export const volumeConfiguration = [
  '100',
  '90',
  '80',
  '70',
  '60',
  '50',
  '40',
  '30',
  '20',
  '10',
];

export const speedConfiguration = [
  {
    name: '0.2x',
    value: '0.2',
  },
  {
    name: '0.3x',
    value: '0.3',
  },
  {
    name: '0.4x',
    value: '0.4',
  },
  {
    name: '0.5x',
    value: '0.5',
  },
  {
    name: '0.6x',
    value: '0.6',
  },
  {
    name: '0.7x',
    value: '0.7',
  },
  {
    name: '0.8x',
    value: '0.8',
  },
  {
    name: '0.9x',
    value: '0.9',
  },
  {
    name: '1.0x',
    value: '1',
  },
  {
    name: '1.1x',
    value: '1.1',
  },
  {
    name: '1.2x',
    value: '1.2',
  },
  {
    name: '1.3x',
    value: '1.3',
  },
  {
    name: '1.4x',
    value: '1.4',
  },
  {
    name: '1.5x',
    value: '1.5',
  },
  {
    name: '1.6x',
    value: '1.6',
  },
  {
    name: '1.7x',
    value: '1.7',
  },
  {
    name: '1.8x',
    value: '1.8',
  },
  {
    name: '1.9x',
    value: '1.9',
  },
  {
    name: '2.0x',
    value: '2.0',
  },
];
