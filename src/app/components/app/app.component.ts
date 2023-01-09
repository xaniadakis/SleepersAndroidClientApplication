import {Component} from '@angular/core';
// import {Platform} from "@ionic/angular";
import {Router} from "@angular/router";
import {SignOutResponse} from "../../dto/sign-out-response";
import {GlobalConstants} from "../../util/global-constants";
import {ProfilePicChangeResponse} from "../../dto/profile-pic-change-response";
import {SharedService} from "../../service/shared.service";
import {Subscription, throwError} from "rxjs";
import {ModalService} from "../../service/modal.service";
import {PostType} from "../../dto/post-type";
// import {AppUpdate} from "@ionic-native/app-update/ngx";
import {ToastService} from "../../service/toast.service";
import {Platform, ToastButton} from "@ionic/angular";
import {AppVersion} from '@awesome-cordova-plugins/app-version/ngx';
import {compareVersions} from 'compare-versions';
import {Update} from "../../dto/update";
import {Clipboard} from '@awesome-cordova-plugins/clipboard/ngx';
import {UserService} from "../../service/user.service";
import {PushNotificationsService} from "../../service/push-notifications.service";
import SwiperCore, {Autoplay, Keyboard, Pagination, Scrollbar, Zoom} from 'swiper';
import {catchError} from "rxjs/operators";
import {TranslateConfigService} from "../../service/translate-config.service";
import GeneralUtils from "../../util/general.utils";

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  menuType: string = 'reveal';
  darkMode = false;
  profilePic: File;
  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";
  profilePicSrc: string | null = localStorage.getItem('profilePic');

  profilePicSrc2: string = "https://ionicframework.com/docs/img/demos/avatar.svg";
  loggedIn: boolean;
  currentVersion: string;
  private sharedServiceSubscription: Subscription;
  onSbsProfileTab: boolean = false;
  onMyProfileTab: boolean = false;
  onPostsTab: boolean = true;
  onArtPostsTab: boolean = false;
  onStoriesTab: boolean = true;
  onTripPostsTab: boolean = false;
  onCarPostsTab: boolean = false;
  onEventsTab: boolean = false;
  onOtherTab: boolean = false;
  receiveNotifications: boolean = true;
  currentLanguageIsEnglish: boolean = false;
  username: string | null = localStorage.getItem('name');
  whatToRefresh: PostType = PostType.SLEEPERS;

  constructor(
    private platform: Platform,
    private toastService: ToastService,
    private appVersion: AppVersion,
    private router: Router,
    private sharedService: SharedService,
    public modalService: ModalService,
    private clipboard: Clipboard,
    private userService: UserService,
    private pushNotificationsService: PushNotificationsService,
    private translateConfigService: TranslateConfigService
  ) {
    if (localStorage.getItem("userId") == null)
      this.loggedIn = false;
    else {
      this.loggedIn = true;
      localStorage.setItem("postType", PostType.STORY)
      router.navigateByUrl("/home/tabs/tab3")
    }
    this.getDefaultLanguage();
    this.getCurrentNotificationsIntention();
    this.pushNotificationsService.initPush();
  }

  changeDefaultLanguage(langType: string) {
    this.translateConfigService.changeLanguage(langType);
    localStorage.setItem("language", langType);
  }

  getDefaultLanguage() {
    let lang: string | null = localStorage.getItem("language");
    switch (lang) {
      case "en":
        this.currentLanguageIsEnglish = true;
        break;
      case "el":
      case null:
      default:
        lang = "el";
        this.currentLanguageIsEnglish = false;
    }
    this.translateConfigService.changeLanguage(lang);
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      //   this.statusBar.styleDefault();
      //   this.splashScreen.hide();
      this.appVersion.getVersionNumber().then((res) => {
        localStorage.setItem("appVersion", res);
        this.currentVersion = res;
        console.log(res);
      }, (err) => {
        console.log(err);
      });
      //   const updateUrl = "https://raw.githubusercontent.com/xaniadakis/sleepers-androidClient/main/sleepersUpdate.xml";
      //   this.appUpdate.checkAppUpdate(updateUrl).then(update => {
      //     this.toastService.presentToastWithDuration("middle", "Update Status:  " + update.msg, 5000);
      //   }).catch(error => {
      //     this.toastService.presentToastWithDuration("bottom", "Update Error: " + error.msg, 3000);
      //   });
      //
    });
    this.userService.receiveNotificationsIntention()
      .pipe(catchError(err => {
        this.receiveNotifications = false;
        console.log("error while getting notification intention: " + err);
        return throwError(err);
      }))
      .subscribe(data => {
        this.receiveNotifications = data.intention;
        console.log("receiveNotificationsIntention: " + data.message + ", " + this.receiveNotifications)
      });
    this.sharedServiceSubscription = this.sharedService.onChange.subscribe({
      next: (event: boolean) => {
        console.log(`Received message onChange #${event}`);
        this.toggleLoggedIn(event);
      }
    })
    this.sharedServiceSubscription = this.sharedService.onLogin.subscribe({
      next: (event: string) => {
        console.log(`Received name onLogin #${event}`);
        this.username = event;
      }
    })
    this.sharedServiceSubscription = this.sharedService.onPostsTabsNow.subscribe({
      next: (event: PostType) => {
        console.log(`Received message onPostsTabsNow #${event}`);
        this.onOtherTab = this.onEventsTab = this.onMyProfileTab = this.onSbsProfileTab = false;
        this.onPostsTab = true;
        switch (event) {
          case PostType.CAR:
            this.onCarPostsTab = true;
            this.onTripPostsTab = this.onArtPostsTab = this.onStoriesTab = false;
            break;
          case PostType.ART:
            this.onArtPostsTab = true;
            this.onCarPostsTab = this.onTripPostsTab = this.onStoriesTab = false;
            break;
          case PostType.TRIP:
            this.onTripPostsTab = true;
            this.onCarPostsTab = this.onArtPostsTab = this.onStoriesTab = false;
            break;
          case PostType.STORY:
          default:
            this.onStoriesTab = true;
            this.onCarPostsTab = this.onArtPostsTab = this.onTripPostsTab = false;
            break;
        }
      }
    })
    this.sharedServiceSubscription = this.sharedService.onArtRefresh.subscribe({
      next: (event: boolean) => {
        console.log(`Received message onArtRefresh #${event}`);
        this.onArtPostsTab = true;
        this.onCarPostsTab = this.onTripPostsTab = this.onStoriesTab = false;
      }
    })
    this.sharedServiceSubscription = this.sharedService.onCarRefresh.subscribe({
      next: (event: boolean) => {
        console.log(`Received message onCarRefresh #${event}`);
        this.onCarPostsTab = true;
        this.onStoriesTab = this.onTripPostsTab = this.onArtPostsTab = false;
      }
    })
    this.sharedServiceSubscription = this.sharedService.onStoryRefresh.subscribe({
      next: (event: boolean) => {
        console.log(`Received message onStoryRefresh #${event}`);
        this.onStoriesTab = true;
        this.onCarPostsTab = this.onTripPostsTab = this.onArtPostsTab = false;
      }
    })
    this.sharedServiceSubscription = this.sharedService.onTripRefresh.subscribe({
      next: (event: boolean) => {
        console.log(`Received message onTripRefresh #${event}`);
        this.onTripPostsTab = true;
        this.onCarPostsTab = this.onStoriesTab = this.onArtPostsTab = false;
      }
    })
    this.sharedServiceSubscription = this.sharedService.onMyProfileNow.subscribe({
      next: (event: boolean) => {
        console.log(`Received message onProfileTab #${event}`);
        if (event)
          this.onEventsTab = this.onPostsTab = this.onOtherTab = this.onSbsProfileTab = false;
        this.onMyProfileTab = event;
      }
    })
    this.sharedServiceSubscription = this.sharedService.onSbsProfileNow.subscribe({
      next: (event: boolean) => {
        console.log(`Received message onProfileTab #${event}`);
        if (event)
          this.onEventsTab = this.onPostsTab = this.onOtherTab = this.onMyProfileTab = false;
        this.onSbsProfileTab = event;
      }
    })
    this.sharedServiceSubscription = this.sharedService.onOtherTab.subscribe({
      next: (event: PostType) => {
        console.log(`Received message onFriendosProfileTab #${event}`);
        this.onEventsTab = this.onPostsTab = this.onMyProfileTab = this.onSbsProfileTab = false;
        this.onOtherTab = true;
        this.whatToRefresh = event;
      }
    })
    this.sharedServiceSubscription = this.sharedService.onEventsTab.subscribe({
      next: (event: boolean) => {
        console.log(`Received message onEventsTab #${event}`);
        if (event)
          this.onOtherTab = this.onPostsTab = this.onMyProfileTab = this.onSbsProfileTab = false;
        this.onEventsTab = event;
      }
    })
  }

  public toggleLoggedIn(value: boolean) {
    console.log("will toggle value")
    // if(localStorage.getItem("userId")==null)
    this.loggedIn = value;
    // else
    // this.loggedIn = true;
  }

  toggleThemeMode() {
    window.matchMedia('(prefers-color-scheme: dark)');
  }

  onFileChanged(event: any): void {
    this.profilePic = event.target.files[0];
    console.log(event);

    this.userService.changeProfilePic(this.profilePic).subscribe(data => {
      const jsonResponse: ProfilePicChangeResponse = data;
      console.log(jsonResponse)
      localStorage.setItem('profilePic', jsonResponse.profilePic);
    });
    //
    // var requestParams: string = "?userId=" + localStorage.getItem("userId");
    // var formData: FormData = new FormData()
    // formData.append("profilePic", this.profilePic)
    // var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    // var myRouter = this.router;
    // var toastService = this.toastService;
    // xhr.addEventListener("readystatechange", function () {
    //   if (this.readyState === 4) {
    //     console.log(JSON.stringify(JSON.parse(this.responseText)));
    //     if (GlobalConstants.DEBUG)
    //       toastService.presentToast("top", JSON.stringify(JSON.parse(this.responseText)));
    //
    //     if (xhr.status == 200) {
    //       const jsonResponse: ProfilePicChangeResponse = JSON.parse(this.responseText);
    //       console.log(jsonResponse)
    //       localStorage.setItem('profilePic', jsonResponse.profilePic);
    //       myRouter.navigateByUrl("/home/tabs/tab2");
    //     } else
    //       alert(xhr.status + xhr.responseText)
    //   }
    // });
    //
    // xhr.open("POST", GlobalConstants.APIURL + "/user/changeProfilePic" + requestParams);
    // xhr.setRequestHeader("Accept", "*/*");
    // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    // xhr.withCredentials = false;
    // if (GlobalConstants.DEBUG)
    //   this.toastService.presentToast("middle", "Sending request to " + GlobalConstants.APIURL + "/user/changeProfilePic" + requestParams);
    // xhr.send(formData);
  }

  onLogout() {
    const profilePicDiv: HTMLElement | null = document.getElementById("profilePic");
    if (profilePicDiv != null)
      profilePicDiv.innerHTML = "";
    if (localStorage.getItem("token") == null) {
      this.router.navigateByUrl('/welcome');
      this.toggleLoggedIn(false);
    } else {
      this.capacitorHttpLogOutRequest();
    }
  }

  private xhrLogOutRequest() {
    var xhr = new XMLHttpRequest();
    var myRouter = this.router;
    var toastService = this.toastService;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(JSON.stringify(JSON.parse(this.responseText)));
        if (xhr.status == 200) {
          const jsonResponse: SignOutResponse = JSON.parse(this.responseText);
          console.log(jsonResponse)
          localStorage.removeItem('token');
          localStorage.removeItem("profilePic");
          localStorage.clear();
          myRouter.navigateByUrl('/welcome');
          if (GlobalConstants.DEBUG)
            toastService.presentToast("middle", "You are logged out!");
        } else
          console.log(xhr.status + xhr.responseText);
        if (GlobalConstants.DEBUG)
          toastService.presentToast("middle", "Logging out!");
      }
    });

    xhr.open("GET", GlobalConstants.APIURL + "user/logout?userId=" + localStorage.getItem('userId'));
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.withCredentials = false;
    xhr.send();
  }

  private capacitorHttpLogOutRequest() {
    this.userService.logOut().subscribe(data => {
      console.log(data)
      localStorage.removeItem('token');
      localStorage.removeItem("profilePic");
      localStorage.clear();
      this.toggleLoggedIn(false);
      this.router.navigateByUrl('/welcome');
      this.toastService.presentToast("middle", "You are logged out!");
    });
    // const options = {
    //   url: GlobalConstants.APIURL + "/user/logout?userId=" + localStorage.getItem('userId'),
    //   headers: {
    //     "Accept": "*/*",
    //     "Access-Control-Allow-Origin": "*"
    //   }
    // };
    // var myRouter = this.router;
    // var toastService = this.toastService;
    // Http.request({...options, method: 'GET'})
    //   .then(async response => {
    //     if (response.status === 200) {
    //       const jsonResponse: SignOutResponse = await response.data;
    //       // console.log(data)
    //       // const jsonResponse: SignUpResponse = JSON.parse(data);
    //       console.log(jsonResponse)
    //       localStorage.removeItem('token');
    //       localStorage.removeItem("profilePic");
    //       localStorage.clear();
    //       this.toggleLoggedIn(false);
    //       myRouter.navigateByUrl('/welcome');
    //       this.toastService.presentToast("middle", "You are logged out!");
    //     }
    //   })
    //   .catch(e => {
    //     console.log(e)
    //     if (GlobalConstants.DEBUG)
    //       this.toastService.presentToast("middle", e);
    //   })
  }

  checkForUpdates() {
    // compareVersions('11.1.1', '10.0.0'); //  1
    // compareVersions('10.0.0', '10.0.0'); //  0
    // compareVersions('10.0.0', '11.1.1'); // -1
    var xhr = new XMLHttpRequest();
    const currentVersion = this.currentVersion
    const toastService = this.toastService
    const clipboard = this.clipboard

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        const jsonResponse: Update = JSON.parse(this.responseText);
        const updateExists: boolean = compareVersions(jsonResponse.version, currentVersion) == 1
        if (updateExists) {
          const buttons: ToastButton[] = [{
            icon: 'clipboard',
            text: " Copy download URL",
            handler: () => {
              clipboard.copy(jsonResponse.url);
            }
          }, {
            text: "Who even cares..",
            role: 'cancel'
          }]
          toastService.presentToastWithButtons("middle", "Version " + jsonResponse.version + " is available!", 5000, buttons)
        } else
          toastService.presentToastWithDuration("bottom", "No need to hurry. This app is already cool enough.", 2000)
        console.log(this.responseText);
      }
    });

    xhr.open("GET", "http://sleepers.ddns.net:80/update-check/");
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.withCredentials = false;
    xhr.send();

  }

  goFromProfileToTimeline() {
    this.onEventsTab = this.onMyProfileTab = this.onOtherTab = false;
    this.onPostsTab = true;
    GeneralUtils.goBack(this.router, this.sharedService);
  }

  editProfile() {
    this.sharedService.immaEditProfile(true);
  }

  reload() {
    location.reload();
  }

  checkSleepers() {
    this.router.navigateByUrl('/home/sleepers');
  }

  checkForFriendRequests() {
    this.router.navigateByUrl('/home/friend-requests');
  }

  checkForEvents() {
    this.router.navigateByUrl('/home/events');
  }

  onProposal() {

  }


  animate() {
    var btn = document.getElementById('my-btn');
    // @ts-ignore
    console.log("running aniimation..")
    // @ts-ignore
    btn.children[0].classList.add('spin-animation');
    setTimeout(function () {
      // @ts-ignore
      btn.children[0].classList.remove('spin-animation');
    }, 500);
    this.sharedService.refreshed(this.whatToRefresh);
  }

  clickedCheckBox() {
    // localStorage.getItem()
    this.receiveNotifications = !this.receiveNotifications;
    localStorage.setItem("receiveNotifications", JSON.stringify(this.receiveNotifications));
    console.log("receiveNotifications: " + this.receiveNotifications);
    this.userService.setNotificationsIntention(this.receiveNotifications)
      .pipe(catchError(err => {
        this.receiveNotifications = false;
        console.log("error while settin notification intention: " + err);
        return throwError(err);
      }))
      .subscribe(data => {
        this.receiveNotifications =  data.intention;
        console.log("setNotificationsIntention: " + data.message + ", " + this.receiveNotifications)
      });
  }

  getCurrentNotificationsIntention() {
    let currentNotificationsIntention: string | null = localStorage.getItem("receiveNotifications")
    if (currentNotificationsIntention == null) {
      this.receiveNotifications = true;
      return;
    }
    console.log("currentNotificationsIntention: "+currentNotificationsIntention)
    this.receiveNotifications = JSON.parse(currentNotificationsIntention);
  }

}
