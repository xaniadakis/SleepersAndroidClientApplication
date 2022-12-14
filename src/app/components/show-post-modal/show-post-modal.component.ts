import {Component, Input} from '@angular/core';

import {AlertController, ModalController, Platform} from '@ionic/angular';
import {GlobalConstants} from "../../util/global-constants";
import {ToastService} from "../../service/toast.service";
import {SimpleCommentDto, SimpleReactionDto} from "../../dto/get-post-response";
import {NgForm} from "@angular/forms";
import {PostService} from "../../service/post.service";
import {PostType} from "../../dto/post-type";
import {CreateCommentResponse} from "../../dto/create-post-response";
import {SharedService} from "../../service/shared.service";
import {ModalService} from "../../service/modal.service";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {UiPostDto} from "../../dto/ui-post-dto";
import GeneralUtils from "../../util/general.utils";
import {TranslateService} from "@ngx-translate/core";
import getVideoId from "get-video-id";

@Component({
  selector: 'app-edit-post-modal',
  templateUrl: 'show-post-modal.component.html',
  styleUrls: ['./show-post-modal.component.scss', '../tab2/tab2.page.scss']

})
export class ShowPostModalComponent {
  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";
  name: string | null = localStorage.getItem("name");
  comments: SimpleCommentDto[];
  likes: SimpleReactionDto[];

  @Input("image") image: string;
  @Input("image") text: string;
  @Input("id") id: bigint;
  @Input("type") type: PostType;
  @Input("owner") owner: string;
  @Input("ownerProfilePic") ownerProfilePic: string;
  youtubeVideoId: string;

  userId: string | null = localStorage.getItem("userId");
  profilePic: string = GlobalConstants.APIURL + "/file/image?filename=" + localStorage.getItem('profilePic');
  username: string | null = localStorage.getItem("name");
  isMyPost: boolean;
  comment = {
    commentText: ''
  };

  constructor(private modalCtrl: ModalController
    , private toastService: ToastService
    , private postService: PostService
    , private sharedService: SharedService
    , private platform: Platform
    , public modalService: ModalService
    , public generalUtils: GeneralUtils
    , public translate: TranslateService
  , private alertController: AlertController) {
    this.platform.backButton.subscribeWithPriority(9999, (processNextHandler) => {
      return this.modalCtrl.dismiss(null, 'cancel');
    })
  }

  async presentAlert() {

  }


  ngOnInit() {
    this.isMyPost = this.equalsSecure(this.owner);
    this.getPostComments();

    // this.sharedService.onStoryEditOrReact.subscribe({
    //   next: (postId: bigint) => {
    //     this.getPost(postId)
    //       .then(refinedPost => {
    //         this.text = refinedPost.text;
    //         this.image = refinedPost.image;
    //         this.youtubeVideoId = refinedPost.youtubeVideoId;
    //       });
    //   }
    // });
  }

  // async getPost(postId: bigint): Promise<UiPostDto> {
  //   // this.fetching = true;
  //   console.log("fetching post: " + postId);
  //   return new Promise((resolve, reject) => {
  //     this.postService.findPost(postId)
  //       .pipe(catchError(err => {
  //         // this.fetching = false;
  //         // this.toastService.presentToastWithDuration("bottom",
  //         //   "Error while fetching post: " + postId,
  //         //   1500);
  //         console.log("Error while fetching post: " + postId);
  //         return throwError(err);
  //       }))
  //       .subscribe(data => {
  //         console.log("SUCCESS: " + data.message);
  //         resolve(data.postDto);
  //       });
  //   });
  // }

  itemStyle(commentIndex: number) {
    return "--animation-order: " + commentIndex;
  }

  equalsSecure(owner: string) {
    let bool = (owner == this.username);
    if (bool)
      console.log("This post is yours.");
    else
      console.log("This post aint yours.[" + owner + "]/=[" + this.username + "]");
    return bool;
  }

  private getPostComments() {
    if (this.userId == null)
      return
    this.postService.findAllComments(this.id).subscribe(data => {
      // data.postCommentsDto.comments.forEach(comment => {this.comments.add(comment); console.log(comment.commentedAt)})
      this.comments = data.postCommentsDto.comments;
      this.comments.sort(function (a, b) {
        return new Date(a.commentedAt).getTime() - new Date(b.commentedAt).getTime();
      });
    });
  }

  getLastValue(set: Set<SimpleCommentDto>): SimpleCommentDto {
    let value;
    for (value of set) ;
    // @ts-ignore
    return value;
  }

  private getLastComments() {
    if (this.userId == null)
      return
    if (this.comments.length > 0) {
      let lastItem: SimpleCommentDto = this.comments[this.comments.length - 1];
      console.log("LENGTH: " + this.comments.length);
      console.log(this.comments);
      console.log("LAST: " + lastItem.text);
      // let lastChar: number = parseInt(lastCommentAt.slice(- 1))+1;
      this.postService.findLastComments(this.id, lastItem.commentedAt)
        .pipe(catchError(err => {
          console.log("error while fetching last comments");
          return throwError(err);
        }))
        .subscribe(data => {
          // console.log("YESSSSSSSS!!")
          // console.log("fetched " + data.postCommentsDto.comments.length + " new comments")
          data.postCommentsDto.comments.sort(function (a, b) {
            return new Date(a.commentedAt).getTime() - new Date(b.commentedAt).getTime();
          });
          data.postCommentsDto.comments.forEach(comment => this.comments.push(comment))
          console.log(this.comments);
        });
    } else {
      // console.log("LOSS: "+this.comments.length);
      this.getPostComments()
    }
    ;
  }

  addComment(form: NgForm) {
    let comment = form.controls["commentText"].value;
    if (this.notEmpty(comment)) {
      if (this.userId == null) {
        return;
      }
      this.postService.saveComment(this.id, form.controls["commentText"].value).subscribe(data => {
        const response: CreateCommentResponse = data;
        // alert(response)
        form.reset()
        setTimeout(() => {
          this.sharedService.editedOrReacted(this.type, this.id);
        }, 300);
        this.getLastComments();
      });
    } else {
      this.toastService.presentToastWithDuration("bottom", "no comment", 200)
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  notEmpty(string: string | ArrayBuffer | null) {
    if (string instanceof ArrayBuffer) {
      return false;
    }
    if (string == null || string.trim().length === 0)
      return false;
    else
      return true;
    // console.log("image: '"+string+"' = "+value);
  }

  async deletePost(postId: bigint) {
    if (this.userId == null) {
      return
    }
    const alert = await this.alertController.create({
      subHeader: 'You sure you wanna delete this post?',
      buttons: [
        {
          text: 'Yes',
          handler: data => {
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
                this.sharedService.deleted(this.type, postId);
              });
            this.cancel();
          }
        },
        {
          text: 'No'
        }
      ]
    });
    await alert.present();

  }

  print() {
    console.log("dragged");
  }


}
