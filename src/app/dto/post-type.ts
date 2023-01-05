import {SafeResourceUrl} from "@angular/platform-browser";

export enum PostType {
  CAR = "CAR",
  STORY = "STORY",
  ART = "ART",
  TRIP = "TRIP",
  ALL = "ALL",
  SLEEPERS = "SLEEPERS",
  FRIEND_REQUESTS = "FRIEND_REQUESTS"
}

export class Video {
  vidLink: string;
  trustedVideoUrl: SafeResourceUrl;
}
