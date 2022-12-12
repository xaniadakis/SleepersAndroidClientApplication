import {Component} from '@angular/core';
import {GlobalConstants} from "../../util/global-constants";
import {UiPostDto} from "../../dto/ui-post-dto";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../service/toast.service";
import {PostType} from "../../dto/post-type";
import {OuterPostService} from "../../service/outer-post.service";
import {ModalController} from "@ionic/angular";
import {EditPostModalComponent} from "../edit-post-modal/edit-post-modal.component";
import {ShowPostModalComponent} from "../show-post-modal/show-post-modal.component";
import {ModalService} from "../../service/modal.service";
import {PostService} from "../../service/post.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {SharedService} from "../../service/shared.service";

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
  ) {
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
      this.posts.sort(function (a, b) {
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      });
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
}
