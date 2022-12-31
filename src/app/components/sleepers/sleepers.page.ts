import {Component} from '@angular/core';
import {PostType} from "../../dto/post-type";
import {ActivatedRoute, Router} from "@angular/router";
import {Platform} from "@ionic/angular";
import {SharedService} from "../../service/shared.service";
import {catchError} from "rxjs/operators";
import {empty, throwError} from "rxjs";
import {UserService} from "../../service/user.service";
import {UiUserDto} from "../../dto/get-user-details-response";
import {GlobalConstants} from "../../util/global-constants";
import {DomSanitizer} from "@angular/platform-browser";
import {UiPostDto} from "../../dto/ui-post-dto";

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
  pageNumber = 0;
  pageLimit = 15;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private platform: Platform,
              private sharedService: SharedService,
              private userService: UserService,
              private sanitizer: DomSanitizer) {
    let userIdString = this.route.snapshot.paramMap.get('userId');

    if (userIdString != null)
      this.userId = BigInt(userIdString);

    if (this.myUserIdString != null)
      this.myUserId = BigInt(this.myUserIdString);
    this.sharedService.hideEditButtonForALilWhile(true);
    this.sharedService.hidePostButtonForALilWhile(true);
  }

  ngOnInit() {
    this.getAllUsers(this.pageNumber, this.pageLimit);
    this.sharedService.onRefresh.subscribe({
      next: (value: boolean) => {
        console.log("refreshin sleepers");
        this.pageNumber = 0;
        this.sleepers.splice(0, this.sleepers.length)
        this.getAllUsers(this.pageNumber, this.pageLimit);
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

  doInfinite(event: any) {
    this.pageNumber += 1;
    console.log("Shall fetch userados for page: " + this.pageNumber);
    this.getAllUsers(this.pageNumber, this.pageLimit).then(r => event.target.complete());
  }

  goBack() {
    this.sharedService.hidePostButtonForALilWhile(false);
    this.router.navigateByUrl('/home/tabs/tab3');
  }

  goToProfilePage(id: bigint) {
    this.router.navigateByUrl("/home/profile/" + id+"/"+1);
  }

  setBadge(lastActedAt: string): string {
    if(this.empty(lastActedAt))
      return "<ion-badge style=\"margin-right: 15px\" color=\"danger\">offline</ion-badge>";
    var lastActedAtDate = new Date(lastActedAt);
    var now = new Date();
    // var diffMs = (new Date().valueOf() - lastActedAtDate.valueOf()); // milliseconds between now & Christmas
    var diffMins = this.diffMinutes(lastActedAtDate, now)
    // let string = "<ion-badge style=\"margin-right: 15px\" [color]=\"\"></ion-badge>"
    // return '<ion-badge style=\"margin-right: 15px\" color=\"success\">d:'+diffMins+', '+lastActedAtDate.toString()+'</ion-badge>';

    switch (true) {
      case (diffMins<5):
        return "<ion-badge style=\"margin-right: 15px\" color=\"success\">active</ion-badge>";
        break;
      case (diffMins<60):
        return "<ion-badge style=\"margin-right: 15px\" color=\"warning\">active before "+diffMins+" minutes</ion-badge>";
        break;
      case (diffMins<1500):
        return "<ion-badge style=\"margin-right: 15px\" color=\"warning\">active before "+this.diffHoursFromMinutes(diffMins)+" hours</ion-badge>";
        break;
      default:
        return "<ion-badge style=\"margin-right: 15px\" color=\"danger\">active before "+this.diffDaysFromMinutes(diffMins)+" days</ion-badge>";
        break;
    }
  }

  diffMinutes(date1: Date, date2: Date) {
    return Math.round((date2.getTime() - date1.getTime()) / 60000);
  }

  diffHours(date1: Date, date2: Date) {
    return Math.round((date2.getTime() - date1.getTime()) / 3600000);
  }

  diffHoursFromMinutes(diffMinutes: number) {
    return Math.round(diffMinutes/60);
  }

  diffDaysFromMinutes(diffMinutes: number) {
    return Math.round(diffMinutes/60*24);
  }

  getBadgeColor(lastActedAt: string):string {
    if(this.empty(lastActedAt))
      return 'danger';
    var lastActedAtDate = new Date(lastActedAt);
    var diffMs = (new Date().valueOf() - lastActedAtDate.valueOf()); // milliseconds between now & Christmas
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

    switch (true) {
      case (diffMins<5):
        return 'success';
        break;
      case (diffMins<60):
        return 'warning';
        break;
      default:
        return 'danger';
        break;
    }
  }

  getBadgeText(lastActedAt: string):string {
    if(this.empty(lastActedAt))
      return 'offline';
    var lastActedAtDate = new Date(lastActedAt);
    var diffMs = (new Date().valueOf() - lastActedAtDate.valueOf()); // milliseconds between now & Christmas
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    switch (true) {
      case (diffMins<10):
        return 'active';
        break;
      case (diffMins<60):
        return 'active before '+diffMins+" minutes";
        break;
      case (diffMins<2):
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
}
