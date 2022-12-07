import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetAllPostsResponse } from '../dto/get-all-posts-response';
import { Observable } from 'rxjs';
import {CreatePostResponse} from "../dto/create-post-response";
import {UiPostDto} from "../dto/ui-post-dto";
import {GlobalConstants} from "../util/global-constants";

@Injectable()
export class StoriesService {

  private postsUrl: string;

  constructor(private http: HttpClient) {
    this.postsUrl = GlobalConstants.APIURL+'/story/';
  }

  public findAll(): Observable<GetAllPostsResponse> {
    return this.http.get<GetAllPostsResponse>(this.postsUrl);
  }

  public save(post: UiPostDto) {
    return this.http.post<CreatePostResponse>(this.postsUrl, post);
  }
}
