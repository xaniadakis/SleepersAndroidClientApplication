import {Component} from '@angular/core';
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";
import {Http} from "@capacitor-community/http";
import {SignOutResponse} from "../../dto/sign-out-response";
import {GlobalConstants} from "../../util/global-constants";
import {ProfilePicChangeResponse} from "../../dto/profile-pic-change-response";
import {SharedService} from "../../service/shared.service";
import {Subscription} from "rxjs";
import {SwUpdate} from "@angular/service-worker";
import {ModalService} from "../../service/modal.service";
import {PostType} from "../../dto/post-type";

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
  profilePicSrc: string = GlobalConstants.APIURL + "/file/image?filename=" + localStorage.getItem('profilePic');
  profilePicSrc2: string = "https://ionicframework.com/docs/img/demos/avatar.svg";
  loggedIn: boolean;

  private sharedServiceSubscription: Subscription;

  constructor(private toastController: ToastController,
              private router: Router,
              private sharedService: SharedService,
              public modalService: ModalService
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
    // this.loggedIn = localStorage.getItem("userId") != null;
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
    var myToastController = this.toastController;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(JSON.stringify(JSON.parse(this.responseText)));
        if (GlobalConstants.DEBUG)
          presentToast(myToastController, "top", JSON.stringify(JSON.parse(this.responseText)));

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
      presentToast(myToastController, "middle", "Sending request to " + GlobalConstants.APIURL + "/user/changeProfilePic" + requestParams);
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
    var myToastController = this.toastController;

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
            presentToast(myToastController, "middle", "You are logged out!");
        } else
          console.log(xhr.status + xhr.responseText);
        if (GlobalConstants.DEBUG)
          presentToast(myToastController, "middle", "Logging out!");
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
    var myToastController = this.toastController;
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
