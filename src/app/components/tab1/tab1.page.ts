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
import {ReactionsComponent} from "../reactions/reactions.component";
import {ReactionEnum} from "../../dto/get-post-response";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss', '../tab2/tab2.page.scss']
})

export class Tab1Page {
  // https://www.youtube.com/watch?v=6NImgmZKLfo&t=3s
  postPlaceholder: string = "Post some art. . .";
  videoSource: string = "https://www.youtube.com/embed/6NImgmZKLfo";
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

  postType: PostType = PostType.ART;
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
  imageEvent: File;
  hidden: boolean = true;
  private message: string;

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
    this.sharedServiceSubscription = this.sharedService.onArtPost.subscribe({
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

  like(event: Event){
    window.alert("like");
  }

  likeIt(postId: bigint){
    this.react(ReactionEnum.LOVE, postId);
    this.ngOnInit();
  }

  fetching: boolean = true;

  isModalOpen = false;

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
    this.imageEvent = event.target.files[0];
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
    }, error => {
      this.fetching = false;
      this.toastService.presentToastWithDuration("middle",
        "You might wanna sleep on it for a sec, cause the server is probably gettin another upgrade",
        5000)
    });
    console.log("I received all posts successfully.")
    this.fetching = false;
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
    this.postService.savePost(this.userId, text, this.imageEvent, this.postType).subscribe(data => {
      const response: CreatePostResponse = data;
      // alert(response);
      form.reset();
    });
    this.getAllPosts();
  }
}
