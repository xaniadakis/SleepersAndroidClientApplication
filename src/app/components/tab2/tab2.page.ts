import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalConstants} from "../../util/global-constants";
import {UiPostDto} from "../../dto/ui-post-dto";
import {ToastService} from "../../service/toast.service";
import {PostType} from "../../dto/post-type";
import {ModalService} from "../../service/modal.service";
import {NgForm} from "@angular/forms";
import {PostService} from "../../service/post.service";
import {Subscription} from "rxjs";
import {SharedService} from "../../service/shared.service";
import {ReactionsComponent} from "../react-to-post/reactions.component";
import {PopoverController} from "@ionic/angular";
import {ReactionEnum} from "../../dto/get-post-response";
import {ReactResponse} from "../../dto/create-post-response";
import {ShowReactionsComponent} from "../show-reactions/show-reactions.component";
import {SafeResourceUrl, SafeValue} from "@angular/platform-browser";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  postType: PostType = PostType.CAR;

  postPlaceholder: string = "Send it dude . .";

  constructor() { }

  ngOnInit() { }
}
