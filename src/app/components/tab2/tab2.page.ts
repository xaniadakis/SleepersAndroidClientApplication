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
  postPlaceholder: string = "Send it dude . .";
  postType: PostType = PostType.CAR;
  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";
  profilePic: string = GlobalConstants.APIURL + "/file/image?filename=" + localStorage.getItem('profilePic');
  posts: UiPostDto[] = [];
  userId: string | null = localStorage.getItem("userId");
  username: string | null = localStorage.getItem("name");
  youtubeEmbedApi: string = "https://www.youtube.com/embed/";


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
    ,  private popoverCtrl: PopoverController
  ) {
    // window.addEventListener("contextmenu", (e) => { e.preventDefault(); });

  }

  ngOnInit() {
    // const info = getVideoId('https://www.youtube.com/watch?v=GfGT_4z9YTc');
    // this.videoId = "https://www.youtube.com/embed/"+info.id;
    this.pageNumber=0;
    this.getAllPosts(this.pageNumber, this.pageLimit);
    this.sharedServiceSubscription = this.sharedService.onCarPost.subscribe({
      next: (event: boolean) => {
        this.pageNumber=0;
        this.posts = [];
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

  getAllPosts(pageNumber: number, pageLimit: number) {
    this.postService.findAll(this.postType, pageNumber, pageLimit).subscribe(data => {
      console.log(data.postDtos)
      for (let i = 0; i < data.postDtos.length; i++) {
        this.posts.push(data.postDtos[i]);
      }
      // this.posts = data.postDtos;
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
    this.postService.deletePost(postId, this.postType).subscribe(data => {
      console.log(data);
      this.ngOnInit();
    });
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

  doInfinite(event: any) {
    this.pageNumber += 1;
    console.log("Shall fetch postados dor page: "+this.pageNumber);
    this.getAllPosts(this.pageNumber, this.pageLimit);
    event.target.complete();
  }
}
