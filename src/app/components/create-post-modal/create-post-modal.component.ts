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
import {SafeUrl} from '@angular/platform-browser';
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {Camera as CapCamera, CameraResultType, GalleryPhotos} from '@capacitor/camera';
import {CameraSource} from "@capacitor/camera/dist/esm/definitions";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-edit-post-modal',
  templateUrl: 'create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.scss', '../tab2/tab2.page.scss']

})
export class CreatePostModalComponent {
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
    image: '',
    postType: ''
  };
  @Input("postType") postType: PostType;

  loading: HTMLIonLoadingElement;
  loadingPost: HTMLIonLoadingElement;
  imageSrc: string | ArrayBuffer | null;
  hidden: boolean = true;
  youtubeVideoId: string | null = null;
  imageUploaded: File;
  imgResult: string | undefined | null;
  youtubeThumbnail: string | null;
  uploadImage: boolean = false;
  safeImg: SafeUrl;
  inputPlaceholder: string;

  constructor(private modalCtrl: ModalController
    , private postService: PostService
    , private sharedService: SharedService
    , private router: Router
    , private alertController: AlertController
    , private toastService: ToastService
    , public ngxImageCompressService: NgxImageCompressService
    , private loadingCtrl: LoadingController
    , private camera: Camera
    // , private file: CordovaFile
    // , private sanitizer: DomSanitizer
    , private translate: TranslateService
  ) {
    this.inputPlaceholder = this.translate.instant('createPost.inputPlaceholder')
  }

  async ngOnInit() {
    //print 123
    console.log(this.image);
    //print 234
    console.log(this.text);
    console.log("TYPE: " + this.postType)
    this.loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Optimizing this lil picture',
      duration: 10000,
      cssClass: 'custom-loading',
    });
    this.loadingPost = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Posting..',
      duration: 10000,
      cssClass: 'custom-loading',
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('editPost.enterLink'),
      buttons: [
        {
          text: 'OK',
          handler: data => {
            this.youtubeVideoId = getVideoId(data.url).id;
            this.imgResult = null;
            if (this.youtubeVideoId == null)
              this.toastService.presentToast("middle", this.translate.instant('editPost.invalidLinkPrompt'));
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
          placeholder: this.translate.instant('editPost.youtubeVideoLink'),
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

  async confirm(form: NgForm) {
    await this.loadingPost.present();
    this.createPostV2(form)
      .catch(async error => {
        console.log("error: " + error);
        await this.loadingPost.dismiss();
      })
      .then(async (postId: bigint | void) => {
        if (postId != null)
          setTimeout(() => {
            this.sharedService.posted(this.postType, postId);
            console.log("notified em about whats comin: " + this.postType)
          }, 300)
        else console.log("error")
        await this.loadingPost.dismiss();
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

  createPost(form: NgForm): Promise<bigint> {
    return new Promise((resolve, reject) => {
      const text = form.controls["text"].value;
      if (((text == null || text == '') && !this.uploadImage && this.youtubeVideoId == null) || (this.postType == null)) {
        this.toastService.presentToast("top", "Bud this was an empty post, imma pretend this never happened.");
        reject();
      }

      this.postService.savePost(text, this.imageUploaded, this.youtubeVideoId, this.postType, this.uploadImage).subscribe(data => {
        // const response: CreateCommentResponse = data;
        form.reset();
        this.hidden = true;
        this.imageSrc = null;
        resolve(data.newPostId);
      });
    });
  }

  createPostV2(form: NgForm): Promise<bigint> {
    return new Promise((resolve, reject) => {
      const text = form.controls["text"].value;
      if (((text == null || text == '') && !this.uploadImage && this.youtubeVideoId == null) || (this.postType == null)) {
        this.toastService.presentToast("top", "Bud this was an empty post, imma pretend this never happened.");
        reject();
      }
      if (this.imgResult)
        this.postService.savePostV2(text, this.imgResult, this.youtubeVideoId, this.postType, this.uploadImage)
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
            resolve(data.newPostId);
          });
    });
  }

  takePicture = async () => {
    const image = await CapCamera.getPhoto({
      quality: 50,
      source: CameraSource.Camera,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      width: 1500,
      height: 2000
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    this.imgResult = image.dataUrl;
    console.log("THIS: " + image.dataUrl)
  };

  takePictures = async () => {
    const images: GalleryPhotos = await CapCamera.pickImages({
      quality: 50,
      width: 1500,
      height: 2000,
      limit: 5
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    let url = images.photos[0].webPath.replace('blob:', '');
    console.log("fetchin from: " + url);
    // @ts-ignore
    let blob: Blob = await fetch(url)
      .then(response => {
        console.log("STATUS: " + response.status); // 200
        console.log("TEXT: " + response.statusText); // OK
        return response.blob();
      })
      .then(async (data) => {
        console.log("IN");
        console.log("blob: " + data); // pass your blob/file info here
        console.log("blob type: " + data.type); // pass your blob/file info here
        console.log("blob size: " + data.size); // pass your blob/file info here
        this.uploadImage = true;
        this.imageUploaded = new File([data], Date.now() + Math.random() + ".jpeg");
        console.log("OUT");
      })
      .catch(error => {
        console.log("error: " + error); // OK
      });
    console.log("THIS2: " + url);
  };

  convertBlobToBase64 = async (blob: Blob) => { // blob data
    return await this.blobToBase64(blob);
  }

  blobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      console.log("SUCcESS");
      resolve(reader.result)
    };
    reader.onerror = error => {
      console.log("FAIL");
      reject(error);
    };
  });

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
      // let filename = new Date().valueOf().toString() + ".jpg";
      // this.imageUploaded = this.dataURItoBlob(this.imgResult, filename)
      // console.log("I GAVE: " + filename);
      // console.log("I GOT: " + this.imageUploaded.type.toString());
      // console.log("IMAGE NAME: " + this.imageUploaded.name.toString());
      // console.log("IMAGE SIZE: " + this.imageUploaded.size);
      // console.log(JSON.stringify(this.imageUploaded));
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

  // takePictureInstantlyFileUri() {
  //   const options: CameraOptions = {
  //     quality: 50,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     targetWidth: 1500,
  //     targetHeight: 2000,
  //     correctOrientation: true,
  //     saveToPhotoAlbum: true
  //   }
  //
  //   this.camera.getPicture(options).then(async (imageData) => {
  //     const filename = imageData.substring(imageData.lastIndexOf('/') + 1);
  //     const path = imageData.substring(0, imageData.lastIndexOf('/') + 1);
  //     const image = path + filename;
  //     console.log("image: " + image);
  //
  //     this.imgResult = Capacitor.convertFileSrc(image);
  //     console.log("resolvedImg: " + this.imgResult);
  //
  //     this.safeImg = this.sanitizer.bypassSecurityTrustUrl(this.imgResult);
  //     this.uploadImage = true;
  //     console.log("BEFORE");
  //     // this.fileUriToFile(imageData, filename)
  //     //   .then((value) => {
  //     //     console.log("IM IIIIINN YOOOOOOO!: " + value);
  //     //     this.imageUploaded = value;
  //     //     console.log("IM IIIIINN YOOOOOOO2!: " + this.imageUploaded);
  //     //   })
  //     //   .catch((error) => {
  //     //     console.log("IM IIIIINN ERROR!: " + error);
  //     //   });
  //     this.imageDataToBlob(imageData)
  //
  //     console.log("AFTER");
  //   }, (err) => {
  //     this.toastService.presentToast("bottom", "Some error occuradoed: " + err);
  //   });
  // }

  imageDataToBlob(imageData: any) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', imageData);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      let blobImage = xhr.response;
    }
    xhr.send();
  }

  async compressFile() {
    console.log("INSIDE THIS");
    await this.ngxImageCompressService.uploadFile()
      .then(({image, fileName, orientation}) => {
          console.log("INSIDE THAT");
          this.loading.present();
          // this.imgResultBeforeCompression = image;
          let oldSize = this.ngxImageCompressService.byteCount(image) / 1000000;

          console.log("Size in bytes of the uploaded image: " + fileName + " was:", oldSize, 'MB');
          this.youtubeThumbnail = null;
          if (oldSize > 0.6) {
            console.log("imma compress this one..")
            this.ngxImageCompressService
              .compressFile(image, orientation, 50, 40) // 50% ratio, 50% quality
              .then(
                (compressedImage) => {
                  this.imgResult = compressedImage;
                  this.uploadImage = true;
                  console.log("YO: " + this.uploadImage);
                  let newSize = this.ngxImageCompressService.byteCount(compressedImage) / 1000000;
                  this.toastService.presentToastWithDuration("bottom", "Compressed this one from " + oldSize + "MB down to " + newSize + "MB", 1200)
                  // window.alert("old size: "+oldSize+" mb, new size: "+newSize+" mb");
                  console.log("Size in bytes after compression is now:", this.ngxImageCompressService.byteCount(compressedImage) / 1000000, 'MB');
                  // console.log(compressedImage)
                  this.imageUploaded = this.dataURItoBlob(compressedImage, fileName);
                  this.loading.dismiss();
                  // this.imageUploaded = new File([this.imgResult], fileName);
                }
              );
          } else {
            this.imgResult = image;
            this.uploadImage = true;
            console.log("aint compressadoing this one..")
            this.imageUploaded = this.dataURItoBlob(image, fileName);
            this.loading.dismiss();
          }
        }
      )
      .catch((error) => {
        console.log("ERROR WHILE UPLOADING PICADO: " + error);
      });
  }

  dataURItoBlob(dataURI: string, fileName: string) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    let type = 'image/' + fileName.split('.').pop();
    console.log("type: " + type);
    console.log("READY: " + fileName);
    return new File([new Uint8Array(array)], fileName, {type: type});
  }

  urltoFile(url: string, filename: string, mimeType: string) {
    return (fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        console.log("BUF SIZE: " + buf.byteLength);
        return new File([buf], filename, {type: mimeType});
      }));
  }

  dataURLtoFile(dataUrl: string, filename: string): File {
    // @ts-ignore
    var arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  }
}
