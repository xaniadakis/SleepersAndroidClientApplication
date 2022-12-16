import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GetAllPostsResponse} from '../dto/get-all-posts-response';
import {Observable} from 'rxjs';
import {CreatePostResponse} from "../dto/create-post-response";
import {GlobalConstants} from "../util/global-constants";
import {GetCommentsResponse, GetReactionsResponse, ReactionEnum} from "../dto/get-post-response";
import {ModifyPostResponse} from "../dto/modify-post-response";
import {PostType} from "../dto/post-type";
import {DataUrl} from "ngx-image-compress";
import {ProfilePicChangeResponse} from "../dto/profile-pic-change-response";
import {SignOutResponse} from "../dto/sign-out-response";

@Injectable()
export class PostService {

  private getAllPostsUrl: string;
  private getPostCommentsUrl: string;
  private getPostReactionsUrl: string;
  private savePostUrl: string;
  private modifyPostUrl: string;
  private deletePostUrl: string;
  private commentPostUrl: string;
  private reactPostUrl: string;
  private getImageUrl: string;
  private changeProfilePicUrl: string;
  private logoutUrl: string;


  constructor(private http: HttpClient) {
    this.getAllPostsUrl = GlobalConstants.APIURL + '/post/';
    this.modifyPostUrl = GlobalConstants.APIURL + '/post/';
    this.savePostUrl = GlobalConstants.APIURL + '/post/';
    this.deletePostUrl = GlobalConstants.APIURL + '/post/';
    this.commentPostUrl = GlobalConstants.APIURL + '/post/comment/';
    this.reactPostUrl = GlobalConstants.APIURL + '/post/react/';
    this.getPostCommentsUrl = GlobalConstants.APIURL + '/post/comments/';
    this.getPostReactionsUrl = GlobalConstants.APIURL + '/post/reactions/';
    this.getImageUrl = GlobalConstants.APIURL + "/file/image?filename=";
    this.changeProfilePicUrl = GlobalConstants.APIURL + "/user/changeProfilePic";
    this.logoutUrl = GlobalConstants.APIURL + "user/logout";

  }

  public findAll(postType: PostType): Observable<GetAllPostsResponse> {
    return this.http.get<GetAllPostsResponse>(this.getAllPostsUrl +"?postType=" + postType);
  }

  public findAllComments(postId: bigint, postType: string): Observable<GetCommentsResponse> {
    const reqParams = "?postId=" + postId.toString()+ "&postType=" + postType;
    return this.http.get<GetCommentsResponse>(this.getPostCommentsUrl + reqParams);
  }

  public findAllReactions(postId: bigint, postType: string): Observable<GetReactionsResponse> {
    const reqParams = "?postId=" + postId.toString()+ "&postType=" + postType;
    return this.http.get<GetReactionsResponse>(this.getPostReactionsUrl + reqParams);
  }

  public findImage(image: string): Observable<File> {
    return this.http.get<File>(this.getImageUrl + image);
  }

  public saveComment(postId:bigint, text: string, postType: PostType) {
    var comment: FormData = new FormData()
    comment.append("postId", postId.toString())
    comment.append("text", text)
    comment.append("postType", postType)
    return this.http.post<CreatePostResponse>(this.commentPostUrl, comment);
  }

  public saveReaction(postId:bigint, reaction: ReactionEnum, postType: PostType) {
    var react: FormData = new FormData()
    react.append("postId", postId.toString())
    react.append("reaction", reaction)
    react.append("postType", postType)
    return this.http.post<CreatePostResponse>(this.reactPostUrl, react);
  }

  public savePost(text: string | null, image: File, youtubeVideoId: string | null, postType: PostType) {
    var savePost: FormData = new FormData()
    if(text!=null)
      savePost.append("text", text)
    savePost.append("postType", postType)
    savePost.append("image", image)
    if(youtubeVideoId!=null)
      savePost.append("youtubeVideoId", youtubeVideoId)
    return this.http.post<CreatePostResponse>(this.getAllPostsUrl, savePost);
  }

  public modifyPost(postId:bigint, text: string, image: File, youtubeVideoId: string | null, postType: PostType) {
    var modifyPost: FormData = new FormData()
    modifyPost.append("postId", postId.toString())
    modifyPost.append("text", text)
    modifyPost.append("postType", postType)
    modifyPost.append("image", image)
    if(youtubeVideoId!=null)
      modifyPost.append("youtubeVideoId", youtubeVideoId)
    return this.http.put<ModifyPostResponse>(this.modifyPostUrl, modifyPost);
  }

  public deletePost(postId:bigint, postType: PostType) {
    const reqParams = "?postId=" + postId.toString()+ "&postType=" + postType;
    return this.http.delete<ModifyPostResponse>(this.deletePostUrl+reqParams);
  }

  public changeProfilePic(image: File) {
    var formData: FormData = new FormData()
    formData.append("profilePic", image)
    return this.http.post<ProfilePicChangeResponse>(this.changeProfilePicUrl, formData);
  }

  public logOut() {
    return this.http.get<SignOutResponse>(this.logoutUrl);
  }

}
