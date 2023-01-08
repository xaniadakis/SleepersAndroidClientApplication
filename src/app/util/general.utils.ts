import {PostType} from "../dto/post-type";
import {Router} from "@angular/router";

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

  public static goBack(router: Router){
    let postType: PostType = PostType[localStorage.getItem("postType") as PostType]
    console.log("IMMA GO BACK TO: "+postType);
    switch (postType) {
      case PostType.ART:
        router.navigateByUrl('/home/tabs/tab1');
        break;
      case PostType.CAR:
        router.navigateByUrl('/home/tabs/tab2');
        break;
      case PostType.STORY:
        router.navigateByUrl('/home/tabs/tab3');
        break;
      default:
        router.navigateByUrl('/home/tabs/tab3');
        break;
    }
  }

  getDate(didAt: string): string {
    var didAtDate = new Date(didAt);
    var now = new Date();
    var diffMins = this.diffMinutes(didAtDate, now)
    let diff;

    switch (true) {
      case (diffMins < 1):
        return "just now";
      case (diffMins < 60):
        return diffMins + " minutes ago";
      case (diffMins < 1440):
        diff = this.diffHoursFromMinutes(diffMins);
        return diff+ " hour"+this.addPlural(diff)+" ago";
      case (diffMins < 10080):
        diff = this.diffDaysFromMinutes(diffMins);
        return diff+ " day"+this.addPlural(diff)+" ago";
      case (diffMins > 10080):
        diff = this.diffHoursFromMinutes(diffMins);
        return diff+ " week"+this.addPlural(diff)+" ago";
      default:
        return "";
    }
  }

  addPlural(number: number): string{
    if(number>1)
      return "s";
    else
      return "";
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
