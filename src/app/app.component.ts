import { Component } from '@angular/core';
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";
import {GlobalConstants} from "./shared/global-constants";
import {JwtTokenPayload, SignInResponse, SignUpResponse} from "./shared/my-types";
import {NgForm} from "@angular/forms";
import {Http} from "@capacitor-community/http";
import jwt_decode from "jwt-decode";

async function presentToast(toastController: ToastController, position: 'top' | 'middle' | 'bottom', message:string) {
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

  constructor(private toastController: ToastController, private router: Router) {}



  toggleThemeMode() {
    window.matchMedia('(prefers-color-scheme: dark)');
  }


  onLogout(){

    const profilePicDiv: HTMLElement | null = document.getElementById("profilePic");
    if(profilePicDiv != null)
      profilePicDiv.innerHTML = "";
    if (sessionStorage.getItem("token") == null) {
      this.router.navigateByUrl('/welcome');
    }
    else {
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
          const jsonResponse: SignInResponse = JSON.parse(this.responseText);
          console.log(jsonResponse)
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('userId');
          sessionStorage.removeItem('email');
          sessionStorage.removeItem('name');
          sessionStorage.removeItem("profilePic");
          sessionStorage.clear();
          myRouter.navigateByUrl('/welcome');
          presentToast(myToastController, "middle", "You are logged out!");
        } else
          console.log(xhr.status + xhr.responseText);
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
      headers: {  "Accept": "*/*",
        "Access-Control-Allow-Origin": "*"}
    };
    var myRouter = this.router;
    var myToastController = this.toastController;
    Http.request({ ...options, method: 'GET' })
      .then(async response => {
        if (response.status === 200) {
          const jsonResponse: SignUpResponse = await response.data;
          // console.log(data)
          // const jsonResponse: SignUpResponse = JSON.parse(data);
          console.log(jsonResponse)
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('userId');
          sessionStorage.removeItem('email');
          sessionStorage.removeItem('name');
          sessionStorage.clear();
          myRouter.navigateByUrl('/welcome');
          presentToast(myToastController, "middle", "You are logged out!");
        }
      })
      .catch(e => {
        console.log(e)
        presentToast(myToastController, "middle", e);
      })
  }
}
