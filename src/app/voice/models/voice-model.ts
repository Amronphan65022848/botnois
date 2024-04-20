import { TResponseAds } from 'src/app/payment/models/ads-model';

export type TResponseConfirmPaid = {
  file_type: TFileType;
  isMergeAudio: boolean;
  saveFiles: boolean;
};

export type TGenerateVoicePayload = {
  audio_id: string;
  text: string;
  text_delay: string;
  speaker: string;
  volume: string;
  speed: string;
  type_voice?: string;
  save_file: boolean;
  language?: string;
  type_media?: string;
};

// TEST
export type TGetStoreFile = {
  text: string;
  speaker: string;
  file: string;
  language: string;
  ads?: TResponseAds;
  _id: string;
};

type TFileType = 'wav' | 'mp3' | 'm4a';
