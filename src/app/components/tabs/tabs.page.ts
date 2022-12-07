import {Component, ViewChild} from '@angular/core';
import {ActivationStart, Router, RouterOutlet} from "@angular/router";

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


  @ViewChild(RouterOutlet) outlet: RouterOutlet;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(e => {
      if (e instanceof ActivationStart && e.snapshot.outlet === "administration")
        this.outlet.deactivate();
    });
  }
}
