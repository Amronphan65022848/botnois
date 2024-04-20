import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GlobalFunctionService {
  constructor(
    private date: DatePipe,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  /** Uppercase the first string of word */
  uppercaseFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ex. 1000 -> 1,000 */
  numberWithCommas(x: string | unknown) {
    return String(x)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  getObjectKeys(obj: any) {
    return Object.keys(obj);
  }

  /* ex. 1000 -> 1.0k */
  thousand(x: number) {
    return String((x / 1000).toFixed(2) + ' K');
  }

  /* dynamic replace word */
  replace(x: string, symbol: string, replace: string) {
    return String(x).replace(symbol, replace);
  }

  /** replace word between parentheses ex. hi (abc) user {zxc} -> hi user */
  replaceBetweenParentheses(word: string) {
    return String(word)
      .replace(/delay\{(.*?)\}/g, '')
      .replace(/\s/g, '');
  }

  /* ex. 01:00:00 -> 1 hr */
  hour(x: string) {
    x = x.slice(0, 2);
    return x + ':00';
    // return x = (x[0] == '0' ? x.replace('0','') : x) + ' hr'
  }

  /* default divisor is 5, each page has 5 row */
  getMaxPage(x: number, divide: number = 5) {
    return Math.ceil(x / divide);
  }

  /* prevent duplicate pointer when assign var to another vars */
  deepclone(data: any) {
    return JSON.parse(JSON.stringify(data));
  }

  /* merge object a and b to new object  */
  mergeObjects(a: any, b: any) {
    return Object.assign(a, b);
  }

  /* dynamic declare date */
  getDate(x: string) {
    return new Date(x);
  }

  /* check url path with string search */
  checkUrlPath(x: string) {
    return document.location.href.split('/').reverse()[0] == x;
  }

  /* get current url path */
  getUrlPath() {
    return document.location.href.split('/').reverse()[0];
  }

  /* format timestamp to date string */
  toDateString(x: any[]) {
    x.forEach((obj, i) => {
      /* loop object keys */
      Object.keys(obj).forEach((key) => {
        /* less var */
        const val = obj[key];
        /* timestamp always number and value greater than 10^10 */
        if (typeof val == 'number' && val >= Math.pow(10, 10)) {
          x[i][key] = this.date.transform(val, 'dd/MM/yyyy');
        }
      });
    });
    return x;
  }

  sortTopArray(item: string[], data: any[]) {
    data.sort((a: any, b: any) => {
      const key = Object.keys(a)[0];
      if (item.includes(a[key])) return -1;
      else return 0;
    });
  }

  showPassword(element: HTMLInputElement, span: HTMLSpanElement) {
    if (element.type == 'password') {
      element.type = 'text';
      span.innerText = 'visibility';
    } else {
      element.type = 'password';
      span.innerText = 'visibility_off';
    }
  }
  /** Set input focus and invalid.
   * @param elementId
   */
  errWithFocusInput(elementId: string) {
    const input = document.getElementById(elementId) as HTMLInputElement;
    input.setCustomValidity('error');
    input.focus();
  }
  /** Set input valid.
   * @param elementId
   */
  errDisableInput(elementId: string) {
    const input = document.getElementById(elementId) as HTMLInputElement;
    input.setCustomValidity('');
  }

  forceDivFocus(elementId: string) {
    const div = document.getElementById(elementId) as HTMLDivElement;
  }

  /** Change backgroud color on global body in index file.*/
  changeBackgroundColor(color?: '#F7F8FA') {
    if (color) {
      document.body.style.backgroundColor = color;
    } else {
      document.body.style.backgroundColor = '#fff';
    }
  }

  /** Remove many local storage keys by pass specific value to the function.
   * @param value string
   */
  removeLocalStorageByValue(value: string) {
    try {
      /* declare var */
      const storageKeys = Object.keys(localStorage);
      const indexArr: number[] = [];

      /* find index to store in array var */
      storageKeys.findIndex((key, i) => {
        const isFound = key.includes(value);
        if (isFound) indexArr.push(i);
      });

      /* using index on index array to remove storage */
      indexArr.forEach((keyIndex) => {
        localStorage.removeItem(storageKeys[keyIndex]);
      });
      console.log('Storage keys was removing success.');
    } catch (error) {
      console.log('Failed to remove storage keys.');
    }
  }

  clearAllCookies() {
    document.cookie.split(';').forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  }
  /** auto hight grow on textarea while user input */
  autogrow(
    element: HTMLTextAreaElement,
    height: string,
    heightOptional?: number
  ) {
    element.style.height = height;

    element.style.height = element.scrollHeight + 'px';
  }

  /** Clear all query parameters.
   * @warning can not navigate to previous page with back button.
   */
  clearQueryParams() {
    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }

  /** Generate ID with A-Z and 0-9.
   * @output string
   */
  generateID() {
    const length = 5;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /** Insert text at specific position. */
  insertAt(text: string, add: string, pos: number) {
    return `${text.slice(0, pos)}${add}${text.slice(pos)}`;
  }

  /** Get start and end day in month, ex. year = 2023, month = 1 */
  getRangeInMonth(month: number, year: number) {
    // get the start and end dates of the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return { startDate, endDate };
  }

  /** Get current day, month and year */
  getCurrentDate() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    return { day, month, year };
  }

  /** Counting number animation */
  animateValue(elementId: string, start: number, end: number) {
    const duration: number = 2000; // ms
    const obj = document.getElementById(elementId);

    if (!obj) return null;
    let startTimestamp = null;
    const step = (timestamp: any) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp!) / duration, 1);
      obj.innerHTML = Math.floor(
        progress * (end - start) + start
      ).toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  /**
   * Check if a given string is entirely in uppercase.
   * @param str The input string to check.
   * @returns True if the string is entirely in uppercase, false otherwise.
   */
  isUpperCase(str: string) {
    // Check only English string
    if (!this.isEnglishString(str)) return;

    // Convert the string to uppercase and compare it with the original string
    return str === str.toUpperCase();
  }

  /**
   * Checks if a string is composed of English letters only.
   * @param input - The input string to be checked.
   * @returns True if the string is composed of English letters, false otherwise.
   */
  isEnglishString(input: string): boolean {
    // Regular expression to match only English letters (both lowercase and uppercase)
    const englishRegex = /^[a-zA-Z]+$/;

    // Test if the entire string matches the English letters pattern
    return englishRegex.test(input);
  }

  /**
   * @param id - id of selected speaker
   * @returns sound data of random speaker
   */
  getRandomSoundSpeaker(id: string, arr: any[]) {
    if (!id || !arr) return;
    const sound = arr;
    const speakerAds = sound.filter((item) => {
      const split = item.url.split('/');
      const idText = split[4];
      // Use a regular expression to match numbers
      const speakerId = idText.match(/\d+/g);
      return speakerId[0] === id;
    });

    const randomIndex = Math.floor(Math.random() * speakerAds.length);
    return speakerAds[randomIndex];
  }

  /**
   * Reverse between key and value.
   * @param obj
   * @returns
   */
  reverseKeyValue(obj: any): any {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [(value), key])
    );
  }
}
