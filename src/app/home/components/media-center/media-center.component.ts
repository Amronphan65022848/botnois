import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { language } from 'src/app/shared/change_language/language';
import { ChangeLanguageService } from 'src/app/shared/services/change-language.service';
import { ownChannelData } from '../../mocks/media-center-mock';

type TVideoElementIdArray = ['yt_iframe', 'tt_iframe', 'fb_iframe']
type TVideoElementId = 'yt_iframe' | 'tt_iframe' | 'fb_iframe'
type TPlatformArray = ['youtube', 'short', 'tiktok'] //, 'facebook'
type TPlatform = 'youtube' | 'short' | 'tiktok' | 'facebook'
@Component({
  selector: 'app-media-center',
  templateUrl: './media-center.component.html',
  styleUrls: ['./media-center.component.scss'],
})
export class MediaCenterComponent implements OnInit {
  @ViewChild(InfiniteScrollDirective) infiniteScroll: InfiniteScrollDirective;

  public youtubeList: string[] = [];
  public visibleYoutubeList: string[] = [];
  public youtubeShortList: string[] = [];
  public visibleYoutubeShortList: string[] = [];
  public tiktokList: string[] = [];
  public visibleTiktokList: string[] = [];
  public facebookList: string[] = [];
  public visibleFacebookList: string[] = [];


  itemsPerLoad = 8;
  public tab: any = 0;

  // Scroll distances to trigger loading more videos
  scrollDistance = 2; // Adjust as needed
  scrollUpDistance = 1; // Adjust as needed

  isYTLoading = false;
  isTTLoading = false;
  isFBLoading = false;
  isTiktokLoaded = false;
  isVideoLoading = false;
  intervalId: any;

  text = language['TH'].mediaCenter
  page = 1
  resultCount = 2
  ownChannelData = ownChannelData
  currentChannelIndex = 0

  platform_list: TPlatformArray = ['youtube', 'short', 'tiktok']
  currentPlatformIndex = 0
  videoLoaderCount = 6

  // Current creator
  get creator() {
    return this.ownChannelData[this.currentChannelIndex]
  }

  // Current platform
  get platform() {
    return this.platform_list[this.currentPlatformIndex]
  }

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private _language: ChangeLanguageService,
  ) {
    this.sortSubscribeCount()

    // For tiktok
    this.loadScript('https://www.tiktok.com/embed.js').then((status) => {
      if (status === 'loaded') {
        console.log('loaded tiktok');

        this.isTiktokLoaded = true;
      }
    });

    this.changeResultCountByWidth()
  }

  ngOnInit(): void {

    this._language.language
      .subscribe(
        resp => {
          this.text = language[resp].mediaCenter
        }
      )

    // this.isYTLoading = true;
    // this.isTTLoading = true;
    // this.isFBLoading = true;

    this.isVideoLoading = true;

    this.youtubeShortList = this.mockYoutubeShort;
    this.youtubeList = this.mockYoutube;
    this.tiktokList = this.mockTiktok;
    this.facebookList = this.mockFacebook;

    // this.loadMoreVideos();

    this.waitIframeLoad();
  }

  // Execute when the screen size changes
  @HostListener('window:resize') onResize() {

    this.changeResultCountByWidth()

  }

  changeResultCountByWidth() {
    this.resultCount = Math.ceil(window.innerWidth / 300)

  }

  // Sort by greatest number
  sortSubscribeCount() {
    this.ownChannelData.sort((a, b) => b.subscribe_count - a.subscribe_count)
  }

  toUrl(url: string) {
    window.open(url, '_blank')
  }

  onLeft() {
    if (this.page <= 1) return;
    this.page -= 1
  }

  onRight() {
    // Find current items displayed
    const itemDisplayCount = this.page * this.resultCount

    // Find remainning items still not display
    const remainningItems = ownChannelData.length - itemDisplayCount

    // If no remainning left, break function
    if (remainningItems <= 0) return;

    // Change page
    this.page += 1
  }

  onSelectCreator(creatorName: string) {
    const index = ownChannelData.findIndex(e => e.name === creatorName)

    if (index === this.currentChannelIndex) return;
    this.currentChannelIndex = index
  }

  onSelectPlatform(index: number) {
    if (this.currentPlatformIndex === index) return;
    this.isVideoLoading = true;
    this.currentPlatformIndex = index;
    this.waitIframeLoad();
  }

  selectVideoByPlatform() {
    switch (this.platform) {
      // case 'facebook':
      //   return this.facebookList
      case 'short':
        return this.youtubeShortList
      case 'tiktok':
        return this.tiktokList
      case 'youtube':
        return this.youtubeList
    }
  }

  waitIframeLoad() {
    console.log('platform');

    this.intervalId = setInterval(() => {
      const iframe = document.getElementById('content-iframe');

      if (iframe) {
        iframe.addEventListener('load', () => {
          console.log('Finish');
          this.isVideoLoading = false;
        });
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  onScrollDown() {
    // this.loadMoreVideos();
  }

  private loadMoreVideos(): void {
    const list = this.youtubeList; // Adjust for other platforms if needed
    const startIndex = this.visibleYoutubeList.length;
    const endIndex = startIndex + this.itemsPerLoad;
    this.visibleYoutubeList = this.visibleYoutubeList.concat(
      list.slice(startIndex, endIndex)
    );
  }

  /**
   * For tiktok embed loading
   * @param url
   */
  loadScript(url: string) {
    return new Promise((resolve, reject) => {
      if (document.getElementById('tiktok-script')) {
        resolve('loaded');
      }
      const script = document.createElement('script');
      script.async = true;
      script.src = url;
      script.setAttribute('id', 'tiktok-script');

      script.onload = () => {
        // script is loaded successfully, call resolve()
        resolve('loaded');
      };

      script.onerror = () => {
        // script is not loaded, call reject()
        reject('error');
      };

      document.head.appendChild(script);
    });
  }

  /**
   * TODO : OPTIMIZE LOADING (NEED TO BE FAST)
   */

  // ngAfterViewInit(): void {
  //   this.setupLazyLoading();
  // }

  // setupLazyLoading(): void {
  //   const iframeElements = this.el.nativeElement.querySelectorAll('#iframe');

  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         this.loadIframe(entry.target as HTMLIFrameElement);
  //         observer.unobserve(entry.target);
  //       }
  //     });
  //   });

  //   iframeElements.forEach((iframe) => {
  //     observer.observe(iframe);
  //   });
  // }

  // loadIframe(iframe: HTMLIFrameElement): void {
  //   const dataSrc = iframe.dataset['src'];
  //   if (dataSrc) {
  //     this.renderer.setAttribute(iframe, 'src', dataSrc);
  //   }
  // }

  // adjustVolume() {
  //   try {
  //     const iframe = this.tiktokFrame.nativeElement;
  //     iframe.contentWindow.postMessage({ event: 'setVolume', data: 0.5 }, '*');
  //     console.log('change');
  //   } catch (error) {
  //     console.error('Error adjusting volume:', error);
  //   }
  // }


  mockYoutube = [
    // 'https://www.youtube.com/embed/KRIWmop_JE',
    'https://www.youtube.com/embed/Tx_o84tQr7A',
    'https://www.youtube.com/embed/j3Py6v6WdXs',
    'https://www.youtube.com/embed/DeJygEp_T30',
    'https://www.youtube.com/embed/0RNcZGRJjBM',
    'https://www.youtube.com/embed/V0--2gfSNNI',
    'https://www.youtube.com/embed/RWk1_u28t_M',
    'https://www.youtube.com/embed/Ndd6awLw8i8',
    'https://www.youtube.com/embed/JBtvcKeYIkY',
    'https://www.youtube.com/embed/zzqnVp3WY6g',
    'https://www.youtube.com/embed/bl9ODXR2dj8',
    'https://www.youtube.com/embed/CC2m3Mp3lSg',
    'https://www.youtube.com/embed/5Rq0bRXxtqg',
    'https://www.youtube.com/embed/X7Cm2NNb0mg',
    'https://www.youtube.com/embed/pJCROb4iV0s',
    'https://www.youtube.com/embed/A9L9N4oHQ1c',
    'https://www.youtube.com/embed/KJUxLumIUZU',
    'https://www.youtube.com/embed/-BEYp3FPmi4',
  ];

  mockYoutubeShort = [
    'https://www.youtube.com/embed/CGbESPJdrCI',
    'https://www.youtube.com/embed/1yLFhnBf36g',
    'https://www.youtube.com/embed/rArmU1w_xUM',
    'https://www.youtube.com/embed/4WVki3KHJew',
    'https://www.youtube.com/embed/iuIbcYx7WME',
    'https://www.youtube.com/embed/WyO_2HPsddo',
    'https://www.youtube.com/embed/YklEVnkKyhM',
    'https://www.youtube.com/embed/MlgCR6pHzAk',
    'https://www.youtube.com/embed/EMC6hI5yq5M',
  ];

  mockTiktok = [
    'https://www.tiktok.com/embed/7315353250918681862',
    'https://www.tiktok.com/embed/7088968029718990107',
    'https://www.tiktok.com/embed/7228523683353087237',
    'https://www.tiktok.com/embed/7231109193619623174',
    'https://www.tiktok.com/embed/7166620323780119835',
    'https://www.tiktok.com/embed/7129507772558822662',
    'https://www.tiktok.com/embed/7287969001135770888',
    'https://www.tiktok.com/embed/7058206494226943258',
    'https://www.tiktok.com/embed/7046978624695635226',
    'https://www.tiktok.com/embed/7164379670249540891',
    'https://www.tiktok.com/embed/7165058929968434458',
    'https://www.tiktok.com/embed/7036403108532079874',
    'https://www.tiktok.com/embed/7166257068704402715',
    'https://www.tiktok.com/embed/7230793709137169691',
    'https://www.tiktok.com/embed/7260036488887356674',
    'https://www.tiktok.com/embed/7034329751745531137',
    'https://www.tiktok.com/embed/7166569517018107162',
    'https://www.tiktok.com/embed/7164277520492285211',
  ];
  mockFacebook = [
    'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/ironchefthailand/videos/603070744480903/&width=315&height=560',
    'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/masterchefthailand/videos/676130666962036/&width=315&height=560',
    'https://www.facebook.com/plugins/video.php?href=https://fb.watch/p95ceCftXn/&width=315&height=560',
    'https://www.facebook.com/plugins/video.php?href=https://fb.watch/p95krzBMA3/&width=315&height=560',
    'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/1082585772896518 /&width=315&height=560',
  ];
}
