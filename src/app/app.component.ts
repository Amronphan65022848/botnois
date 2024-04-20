import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { SwUpdateService } from './core/services/sw-update.service';
import { NotificationService } from './shared/services/notification.service';
import { ScreenSizeService } from './shared/services/screen-size.service';
import { ImageService } from './shared/services/image.service';
import { CanvaAuthentication } from './auth/models/auth-model';
import { FirebaseAuthService } from './firebase-auth/services/firebase-auth.service';
import { take, filter, map } from 'rxjs';
import { TypeCurrency } from './shared/models/shared-model';
import { AuthService } from './auth/services/auth.service';
import { TitleMetaService } from './shared/services/title-meta.service';
import { TFirebaseOobCode } from './firebase-auth/models/firebase-auth-model';

type Unlock = {
  poom?: 'inkpesprem';
};

type TChangeCurrency = {
  password?: 'IBN2024';
  currency?: TypeCurrency;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public loadFinish = false;
  public time = 0;
  hideNavbar = false;
  screenHeight: any;
  screenWidth: any;

  isLoading = false;

  title = 'botnoi-platform-tool';
  // Min , max 300 characters
  warning_text: string = '';
  warning_status = false;
  slideText = false;
  isMaintenance = false;
  isCanvaUser = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sw: SwUpdateService,
    private cd: ChangeDetectorRef,
    private _screen: ScreenSizeService,
    private _notify: NotificationService,
    private location: Location,
    private _img: ImageService,
    private _fbAuth: FirebaseAuthService,
    private _auth: AuthService,
    private meta: TitleMetaService,
  ) {
    // Set default website title
    meta.setTitle('Botnoi Voice');

    this.checkPath();
  }

  generateSVG() {
    this._img.generateSVG();
  }

  ngOnInit(): void {
    // Generate image asset from pool
    this.generateSVG();

    this._notify
      .getnotifromServer()
      .pipe(
        filter((res) => !!res),
        map((res) => res.data),
        take(1),
      )
      .subscribe((data) => {
        this._notify.notifyJson.next(data);

        // Get session storage
        const devMode = JSON.parse(sessionStorage.getItem('devMode'));
        if (data?.maintenance && !devMode) {
          this.isMaintenance = true;
        } else if (data?.warning.length > 0) {
          this.warning_text = data.warning;
        } else {
          this.warning_status = true;
        }
      });
    this.route.queryParams.subscribe(
      (
        param: CanvaAuthentication &
          Unlock &
          TFirebaseOobCode &
          TChangeCurrency,
      ) => {
        // Check verify email
        if (param?.mode && param?.oobCode) {
          setTimeout(() => {
            this._fbAuth.toFirebaseAuth(param?.oobCode, param?.mode);
          }, 1000);
        }

        // Check for Canva data
        if (param?.state && param?.canva_user_token) {
          this.isCanvaUser = true;
          console.log('canva-data', param);

          sessionStorage.setItem('CanvaData', JSON.stringify(param));
          this._auth.deleteToken();

          // Redirect user to authenticate page
          this.router.navigate(['/redirect-url'], { queryParams: param });
        }

        // Check for developer mode
        if (param?.poom === 'inkpesprem') {
          this.isMaintenance = false;
          sessionStorage.setItem('devMode', JSON.stringify(true));
        }
      },
    );

    this._screen.getScreenSize();

    // check the service worker for updates
    this.sw.checkForUpdates();

    this.getWarning();
  }

  getWarning() {
    this.warning_status =
      sessionStorage.getItem('hide_warning') === 'true' ? true : false;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this._screen.getScreenSize();
  }

  checkRouter(path: string) {
    let contain = document.querySelector('.app-content') as HTMLElement;

    const navbar = document.getElementById('navbar-container');
    if (this.isCanvaUser || path.includes('redirect-url') || path === '') {
      contain.style.paddingTop = '0';
    } else {
      /* Increase padding pixel following by navbar height */
      contain.style.paddingTop = navbar?.offsetHeight + 'px';
    }
  }

  /** Function is check if user current on Auth page */
  checkPath() {
    // Get chatbot element
    const chatbot = document.getElementById('bn-root');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const url = event.url;

        if (url.includes('/redirect-url') || url.includes('/blacklist')) {
          this.hideNavbar = true;
          this.checkRouter(this.location.path().slice(1));
          if (chatbot) chatbot.style.display = 'none';
        } else {
          this.hideNavbar = false;
        }

        this.cd.detectChanges();
      }
    });
  }
}
