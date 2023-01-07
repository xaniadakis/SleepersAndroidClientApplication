import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GetAllPostsResponse, GetPostResponse} from '../dto/get-all-posts-response';
import {Observable} from 'rxjs';
import {CreatePostResponse, ProposeChangeResponse} from "../dto/create-post-response";
import {GlobalConstants} from "../util/global-constants";
import {GetCommentsResponse, GetReactionsResponse, ReactionEnum} from "../dto/get-post-response";
import {ModifyPostResponse} from "../dto/modify-post-response";
import {PostType} from "../dto/post-type";
import {DeletePostResponse} from "../dto/delete-post-response";

@Injectable()
export class PostService {

  private getAllPostsUrl: string;
  private getAllPostsOfUserUrl: string;
  private getPostUrl: string;
  private getPostCommentsUrl: string;
  private getLastPostCommentsUrl: string;
  private getPostReactionsUrl: string;
  private savePostUrl: string;
  private savePostV2Url: string;
  private modifyPostUrl: string;
  private modifyPostV2Url: string;
  private deletePostUrl: string;
  private commentPostUrl: string;
  private reactPostUrl: string;
  private getImageUrl: string;
  private proposeChangeUrl: string;

  constructor(private http: HttpClient) {
    this.getAllPostsUrl = GlobalConstants.APIURL + '/post/';
    this.getAllPostsOfUserUrl = GlobalConstants.APIURL + '/post/ofUser/';
    this.getPostUrl = GlobalConstants.APIURL + '/post/unique/';
    this.modifyPostUrl = GlobalConstants.APIURL + '/post/';
    this.modifyPostV2Url = GlobalConstants.APIURL + '/post/v2/';
    this.savePostUrl = GlobalConstants.APIURL + '/post/';
    this.savePostV2Url = GlobalConstants.APIURL + '/post/v2/';
    this.deletePostUrl = GlobalConstants.APIURL + '/post/';
    this.commentPostUrl = GlobalConstants.APIURL + '/post/comment/';
    this.reactPostUrl = GlobalConstants.APIURL + '/post/react/';
    this.getPostCommentsUrl = GlobalConstants.APIURL + '/post/comments/';
    this.getLastPostCommentsUrl = GlobalConstants.APIURL + '/post/lastComments/';
    this.getPostReactionsUrl = GlobalConstants.APIURL + '/post/reactions/';
    this.getImageUrl = GlobalConstants.APIURL + "/file/image?filename=";
    this.proposeChangeUrl = GlobalConstants.APIURL + "/post/changeProposal/";
  }

  public findAll(postType: PostType, pageNumber: number, pageLimit: number): Observable<GetAllPostsResponse> {
    return this.http.get<GetAllPostsResponse>(this.getAllPostsUrl + "?postType=" + postType + "&pageNumber=" + pageNumber + "&pageLimit=" + pageLimit);
  }

  public findAllOfUser(userId: bigint, pageNumber: number, pageLimit: number): Observable<GetAllPostsResponse> {
    return this.http.get<GetAllPostsResponse>(this.getAllPostsOfUserUrl
      + "?pageNumber=" + pageNumber + "&pageLimit=" + pageLimit + "&userId=" + userId);
  }

  public findPost(postId: bigint): Observable<GetPostResponse> {
    return this.http.get<GetPostResponse>(this.getPostUrl + "?postId=" + postId);
  }

  public findAllComments(postId: bigint): Observable<GetCommentsResponse> {
    const reqParams = "?postId=" + postId.toString();
    return this.http.get<GetCommentsResponse>(this.getPostCommentsUrl + reqParams);
  }

  public findLastComments(postId: bigint, fromDate: string): Observable<GetCommentsResponse> {
    const reqParams = "?postId=" + postId.toString() + "&commentedAt=" + fromDate;
    return this.http.get<GetCommentsResponse>(this.getLastPostCommentsUrl + reqParams);
  }

  public findAllReactions(postId: bigint): Observable<GetReactionsResponse> {
    const reqParams = "?postId=" + postId.toString();
    return this.http.get<GetReactionsResponse>(this.getPostReactionsUrl + reqParams);
  }

  public findImage(image: string): Observable<File> {
    return this.http.get<File>(this.getImageUrl + image);
  }

  public saveComment(postId: bigint, text: string) {
    var comment: FormData = new FormData()
    comment.append("postId", postId.toString())
    comment.append("text", text)
    return this.http.post<CreatePostResponse>(this.commentPostUrl, comment);
  }

  public saveReaction(postId: bigint, reaction: ReactionEnum) {
    var react: FormData = new FormData()
    react.append("postId", postId.toString())
    react.append("reaction", reaction)
    return this.http.post<CreatePostResponse>(this.reactPostUrl, react);
  }

  public savePost(text: string | null, image: File, youtubeVideoId: string | null, postType: PostType, uploadImage: boolean) {
    var savePost: FormData = new FormData()
    if (text != null)
      savePost.append("text", text)
    savePost.append("postType", postType)
    if (uploadImage) {
      console.log("imma upload: " + image.name.toString() + " of type: " + image.type + " and size: " + image.size);
      savePost.append("image", image)
    }
    if (youtubeVideoId != null)
      savePost.append("youtubeVideoId", youtubeVideoId)
    return this.http.post<CreatePostResponse>(this.savePostUrl, savePost);
  }

  public savePostV2(text: string | null, image: string | null, youtubeVideoId: string | null, postType: PostType, uploadImage: boolean) {
    var savePost: FormData = new FormData()
    if (text != null)
      savePost.append("text", text)
    savePost.append("postType", postType)
    if (uploadImage && image != null) {
      console.log("imma upload: " + image);
      console.log("size: " + image.length);
      savePost.append("image", image)
    }
    if (youtubeVideoId != null)
      savePost.append("youtubeVideoId", youtubeVideoId)
    return this.http.post<CreatePostResponse>(this.savePostV2Url, savePost);
  }

  public modifyPost(postId: bigint, text: string, image: File, youtubeVideoId: string | null) {
    var modifyPost: FormData = new FormData()
    modifyPost.append("postId", postId.toString())
    modifyPost.append("text", text)
    // modifyPost.append("newPostType", newPostType)
    modifyPost.append("image", image)
    if (youtubeVideoId != null)
      modifyPost.append("youtubeVideoId", youtubeVideoId)
    return this.http.put<ModifyPostResponse>(this.modifyPostUrl, modifyPost);
  }

  public modifyPostV2(postId: bigint, text: string, image: string | null, youtubeVideoId: string | null) {
    var modifyPost: FormData = new FormData()
    modifyPost.append("postId", postId.toString())
    modifyPost.append("text", text)
    // modifyPost.append("newPostType", newPostType)
    if (image != null) {
      console.log("imma upload: " + image);
      console.log("size: " + image.length);
      modifyPost.append("image", image)
    } else
      console.log("image be null");
    if (youtubeVideoId != null)
      modifyPost.append("youtubeVideoId", youtubeVideoId)
    return this.http.put<ModifyPostResponse>(this.modifyPostV2Url, modifyPost);
  }

  public deletePost(postId: bigint) {
    const reqParams = "?postId=" + postId.toString();
    return this.http.delete<DeletePostResponse>(this.deletePostUrl + reqParams);
  }

  public proposeChange(text: string | null, image: string | null, uploadImage: boolean) {
    var savePost: FormData = new FormData()
    if (text != null)
      savePost.append("text", text)
    if (uploadImage && image != null) {
      console.log("imma upload: " + image);
      console.log("size: " + image.length);
      savePost.append("image", image)
    }
    return this.http.post<ProposeChangeResponse>(this.proposeChangeUrl, savePost);
  }
}
