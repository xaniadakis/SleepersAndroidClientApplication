import {Component, Input} from '@angular/core';

import {ModalController} from '@ionic/angular';
import {GlobalConstants} from "../../util/global-constants";
import {Subject} from 'rxjs';
import {ToastService} from "../../service/toast.service";
import {CommentsAndLikesDto, SimpleCommentDto, SimpleReactionDto} from "../../dto/get-post-response";
import {NgForm} from "@angular/forms";
import {PostService} from "../../service/post.service";
import {PostType} from "../../dto/post-type";
import {CreateCommentResponse} from "../../dto/create-post-response";

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

  @Input("image") image: string | ArrayBuffer | null;
  @Input("image") text: string;
  @Input("id") id: bigint;
  @Input("type") type: PostType;

  userId: string | null = localStorage.getItem("userId");
  profilePic: string = GlobalConstants.APIURL + "/file/image?filename=" + localStorage.getItem('profilePic');

  comment = {
    commentText: ''
  };

  constructor(private modalCtrl: ModalController
    , private toastService: ToastService
  , private postService: PostService) {
  }

  ngOnInit() {
    this.getPostCommentsAndLikes();
  }

  private getPostCommentsAndLikes() {
    if (this.userId==null)
      return
    this.postService.findAllCommentsAndLikes(this.userId, this.id, this.type).subscribe(data => {
      this.likes = data.commentsAndLikesDto.likes;
      this.comments = data.commentsAndLikesDto.comments;

      console.log(this.comments);
      this.comments.sort(function (a, b) {
        return new Date(b.commentedAt).getTime() - new Date(a.commentedAt).getTime();
      });
    });
  }

  addComment(form: NgForm) {
    if (this.userId == null) {
      return;
    }
    this.postService.saveComment(this.userId, this.id, form.controls["commentText"].value, this.type).subscribe(data => {
      const response: CreateCommentResponse = data;
      // alert(response)
      form.reset()
      this.ngOnInit();
    });
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
}
