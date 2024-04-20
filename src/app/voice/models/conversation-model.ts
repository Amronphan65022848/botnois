export interface ScreenSize {
  width: string;
  height: string;
}

export type Device = 'Mobile' | 'Tablet' | 'Desktop';

export interface DefineDeviceBaseOnPage {
  [x: string]: ScreenSizeByPage;
  conversation: ScreenSizeByPage;
  premiumvoice?: ScreenSizeByPage;
}

export interface ScreenSizeByPage {
  tablet?: number;
  desktop?: number;
  mobile?: number;
  smallMobile?: number;
}

export type Block = {
  _id: string;
  text: string;
  text_read?: string;
  text_read_with_delay?: string;
  text_with_delay?: string;
  text_previous?: string;
  text_editing?: string;
  html: any;
  html_previous?: any;
  html_edit?: any;
  html_edit2?: any;
  category: TAudioCategory;
  speaker?: string;
  speed?: string;
  volume?: string;
  isEdit: boolean;
  isSetting?: boolean;
  isDownload?: boolean;
  isLoading?: boolean;
  isPlaying?: boolean;
  isAds?: boolean;
  isTextExceed?: boolean;
  freeze?: boolean;
  focus?: boolean;
  point?: number;
  price?: number;
  text_length?: number;
  speaker_name?: string | undefined;
  mode?: any;
  duration?: number;
  box_height?: string;
  display_text?: string;
  language?: language;
  main_lang?: language[];
  sub_lang?: language[];
  workspace_name?: string;
  isDownloaded?: boolean;
};

type TAudioCategory = 'text' | 'soundtrack';
interface language {
  name?: string;
  value: string;
  flag?: string;
  TH_name?: string;
  EN_name?: string;
}

export interface DropdownAttribute {
  index?: number;
  left: number;
  top: number;
}

export interface AudioDefaultSettings {
  volume: string;
  speed: string;
}

export interface Word {
  _id: string;
  before_text: string;
  after_text: string;
}

export interface SpeakerData {
  speaker_id: string;
  speaker_name: string;
  eng_name: string;
  thai_name: string;
  image: string;
  face_image: string;
  horizontal_face_image: string;
  square_image: string;
  audio: string;
  voice_style: string[];
  eng_voice_style: string[];
  age_style: string;
  eng_age_style: string;
  speech_style: string[];
  eng_speech_style: string[];
  speed: string;
  eng_speed: string;
  popularity: string;
  eng_popularity: string;
  type: number;
  language: string;
  status: boolean;
  gender: string;
  eng_gender: string;
  private: boolean;
  allow_uid: string[];
  available_language: string[];
  premier: boolean;
  name?: string;
  global_gender?: string;
  global_speech_style?: string[];
  global_voice_style?: string[];
}

export type TEnqueueParams = {
  speaker: string;
  speed: string;
  volume: string;
  language: string;
  index: number;
  box: HTMLDivElement;
  text: string;
  _id: string;
};

//TEST
export type TGenerateAudioParams = {
  replaceBrackets: string;
  file: TResponseFile;
} & TEnqueueParams;

//TEST
export type TResponseFile = {
  message: string;
  data: string;
};

export type TLangListAll = {
  EN_name: string;
  TH_name: string;
  value: string;
  flag: string;
};

export type TAudioState = 'Playing' | 'Paused' | 'Ended';
