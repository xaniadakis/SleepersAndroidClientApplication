import {Component} from '@angular/core';
import {PostType} from "../../dto/post-type";
import {ActivatedRoute, Router} from "@angular/router";
import {Platform} from "@ionic/angular";
import {SharedService} from "../../service/shared.service";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {UserService} from "../../service/user.service";
import {FriendRequestStatusEnum, UiUserDto} from "../../dto/get-user-details-response";
import {GlobalConstants} from "../../util/global-constants";
import {ToastService} from "../../service/toast.service";
import GeneralUtils from "../../util/general.utils";
import {TranslateService} from "@ngx-translate/core";

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
  friends: UiUserDto[] = [];
  pageNumber = 0;
  pageLimit = 15;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private platform: Platform,
              private sharedService: SharedService,
              private userService: UserService,
              private toastService: ToastService,
              public translate: TranslateService) {
    let userIdString = this.route.snapshot.paramMap.get('userId');

    if (userIdString != null)
      this.userId = BigInt(userIdString);

    if (this.myUserIdString != null)
      this.myUserId = BigInt(this.myUserIdString);
    this.sharedService.checkingOtherSection(true, PostType.SLEEPERS);
  }

  ngOnInit() {
    this.getAllFriends();
    this.getNonFriends();
    // this.getAllUsers(this.pageNumber, this.pageLimit);
    this.sharedService.onSleeperRefresh.subscribe({
      next: (value: boolean) => {
        console.log("refreshin sleepers");
        // this.pageNumber = 0;
        this.sleepers.splice(0, this.sleepers.length)
        this.friends.splice(0, this.friends.length)
        this.getAllFriends();
        this.getNonFriends();
        // this.getAllUsers(this.pageNumber, this.pageLimit);
      }
    });
  }

  async getAllUsers(pageNumber: number, pageLimit: number) {
    this.fetching = true;
    this.userService.getAllUsers(pageNumber, pageLimit)
      .pipe(catchError(err => {
        console.log(err);
        return throwError(err);
      }))
      .subscribe(data => {

        console.log(data.message);
        console.log(data.uiUserDtos);
        for (let i = 0; i < data.uiUserDtos.length; i++) {
          this.sleepers.push(data.uiUserDtos[i]);
        }
        // this.sleepers = data.uiUserDtos;
      });
    this.fetching = false;
  }

  async getAllFriends() {
    this.fetching = true;
    this.userService.getFriends()
      .pipe(catchError(err => {
        console.log(err);
        return throwError(err);
      }))
      .subscribe(data => {
        // console.log(data.message);
        console.log(data);
        // for (let i = 0; i < data.length; i++) {
        //   this.friends.push(data[i]);
        // }
        this.friends = data;
        this.friends.sort(function (a, b) {
          return new Date(b.lastActedAt).valueOf() - new Date(a.lastActedAt).valueOf();
        });
      });
    this.fetching = false;
  }

  async getNonFriends() {
    this.fetching = true;
    this.userService.getNonFriends()
      .pipe(catchError(err => {
        console.log(err);
        return throwError(err);
      }))
      .subscribe(data => {
        // console.log(data.message);
        console.log(data);
        // for (let i = 0; i < data.length; i++) {
        //   this.friends.push(data[i]);
        // }
        this.sleepers = data;
        this.sleepers.sort(function (a, b) {
          return new Date(b.lastActedAt).valueOf() - new Date(a.lastActedAt).valueOf();
        });
      });
    this.fetching = false;
  }

  doInfinite(event: any) {
    this.pageNumber += 1;
    console.log("Shall fetch userados for page: " + this.pageNumber);
    this.getAllUsers(this.pageNumber, this.pageLimit).then(r => event.target.complete());
  }

  goBack() {
    GeneralUtils.goBack(this.router, this.sharedService);
  }

  goToProfilePage(id: bigint) {
    this.router.navigateByUrl("/home/profile/" + id + "/" + 1);
  }

  setBadge(lastActedAt: string): string {
    const html = (color: string, diff: string) => `<ion-badge style=\"margin-right: 10px\" color=\"${color}\">${diff}</ion-badge>`;
    if (this.empty(lastActedAt))
      return html('dark', this.translate.instant('sleepers.offline'));
    var lastActedAtDate = new Date(lastActedAt);
    var now = new Date();
    var diffMins = this.diffMinutes(lastActedAtDate, now);
    let diff;
    switch (true) {
      case (diffMins < 5):
        return html('success', this.translate.instant('sleepers.active'));
      case (diffMins < 60):
        return html('warning', this.translate.instant('sleepers.activeBeforeMinutes', {n: diffMins}));
      case (diffMins < 1380):
        diff = this.diffHoursFromMinutes(diffMins);
        if(!this.needsPlural(diff))
          return html('warning', this.translate.instant('sleepers.activeBefore1hour'));
        else
          return html('warning', this.translate.instant('sleepers.activeBeforeHours', {n: diff}));
      case (diffMins < 10080):
        diff = this.diffDaysFromMinutes(diffMins);
        if(!this.needsPlural(diff))
          return html('danger', this.translate.instant('sleepers.activeBefore1day'));
        else
          return html('danger', this.translate.instant('sleepers.activeBeforeDays', {n: diff}));
      case (diffMins > 10080):
        diff = this.diffWeeksFromMinutes(diffMins);
        if(!this.needsPlural(diff))
          return html('danger', this.translate.instant('sleepers.activeBefore1week'));
        else
          return html('danger', this.translate.instant('sleepers.activeBeforeWeeks', {n: diff}));
      default:
        return html('dark', this.translate.instant('sleepers.offline'));
    }
  }

  needsPlural(number: number): boolean {
    return number > 1;
  }

  diffMinutes(date1: Date, date2: Date) {
    return Math.round((date2.getTime() - date1.getTime()) / 60000);
  }

  diffHours(date1: Date, date2: Date) {
    return Math.round((date2.getTime() - date1.getTime()) / 3600000);
  }

  diffHoursFromMinutes(diffMinutes: number) {
    return Math.round(diffMinutes / 60);
  }

  diffDaysFromMinutes(diffMinutes: number) {
    return Math.round(diffMinutes / (60 * 24));
  }

  diffWeeksFromMinutes(diffMinutes: number) {
    return Math.round(diffMinutes / (60 * 24 * 7));
  }

  getBadgeColor(lastActedAt: string): string {
    if (this.empty(lastActedAt))
      return 'danger';
    var lastActedAtDate = new Date(lastActedAt);
    var diffMs = (new Date().valueOf() - lastActedAtDate.valueOf()); // milliseconds between now & Christmas
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

    switch (true) {
      case (diffMins < 5):
        return 'success';
        break;
      case (diffMins < 60):
        return 'warning';
        break;
      default:
        return 'danger';
        break;
    }
  }

  getBadgeText(lastActedAt: string): string {
    if (this.empty(lastActedAt))
      return 'offline';
    var lastActedAtDate = new Date(lastActedAt);
    var diffMs = (new Date().valueOf() - lastActedAtDate.valueOf()); // milliseconds between now & Christmas
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    switch (true) {
      case (diffMins < 10):
        return 'active';
        break;
      case (diffMins < 60):
        return 'active before ' + diffMins + " minutes";
        break;
      case (diffMins < 2):
        return 'active last hour';
      default:
        return 'offline';
        break;
    }
  }

  empty(string: string) {
    if (string == null || string.length === 0)
      return true;
    else
      return false;
  }

  addFriend(friendId: bigint, friendName: string) {
    this.userService.addFriend(friendId)
      .pipe(catchError(err => {
        this.toastService.presentToastWithDuration("middle", err, 3000);
        // this.oldPasswordWrong;
        // window.alert(err);
        return throwError(err);
      }))
      .subscribe(data => {
        console.log(data);
        if (data.status == FriendRequestStatusEnum.SENT)
          this.toastService.presentToastWithDuration("middle", "Sent a friend request to " + friendName, 1500);
        else if (data.status == FriendRequestStatusEnum.PENDING)
          this.toastService.presentToastWithDuration("middle", "There is already a pending friend request to " + friendName, 1500);
        else if (data.status == FriendRequestStatusEnum.ALREADY_FRIENDS)
          this.toastService.presentToastWithDuration("middle", "You are already friends with " + friendName, 1500);
        else if (data.status == FriendRequestStatusEnum.FAILED)
          this.toastService.presentToastWithDuration("middle", "There was an error while sending a friend request towards " + friendName, 1500);
      });
  }

  unfriend(friendId: bigint, friendName: string) {
    this.userService.unfriend(friendId)
      .pipe(catchError(err => {
        this.toastService.presentToastWithDuration("middle", err, 3000);
        return throwError(err);
      }))
      .subscribe(data => {
        console.log(data);
        this.toastService.presentToastWithDuration("middle", "Lil " + friendName + " is no longer your buddy for now..", 1500);
        let deletedFriend: UiUserDto | undefined = this.friends.find(UiUserDto => UiUserDto.id === data.unfriendId);
        if (deletedFriend == undefined)
          return;
        let friendIndex = this.friends.indexOf(deletedFriend); // 👉️
        if (friendIndex > -1)
          this.friends.splice(friendIndex, 1);
        this.sleepers.unshift(deletedFriend);
      });
  }
}
