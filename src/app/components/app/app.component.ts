import {Component} from '@angular/core';
// import {Platform} from "@ionic/angular";
import {Router} from "@angular/router";
import {Http} from "@capacitor-community/http";
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
import {gt} from "semver";
import {Update} from "../../dto/update";
import {Clipboard} from '@awesome-cordova-plugins/clipboard/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  menuType: string = 'reveal';
  darkMode = false;
  profilePic: Blob;
  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";
  profilePicSrc: string | null = localStorage.getItem('profilePic');
  profilePicSrc2: string = "https://ionicframework.com/docs/img/demos/avatar.svg";
  loggedIn: boolean;
  currentVersion: string;
  private sharedServiceSubscription: Subscription;

  constructor(
    private platform: Platform,
    private toastService: ToastService,
    private appVersion: AppVersion,
    private router: Router,
    private sharedService: SharedService,
    public modalService: ModalService,
    private clipboard: Clipboard
  ) {
    if (localStorage.getItem("userId") == null)
      this.loggedIn = false;
    else {
      this.loggedIn = true;
      localStorage.setItem("postType", PostType.STORY)
      router.navigateByUrl("/home/tabs/tab3")
    }
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

    var requestParams: string = "?userId=" + localStorage.getItem("userId");
    var formData: FormData = new FormData()
    formData.append("profilePic", this.profilePic)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    var myRouter = this.router;
    var toastService = this.toastService;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(JSON.stringify(JSON.parse(this.responseText)));
        if (GlobalConstants.DEBUG)
          toastService.presentToast("top", JSON.stringify(JSON.parse(this.responseText)));

        if (xhr.status == 200) {
          const jsonResponse: ProfilePicChangeResponse = JSON.parse(this.responseText);
          console.log(jsonResponse)
          localStorage.setItem('profilePic', jsonResponse.profilePic);
          myRouter.navigateByUrl("/home/tabs/tab2");
        } else
          alert(xhr.status + xhr.responseText)
      }
    });

    xhr.open("POST", GlobalConstants.APIURL + "/user/changeProfilePic" + requestParams);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.withCredentials = false;
    if (GlobalConstants.DEBUG)
      this.toastService.presentToast("middle", "Sending request to " + GlobalConstants.APIURL + "/user/changeProfilePic" + requestParams);
    xhr.send(formData);
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
    const options = {
      url: GlobalConstants.APIURL + "/user/logout?userId=" + localStorage.getItem('userId'),
      headers: {
        "Accept": "*/*",
        "Access-Control-Allow-Origin": "*"
      }
    };
    var myRouter = this.router;
    var toastService = this.toastService;
    Http.request({...options, method: 'GET'})
      .then(async response => {
        if (response.status === 200) {
          const jsonResponse: SignOutResponse = await response.data;
          // console.log(data)
          // const jsonResponse: SignUpResponse = JSON.parse(data);
          console.log(jsonResponse)
          localStorage.removeItem('token');
          localStorage.removeItem("profilePic");
          localStorage.clear();
          this.toggleLoggedIn(false);
          myRouter.navigateByUrl('/welcome');
          this.toastService.presentToast("middle", "You are logged out!");
        }
      })
      .catch(e => {
        console.log(e)
        if (GlobalConstants.DEBUG)
          this.toastService.presentToast("middle", e);
      })
  }

  checkForUpdates() {
    // a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    // semver.gt('1.2.3', '9.8.7') // false
    var xhr = new XMLHttpRequest();
    const currentVersion = this.currentVersion
    const toastService = this.toastService
    const clipboard = this.clipboard

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        const jsonResponse: Update = JSON.parse(this.responseText);
        const updateExists: boolean = gt(jsonResponse.version, currentVersion)
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
}
