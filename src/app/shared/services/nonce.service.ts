import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CanvaAuthentication } from 'src/app/auth/models/auth-model';

type TCookieName = 'nonceWithExpiry'

@Injectable({
  providedIn: 'root'
})

export class NonceService {

  private cookieName: TCookieName = 'nonceWithExpiry'

  constructor(
    private cookieService: CookieService,
  ) { }

  /**
   * Generating Number only user one time and storing on cookie.
   */
  generateNonce(state: string): void {
    // The expiry time for the nonce, in milliseconds
    const NONCE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

    // Generate a nonce
    const nonce = crypto.randomUUID() // Use the crypto.randomUUID library to generate a UUID-based nonce

    // Create an expiry time for the nonce
    const nonceExpiry = Date.now() + NONCE_EXPIRY_MS;

    // Store the nonce and expiry time in a stringified JSON array
    const nonceWithExpiry = JSON.stringify([nonce, nonceExpiry]);

    // Store the nonce and expiry time in a cookie using ngx-cookie-service
    this.cookieService.set(this.cookieName, nonceWithExpiry, NONCE_EXPIRY_MS, '/', '', true);

    const cookieAlready = this.cookieService.get(this.cookieName)

    // Check stored cookie
    if (cookieAlready) {

      const params = new URLSearchParams({
        state,
        nonce,
      });

      // Redirect user to Canva app
      const url = `https://www.canva.com/apps/configure/link?${params.toString()}`
      window.location.replace(url)
    }
  }

  getCanvaData() {
    return JSON.parse(sessionStorage.getItem('CanvaData')) as CanvaAuthentication
  }

  /**
   * Verify nonce with comparing between nonce from Canva and stored cookie.
   */
  verifyNonce(): void {
    const nonceWithExpiryCookie = this.cookieService.get(this.cookieName);
    const nonceQuery = this.getCanvaData().nonce
    try {
      const nonceWithExpiry = JSON.parse(nonceWithExpiryCookie);

      // Extract the nonce and expiry time
      const [nonceCookie, nonceExpiry] = nonceWithExpiry;
      console.log('Start verifying nonce.');

      if (
        Date.now() > nonceExpiry || // The nonce has expired
        typeof nonceCookie !== "string" || // The nonce in the cookie is not a string
        typeof nonceQuery !== "string" || // The nonce in the query parameter is not a string
        nonceCookie.length < 1 || // The nonce in the cookie is an empty string
        nonceQuery.length < 1 || // The nonce in the query parameter is an empty string
        nonceCookie !== nonceQuery // The nonce in the cookie does not match the nonce in the query parameter
      ) {
        this.redirectWithErrorMessage()
      }

      console.log('Nonce is valid, Deleting nonceWithExpiry cookie.');
      this.cookieService.delete(this.cookieName)

    } catch (error) {
      this.redirectWithErrorMessage()
    }
  }

  /**
   * Redirect Canva user to Canva app attached state.
   */
  redirectWithErrorMessage(): void {
    const { state } = this.getCanvaData()
    const params = new URLSearchParams({
      success: 'false',
      state: state,
      errors: 'invalid_nonce'
    })
    const url = `https://www.canva.com/apps/configured?${params.toString()}`
    window.location.replace(url)
  }
}
