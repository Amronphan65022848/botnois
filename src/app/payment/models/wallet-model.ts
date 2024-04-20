import { Month, Subscription, SubscriptionPackage } from './subscription-model';

/* point transfer */
export interface TopUpByUserInput {
  baht: number;
  point: number;
  sale_code_name?: string;
}

export interface CustomPrice {
  price: string | number;
  user_id: string;
}

export interface PaymentRedirectData {
  page: number;
  behavior?: 'view' | 'buy';
  rank?: Subscription;
}
export interface PromptPayData {
  res_desc: string;
  qrCode: string;
  res_code: string;
  transactionId: string;
}

export interface QRCodeResponse {
  message: string;
  data: PromptPayData;
}

export interface ChangeNavbarData {
  page?: number;
  month?: Month;
  action?: 'details' | 'subscription';
  package?: SubscriptionPackage;
}

export type TDialogPaidData = {
  point?: number;
  bonus?: number;
  price?: number;
  type?: 'input' | 'qr' | 'unlimited';
  qrData?: qrData;
  addon?: TAddOn;
};

type qrData = {
  qrCode: string;
  transactionId: string;
  price?: number;
};

export type TResponsePackage = {
  package_id: string;
  // point: number | string; // TODO check type
  point: any;
  type: number;
  price: number;
  price_discount?: number;
  url?: string;
  us_price?: number;
  us_price_discount?: number;
  us_url?: string;
  day?: number;
  sub_id?: number;
  coupon?: string;
  us_coupon?: string;
  unit_us_price?: number;
} & TAddOn;

export type TAddOn = {
  add_on?: string;
  add_on_day?: number;
}


