export interface NotificationData {
  warning: string;
  maintenance: boolean;
  update: Update;
  // pinned_tts?: string[];
  // problem_category?: string[];
  file_type: string[];
  // api?: CoreAPI;
  sales: Sales;
  teacher: Teacher;
  subscription: Subscription;
  ads: Ads;
  payment: Payment;
  personal_form: boolean;
}

interface Payment {
  lugent: boolean;
}
interface Ads {
  studio: string;
  max: number;
  landing_max?: number;
}
interface Update {
  text: string;
  image: string[];
}

interface Teacher {
  give_point: number;
}

interface Sales {
  percent_sales: number;
  percent_users: number;
  withdraw_limit: number;
}

interface PersonalForm {
  give_point: number;
}

interface CoreAPI {
  generate: CoreKeys;
  download: CoreKeys;
}

interface CoreKeys {
  header: string;
  url: string;
  firebase?: boolean;
}

interface Subscription {
  manage_subscription_url: string;
  play_quota_multi: number;
}
