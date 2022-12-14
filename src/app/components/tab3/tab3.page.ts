import {Component} from '@angular/core';
import {GlobalConstants} from "../../util/global-constants";
import {UiPostDto} from "../../dto/ui-post-dto";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../service/toast.service";
import {PostType} from "../../dto/post-type";
import {OuterPostService} from "../../service/outer-post.service";
import {ModalController, PopoverController} from "@ionic/angular";
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

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss', '../tab2/tab2.page.scss']
})
export class Tab3Page {

  postPlaceholder: string = "Whatz crackalackin pimpalimpin?";
  postType: PostType = PostType.STORY;
  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";
  profilePic: string = GlobalConstants.APIURL + "/file/image?filename=" + localStorage.getItem('profilePic');
  posts: UiPostDto[];
  userId: string | null = localStorage.getItem("userId");
  username: string | null = localStorage.getItem("name");

  postForm = {
    title: '',
    text: '',
    image: ''
  };

  loading: string = "/src/assets/icon/loading.webp";
  imageSrc: string | ArrayBuffer | null;
  hidden: boolean = true;
  private sharedServiceSubscription: Subscription;

  constructor(
    private router: Router
    , private activatedRoute: ActivatedRoute
    , private toastService: ToastService
    , public postService: PostService
    , public modalService: ModalService
    , private sharedService: SharedService
    ,  private popoverCtrl: PopoverController
  ) {
    // window.addEventListener("contextmenu", (e) => { e.preventDefault(); });

  }

  ngOnInit() {
    this.getAllPosts();
    this.sharedServiceSubscription = this.sharedService.onStory.subscribe({
      next: (event: boolean) => {
        console.log(`Received message #${event}`);
        this.getAllPosts();
      }
    })
  }

  react(reaction: ReactionEnum, postId: bigint) {
    if (this.userId == null) {
      return;
    }
    this.postService.saveReaction(this.userId, postId, reaction, this.postType).subscribe(data => {
      const response: ReactResponse = data;
      console.log(response)
    });
  }

  reload(){
    this.ngOnInit();
  }

  async showReactions(event: Event, postId: bigint){
    let reactions = await this.popoverCtrl.create({
      component: ReactionsComponent,
      componentProps: {postId: postId, userId: this.userId, postType: this.postType},
      event: event});
    console.log("react")
    await reactions.present();
  }

  async showReactors(event: Event, postId: bigint){
    let reactions = await this.popoverCtrl.create({
      component: ShowReactionsComponent,
      componentProps: {postId: postId, userId: this.userId, postType: this.postType},
      event: event});
    console.log("reactors")
    await reactions.present();
  }

  like(event: Event){
    window.alert("like");
  }

  likeIt(postId: bigint){
    this.react(ReactionEnum.LOVE, postId);
    this.ngOnInit();
  }


  isModalOpen = false;

  fetching: boolean = true;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
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

  onFileChanged(event: any): void {
    const file = event.target.files[0];
    this.postForm.image = file;
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;
    this.hidden = false;
    reader.readAsDataURL(file);
    console.log(event);
  }

  unloadImage() {
    this.hidden = true;
    this.postForm.image = '';
  }

  getAllPosts() {
    this.postService.findAll(this.postType).subscribe(data => {
      this.posts = data.postDtos;
      // this.posts.sort(function (a, b) {
      //   return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      // });
      console.log("I received all posts successfully.")
      this.fetching = false;
    }, error => {
      this.fetching = false;
      this.toastService.presentToastWithDuration("middle",
        "You might wanna sleep on it for a sec, cause the server is probably gettin another upgrade",
        5000)
    });
  }

  deletePost(postId: bigint) {
    if (this.userId == null) {
      // this.router.navigateByUrl("/welcome");
      return
    }
    this.postService.deletePost(this.userId, postId, this.postType).subscribe(data => {
      console.log(data)
    });
    this.getAllPosts();
  }

  createPost(form: NgForm, image: any) {
    const text = form.controls["text"].value;
    if ((this.userId == null) || (text == null || text == '' && image == '')) {
      this.toastService.presentToast("top", "Bro this was an empty post, imma pretend this never happened.");
      // this.router.navigateByUrl("/welcome");
      return;
    }
    this.postService.savePost(this.userId, text, image, this.postType).subscribe(data => {
      // const response: CreateCommentResponse = data;
      form.reset()
    });
    this.getAllPosts();
  }
  getReactionsDesc(num: number){
    if(num>1)
      return num+ " buddies have reacted";
    if(num==0)
      return "nobuddy has reacted yet";
    else
      return num+ " buddy has reacted";
  }

  getCommentsDesc(num: number){
    if(num>1)
      return "already " +num+ " comments";
    if(num==0)
      return "no comments yet";
    else
      return "already " +num+ " comment";
  }
}
