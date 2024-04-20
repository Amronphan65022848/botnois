import { ThemePalette } from '@angular/material/core';
import { TResponsePackage } from 'src/app/payment/models/wallet-model';

export interface TrackSoundSample {
  speaker: string;
  datetime: string;
  page: PageName;
  user_id: string;
}

type PageName = 'Home' | 'Select Voice' | 'Voice Studio';

/** Language type, can add moere language such as "TH" | "EN" | "JP" | ... */
export type Language = 'TH' | 'EN';
export type TypeCurrency = 'thb' | 'usd';
export type TPayMethods = 'card' | 'promptpay';

export type Voice_data = {
  audio_id: string;
  datetime: string;
  text: string;
  size: number | string;
  speaker: string;
  type_media: string;
  duration: number | string;
  url: string;
  color: ThemePalette;
  selected: boolean;
};

export type TState =
  | 'Downloading'
  | 'Completed'
  | 'Loading'
  | 'Failed'
  | 'Waiting'
  | 'Canceled';

export type TBuyState = {
  action: 'point' | 'promotion' | 'subscription' | 'details';
  item:
    | TResponsePackage
    | Pick<
        TResponsePackage,
        'point' | 'price' | 'price_discount' | 'us_price' | 'us_price_discount'
      >;
  // month: 0 | 1 | 12
};

export type TAPIResponse<T> = {
  message: string;
  data: T;
};

export type TAPIResponseMessage = {
  message: string;
};
