import { Device } from 'src/app/model/core-model';

/* point transfer */
export interface AudioDataAPI {
  audio_id?: string;
  text: string;
  text_delay: string;
  speaker: string;
  volume: string;
  speed: string;
  type_voice?: string;
  language?: string;
  type_media?: string;
}

export interface CollectUsageVoice {
  path: 'Conversation' | 'Book';
  device: Device;
}

export interface RemoveAudioTemp {
  delete_list: string[];
  total_count: number;
}

export interface ResponseAPI {
  message: string;
  status: number;
}
