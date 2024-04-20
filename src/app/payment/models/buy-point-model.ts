import { TAddOn } from './wallet-model';
type TPackageEventTypeClass = 'event-pack';
type TExpandEventColor = '#D40101';
type TPackageTypeClass =
  | 'default-pack'
  | 'regular-pack'
  | 'pro-pack'
  | 'unlimited-pack'
  | TPackageEventTypeClass;
type TExpandColor =
  | '#01BFFB'
  | '#822549'
  | '#FFBB54'
  | '#FFBB54'
  | TExpandEventColor;

export type TPackageType = {
  type: number;
  isExpand: boolean;
  class: TPackageTypeClass;
  expandColor: TExpandColor;
};

export type Coin = {
  point: number | string;
  bonus?: number;
  price: number;
  type?: 'input' | 'mini';
  sub_data?: any;
  addon?: TAddOn;
};

export type Pages = 'quote' | 'payment' | 'seo' | 'studio';
