import {Component} from '@angular/core';
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Http} from "@capacitor-community/http";
import jwt_decode from "jwt-decode";
import {SignUpResponse} from "../../dto/sign-up-response";
import {SignInResponse} from "../../dto/sign-in-response";
import {SignOutResponse} from "../../dto/sign-out-response";
import {GlobalConstants} from "../../util/global-constants";
import {FileInfo} from "@capacitor/filesystem";
import {JwtTokenPayload} from "../../dto/jwt-token";
import {ProfilePicChangeResponse} from "../../dto/profile-pic-change-response";
import {SharedService} from "../../service/shared.service";
import {filter, Subscription} from "rxjs";
import {SwUpdate, VersionReadyEvent} from "@angular/service-worker";

async function presentToast(toastController: ToastController, position: 'top' | 'middle' | 'bottom', message: string) {
  const toast = await toastController.create({
    message: message,
    duration: 1000
  });
  await toast.present();
}


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  menuType: string = 'reveal';
  darkMode = false;
  profilePic: Blob;
  profilePicSrc: string = GlobalConstants.APIURL + "/file/image?filename=" + sessionStorage.getItem('profilePic');
  profilePicSrc2: string = "https://ionicframework.com/docs/img/demos/avatar.svg";
  loggedIn: boolean;
  private sharedServiceSubscription: Subscription;

  constructor(private toastController: ToastController,
              private router: Router,
              private sharedService: SharedService,
              private swUpdate: SwUpdate) {
    if (sessionStorage.getItem("userId") == null)
      this.loggedIn = false;
    else
      this.loggedIn = true;
  }

  ngOnInit() {
    this.sharedServiceSubscription = this.sharedService.onChange.subscribe({
      next: (event: boolean) => {
        console.log(`Received message #${event}`);
        this.toggleLoggedIn(event);
      }
    })
    // if (this.swUpdate.isEnabled) {
    //
    //   this.swUpdate.versionUpdates
    //     .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
    //     .subscribe(evt => {
    //       if (confirm("New version available. Install?")) {
    //         // Reload the page to update to the latest version.
    //         document.location.reload();
    //       }
    //     });
    // }
    // this.loggedIn = sessionStorage.getItem("userId") != null;
  }

  public toggleLoggedIn(value: boolean) {
    console.log("will toggle value")
    // if(sessionStorage.getItem("userId")==null)
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

    var requestParams: string = "?userId=" + sessionStorage.getItem("userId");
    var formData: FormData = new FormData()
    formData.append("profilePic", this.profilePic)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    var myRouter = this.router;
    var myToastController = this.toastController;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(JSON.stringify(JSON.parse(this.responseText)));
        if (GlobalConstants.DEBUG)
          presentToast(myToastController, "top", JSON.stringify(JSON.parse(this.responseText)));

        if (xhr.status == 200) {
          const jsonResponse: ProfilePicChangeResponse = JSON.parse(this.responseText);
          console.log(jsonResponse)
          sessionStorage.setItem('profilePic', jsonResponse.profilePic);
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
      presentToast(myToastController, "middle", "Sending request to " + GlobalConstants.APIURL + "/user/changeProfilePic" + requestParams);
    xhr.send(formData);
  }

  onLogout() {

    const profilePicDiv: HTMLElement | null = document.getElementById("profilePic");
    if (profilePicDiv != null)
      profilePicDiv.innerHTML = "";
    if (sessionStorage.getItem("token") == null) {
      this.router.navigateByUrl('/welcome');
      this.toggleLoggedIn(false);
    } else {
      this.capacitorHttpLogOutRequest();
    }
  }

  private xhrLogOutRequest() {
    var xhr = new XMLHttpRequest();
    var myRouter = this.router;
    var myToastController = this.toastController;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(JSON.stringify(JSON.parse(this.responseText)));
        if (xhr.status == 200) {
          const jsonResponse: SignOutResponse = JSON.parse(this.responseText);
          console.log(jsonResponse)
          sessionStorage.removeItem('token');
          sessionStorage.removeItem("profilePic");
          sessionStorage.clear();
          myRouter.navigateByUrl('/welcome');
          if (GlobalConstants.DEBUG)
            presentToast(myToastController, "middle", "You are logged out!");
        } else
          console.log(xhr.status + xhr.responseText);
        if (GlobalConstants.DEBUG)
          presentToast(myToastController, "middle", "Logging out!");
      }
    });

    xhr.open("GET", GlobalConstants.APIURL + "user/logout?userId=" + sessionStorage.getItem('userId'));
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.withCredentials = false;
    xhr.send();
  }

  private capacitorHttpLogOutRequest() {
    const options = {
      url: GlobalConstants.APIURL + "/user/logout?userId=" + sessionStorage.getItem('userId'),
      headers: {
        "Accept": "*/*",
        "Access-Control-Allow-Origin": "*"
      }
    };
    var myRouter = this.router;
    var myToastController = this.toastController;
    Http.request({...options, method: 'GET'})
      .then(async response => {
        if (response.status === 200) {
          const jsonResponse: SignOutResponse = await response.data;
          // console.log(data)
          // const jsonResponse: SignUpResponse = JSON.parse(data);
          console.log(jsonResponse)
          sessionStorage.removeItem('token');
          sessionStorage.removeItem("profilePic");
          sessionStorage.clear();
          this.toggleLoggedIn(false);
          myRouter.navigateByUrl('/welcome');
          presentToast(myToastController, "middle", "You are logged out!");
        }
      })
      .catch(e => {
        console.log(e)
        if (GlobalConstants.DEBUG)
          presentToast(myToastController, "middle", e);
      })
  }
}
