import {Component} from '@angular/core';
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalConstants} from "../../util/global-constants";
import {UiPostDto} from "../../dto/ui-post-dto";
import {CreatePostResponse, ReactResponse} from "../../dto/create-post-response";
import {ToastService} from "../../service/toast.service";
import {DeletePostResponse} from "../../dto/delete-post-response";
import {PostService} from "../../service/post.service";
import {PostType} from "../../dto/post-type";
import {EditPostModalComponent} from "../edit-post-modal/edit-post-modal.component";
import {ShowPostModalComponent} from "../show-post-modal/show-post-modal.component";
import {OuterPostService} from "../../service/outer-post.service";
import {ModalController, PopoverController} from "@ionic/angular";
import {ModalService} from "../../service/modal.service";
import {Subscription} from "rxjs";
import {SharedService} from "../../service/shared.service";
import {ReactionsComponent} from "../react-to-post/reactions.component";
import {ReactionEnum} from "../../dto/get-post-response";
import {ShowReactionsComponent} from "../show-reactions/show-reactions.component";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss', '../tab2/tab2.page.scss']
})

export class Tab1Page {

  postType: PostType = PostType.ART;

  postPlaceholder: string = "Post some art. . .";
  poem1: string = "What happens to a dream deferred?\n" +
    "\n" +
    "      Does it dry up\n" +
    "      like a raisin in the sun?\n" +
    "      Or fester like a sore—\n" +
    "      And then run?\n" +
    "      Does it stink like rotten meat?\n" +
    "      Or crust and sugar over—\n" +
    "      like a syrupy sweet?\n" +
    "\n" +
    "      Maybe it just sags\n" +
    "      like a heavy load.\n" +
    "\n" +
    "      Or does it explode?";

  constructor() { }

  ngOnInit() { }
}
