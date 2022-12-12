import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {GlobalConstants} from "../../util/global-constants";
import {NgForm} from "@angular/forms";
import {PostService} from "../../service/post.service";
import {PostType} from "../../dto/post-type";
import {SharedService} from "../../service/shared.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-post-modal',
  templateUrl: 'create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.scss','../tab2/tab2.page.scss']

})
export class CreatePostModalComponent {
  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";
  name: string;
  image: string;
  text: string;

  placeIcon = './assets/place4.png';
  carIcon = './assets/carIcon2.png';
  peopleIcon = './assets/people3.png';

  userId: string | null = localStorage.getItem("userId");
  username: string | null = localStorage.getItem("name");

  postForm = {
    title: '',
    text: '',
    image: '',
    postType:''
  };

  loading: string = "/src/assets/icon/loading.webp";
  imageSrc: string | ArrayBuffer | null;
  hidden: boolean = true;
  imageUploaded: File;
  postType: string | null ;

  private sharedServiceSubscription: Subscription;

  constructor(private modalCtrl: ModalController
    , private postService: PostService
  , private  sharedService: SharedService
  ,private router: Router) {}

  ngOnInit() {
    //print 123
    console.log(this.image);
    //print 234
    console.log(this.text);
    this.postType = localStorage.getItem("postType");
    console.log("TYPE: "+this.postType)
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(form: NgForm) {
    this.createPost(form)
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  notEmpty(string: string){
    if(string==null || string.trim().length === 0)
      return false;
    else
      return true;
  }

  onFileChanged(event: any, type:string): void {
    if(type=="image") {
      const file = event.target.files[0];
      this.imageUploaded = event.target.files[0];
      this.postForm.image = file;
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      this.hidden = false;
      reader.readAsDataURL(file);
    }
    console.log(event);
  }

  unloadImage() {
    this.hidden = true;
    this.postForm.image = '';
  }

  createPost(form: NgForm)  {
    const text = form.controls["text"].value;
    if((this.userId==null)||(text==null||text=='' && this.postForm.image == '')||(this.postType==null)) {
      // this.toastService.presentToast("top", "Bro this was an empty post, imma pretend this never happened.");
      return;
    }
    var postType : PostType = PostType[this.postType as keyof typeof PostType];
    this.postService.savePost(this.userId, text, this.imageUploaded, postType).subscribe(data => {
      // const response: CreateCommentResponse = data;
      form.reset();
      this.hidden = true;
      this.imageSrc = null;
      this.sharedService.posted(postType);
      if(postType==PostType.STORY)
        this.router.navigateByUrl("/home/tabs/tab3")
      else if(postType==PostType.ART)
        this.router.navigateByUrl("/home/tabs/tab1")
      else
        this.router.navigateByUrl("/home/tabs/tab2")
    });
  }
}
