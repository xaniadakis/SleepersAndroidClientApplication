import {Component, OnInit} from '@angular/core';
import {SharedService} from "../../service/shared.service";
import {PostType} from "../../dto/post-type";

// function onLoginLoadProfilePicado(username:string | null, profilePicName: string | null){
//   console.log("picado lanado")
//   const profilePic: string = GlobalConstants.APIURL+"/file/image?filename="+profilePicName;
//   const profilePicDiv: HTMLElement | null = document.getElementById("profilePic");
//   if(profilePicDiv != null) {
//     profilePicDiv.innerHTML = "<div class=\"container\">\n" +
//       "  <div class=\"outer\">\n" +
//       "    <ion-avatar>\n" +
//       "       <img alt=\""+username+"'s Profile Picture\" id=\"profilePicImg\" src=\"" + profilePic + "\"/>\n" +
//       "    </ion-avatar>\n" +
//       // "    <ion-img height=\"50px;\" width=\"50px;\" alt=\""+username+"'s Profile Picture\" id=\"profilePicImg\" src=\"" + profilePic + "\"></ion-img>\n" +
//       "    <div class=\"inner\">\n" +
//       "    <input class=\"inputfile\" type=\"file\" name=\"pic\" accept=\"image/*\">\n" +
//       "    <label><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"17\" viewBox=\"0 0 20 17\"><path d=\"M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z\"></path></svg></label>\n" +
//       "    </div>\n" +
//       "  </div>\n" +
//       "</div>";
//
//     //   "<ion-card class=\"card info-card\">\n" +
//     //   "<ion-img height=\"50px;\" width=\"50px;\" alt=\""+username+"'s Profile Picture\" id=\"profilePicImg\" src=\"" + profilePic + "\"></ion-img>\n" +
//     //   "<ion-row><ion-item>Welcome "+username+ "!</ion-item></ion-row>"
//     // "</ion-card>";
//     console.log(profilePicDiv.innerHTML)
//   }else console.log("null profilePicDiv");
// }

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private name: string | null = localStorage.getItem("name");
  private profilePicado: string | null = localStorage.getItem("profilePic");

  constructor(private sharedService: SharedService) { }

  handleRefresh(event: any) {
    setTimeout(() => {
      console.log("gotta refresh");
      // location.reload();
      this.sharedService.posted(PostType[localStorage.getItem("postType") as keyof typeof PostType]);
      event.target.complete();
    }, 500);
  };

  ngOnInit() {
    console.log('Initializing ProfilePage');
  }

}
