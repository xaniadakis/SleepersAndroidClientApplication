import {EventEmitter, Injectable} from '@angular/core'
import {PostType} from "../dto/post-type";
import {ReactionEnum} from "../dto/get-post-response";


@Injectable()
export class SharedService {
  public onChange: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onCarPost: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onArtPost: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onStory: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onRefresh: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  public onReact: EventEmitter<ReactionEnum> = new EventEmitter<ReactionEnum>();

  public fire(value: boolean) {
    this.onChange.emit(value);
  }

  public posted(postType: PostType){
    switch (postType) {
      case PostType.ART:
        this.onArtPost.emit(true);
        break
      case PostType.STORY:
        this.onStory.emit(true);
        break
      case PostType.CAR:
        this.onCarPost.emit(true);
        break
      default:
        this.onStory.emit(true);
        this.onArtPost.emit(true);
        this.onCarPost.emit(true);
    }
  }

  public reacted(reactionEnum: ReactionEnum){
    this.onReact.emit(reactionEnum);
  }
}
