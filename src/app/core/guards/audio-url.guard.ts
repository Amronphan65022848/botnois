import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AudioStorageApiService } from '../../storage/services/audio-storage-api.service';

@Injectable({
  providedIn: 'root'
})
export class AudioUrlGuard implements CanActivate {
  constructor(
    private _audioStorageApi: AudioStorageApiService
  ) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

}
