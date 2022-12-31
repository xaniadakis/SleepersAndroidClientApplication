import {Component, Input} from '@angular/core';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import {GlobalConstants} from "../../util/global-constants";
import {NgForm} from "@angular/forms";
import {PostService} from "../../service/post.service";
import {PostType} from "../../dto/post-type";
import {SharedService} from "../../service/shared.service";
import {Router} from "@angular/router";
import getVideoId from 'get-video-id';
import {ToastService} from "../../service/toast.service";
import {NgxImageCompressService} from "ngx-image-compress";
import {Camera, CameraOptions} from '@awesome-cordova-plugins/camera/ngx';
import {File as CordovaFile} from '@awesome-cordova-plugins/file/ngx';
import {Capacitor} from '@capacitor/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";

@Component({
  selector: 'app-edit-post-modal',
  templateUrl: 'propose-change-modal.component.html',
  styleUrls: ['./propose-change-modal.component.scss', '../tab2/tab2.page.scss']

})
export class ProposeChangeModalComponent {
  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";
  name: string;
  image: string;
  text: string;

  placeIcon = './assets/place4.png';
  carIcon = './assets/carIcon2.png';
  peopleIcon = './assets/people3.png';

  postForm = {
    title: '',
    text: '',
    image: ''
  };

  loading: HTMLIonLoadingElement;
  imageSrc: string | ArrayBuffer | null;
  hidden: boolean = true;
  youtubeVideoId: string | null = null;
  imageUploaded: File;
  imgResult: string | null;
  youtubeThumbnail: string | null;
  uploadImage: boolean = false;
  safeImg: SafeUrl;

  constructor(private modalCtrl: ModalController
    , private postService: PostService
    , private sharedService: SharedService
    , private router: Router
    , private alertController: AlertController
    , private toastService: ToastService
    , public ngxImageCompressService: NgxImageCompressService
    , private loadingCtrl: LoadingController
    , private camera: Camera
    , private file: CordovaFile
    , private sanitizer: DomSanitizer
  ) {
  }

  async ngOnInit() {
    //print 123
    console.log(this.image);
    //print 234
    console.log(this.text);
    this.loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Optimizing this lil picture',
      duration: 10000,
      cssClass: 'custom-loading',
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Enter your link',
      buttons: [
        {
          text: 'OK',
          handler: data => {
            this.youtubeVideoId = getVideoId(data.url).id;
            this.imgResult = null;
            if (this.youtubeVideoId == null)
              this.toastService.presentToast("middle", "Gimme a valid link lil mate");
            else {
              this.uploadImage = false;
              this.youtubeThumbnail = "http://img.youtube.com/vi/" + this.youtubeVideoId + "/0.jpg"
            }
          }
        }
      ],
      inputs: [
        {
          name: 'url',
          placeholder: 'Youtube video link',
          attributes: {
            minLength: 5
          }
        }
      ],
    });
    await alert.present();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(form: NgForm) {
    this.proposeChange(form)
      .catch(error => {
        console.log("error: " + error)
      })
      .then((postId: bigint | void) => {
        // if (postId != null)
        //   setTimeout(() => {
        //     this.sharedService.posted(this.postType, postId);
        //     console.log("notified em about whats comin: " + this.postType)
        //   }, 300)
        // else
        console.log(postId)
      });
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  notEmpty(string: string) {
    if (string == null || string.trim().length === 0)
      return false;
    else
      return true;
  }

  onFileChanged(event: any, type: string): void {
    if (type == "image") {
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
    this.imgResult = null;
    // this.safeImg = null;
    this.uploadImage = false;
  }

  unloadYoutubeVideo() {
    this.youtubeThumbnail = null;
    this.youtubeVideoId = null;
  }

  proposeChange(form: NgForm): Promise<bigint> {
    return new Promise((resolve, reject) => {
      const text = form.controls["text"].value;
      if (((text == null || text == '') && !this.uploadImage)) {
        this.toastService.presentToast("top", "Bud this was an empty proposal, i aint gonna send it over.");
        reject();
      }
      console.log("TEXT: "+text);
      this.postService.proposeChange(text, this.imgResult, this.uploadImage)
        .pipe(catchError(err => {
          this.toastService.presentToastWithDuration("bottom",
            "Error while saving post: " + err,
            1500);
          return throwError(err);
        }))
        .subscribe(data => {
          console.log("SUCCESS: " + data.message);
          form.reset();
          this.hidden = true;
          this.imageSrc = null;
          resolve(data.changeProposalId);
        });
    });
  }

  async takePictureInstantlyDataUri() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1500,
      targetHeight: 2000,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Optimizing this lil picture',
      duration: 10000,
      cssClass: 'custom-loading',
    });
    this.camera.getPicture(options).then(async (imageData) => {
      await loading.present();
      console.log('image data =>  ', imageData);
      this.imgResult = 'data:image/jpeg;base64,' + imageData;
      console.log("IMAGE LENGTH: " + this.imgResult.length);
      this.uploadImage = true;
      await loading.dismiss();
    }, (err) => {
      loading.dismiss();
      this.toastService.presentToast("bottom", "Some error occuradoed: " + err);
    });
  }

  async uploadFromGalleryDataUri() {
    const options: CameraOptions = {
      quality: 50,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1500,
      targetHeight: 2000,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Optimizing this lil picture',
      duration: 10000,
      cssClass: 'custom-loading',
    });
    this.camera.getPicture(options).then(async (imageData) => {
      loading.present();
      console.log('image data => [', imageData + "]");
      this.imgResult = 'data:image/jpeg;base64,' + imageData;
      console.log("IMAGE LENGTH: " + this.imgResult.length);
      this.uploadImage = true;
      // let filename = new Date().valueOf().toString() + ".jpg";
      // this.imageUploaded = this.dataURItoBlob(this.imgResult, filename);
      // console.log("I GAVE: " + filename);
      // console.log("I GOT: " + this.imageUploaded.type.toString());
      // console.log("IMAGE NAME: " + this.imageUploaded.name.toString());
      // console.log("IMAGE SIZE: " + this.imageUploaded.size);
      // console.log(JSON.stringify(this.imageUploaded));
      loading.dismiss();
    }, (err) => {
      loading.dismiss();
      this.toastService.presentToast("bottom", "Some error occuradoed: " + err);
    });
  }

}
