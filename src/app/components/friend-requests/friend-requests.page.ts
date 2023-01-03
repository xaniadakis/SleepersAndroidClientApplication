import {Component} from '@angular/core';
import {PostType} from "../../dto/post-type";
import {ActivatedRoute, Router} from "@angular/router";
import {Platform} from "@ionic/angular";
import {SharedService} from "../../service/shared.service";
import {catchError} from "rxjs/operators";
import {empty, throwError} from "rxjs";
import {UserService} from "../../service/user.service";
import {FriendRequestDto, UiUserDto} from "../../dto/get-user-details-response";
import {GlobalConstants} from "../../util/global-constants";
import {DomSanitizer} from "@angular/platform-browser";
import {UiPostDto} from "../../dto/ui-post-dto";
import {ToastService} from "../../service/toast.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'friend-requests.page.html',
  styleUrls: ['friend-requests.page.scss', '../tab2/tab2.page.scss']
})

export class FriendRequestsPage {

  postType: PostType = PostType.ALL;
  userId: bigint;
  myUserIdString: string | null = localStorage.getItem("userId");
  myUserId: bigint;
  fetching: boolean = true;
  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";

  friendRequests: Set<FriendRequestDto> = new Set();
  pageNumber = 0;
  pageLimit = 15;

  noRequests: boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private platform: Platform,
              private sharedService: SharedService,
              private userService: UserService,
              private toastService: ToastService) {
    let userIdString = this.route.snapshot.paramMap.get('userId');

    if (userIdString != null)
      this.userId = BigInt(userIdString);

    if (this.myUserIdString != null)
      this.myUserId = BigInt(this.myUserIdString);
    this.sharedService.hideEditButtonForALilWhile(true);
    this.sharedService.hidePostButtonForALilWhile(true);
  }

  ngOnInit() {
    this.getFriendRequests();
    this.sharedService.onRefresh.subscribe({
      next: (value: boolean) => {
        console.log("refreshin sleepers");
        this.noRequests = false;
        this.friendRequests = new Set<FriendRequestDto>();
        this.getFriendRequests();
      }
    });
  }

  async getFriendRequests() {
    this.fetching = true;
    this.userService.getFriendRequests()
      .pipe(catchError(err => {
        console.log(err);
        return throwError(err);
      }))
      .subscribe(data => {
        console.log(data)
        if (data.size == 0)
          this.noRequests = true
        else
          this.friendRequests = data
      });
    this.fetching = false;
  }

  doInfinite(event: any) {
    this.pageNumber += 1;
    console.log("Shall fetch requados for page: " + this.pageNumber);
    this.getFriendRequests().then(r => event.target.complete());
  }

  goBack() {
    this.sharedService.hidePostButtonForALilWhile(false);
    this.router.navigateByUrl('/home/tabs/tab3');
  }

  // goToProfilePage(id: bigint) {
  //   this.router.navigateByUrl("/home/profile/" + id+"/"+1);
  // }

  setBadge(lastActedAt: string): string {
    if (this.empty(lastActedAt))
      return "danger";
    var lastActedAtDate = new Date(lastActedAt);
    var now = new Date();
    var diffMins = this.diffMinutes(lastActedAtDate, now)

    switch (true) {
      case (diffMins < 5):
        return "success";
        break;
      case (diffMins < 1500):
        return "warning";
        break;
      default:
        return "danger";
        break;
    }
  }

  diffMinutes(date1: Date, date2: Date) {
    return Math.round((date2.getTime() - date1.getTime()) / 60000);
  }

  empty(string: string) {
    if (string == null || string.length === 0)
      return true;
    else
      return false;
  }

  acceptRequest(id: bigint) {
    this.userService.handleFriendRequest(id, true)
      .pipe(catchError(err => {
        console.log(err);
        return throwError(err);
      }))
      .subscribe(data => {
        console.log(data);
        this.ngOnInit();
      });
  }

  rejectRequest(id: bigint) {
    this.userService.handleFriendRequest(id, false)
      .pipe(catchError(err => {
        console.log(err);
        return throwError(err);
      }))
      .subscribe(data => {
        console.log(data);
        this.ngOnInit();
      });
  }
}
