import {EventEmitter, Injectable} from '@angular/core'
import {PostType} from "../dto/post-type";


@Injectable()
export class SharedService {
  public onChange: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onProfileTab: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onAFriendsProfileTab: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public editProfile: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  public onCarPost: EventEmitter<bigint> = new EventEmitter<bigint>();
  public onArtPost: EventEmitter<bigint> = new EventEmitter<bigint>();
  public onStory: EventEmitter<bigint> = new EventEmitter<bigint>();

  public onRefresh: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  public onArtEditOrReact: EventEmitter<bigint> = new EventEmitter<bigint>();
  public onStoryEditOrReact: EventEmitter<bigint> = new EventEmitter<bigint>();
  public onCarEditOrReact: EventEmitter<bigint> = new EventEmitter<bigint>();
  public onStoryDelete: EventEmitter<bigint> = new EventEmitter<bigint>();
  public onArtDelete: EventEmitter<bigint> = new EventEmitter<bigint>();
  public onCarDelete: EventEmitter<bigint> = new EventEmitter<bigint>();

  public refreshed() {
    this.onRefresh.emit(true);
  }

  public fire(value: boolean) {
    this.onChange.emit(value);
  }

  public hidePostButtonForALilWhile(value: boolean) {
    this.onProfileTab.emit(value);
  }

  public hideEditButtonForALilWhile(value: boolean) {
    this.onAFriendsProfileTab.emit(value);
  }

  public immaEditProfile(value: boolean) {
    this.editProfile.emit(value);
  }

  public posted(postType: PostType, postId: bigint) {
    switch (postType) {
      case PostType.ART:
        this.onArtPost.emit(postId);
        break
      case PostType.STORY:
        this.onStory.emit(postId);
        break
      case PostType.CAR:
        this.onCarPost.emit(postId);
        break
      default:
        this.onStory.emit(postId);
        this.onArtPost.emit(postId);
        this.onCarPost.emit(postId);
    }
  }

  public editedOrReacted(postType: PostType, postId: bigint) {
    switch (postType) {
      case PostType.ART:
        this.onArtEditOrReact.emit(postId);
        break
      case PostType.STORY:
        this.onStoryEditOrReact.emit(postId);
        break
      case PostType.CAR:
        this.onCarEditOrReact.emit(postId);
        break
      default:
        this.onCarEditOrReact.emit(postId);
        this.onStoryEditOrReact.emit(postId);
        this.onArtEditOrReact.emit(postId);
    }
  }

  public deleted(postType: PostType, postId: bigint) {
    switch (postType) {
      case PostType.ART:
        this.onArtDelete.emit(postId);
        break
      case PostType.STORY:
        this.onStoryDelete.emit(postId);
        break
      case PostType.CAR:
        this.onCarDelete.emit(postId);
        break
      default:
        this.onCarDelete.emit(postId);
        this.onStoryDelete.emit(postId);
        this.onArtDelete.emit(postId);
    }
  }
}
