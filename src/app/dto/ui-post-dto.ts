export class UiPostDto {
  id: bigint;
  postedAt: string;
  title: string;
  text: string;
  image: string;
  youtubeVideoId: string;
  owner: string;
  ownerId: bigint;
  ownerProfilePic: string;
  reactionsSize: number;
  commentsSize: number;
}
