import {Component} from '@angular/core';
// import {Platform} from "@ionic/angular";
import {Router} from "@angular/router";
import {SignOutResponse} from "../../dto/sign-out-response";
import {GlobalConstants} from "../../util/global-constants";
import {ProfilePicChangeResponse} from "../../dto/profile-pic-change-response";
import {SharedService} from "../../service/shared.service";
import {Subscription} from "rxjs";
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
  onProfileTab: boolean;
  onFriendosProfileTab: boolean;

  constructor(
    private platform: Platform,
    private toastService: ToastService,
    private appVersion: AppVersion,
    private router: Router,
    private sharedService: SharedService,
    public modalService: ModalService,
    private clipboard: Clipboard,
    private userService: UserService,
    private pushNotificationsService: PushNotificationsService
  ) {
    if (localStorage.getItem("userId") == null)
      this.loggedIn = false;
    else {
      this.loggedIn = true;
      localStorage.setItem("postType", PostType.STORY)
      router.navigateByUrl("/home/tabs/tab3")
    }
    this.pushNotificationsService.initPush();
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
    this.sharedServiceSubscription = this.sharedService.onChange.subscribe({
      next: (event: boolean) => {
        console.log(`Received message #${event}`);
        this.toggleLoggedIn(event);
      }
    })
    this.sharedServiceSubscription = this.sharedService.onProfileTab.subscribe({
      next: (event: boolean) => {
        console.log(`Received message #${event}`);
        this.onProfileTab = event
      }
    })
    this.sharedServiceSubscription = this.sharedService.onAFriendsProfileTab.subscribe({
      next: (event: boolean) => {
        console.log(`Received message #${event}`);
        this.onFriendosProfileTab = event
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
    this.onProfileTab = false;
    this.sharedService.hideEditButtonForALilWhile(false);
    this.router.navigateByUrl('/home/tabs/tab3');
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

  onProposal() {

  }
}
