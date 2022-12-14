import {Component, Input} from '@angular/core';
import {PopoverController} from "@ionic/angular";
import {ReactResponse} from "../../dto/create-post-response";
import {PostService} from "../../service/post.service";
import {ReactionEnum} from "../../dto/get-post-response";
import {PostType} from "../../dto/post-type";
import {SharedService} from "../../service/shared.service";

@Component({
  selector: 'app-reactions',
  templateUrl: 'reactions.component.html',
})
export class ReactionsComponent {

  @Input("postId") postId: bigint;
  @Input("postType") postType: PostType;
  @Input("userId") userId: string;

  constructor(
    // private navCtrl: NavController,
    // private navParams: NavParams,
    private postService: PostService,
    private popoverController: PopoverController,
    private sharedService: SharedService) {
  }

  dismiss(reaction: ReactionEnum) {
    this.react(reaction);
    this.popoverController.dismiss();
    setTimeout(() => {
      this.sharedService.posted(this.postType)
    }, 500);
  }

  angryBird() {
    // window.alert("angry");
    this.dismiss(ReactionEnum.ANGRY);
  }

  turd() {
    // window.alert("turd");
    this.dismiss(ReactionEnum.TURD);
  }

  redCard() {
    // window.alert("redCard");
    this.dismiss(ReactionEnum.RED_CARD);
  }

  sad() {
    // window.alert("sad");
    this.dismiss(ReactionEnum.SAD);
  }

  love() {
    window.alert("love");
    this.dismiss(ReactionEnum.LOVE);
  }

  react(reaction: ReactionEnum) {
    if (this.userId == null) {
      return;
    }
    this.postService.saveReaction(this.userId, this.postId, reaction, this.postType).subscribe(data => {
      const response: ReactResponse = data;
      console.log(response)
    });
  }
}
