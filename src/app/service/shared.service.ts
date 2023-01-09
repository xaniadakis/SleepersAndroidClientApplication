import {EventEmitter, Injectable} from '@angular/core'
import {PostType} from "../dto/post-type";


@Injectable()
export class SharedService {
  public onChange: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  public onPostsTabsNow: EventEmitter<PostType> = new EventEmitter<PostType>();
  public onMyProfileNow: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onSbsProfileNow: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onEventsTab: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onOtherTab: EventEmitter<PostType> = new EventEmitter<PostType>();

  public editProfile: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  public onCarPost: EventEmitter<bigint> = new EventEmitter<bigint>();
  public onArtPost: EventEmitter<bigint> = new EventEmitter<bigint>();
  public onStory: EventEmitter<bigint> = new EventEmitter<bigint>();

  public onCarRefresh: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onArtRefresh: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onStoryRefresh: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onTripRefresh: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onFriendRequestRefresh: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onSleeperRefresh: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onRefresh: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onGoScrollToTop: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  public onArtEditOrReact: EventEmitter<bigint> = new EventEmitter<bigint>();
  public onStoryEditOrReact: EventEmitter<bigint> = new EventEmitter<bigint>();
  public onCarEditOrReact: EventEmitter<bigint> = new EventEmitter<bigint>();
  public onStoryDelete: EventEmitter<bigint> = new EventEmitter<bigint>();
  public onArtDelete: EventEmitter<bigint> = new EventEmitter<bigint>();
  public onCarDelete: EventEmitter<bigint> = new EventEmitter<bigint>();


  public refreshed(refreshType: PostType) {
    switch (refreshType) {
      case PostType.SLEEPERS:
        this.onSleeperRefresh.emit(true);
        break;
      case PostType.FRIEND_REQUESTS:
        this.onFriendRequestRefresh.emit(true);
        break;
      case PostType.ART:
        this.onArtRefresh.emit(true);
        break;
      case PostType.CAR:
        this.onCarRefresh.emit(true);
        break;
      case PostType.STORY:
        this.onStoryRefresh.emit(true);
        break;
      case PostType.TRIP:
        this.onTripRefresh.emit(true);
        break;
      case PostType.ALL:
      default:
        this.onRefresh.emit(true);
        break;
    }
  }

  public pleaseScrollToTop() {
    this.onGoScrollToTop.emit(true);
  }

  public fire(value: boolean) {
    this.onChange.emit(value);
  }

  public checkingEvents(value: boolean) {
    this.onEventsTab.emit(value);
  }

  public checkingPosts(postType: PostType) {
    this.onPostsTabsNow.emit(postType);
  }

  public checkingMyProfile(value: boolean) {
    this.onMyProfileNow.emit(value);
  }

  public checkingSbsProfile(value: boolean) {
    this.onSbsProfileNow.emit(value);
  }

  public checkingOtherSection(value: boolean, type: PostType) {
    switch (type) {
      case PostType.SLEEPERS:
        this.onOtherTab.emit(type);
        break
      case PostType.FRIEND_REQUESTS:
        this.onOtherTab.emit(type);
        break
      case PostType.USER_POSTS:
        this.onOtherTab.emit(type);
        break
      case PostType.PROFILE:
      default:
        this.onOtherTab.emit(type);
        break
    }
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
