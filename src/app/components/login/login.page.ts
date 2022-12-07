import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Headers} from "node-fetch";
import jwt_decode from "jwt-decode";
import {SignInResponse} from "../../dto/sign-in-response";
import {JwtTokenPayload} from "../../dto/jwt-token";
import {GlobalConstants} from "../../util/global-constants";
import {SharedService} from "../../service/shared.service";

async function presentToast(toastController: ToastController, position: 'top' | 'middle' | 'bottom', message:string) {
  const toast = await toastController.create({
    message: message,
    duration: 1000
  });
  await toast.present();
}

function onLoginLoadProfilePicado(username:string, profilePicName: string){
  console.log("picado lanado")
  const profilePic: string = GlobalConstants.APIURL+"/file/image?filename="+profilePicName;
  const profilePicDiv: HTMLElement | null = document.getElementById("profilePic");
  if(profilePicDiv != null) {
    profilePicDiv.innerHTML = "<div class=\"container\">\n" +
      "  <div class=\"outer\">\n" +
      "    <ion-avatar>\n" +
      "       <img alt=\""+username+"'s Profile Picture\" id=\"profilePicImg\" src=\"" + profilePic + "\"/>\n" +
      "    </ion-avatar>\n" +
      // "    <ion-img height=\"50px;\" width=\"50px;\" alt=\""+username+"'s Profile Picture\" id=\"profilePicImg\" src=\"" + profilePic + "\"></ion-img>\n" +
      "    <div class=\"inner\">\n" +
      "    <input class=\"inputfile\" type=\"file\" name=\"pic\" accept=\"image/*\">\n" +
      "    <label><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"17\" viewBox=\"0 0 20 17\"><path d=\"M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z\"></path></svg></label>\n" +
      "    </div>\n" +
      "  </div>\n" +
      "</div>";

    //   "<ion-card class=\"card info-card\">\n" +
    //   "<ion-img height=\"50px;\" width=\"50px;\" alt=\""+username+"'s Profile Picture\" id=\"profilePicImg\" src=\"" + profilePic + "\"></ion-img>\n" +
    //   "<ion-row><ion-item>Welcome "+username+ "!</ion-item></ion-row>"
    // "</ion-card>";
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

  constructor(private toastController: ToastController, private router: Router, private sharedService: SharedService) {}

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
    var sharedService = this.sharedService;
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
          sharedService.fire(true);
          console.log(tokenPayload);
          presentToast(myToastController, "middle", "Welcome "+tokenPayload.name+"!");
          // onLoginLoadProfilePicado(tokenPayload.name, jsonResponse.profilePic)
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
