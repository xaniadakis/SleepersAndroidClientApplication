import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Headers} from "node-fetch";
import {JwtTokenPayload, SignInResponse} from "../shared/my-types";
import jwt_decode from "jwt-decode";
import {GlobalConstants} from "../shared/global-constants";

async function presentToast(toastController: ToastController, position: 'top' | 'middle' | 'bottom', message:string) {
  const toast = await toastController.create({
    message: message,
    duration: 1000
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
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss', "../welcome/welcome.page.scss"],
})
export class LoginPage implements OnInit {

  login = {
    // email: '',
    username: '',
    password: ''
  };

  constructor(private toastController: ToastController, private router: Router) {}

  ngOnInit(): void { }

  onLogin(form: NgForm){
    var raw = JSON.stringify({
      "username": form.controls["username"].value,
      "password": form.controls["password"].value
      // "email": form.controls["email"].value
    });

    var xhr = new XMLHttpRequest();
    console.log(raw);

    var myRouter = this.router;
    var myToastController = this.toastController;
    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        console.log(JSON.stringify(JSON.parse(this.responseText)));
        if (xhr.status == 200) {
          const jsonResponse: SignInResponse = JSON.parse(this.responseText);
          console.log(jsonResponse)
          sessionStorage.setItem('token', jsonResponse.jwt);
          console.log(JSON.stringify(jwt_decode(jsonResponse.jwt)))
          let tokenPayload: JwtTokenPayload = JSON.parse(JSON.stringify(jwt_decode(jsonResponse.jwt)));
          sessionStorage.setItem('userId', tokenPayload.sub);
          sessionStorage.setItem('name', tokenPayload.name);
          sessionStorage.setItem('email', tokenPayload.email);
          sessionStorage.setItem('profilePic', jsonResponse.profilePic);
          console.log(tokenPayload);
          presentToast(myToastController, "middle", "Welcome "+tokenPayload.name+"!");
          onLoginLoadProfilePicado(tokenPayload.name, jsonResponse.profilePic)
          myRouter.navigateByUrl("/home/tabs/tab2");
        } else
          alert(xhr.status + xhr.responseText)
      }
    });

    xhr.open("POST", GlobalConstants.APIURL+"/user/login");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.withCredentials = false;
    xhr.send(raw);
  }

}
