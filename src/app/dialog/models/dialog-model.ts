/* point transfer */
export interface DialogImage3Texts {
  h?: string;
  sub?: string;
  content?: string;
  btn?: string[];
}

export interface DialogImage1Texts {
  content?: string;
  btn?: string[];
}

export interface s {

}

export interface DialogPaid {
  order:          string;
  package_id:     string;
  detail:         string;
  promotion:      string;
  point:          string;
  price:          string;
  stripe_id:      string;
  type?:          string;
  qr_data_t2s?:   string;
}

export interface RecommendPackagePopUp {
  language: any;
  point: number;
  bonus: number;
}
