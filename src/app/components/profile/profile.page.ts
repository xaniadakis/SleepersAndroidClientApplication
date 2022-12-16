import {Component, OnInit} from '@angular/core';
import {SharedService} from "../../service/shared.service";
import {PostType} from "../../dto/post-type";
import {GlobalConstants} from "../../util/global-constants";
import {Router} from "@angular/router";
import {Platform} from "@ionic/angular";


@Component({
  selector: 'app-home-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";
  name: string | null = localStorage.getItem("name");
  profilePicado: string | null = localStorage.getItem("profilePic");

  constructor(private sharedService: SharedService,
              private router: Router,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(9999, (processNextHandler) => {
      this.sharedService.hidePostButtonForALilWhile(false);
      this.router.navigateByUrl('/home/tabs/tab3');
    })
  }

  ngOnInit() {
    this.sharedService.hidePostButtonForALilWhile(true);
    console.log('Initializing ProfilePage');
  }

  goBack() {
    this.sharedService.hidePostButtonForALilWhile(false);
    this.router.navigateByUrl('/home/tabs/tab3');
  }
}
