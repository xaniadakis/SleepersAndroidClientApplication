import {Component, OnInit} from '@angular/core';
import {SharedService} from "../../service/shared.service";
import {PostType} from "../../dto/post-type";
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import {Capacitor} from "@capacitor/core";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private name: string | null = localStorage.getItem("name");
  private profilePicado: string | null = localStorage.getItem("profilePic");

  constructor(private sharedService: SharedService) {
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      console.log("gotta refresh");
      // location.reload();
      this.sharedService.posted(PostType[localStorage.getItem("postType") as keyof typeof PostType]);
      event.target.complete();
    }, 500);
  };

  ngOnInit() {
    console.log('Initializing PostsPage');
  }
}
