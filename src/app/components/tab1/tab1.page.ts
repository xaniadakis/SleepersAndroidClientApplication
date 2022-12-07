import {Component} from '@angular/core';
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalConstants} from "../../util/global-constants";
import {UiPostDto} from "../../dto/ui-post-dto";
import {StoriesService} from "../../service/stories.service";
import {CreatePostResponse} from "../../dto/create-post-response";
import {ToastService} from "../../service/toast.service";
import {ArtPostService} from "../../service/art-post.service";
import {DeletePostResponse} from "../../dto/delete-post-response";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss', '../tab2/tab2.page.scss']
})

export class Tab1Page {
  // https://www.youtube.com/watch?v=6NImgmZKLfo&t=3s

  videoSource:string = "https://www.youtube.com/embed/6NImgmZKLfo";
  poem1:string = "What happens to a dream deferred?\n" +
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

  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";
  profilePic: string = GlobalConstants.APIURL + "/file/image?filename=" + sessionStorage.getItem('profilePic');
  posts: UiPostDto[];
  userId: string | null = sessionStorage.getItem("userId");
  username: string | null = sessionStorage.getItem("name");
  loading: string = "/src/assets/icon/loading.webp";

  postForm = {
    title:'',
    text: '',
    image: ''
  };

  constructor(
    private router: Router
    , private activatedRoute: ActivatedRoute
    , private toastService: ToastService
    , private postService: ArtPostService
  ) {
  }

  ngOnInit() {
    this.postService.findAll().subscribe(data => {
      this.posts = data.postDtos;
      this.posts.sort(function(a,b){
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      });
    });
  }

  notEmpty(string: string){
    if(string==null || string.trim().length === 0)
      return false;
    else
      return true;
    // console.log("image: '"+string+"' = "+value);
  }

  equals(string1: string){
    // console.log(string1+"  "+ sessionStorage.getItem("name"));
    //
    // console.log(string1==sessionStorage.getItem("name"));
    return string1==this.username;
  }

  onFileChanged(event: any): void {
    this.postForm.image = event.target.files[0];
    console.log(event);
  }

  deletePost(postId:bigint){
    if((this.userId==null)) {
      return;
    }
    var formData: FormData = new FormData()
    formData.append("userId", this.userId)
    formData.append("postId", postId.toString())
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    var myRouter = this.router;
    var toastService = this.toastService;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(JSON.stringify(JSON.parse(this.responseText)));

        if (xhr.status == 200) {
          const jsonResponse: DeletePostResponse = JSON.parse(this.responseText);
          console.log(jsonResponse)
          toastService.presentToast("top", jsonResponse.message);
          location.reload();
        } else
          alert(xhr.status + xhr.responseText)
      }
    });

    xhr.open("DELETE", GlobalConstants.APIURL + "/art/post/" );
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.withCredentials = false;
    if(GlobalConstants.DEBUG)
      toastService.presentToast("middle", "Sending request to " + GlobalConstants.APIURL + "/art/post/" );
    xhr.send(formData);
  }

  modifyPost(form: NgForm) {
    const text = form.controls["text"].value;
    if((this.userId==null)||(text==null||text=='' && this.postForm.image == '')) {
      this.toastService.presentToast("top", "Bro this was an empty post, imma pretend this never happened.");
      return;
    }
    var formData: FormData = new FormData()
    formData.append("image", this.postForm.image)
    formData.append("userId", this.userId)
    formData.append("text", text)
    formData.append("title", this.postForm.title)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    var myRouter = this.router;
    var toastService = this.toastService;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(JSON.stringify(JSON.parse(this.responseText)));

        if (xhr.status == 200) {
          const jsonResponse: CreatePostResponse = JSON.parse(this.responseText);
          console.log(jsonResponse)
          // toastService.presentToast("top", jsonResponse.message);
          location.reload();
        } else
          alert(xhr.status + xhr.responseText)
      }
    });

    xhr.open("POST", GlobalConstants.APIURL + "/art/post/" );
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.withCredentials = false;
    if(GlobalConstants.DEBUG)
      toastService.presentToast("middle", "Sending request to " + GlobalConstants.APIURL + "/art/post/" );
    xhr.send(formData);
  }

  createPost(form: NgForm) {
    const text = form.controls["text"].value;
    if((this.userId==null)||(text==null||text=='' && this.postForm.image == '')) {
      this.toastService.presentToast("top", "Bro this was an empty post, imma pretend this never happened.");
      return;
    }
    var formData: FormData = new FormData()
    formData.append("image", this.postForm.image)
    formData.append("userId", this.userId)
    formData.append("text", text)
    formData.append("title", this.postForm.title)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    var myRouter = this.router;
    var toastService = this.toastService;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(JSON.stringify(JSON.parse(this.responseText)));

        if (xhr.status == 200) {
          const jsonResponse: CreatePostResponse = JSON.parse(this.responseText);
          console.log(jsonResponse)
          if(GlobalConstants.DEBUG)
            toastService.presentToast("top", jsonResponse.message);
          location.reload();
        } else
          alert(xhr.status + xhr.responseText)
      }
    });

    xhr.open("POST", GlobalConstants.APIURL + "/art/post/" );
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.withCredentials = false;
    if(GlobalConstants.DEBUG)
      toastService.presentToast("middle", "Sending request to " + GlobalConstants.APIURL + "/art/post/" );
    xhr.send(formData);
  }
}
