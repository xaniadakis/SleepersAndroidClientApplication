import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GetAllPostsResponse} from '../dto/get-all-posts-response';
import {Observable} from 'rxjs';
import {CreatePostResponse} from "../dto/create-post-response";
import {GlobalConstants} from "../util/global-constants";
import {GetPostResponse, ReactionEnum} from "../dto/get-post-response";
import {ModifyPostResponse} from "../dto/modify-post-response";
import {PostType} from "../dto/post-type";

@Injectable()
export class PostService {

  private getAllPostsUrl: string;
  private getPostCommentsAndLikesUrl: string;
  private savePostUrl: string;
  private modifyPostUrl: string;
  private deletePostUrl: string;
  private commentPostUrl: string;
  private reactPostUrl: string;
  private getImageUrl: string;

  constructor(private http: HttpClient) {
    this.getAllPostsUrl = GlobalConstants.APIURL + '/post/';
    this.modifyPostUrl = GlobalConstants.APIURL + '/post/';
    this.savePostUrl = GlobalConstants.APIURL + '/post/';
    this.deletePostUrl = GlobalConstants.APIURL + '/post/';
    this.commentPostUrl = GlobalConstants.APIURL + '/post/comment/';
    this.reactPostUrl = GlobalConstants.APIURL + '/post/react/';
    this.getPostCommentsAndLikesUrl = GlobalConstants.APIURL + '/post/commentsAndLikes/';
    this.getImageUrl = GlobalConstants.APIURL + "/file/image?filename=";
  }

  public findAll(postType: PostType): Observable<GetAllPostsResponse> {
    return this.http.get<GetAllPostsResponse>(this.getAllPostsUrl +"?postType=" + postType);
  }

  public findAllCommentsAndLikes(userId: string, postId: bigint, postType: string): Observable<GetPostResponse> {
    const reqParams = "?userId=" + userId + "&postId=" + postId.toString()+ "&postType=" + postType;
    return this.http.get<GetPostResponse>(this.getPostCommentsAndLikesUrl + reqParams);
  }

  public findImage(image: string): Observable<File> {
    return this.http.get<File>(this.getImageUrl + image);
  }

  public saveComment(userId: string, postId:bigint, text: string, postType: PostType) {
    var comment: FormData = new FormData()
    comment.append("userId", userId)
    comment.append("postId", postId.toString())
    comment.append("text", text)
    comment.append("postType", postType)
    return this.http.post<CreatePostResponse>(this.commentPostUrl, comment);
  }

  public saveReaction(userId: string, postId:bigint, reaction: ReactionEnum) {
    var comment: FormData = new FormData()
    comment.append("userId", userId)
    comment.append("postId", postId.toString())
    comment.append("reaction", reaction)
    return this.http.post<CreatePostResponse>(this.commentPostUrl, comment);
  }

  public savePost(userId: string, text: string, image: File, postType: PostType) {
    var savePost: FormData = new FormData()
    savePost.append("userId", userId)
    savePost.append("text", text)
    savePost.append("postType", postType)
    savePost.append("image", image)
    return this.http.post<CreatePostResponse>(this.getAllPostsUrl, savePost);
  }

  public modifyPost(userId: string, postId:bigint, text: string, image:any, postType: PostType) {
    var modifyPost: FormData = new FormData()
    modifyPost.append("userId", userId)
    modifyPost.append("postId", postId.toString())
    modifyPost.append("text", text)
    modifyPost.append("postType", postType)
    modifyPost.append("image", image)
    return this.http.post<ModifyPostResponse>(this.modifyPostUrl, modifyPost);
  }

  public deletePost(userId: string, postId:bigint, postType: PostType) {
    const reqParams = "?userId=" + userId + "&postId=" + postId.toString()+ "&postType=" + postType;
    return this.http.delete<ModifyPostResponse>(this.deletePostUrl+reqParams);
  }

}
