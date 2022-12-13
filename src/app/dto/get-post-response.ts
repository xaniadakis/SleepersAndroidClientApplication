export class GetPostResponse {
  commentsAndLikesDto: CommentsAndLikesDto;
  message: string;
}

export class CommentsAndLikesDto {
  comments: SimpleCommentDto[];
  likes: SimpleReactionDto[];
}

export class SimpleCommentDto {
  owner: string;
  text: string;
  commentedAt: string;
}

export enum ReactionEnum{
  ANGRY="ANGRY",
  TURD="TURD",
  RED_CARD="RED_CARD",
  SAD="SAD",
  LOVE="LOVE"
}

export class SimpleReactionDto {
  owner: string;
  reaction: ReactionEnum;
}


export class FullPostDto {
  id: bigint;

  postedAt: string;

  title: string;

  text: string;

  image: string;

  owner: string;

  postType: string;

  comments: CommentDto[];

  likes: string[];
}

export class UserDto {
  username: string;

  password: string;

  email: string;

  profilePic: string;

  token: string;
}

export class CommentDto {
  id: bigint;

  owner: string;

  text: string;

  commentedAt: string;
}

