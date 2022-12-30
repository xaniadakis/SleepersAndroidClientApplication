import {SafeResourceUrl} from "@angular/platform-browser";

export enum PostType {
  CAR = "CAR",
  STORY = "STORY",
  ART = "ART",
  ALL = "ALL",
  REFRESH = "REFRESH"
}

export class Video {
  vidLink: string;
  trustedVideoUrl: SafeResourceUrl;
}
