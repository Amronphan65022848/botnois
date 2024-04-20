import { Subscription } from 'src/app/payment/models/subscription-model';

export interface ParamObj {
  page: string;
  token: string;
  type: '' | 'email' | 'password' | 'confirm' | 'error';
  email: string;
}

export type ConfirmStatus = '' | 'success' | 'error';

export interface NewPasswordData {
  password: string;
  confirm_password: string;
}

export interface SocialText {
  submit: string[];
  noAccount: noAccount;
}

interface noAccount {
  text: string[];
  href: string[];
}

export interface SignInData {
  username: string;
  password: string;
  remember_password: boolean;
}

export interface SignUpData {
  firstname: string;
  lastname: string;
  birthdate: string;
  career: string;
  career_optional: string;
  email: string;
  password: string;
}

export interface AuthError {
  email?: string;
  password?: string;
}

export interface CanvaAuthentication {
  user?: string;
  brand?: string;
  time?: string;
  extensions?: string;
  state?: string;
  canva_user_token?: string;
  signatures?: string;
  context?: string;
  nonce?: string;
}

export interface UserData {
  user_id: string;
  username: string;
  email: string;
  image: string;
  jwt: string;
  start_datetime: string;
  end_datetime: string;
  credits: number;
  agreement: boolean;
  sign_in_provider: string;
  uid: string;
  personal_form: boolean; // TODO Check & Remove
  account_status: string;
  subscription: Subscription;
  play_quota: number;
  exp_subscription: string;
  monthly_point: number;
  subscription_month: number;
  auto_debit: boolean;
  popup: boolean;
  compensate_sub?: Subscription;
  keep_sub?: string;
  depa?: string; // TODO Check & Remove
  blacklist?: boolean;
  free_trial?: boolean; // TODO Check & Remove
  sale_code_name?: string;
  token?: string;
  ads?: TAds; // TODO Check & Remove
  list_add_on?: TAddonOwn[];
  survey?: boolean;
}

export type TAddonOwn = {
  add_on?: TAddonName;
  exp?: string;
};

export type TAddonName = 'Limit_text' | 'NoAds' | 'Storage';

export type TAds = {
  current: number;
  max: number;
  reduce: number;
};

export type TAuthPage =
  | 'SignUp'
  | 'SignIn'
  | 'ForgotPassword'
  | 'ResetPassword'
  | TAuthStatePage;
type TAuthStatePage =
  | 'State__CreateAccount'
  | 'State__SendPassword'
  | 'State__Success_ResetPassword'
  | 'State__Success_VerifyEmail';

export type TErrorMessageMapping = {
  signIn: {
    'auth/user-not-found': string;
    'auth/wrong-password': string;
  };
  signUp: {
    'auth/email-already-in-use': string;
    'auth/invalid-email': string;
    'auth/weak-password': string;
    'own/passwords-not-match': string;
  };
  forgotPassword: {};
  share: {
    required: string;
  };
};
