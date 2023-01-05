import {Component, ElementRef, ViewChild} from '@angular/core';

import {Map, Marker, NavigationControl, Popup} from 'maplibre-gl';
import {Router} from "@angular/router";
import {SharedService} from "../../service/shared.service";
import {UiEventDto} from "../../dto/ui-post-dto";
import {GlobalConstants} from "../../util/global-constants";
import {UserService} from "../../service/user.service";
import {ToastService} from "../../service/toast.service";

@Component({
  selector: 'app-events',
  templateUrl: 'events.page.html',
  styleUrls: ['events.page.scss', '../tab2/tab2.page.scss']
})
export class EventsPage {

  event1: UiEventDto = {
    id: BigInt(1),
    announcedAt: "2023-01-04 00:11",
    willOccurAtTime: "2023-01-04 00:11",
    willOccurAtPlace: "place",
    title: "eventTitle",
    text: "eventText",
    image: "20230104001132.jpg",
    owner: "ΒΑCΙλΕΙΟC",
    ownerId: BigInt(38),
    ownerLastActedAt: "2023-01-04 00:36",
    ownerProfilePic: "IMG-99fa2269f785fe368650c296e9c379be-V.jpg",
    participationsSize: 2,
    reactionsSize: 3,
    commentsSize: 2
  };
  event2: UiEventDto = {
    id: BigInt(2),
    announcedAt: "2023-01-04 00:11",
    willOccurAtTime: "2023-01-04 00:11",
    willOccurAtPlace: "place",
    title: "eventTitle",
    text: "eventText",
    image: "20230104001132.jpg",
    owner: "fake",
    ownerId: BigInt(3),
    ownerLastActedAt: "2023-01-04 12:43",
    ownerProfilePic: "papers.co-nd57-mountain-fog-nature-view-wood-forest-29-wallpaper.jpg",
    participationsSize: 2,
    reactionsSize: 3,
    commentsSize: 2
  };

  events: UiEventDto[] = [this.event1, this.event2];
  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";

  map: Map | undefined;
  lat = 37.9696;
  lng = 23.7662;
  zoom = 14;
  di = [37.96962541227876, 23.7662103924327]

  geojson = {
    'type': 'FeatureCollection', 'features': [{
      'type': 'Feature', 'properties': {
        'className': 'diMarker', 'message': 'Hi from di UoA', 'iconSize': [60, 60]
      }, 'geometry': {
        'type': 'Uni', 'coordinates': this.di
      }
    }, {
      'type': 'Feature', 'properties': {
        'className': 'androidDeviceMarker', 'message': 'Hi this is me', 'iconSize': [50, 50]
      }, 'geometry': {
        'type': 'AndroidDevice1',
        'coordinates': [this.di[0] + 0.003, this.di[1] + 0.003]
      }
    },
      {
        'type': 'Feature', 'properties': {
          'className': 'iotDeviceMarker', 'message': 'Bye lad', 'iconSize': [40, 40]
        }, 'geometry': {
          'type': 'iotDevice1', 'coordinates': [this.di[0] - 0.005, this.di[1] - 0.0005]
        }
      },
      {
        'type': 'Feature', 'properties': {
          'className': 'iotDeviceMarker', 'message': 'Bye lad', 'iconSize': [40, 40]
        }, 'geometry': {
          'type': 'iotDevice2', 'coordinates': [this.di[0] + 0.005, this.di[1] + 0.005]
        }
      }]
  };


  constructor(private router: Router,
              private sharedService: SharedService,
              private toastService: ToastService) {
    this.sharedService.hideEditButtonForALilWhile(true);
    this.sharedService.hidePostButtonForALilWhile(true);
    this.sharedService.imOnEventsTab(true);
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  goBack() {
    this.sharedService.imOnEventsTab(false);
    setTimeout(() => {
      this.sharedService.hidePostButtonForALilWhile(false);
    }, 200);
    this.router.navigateByUrl('/home/tabs/tab3');
  }


  goToProfilePage(ownerId: bigint) {
    this.router.navigateByUrl("/home/profile/" + ownerId + "/" + 0);
  }

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

  notEmpty(string: string) {
    if (string == null || string.trim().length === 0)
      return false;
    else
      return true;
  }
}
