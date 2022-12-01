import {Component, OnInit} from '@angular/core';
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";
import jwt_decode from "jwt-decode";
import {Headers} from 'node-fetch';
import {NgForm} from '@angular/forms';
import {JwtTokenPayload, SignUpResponse} from '../shared/my-types'
import {GlobalConstants} from "../shared/global-constants";
import { Http, HttpResponse } from '@capacitor-community/http';

async function presentToast(toastController: ToastController, position: 'top' | 'middle' | 'bottom', message:string) {
  const toast = await toastController.create({
    message: message,
    duration: 1000
    // ,buttons: [
    //   {
    //     text: 'Ok navigate me home.',
    //     role: 'cancel',
    //     handler: () => { this.router.navigateByUrl("/home/tabs/tab2"); }
    //   }
    // ]
  });
  await toast.present();
}

function onLoginLoadProfilePicado(username:string, profilePicName: string){
  console.log("picado lanado")
  const profilePic: string = GlobalConstants.APIURL+"/user/profilePic?filename="+profilePicName;
  const profilePicDiv: HTMLElement | null = document.getElementById("profilePic");
  if(profilePicDiv != null) {
    profilePicDiv.innerHTML = "<ion-card class=\"card info-card\">\n" +
      "<ion-img height=\"50px;\" width=\"50px;\" alt=\""+username+"'s Profile Picture\" id=\"profilePicImg\" src=\"" + profilePic + "\"></ion-img>\n" +
      "<ion-row><ion-item>Welcome "+username+ "!</ion-item></ion-row>"
    "</ion-card>";
    console.log(profilePicDiv.innerHTML)
  }else console.log("null profilePicDiv");
}


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss', "../welcome/welcome.page.scss"],
})
export class SignupPage implements OnInit {

  signup = {
    email: '',
    username: '',
    password1: '',
    password2: '',
    profilePic: ''
  };

  constructor(private toastController: ToastController, private router: Router) {}

  ngOnInit(): void { }

  onFileChanged(event: any): void {
    this.signup.profilePic = event.target.files[0];
    console.log(event);
  }

  onSignup(form: NgForm){
    this.xhrSignUpRequest(form);
  }

  private capacitorHttpSignUpRequest(form: NgForm) {
    var requestParams: string = "?username=" + form.controls["username"].value +
      "&password1=" + form.controls["password1"].value +
      "&password2=" + form.controls["password2"].value +
      "&email=" + form.controls["email"].value;
    var formData: FormData = new FormData()
    formData.append("profilePic", this.signup.profilePic)
    const options = {
      url: GlobalConstants.APIURL + "/user/signup" + requestParams,
      data: formData,
      headers: { "Content-Type": "multipart/form-data",
                 "Accept": "*/*",
                 "Access-Control-Allow-Origin": "*"}
    };
    var myRouter = this.router;
    var myToastController = this.toastController;
    Http.request({ ...options, method: 'POST' })
      .then(async response => {
        if (response.status === 200) {
          const jsonResponse: SignUpResponse = await response.data;
          console.log(jsonResponse)
          sessionStorage.setItem('token', jsonResponse.jwt);
          console.log(JSON.stringify(jwt_decode(jsonResponse.jwt)))
          let tokenPayload: JwtTokenPayload = JSON.parse(JSON.stringify(jwt_decode(jsonResponse.jwt)));
          sessionStorage.setItem('userId', tokenPayload.sub);
          sessionStorage.setItem('name', tokenPayload.name);
          sessionStorage.setItem('email', tokenPayload.email);
          sessionStorage.setItem('profilePic', jsonResponse.profilePic);
          console.log(tokenPayload);
          presentToast(myToastController, "middle", "Welcome aboard " + tokenPayload.name + "!");
          myRouter.navigateByUrl("/home/tabs/tab2");
        }
      })
      .catch(e => {
        console.log(e)
        alert(e)
      })
  }

  private xhrSignUpRequest(form: NgForm) {
    // var raw = JSON.stringify({
    //   "username": form.controls["username"].value,
    //   "password1": form.controls["password1"].value,
    //   "password2": form.controls["password2"].value,
    //   "email": form.controls["email"].value
    // });
    var requestParams: string = "?username=" + form.controls["username"].value +
      "&password1=" + form.controls["password1"].value +
      "&password2=" + form.controls["password2"].value +
      "&email=" + form.controls["email"].value;
    var formData: FormData = new FormData()
    formData.append("profilePic", this.signup.profilePic)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    var myRouter = this.router;
    var myToastController = this.toastController;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(JSON.stringify(JSON.parse(this.responseText)));
        presentToast(myToastController, "top", JSON.stringify(JSON.parse(this.responseText)));

        if (xhr.status == 200) {
          const jsonResponse: SignUpResponse = JSON.parse(this.responseText);
          console.log(jsonResponse)
          sessionStorage.setItem('token', jsonResponse.jwt);
          console.log(JSON.stringify(jwt_decode(jsonResponse.jwt)))
          let tokenPayload: JwtTokenPayload = JSON.parse(JSON.stringify(jwt_decode(jsonResponse.jwt)));
          sessionStorage.setItem('userId', tokenPayload.sub);
          sessionStorage.setItem('name', tokenPayload.name);
          sessionStorage.setItem('email', tokenPayload.email);
          sessionStorage.setItem('profilePic', jsonResponse.profilePic);
          console.log(tokenPayload);
          onLoginLoadProfilePicado(tokenPayload.name, jsonResponse.profilePic)
          presentToast(myToastController, "middle", "Welcome aboard " + tokenPayload.name + "!");
          myRouter.navigateByUrl("/home/tabs/tab2");
        } else
          alert(xhr.status + xhr.responseText)
      }
    });

    xhr.open("POST", GlobalConstants.APIURL + "/user/signup" + requestParams);
    // xhr.setRequestHeader("Content-Type", undefined);
    // xhr.setRequestHeader("Content-Length", formData.get);
    xhr.setRequestHeader("Accept", "*/*");
    // console.log("size of req is "+formData.get("profilePic").length)
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.withCredentials = false;
    presentToast(myToastController, "middle", "Sending request to " + GlobalConstants.APIURL + "/user/signup" + requestParams);
    xhr.send(formData);
  }
}
