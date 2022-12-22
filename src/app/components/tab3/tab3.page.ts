import {Component} from '@angular/core';
import {GlobalConstants} from "../../util/global-constants";
import {UiPostDto} from "../../dto/ui-post-dto";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../service/toast.service";
import {PostType, Video} from "../../dto/post-type";
import {OuterPostService} from "../../service/outer-post.service";
import {ModalController, NavController, PopoverController} from "@ionic/angular";
import {EditPostModalComponent} from "../edit-post-modal/edit-post-modal.component";
import {ShowPostModalComponent} from "../show-post-modal/show-post-modal.component";
import {ModalService} from "../../service/modal.service";
import {PostService} from "../../service/post.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {SharedService} from "../../service/shared.service";
import {ReactionsComponent} from "../react-to-post/reactions.component";
import {ReactionEnum} from "../../dto/get-post-response";
import {ReactResponse} from "../../dto/create-post-response";
import {ShowReactionsComponent} from "../show-reactions/show-reactions.component";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss', '../tab2/tab2.page.scss']
})
export class Tab3Page {

  postPlaceholder: string = "Whatz crackalackin pimpalimpin?";
  postType: PostType = PostType.STORY;

  constructor() { }

  ngOnInit() { }
}
