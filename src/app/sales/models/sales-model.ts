/* point transfer */
export interface SalesInfo {
  message: string;
  data: Data;
}

export interface MonthAndYear {
  month: string;
  year: string;
}

export interface RangeInMonth {
  startDate: Date;
  endDate: Date;
}

export type ViewPanelType = 'list' | 'total';

export interface SalesData {
  sale_code_name: string;
  title_income?: number;
  total_income: number;
  table_payment_in_month: TablePaymentInMonth;
  total_sales: number;
}

export interface TablePaymentInMonth {
  month: number;
  sales_in_month: number;
  transaction: TransactionInMonth[];
}

export interface TransactionInMonth {
  income: string;
  timestamp: string;
  share: string;
  url_profile: string;
  username: string;
}

export interface SalesObj {
  alreadyWithdraw: number;
  isLoading: boolean;
  text: null;
  rangeInMonth: RangeInMonth;
  floatingMessage: any[];
  messageShow: boolean;
  messangeFloating: boolean;
  clickDelete: boolean;
  withdraw_limit: number;
  salesData: SalesData;
  salesDataTotal: TransactionInMonth[];
  date: MonthAndYear;
}

interface currentDate {
  day: string;
  month: string;
  year: string;
}

interface Data {
  sale_code_name: string;
  total_sales: string;
  total_income: string;
  table_payment_customer: TablePaymentCustomer[];
}

interface TablePaymentCustomer {
  url_profile: string;
  username: string;
  timestamp: string;
  income: string;
  share: string;
}
