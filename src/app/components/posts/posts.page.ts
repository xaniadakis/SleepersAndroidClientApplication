import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SharedService} from "../../service/shared.service";
import {GlobalConstants} from "../../util/global-constants";
import {ActivatedRoute, Router} from "@angular/router";
import {IonContent, PopoverController} from "@ionic/angular";
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

  @ViewChild(IonContent, {static: false}) content: IonContent;

  @Input() postType: PostType;
  @Input() userIdPosted: bigint;

  posts: UiPostDto[] = [];

  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";
  youtubeEmbedApi: string = "https://www.youtube.com/embed/";

  profilePic: string = GlobalConstants.APIURL + "/file/image?filename=" + localStorage.getItem('profilePic');
  userId: string | null = localStorage.getItem("userId");
  username: string | null = localStorage.getItem("name");

  isModalOpen = false;
  fetching: boolean = true;

  pageNumber = 0;
  pageLimit = 3;

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
    if (this.postType == PostType.CAR || this.postType == PostType.ALL) {
      this.sharedService.onCarRefresh.subscribe({
        next: (value: boolean) => {
          // this.scrollToTop(700);
          this.pageNumber = 0;
          this.posts.splice(0, this.posts.length)
          this.getAllPosts(this.pageNumber, this.pageLimit)
        }
      });
      this.sharedService.onCarPost.subscribe({
        next: (postId: bigint) => {
          this.getPost(postId)
            .then(newPost => this.posts.unshift(newPost));
          console.log(`Received new post #${postId}`);
          this.scrollToTop(700);
        }
      });
      this.sharedService.onCarEditOrReact.subscribe({
        next: (postId: bigint) => {
          let reactedPost: UiPostDto | undefined = this.posts.find(uiPostDto => uiPostDto.id === postId);
          if (reactedPost == undefined)
            return;
          let postIndex = this.posts.indexOf(reactedPost); // 👉️
          if (postIndex > -1)
            this.getPost(postId)
              .then(refinedPost => this.posts.splice(postIndex, 1, refinedPost));
        }
      });
    }
    if (this.postType == PostType.ART || this.postType == PostType.ALL) {
      this.sharedService.onArtRefresh.subscribe({
        next: (value: boolean) => {
          // this.scrollToTop(700);
          this.pageNumber = 0;
          this.posts.splice(0, this.posts.length)
          this.getAllPosts(this.pageNumber, this.pageLimit)
        }
      });
      this.sharedService.onArtPost.subscribe({
        next: (postId: bigint) => {
          this.getPost(postId)
            .then(newPost => this.posts.unshift(newPost));
          console.log(`Received new post #${postId}`);
          this.scrollToTop(700);
        }
      });
      this.sharedService.onArtEditOrReact.subscribe({
        next: (postId: bigint) => {
          let reactedPost: UiPostDto | undefined = this.posts.find(uiPostDto => uiPostDto.id === postId);
          if (reactedPost == undefined)
            return;
          let postIndex = this.posts.indexOf(reactedPost); // 👉️
          if (postIndex > -1)
            this.getPost(postId)
              .then(refinedPost => this.posts.splice(postIndex, 1, refinedPost));
        }
      });
    }
    if (this.postType == PostType.STORY || this.postType == PostType.ALL) {
      this.sharedService.onStoryRefresh.subscribe({
        next: (value: boolean) => {
          // this.scrollToTop(700);
          this.pageNumber = 0;
          this.posts.splice(0, this.posts.length)
          this.getAllPosts(this.pageNumber, this.pageLimit)
        }
      });
      this.sharedService.onStory.subscribe({
        next: (postId: bigint) => {
          this.getPost(postId)
            .then(newPost => this.posts.unshift(newPost));
          console.log(`Received new post #${postId}`);
          this.scrollToTop(700);
        }
      });
      this.sharedService.onStoryEditOrReact.subscribe({
        next: (postId: bigint) => {
          let reactedPost: UiPostDto | undefined = this.posts.find(uiPostDto => uiPostDto.id === postId);
          if (reactedPost == undefined)
            return;
          let postIndex = this.posts.indexOf(reactedPost); // 👉️
          if (postIndex > -1)
            this.getPost(postId)
              .then(refinedPost => this.posts.splice(postIndex, 1, refinedPost));
        }
      });
    }
  }

  scrollToTop(fastButHowFast: number) {
    this.content.scrollToTop(fastButHowFast);
  }

  react(reaction: ReactionEnum, postId: bigint) {
    if (this.userId == null) {
      return;
    }
    this.postService.saveReaction(postId, reaction).subscribe(data => {
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
    // @ts-ignore
    let reactedPost: UiPostDto = this.posts.find(uiPostDto => uiPostDto.id === postId);
    let postIndex = this.posts.indexOf(reactedPost); // 👉️  0
    this.getPost(postId)
      .then(refinedPost => this.posts.splice(postIndex, 1, refinedPost));
    // this.ngOnInit();
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

    if (this.userIdPosted == BigInt(-1)) {
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
    } else {
      await this.postService.findAllOfUser(this.userIdPosted, pageNumber, pageLimit)
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
    }
    console.log("I received all posts successfully.")
    this.fetching = false;
  }

  async getPost(postId: bigint): Promise<UiPostDto> {
    // this.fetching = true;
    console.log("fetching post: " + postId);
    return new Promise((resolve, reject) => {
      this.postService.findPost(postId)
        .pipe(catchError(err => {
          // this.fetching = false;
          // this.toastService.presentToastWithDuration("bottom",
          //   "Error while fetching post: " + postId,
          //   1500);
          console.log("Error while fetching post: " + postId);
          return throwError(err);
        }))
        .subscribe(data => {
          console.log("SUCCESS: " + data.message);
          resolve(data.postDto);
        });
    });
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
    this.postService.deletePost(postId)
      .pipe(catchError(err => {
        this.toastService.presentToastWithDuration("bottom",
          "Error while deleting post: " + err,
          1500);
        return throwError(err);
      }))
      .subscribe(data => {
        console.log("SUCCESS: " + data.message);
        console.log(data);
        // this.ngOnInit();
        // this.sharedService.deleted(this.postType, postId);
        let deletedPost: UiPostDto | undefined = this.posts.find(uiPostDto => uiPostDto.id === postId);
        if (deletedPost == undefined)
          return;
        let postIndex = this.posts.indexOf(deletedPost); // 👉️
        if (postIndex > -1)
          this.posts.splice(postIndex, 1);
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
    this.router.navigateByUrl("/home/profile/" + ownerId + "/" + 0);
  }

  setBadge(lastActedAt: string): string {
    if (this.empty(lastActedAt))
      return "danger";
    var lastActedAtDate = new Date(lastActedAt);
    var now = new Date();
    var diffMins = this.diffMinutes(lastActedAtDate, now)

    switch (true) {
      case (diffMins < 5):
        return "success";
        break;
      case (diffMins < 1500):
        return "warning";
        break;
      default:
        return "danger";
        break;
    }
  }

  diffMinutes(date1: Date, date2: Date) {
    return Math.round((date2.getTime() - date1.getTime()) / 60000);
  }

  empty(string: string) {
    if (string == null || string.length === 0)
      return true;
    else
      return false;
  }
}
