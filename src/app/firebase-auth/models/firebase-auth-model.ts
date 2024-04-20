interface CanvaData {
  user_id: string;
  state: string;
}
interface Platform {
  google?: boolean;
  facebook?: boolean;
  line?: boolean;
  botnoi_voice?: boolean;
}

export type AuthenticateData = {
  email: string;
  password: string;
};
export interface UserDataDB {
  username: string;
  credits: number;
  jwt: string;
  last_login_type: string;
  token: string;
  platform?: Platform;
  remember_password?: boolean;
  image: string;
  start_datetime: string;
  invite_code: boolean;
  email: string;
  end_datetime: string;
  firebase_id: string;
  user_id: string;
  _id: string;
  sale_code_name?: null;
}

export interface UserObject {
  email: string;
  credits: number;
  username: string;
  user_id: string;
  image: string;
  uid?: string;
  subscription?: string;
}

interface Where {
  field_path: string;
  logic: Logic;
  find: string;
}

export interface ConditionGroup {
  field_path: string;
  logic: Logic;
  find: string;
}

export type PromiseStatus = 'success' | 'error';
export type AuthPath = 'sign-in' | 'already sign-in';
export type Social = 'google' | 'facebook' | 'line' | 'email';

export type FirebaseCollection =
  | 'speaker'
  | 'voice_studio'
  | 'max_size'
  | 'transfer_credits_statement'
  | 'message'
  | 'aws_message'
  | 'use_invite_coupon'
  | 'progress'
  | 'payment'
  | 'transfer_credits'
  | 'alert_message'
  | 'share'
  | 'blacklist'
  | 'use_coupons'
  | 'package'
  | 'feedback'
  | 'dictionary'
  | 'logs_error_get_voice'
  | 'users'
  | 'sessions'
  | 'temp_message'
  | 'main'
  | 'pay_database'
  | 'device_check'
  | 'invite_coupon'
  | 'coupons'
  | 'logs'
  | 'temp_storage'
  | 'record'
  | 'message_old'
  | 'aws_logs'
  | 'test_sales'
  | 'payment_config'
  | 'storage'
  | 'generate_voice_link';
export type Logic =
  | '<'
  | '<='
  | '=='
  | '!='
  | '>='
  | '>'
  | 'array-contains'
  | 'in'
  | 'array-contains-any'
  | 'not-in';
export type TFirebaseAuth = {
  signin_by: string;
  or: string;
  sign_in: string;
  no_account: string;
  exist_account: string;
  sign_up: string;
  email: string;
  password: string;
  confirm_password: string;
  sign_up_popup: Signuppopup;
  verify_popup: Verifypopup;
  options: Options;
};

export type TFirebaseOobCode = {
  mode?: Action;
  oobCode?: string;
  apiKey?: string;
  continueUrl?: string;
  lang?: string;
};

type Action = 'resetPassword' | 'recoverEmail' | 'verifyEmail';

type Options = {
  remember: string;
  forget_password: string;
  reset_password: string;
  reset_password_complete: string;
  text: string;
  save: string;
};

type Verifypopup = {
  header: string;
  text: string;
  accept: string;
};

type Signuppopup = {
  header: string;
  text: string;
  send_at: string;
  accept: string;
};
