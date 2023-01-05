import {Component, ViewChild} from '@angular/core';
import {ActivationStart, Router, RouterOutlet} from "@angular/router";
import {SharedService} from "../../service/shared.service";
import {PostType} from "../../dto/post-type";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  placeIcon = './assets/place.png';
  carIcon = './assets/carIcon2.png';
  peopleIcon = './assets/Outlawz-nobg.png';
  tripIcon = './assets/map.png';

  width = "30px";
  height = "30px";

  artType: PostType = PostType.ART;
  carType: PostType = PostType.CAR;
  storyType: PostType = PostType.STORY;
  tripType: PostType = PostType.TRIP;

  @ViewChild(RouterOutlet) outlet: RouterOutlet;

  constructor(
    private router: Router,
    public sharedService: SharedService
  ) {
  }

  ngOnInit(): void {
    this.router.events.subscribe(e => {
      if (e instanceof ActivationStart && e.snapshot.outlet === "administration")
        this.outlet.deactivate();
    });
  }

  changedTab(postType: PostType) {
    // const current: PostType = PostType[localStorage.getItem("postType") as PostType];
    // if (postType == current) {
    this.sharedService.refreshed(postType);
    // }
    // else {
    localStorage.setItem("postType", postType)
    console.log("just changed tab to: " + postType)
    // }
  }
}
