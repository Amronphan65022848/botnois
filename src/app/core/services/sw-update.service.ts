import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwUpdateService {

  constructor(
    private updates: SwUpdate,
  ) {
    if (updates.isEnabled) {
      interval(6 * 3600).subscribe(
        () => updates.checkForUpdate().then()
      );
    }
  }

  public checkForUpdates(): void {
    console.log('checking updates.');
    this.updates.versionUpdates.subscribe((evt) => {
      switch (evt.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${evt.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${evt.currentVersion.hash}`);
          console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
          this.promptUser()
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
          break;
      }
    })
  }

  private promptUser(): void {
    console.log('updating to new version');
    this.updates.activateUpdate().then(
      () => document.location.reload()
    );
  }
}
