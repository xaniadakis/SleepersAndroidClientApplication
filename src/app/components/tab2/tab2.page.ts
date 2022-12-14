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
// import {PopoverController} from "ionic-angular";
import {ReactionsComponent} from "../reactions/reactions.component";
import {PopoverController} from "@ionic/angular";
import {ReactionEnum} from "../../dto/get-post-response";
import {ReactResponse} from "../../dto/create-post-response";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  postPlaceholder: string = "Send it dude . .";
  postType: PostType = PostType.CAR;
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
  imageUploaded: File;
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
    this.sharedServiceSubscription = this.sharedService.onCarPost.subscribe({
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
    this.imageUploaded = event.target.files[0];
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

  deletePost(postId:bigint) {
    if(this.userId==null) {
      // this.router.navigateByUrl("/welcome");
      return
    }
    this.postService.deletePost(this.userId, postId, this.postType).subscribe(data => {
      console.log(data);
      this.getAllPosts();
    });
  }

  createPost(form: NgForm)  {
    const text = form.controls["text"].value;
    if((this.userId==null)||(text==null||text=='' && this.postForm.image == '')) {
      this.toastService.presentToast("top", "Bro this was an empty post, imma pretend this never happened.");
      return;
    }
    this.postService.savePost(this.userId, text, this.imageUploaded, this.postType).subscribe(data => {
      // const response: CreateCommentResponse = data;
      form.reset();
      this.hidden = true;
      this.imageSrc = null;
      this.getAllPosts();
    });
  }
}
