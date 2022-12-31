import {Component} from '@angular/core';
import {PostType} from "../../dto/post-type";
import {ActivatedRoute, Router} from "@angular/router";
import {Platform} from "@ionic/angular";
import {SharedService} from "../../service/shared.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'user-posts.page.html',
  styleUrls: ['user-posts.page.scss', '../tab2/tab2.page.scss']
})

export class UserPostsPage {

  postType: PostType = PostType.ALL;
  userId: bigint;
  myUserIdString: string | null = localStorage.getItem("userId");
  myUserId: bigint;
  backToSleepersList: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private platform: Platform,
              private sharedService: SharedService) {
    let userIdString = this.route.snapshot.paramMap.get('userId');

    if (userIdString != null)
      this.userId = BigInt(userIdString);

    if (this.myUserIdString != null)
      this.myUserId = BigInt(this.myUserIdString);

    let naviedFromUsersList = this.route.snapshot.paramMap.get('naviedFromUsersList');
    if (naviedFromUsersList == "1")
      this.backToSleepersList = true;
    else
      this.backToSleepersList = false;
  }

  ngOnInit() {
  }

  goBack() {
    // if (this.userId == this.myUserId) {
    //   console.log("its me yoo!!");
    //   this.sharedService.hidePostButtonForALilWhile(true);
    //   setTimeout(() => {
    //     this.sharedService.hideEditButtonForALilWhile(true);
    //   }, 100);
    // }
    if(this.backToSleepersList)
      this.router.navigateByUrl('/home/sleepers');
    else{
      this.sharedService.hidePostButtonForALilWhile(false);
      this.router.navigateByUrl('/home/tabs/tab3');
    }
  }
}
