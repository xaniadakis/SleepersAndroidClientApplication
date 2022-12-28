import {Component, Input, OnInit} from '@angular/core';
import {SharedService} from "../../service/shared.service";
import {GlobalConstants} from "../../util/global-constants";
import {ActivatedRoute, Router} from "@angular/router";
import {PopoverController} from "@ionic/angular";
import {ToastService} from "../../service/toast.service";
import {throwError} from "rxjs";
import {PostType} from "../../dto/post-type";
import {UiPostDto} from "../../dto/ui-post-dto";
import {PostService} from "../../service/post.service";
import {ModalService} from "../../service/modal.service";
import {ReactionEnum} from "../../dto/get-post-response";
import {ReactResponse} from "../../dto/create-post-response";
import {ReactionsComponent} from "../react-to-post/reactions.component";
import {ShowReactionsComponent} from "../show-reactions/show-reactions.component";
import {catchError} from "rxjs/operators";


@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {

  @Input() postType: PostType;
  posts: UiPostDto[] = [];

  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";
  youtubeEmbedApi: string = "https://www.youtube.com/embed/";

  profilePic: string = GlobalConstants.APIURL + "/file/image?filename=" + localStorage.getItem('profilePic');
  userId: string | null = localStorage.getItem("userId");
  username: string | null = localStorage.getItem("name");

  isModalOpen = false;
  fetching: boolean = true;

  pageNumber = 0;
  pageLimit = 2;

  constructor(
    private router: Router
    , private activatedRoute: ActivatedRoute
    , private toastService: ToastService
    , public postService: PostService
    , public modalService: ModalService
    , private sharedService: SharedService
    , private popoverCtrl: PopoverController) {
  }

  ngOnInit() {
    this.pageNumber = 0;
    this.posts.splice(0, this.posts.length)
    this.getAllPosts(this.pageNumber, this.pageLimit);
    if (this.postType == PostType.CAR)
      this.sharedService.onCarPost.subscribe({
        next: (event: boolean) => {
          this.pageNumber = 0;
          this.posts.splice(0, this.posts.length)
          console.log(`Received message #${event}`);
          this.getAllPosts(this.pageNumber, this.pageLimit);
        }
      })
    else if (this.postType == PostType.ART)
      this.sharedService.onArtPost.subscribe({
        next: (event: boolean) => {
          this.pageNumber = 0;
          this.posts.splice(0, this.posts.length)
          console.log(`Received message #${event}`);
          this.getAllPosts(this.pageNumber, this.pageLimit);
        }
      })
    else if (this.postType == PostType.STORY)
      this.sharedService.onStory.subscribe({
        next: (event: boolean) => {
          this.pageNumber = 0;
          this.posts.splice(0, this.posts.length)
          console.log(`Received message #${event}`);
          this.getAllPosts(this.pageNumber, this.pageLimit);
        }
      })
  }

  react(reaction: ReactionEnum, postId: bigint) {
    if (this.userId == null) {
      return;
    }
    this.postService.saveReaction(postId, reaction, this.postType).subscribe(data => {
      const response: ReactResponse = data;
      console.log(response)
    });
  }

  reload() {
    this.ngOnInit();
  }

  async showReactions(event: Event, postId: bigint) {
    let reactions = await this.popoverCtrl.create({
      component: ReactionsComponent,
      componentProps: {postId: postId, userId: this.userId, postType: this.postType},
      event: event
    });
    console.log("react")
    await reactions.present();
  }

  async showReactors(event: Event, postId: bigint) {
    let reactions = await this.popoverCtrl.create({
      component: ShowReactionsComponent,
      componentProps: {postId: postId, userId: this.userId, postType: this.postType},
      event: event
    });
    console.log("reactors")
    await reactions.present();
  }

  likeIt(postId: bigint) {
    this.react(ReactionEnum.LOVE, postId);
    this.ngOnInit();
  }

  notEmpty(string: string) {
    if (string == null || string.trim().length === 0)
      return false;
    else
      return true;
  }

  equals(string1: string) {
    return string1 == this.username;
  }

  async getAllPosts(pageNumber: number, pageLimit: number) {
    this.fetching = true;
    console.log("fetching page: " + pageNumber + " with limit: " + pageLimit);
    await this.postService.findAll(this.postType, pageNumber, pageLimit)
      .pipe(catchError(err => {
        this.fetching = false;
        this.toastService.presentToastWithDuration("middle",
          "You might wanna sleep on it for a sec, cause either you aint connected or the server is gettin another upgrade",
          5000);
        return throwError(err);
      }))
      .subscribe(data => {
        console.log(data.postDtos)
        for (let i = 0; i < data.postDtos.length; i++) {
          this.posts.push(data.postDtos[i]);
        }
      });
    console.log("I received all posts successfully.")
    this.fetching = false;
  }

  doInfinite(event: any) {
    this.pageNumber += 1;
    console.log("Shall fetch postados for page: " + this.pageNumber);
    this.getAllPosts(this.pageNumber, this.pageLimit).then(r => event.target.complete());
  }

  deletePost(postId: bigint) {
    if (this.userId == null) {
      return
    }
    this.postService.deletePost(postId, this.postType).subscribe(data => {
      console.log(data);
      this.ngOnInit();
    });
  }

  getReactionsDesc(num: number) {
    if (num > 1)
      return num + " buddies have reacted";
    if (num == 0)
      return "nobuddy has reacted yet";
    else
      return num + " buddy has reacted";
  }

  getCommentsDesc(num: number) {
    if (num > 1)
      return "already " + num + " comments";
    if (num == 0)
      return "no comments yet";
    else
      return "already " + num + " comment";
  }

  trackByArtNo(index: number, post: UiPostDto): bigint {
    return post.id;
  }

  goToProfilePage(ownerId: bigint) {
    this.router.navigateByUrl("/home/profile/" + ownerId);
  }
}
