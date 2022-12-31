import {Component, Input} from '@angular/core';
import {PopoverController} from "@ionic/angular";
import {PostService} from "../../service/post.service";
import {ReactionEnum, SimpleReactionDto} from "../../dto/get-post-response";
import {PostType} from "../../dto/post-type";
import {SharedService} from "../../service/shared.service";

@Component({
  selector: 'app-show-reactions',
  templateUrl: 'show-reactions.component.html',
})
export class ShowReactionsComponent {

  @Input("postId") postId: bigint;
  @Input("postType") postType: PostType;
  @Input("userId") userId: string;
  private iconsDir: string = "./assets/icons/";
  public reactions: SimpleReactionDto[];

  constructor(
    // private navCtrl: NavController,
    // private navParams: NavParams,
    private postService: PostService,
    private popoverController: PopoverController,
    private sharedService: SharedService) {
  }

  ngOnInit() {
    this.getPostCommentsAndLikes();
  }

  private getPostCommentsAndLikes() {
    if (this.userId == null)
      return
    this.postService.findAllReactions(this.postId).subscribe(data => {
      this.reactions = data.postReactionsDto.reactions;
      console.log(this.reactions);
    });
  }

  dismiss() {
    this.popoverController.dismiss();
  }

  getReactionIcon(reaction: ReactionEnum) {
    switch (reaction) {
      case ReactionEnum.ANGRY:
        return this.iconsDir + "angryBird.png"
      case ReactionEnum.RED_CARD:
        return this.iconsDir + "red.png"
      case ReactionEnum.SAD:
        return this.iconsDir + "sad.png"
      case ReactionEnum.TURD:
        return this.iconsDir + "poop.png"
      case ReactionEnum.HAHA:
        return this.iconsDir + "haha.png"
      case ReactionEnum.LOVE:
      default:
        return this.iconsDir + "love.png"
    }
  }
}
