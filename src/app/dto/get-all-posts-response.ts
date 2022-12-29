import {UiPostDto} from "./ui-post-dto";

export class GetAllPostsResponse {
  message: string;
  postDtos: UiPostDto[];
}

export class GetPostResponse {
  message: string;
  postDto: UiPostDto;
}
