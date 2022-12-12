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
  placeIcon = './assets/place4.png';
  carIcon = './assets/carIcon2.png';
  peopleIcon = './assets/people3.png';
  width = "30px";
  height = "30px";

  artType: PostType = PostType.ART;
  carType: PostType = PostType.CAR;
  storyType: PostType = PostType.STORY;

  @ViewChild(RouterOutlet) outlet: RouterOutlet;

  constructor(
    private router: Router,
    public sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(e => {
      if (e instanceof ActivationStart && e.snapshot.outlet === "administration")
        this.outlet.deactivate();
    });
  }

  changedTab(postType: PostType) {
    localStorage.setItem("postType", postType)
    console.log("just changed tab to: "+postType)
  }
}
