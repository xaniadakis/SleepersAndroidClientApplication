import {PostType} from "../dto/post-type";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {SharedService} from "../service/shared.service";

export default class GeneralUtils {

  static equals(string1: string, username: string) {
    return string1 == username;
  }

  static notEmpty(string: string) {
    if (string == null || string.trim().length === 0)
      return false;
    else
      return true;
  }

  public static goBack(router: Router, sharedService: SharedService){
    let postType: PostType = PostType[localStorage.getItem("postType") as PostType]
    console.log("IMMA GO BACK TO: "+postType);
    switch (postType) {
      case PostType.ART:
        sharedService.checkingPosts(postType);
        router.navigateByUrl('/home/tabs/tab1');
        break;
      case PostType.CAR:
        sharedService.checkingPosts(postType);
        router.navigateByUrl('/home/tabs/tab2');
        break;
      case PostType.STORY:
        sharedService.checkingPosts(postType);
        router.navigateByUrl('/home/tabs/tab3');
        break;
      default:
        sharedService.checkingPosts(PostType.STORY);
        router.navigateByUrl('/home/tabs/tab3');
        break;
    }
  }

  getDate(didAt: string, translate: TranslateService): string {
    var didAtDate = new Date(didAt);
    var now = new Date();
    var diffMins = this.diffMinutes(didAtDate, now)
    let diff;

    switch (true) {
      case (diffMins < 1):
        return translate.instant('posts.justNow');
      case (diffMins < 60):
        return diffMins + translate.instant('posts.minutesAgo');
      case (diffMins < 1440):
        diff = this.diffHoursFromMinutes(diffMins);
        if(!this.needsPlural(diff))
          return translate.instant('posts.1hourAgo');
        else
          return diff + translate.instant('posts.hoursAgo');
      case (diffMins < 10080):
        diff = this.diffDaysFromMinutes(diffMins);
        if(!this.needsPlural(diff))
          return translate.instant('posts.1dayAgo');
        else
          return diff + translate.instant('posts.daysAgo');
      case (diffMins > 10080):
        diff = this.diffWeeksFromMinutes(diffMins);
        if(!this.needsPlural(diff))
          return translate.instant('posts.1weekAgo');
        else
          return diff + translate.instant('posts.weeksAgo');
      default:
        return "";
    }
  }

  needsPlural(number: number): boolean{
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


  // @ts-ignore
  static noSpaces(event: KeyboardEvent) {
    let newValue = (<HTMLIonInputElement>event.target)?.value;
    let regExp = new RegExp("\\s", "g");
    if (regExp.test(<string>newValue)) {
      // @ts-ignore
      event.target.value = newValue.slice(0, -1);
    }
  }
}
