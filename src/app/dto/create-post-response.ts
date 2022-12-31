export class CreatePostResponse {
  message: string;
  newPostId: bigint;
}

export class CreateCommentResponse {
  message: string;
}

export class ReactResponse {
  message: string;
}

export class ProposeChangeResponse {
  message: string;
  changeProposalId: bigint;
}
