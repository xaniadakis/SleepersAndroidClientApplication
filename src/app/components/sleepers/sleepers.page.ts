import {Component} from '@angular/core';
import {PostType} from "../../dto/post-type";
import {ActivatedRoute, Router} from "@angular/router";
import {Platform} from "@ionic/angular";
import {SharedService} from "../../service/shared.service";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {UserService} from "../../service/user.service";
import {UiUserDto} from "../../dto/get-user-details-response";
import {GlobalConstants} from "../../util/global-constants";

@Component({
  selector: 'app-tab1',
  templateUrl: 'sleepers.page.html',
  styleUrls: ['sleepers.page.scss', '../tab2/tab2.page.scss']
})

export class SleepersPage {

  postType: PostType = PostType.ALL;
  userId: bigint;
  myUserIdString: string | null = localStorage.getItem("userId");
  myUserId: bigint;
  fetching: boolean = true;
  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";

  sleepers: UiUserDto[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private platform: Platform,
              private sharedService: SharedService,
              private userService: UserService) {
    let userIdString = this.route.snapshot.paramMap.get('userId');

    if (userIdString != null)
      this.userId = BigInt(userIdString);

    if (this.myUserIdString != null)
      this.myUserId = BigInt(this.myUserIdString);
  }

  ngOnInit() {
    this.getAllUsers();
  }

  async getAllUsers() {
    this.fetching = true;
    this.userService.getAllUsers()
      .pipe(catchError(err => {
        console.log(err);
        return throwError(err);
      }))
      .subscribe(data => {
        console.log(data.message);
        console.log(data.uiUserDtos);
        this.sleepers = data.uiUserDtos;
      });
    this.fetching = false;
  }

  goBack() {
    if (this.userId == this.myUserId) {
      console.log("its me yoo!!");
      this.sharedService.hidePostButtonForALilWhile(true);
      setTimeout(() => {
        this.sharedService.hideEditButtonForALilWhile(false)
      }, 100);
    }
    this.router.navigateByUrl('/home/profile/' + this.userId);
  }
}
