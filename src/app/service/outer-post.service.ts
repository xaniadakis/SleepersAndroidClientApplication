import {Injectable} from '@angular/core';
import {PostService} from "./post.service";
import {UiPostDto} from "../dto/ui-post-dto";
import {ToastService} from "./toast.service";
import {Router} from "@angular/router";

@Injectable()
export class OuterPostService {

  posts: UiPostDto[];

  constructor(private postService: PostService, private toastService: ToastService, private router: Router) {
  }

  // returnEm(): UiPostDto[] {
  //   return this.posts;
  // }
  //
  // getAllPosts(postType: PostType) {
  //   this.postService.findAll(postType).subscribe(data => {
  //     this.posts = data.postDtos;
  //     console.log("ALL POSTS RETRIEVED: "+ this.posts[0].text);
  //     this.posts.sort(function (a, b) {
  //       return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
  //     });
  //     console.log(JSON.stringify(this.posts[0]));
  //   });
  // }
  //
  // deletePost(userId: string|null, postId:bigint, postType: PostType) {
  //   if(userId==null) {
  //     this.router.navigateByUrl("/welcome");
  //   }
  //   this.postService.deletePost(<string>userId, postId, postType).subscribe(data => {
  //     console.log(data)
  //   });
  //   this.getAllPosts(postType);
  // }
  //
  // createPost(form: NgForm, userId: string | null, image: any, postType: PostType)  {
  //   const text = form.controls["text"].value;
  //   if((text==null||text=='' && image == '')) {
  //     this.toastService.presentToast("top", "Bro this was an empty post, imma pretend this never happened.");
  //     this.router.navigateByUrl("/welcome");
  //   }
  //   this.postService.savePost(text, image, "", postType).subscribe(data => {
  //     // const response: CreateCommentResponse = data;
  //     form.reset()
  //   });
  //   this.getAllPosts(postType);
  // }
}
