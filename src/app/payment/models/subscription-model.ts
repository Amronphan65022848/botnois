import { TAddonName, TAddonOwn } from "src/app/auth/models/auth-model";

export type Month = 0 | 1 | 12;
export type Subscription =
  | 'Free'
  | 'Free trial'
  | 'Mini'
  | 'Basic'
  | 'Advanced'
  | 'Pro'
  | 'Pro plus'
  | 'Unlimited'
  | 'Compensate_basic'
  | 'Compensate_pro'
  | 'Compensate_proplus'
  | 'NoAds';
type Discount = 0 | 5 | 15;


export type TAddonPackage = {
  add_id: string;
  name: TAddonName;
  display_name: string;
  text_limit: number;
  storage: number;
  price: number;
  us_price: number;
  price_discount?: number;
  us_price_discount?: number;
  point?: number;
  NoAds: boolean;
  day: number;
  price_discount_card?: number;
  date_event?: string;
  qr_price?: number;
} & TAddonOwn;

export type SubscriptionPackage = {
  product_id: string;
  subscription_rank: Subscription;
  price: number;
  name: TAddonName | 'Free' | 'No Ads';
  text_limit: number;
  play_quota: number;
  monthly_point: number;
  storage: number;
  point_discount_percent?: Discount;
  price_after_percent_off?: number;
  month: Month;
  us_price?: number;
  us_price_discount?: number;
  us_url?: string;
  url: string;
  point_per_thb: number;
  thb_per_point: number;
  monthly_price?: number;
  percent_off?: number;
  coupon?: string;
  us_coupon?: string;
  bubble?: number;
  workspace?: number;
  qr_price?: number;
  // date_event?: string;
  type?: number;
  add_on?: string;
  add_on_day?: number;
  sub_id?: string; // Optional
} & TAddonPackage;
export interface SubscriptionTier {
  sub_id: string;
  name: string;
  subscription_rank: string;
  percent_off: string;
  ads: boolean;
  storage?: number;
  text_limit?: number;
  old_price: number;
  price: number;
  price_after_percent_off?: number;
  qr_price?: number;
  month?: Month;
}
