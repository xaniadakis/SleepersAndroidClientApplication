import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {GlobalConstants} from "../shared/global-constants";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { ReactiveFormsModule } from '@angular/forms';
import {link} from "fs";
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
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
  // @ViewChild('fileInput', {static: false}) fileInput:ElementRef;
  // public APIURL: string = GlobalConstants.APIURL;
  // public commentForm: FormGroup;
  // postId = new FormControl('', [ ]);
  // _owner_comm = new FormControl('', [ ]);
  // comment_text = new FormControl('', [
  //   Validators.minLength(1),
  // ]);
  // public postForm: FormGroup;
  // _id = new FormControl('', [ ]);
  // title = new FormControl('', [ ]);
  // text = new FormControl('',  [
  //   Validators.minLength(1)
  // ]);
  // _owner = new FormControl('', [ ]);
  // post_Image = new FormControl('', [ ]);
  // post_Song = new FormControl('', [ ]);
  // post_Video = new FormControl('', [ ]);
  //
  // likeForm = new FormGroup({
  //   postId: new FormControl(),
  // });
  // public submitted = false;

  constructor(
    // private formBuilder: FormBuilder
    private router: Router
    // ,private http: HttpClient
    ,private activatedRoute: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngOnInit(){
    // const poem1 = document.getElementById("poem1");
    // if (poem1 != null) {
    //   poem1.innerHTML = this.poem1;
    // }
  }
  // newPost(): any {
  //   this.submitted = true;
  //   if (this.postForm.valid) {
  //     console.log(this.postForm.value);
  //     var formData = new FormData();
  //     formData.append("title", "DEFAULT_TITLE");//this.postForm.controls['title'].value);
  //     formData.append("text", this.postForm.controls['text'].value);
  //     formData.append("post_Image", this.postForm.controls['post_Image'].value);
  //     // formData.append("_owner", sessionStorage.getItem('userid'));
  //     var xhttp = new XMLHttpRequest();
  //     xhttp.onreadystatechange = function() {
  //       if (xhttp.readyState == XMLHttpRequest.DONE) {
  //         console.log(xhttp.status + xhttp.responseText);
  //         alert(xhttp.status)
  //         window.location.reload();
  //       }
  //     }
  //     xhttp.open("POST", GlobalConstants.APIURL+"startpage/post");
  //     xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  //     // xhttp.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
  //     xhttp.send(formData);
  //   }
  // }
  //
  // onFileChanged(event: any): void {
  //   var file = event.target.files[0];
  //   this.postForm.controls['post_Image'].setValue(file)
  // }

  async presentToast(position: 'top' | 'middle' | 'bottom', message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      buttons: [
        {
          text: 'Ok bro I get it.',
          role: 'cancel',
          handler: () => { window.alert("Cool bro..forgive a lad tho..") }
        }
      ]
    });
    await toast.present();
  }

  goForward(){
    this.router.navigateByUrl("/home/tabs/tab2")
  }
}
