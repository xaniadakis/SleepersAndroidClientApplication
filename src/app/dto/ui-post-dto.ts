export class UiPostDto {
  id: bigint;
  postedAt: string;
  title: string;
  text: string;
  image: string;
  youtubeVideoId: string;
  owner: string;
  ownerId: bigint;
  ownerLastActedAt: string;
  ownerProfilePic: string;
  reactionsSize: number;
  commentsSize: number;
}

export class UiEventDto {
  id: bigint;
  announcedAt: string;
  willOccurAtTime: string;
  willOccurAtPlace: string;
  title: string;
  text: string;
  image: string;
  owner: string;
  ownerId: bigint;
  ownerLastActedAt: string;
  ownerProfilePic: string;
  participationsSize: number;
  reactionsSize: number;
  commentsSize: number;
}
