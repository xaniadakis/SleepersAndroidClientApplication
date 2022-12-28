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
import {File as CordovaFile, FileEntry, FileError, FileReader, IFile} from '@awesome-cordova-plugins/file/ngx';
import {Capacitor} from '@capacitor/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {FileChangeEvent} from "@angular/compiler-cli/src/perform_watch";

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

  loading: string = "/src/assets/icon/loading.webp";
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

  ngOnInit() {
    //print 123
    console.log(this.image);
    //print 234
    console.log(this.text);
    console.log("TYPE: " + this.postType)
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
    this.createPost(form)
    setTimeout(() => {
      this.sharedService.posted(this.postType);
      console.log("notified em about whats comin: " + this.postType)
    }, 300);
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

  createPost(form: NgForm) {
    const text = form.controls["text"].value;
    if (((text == null || text == '') && !this.uploadImage && this.youtubeVideoId == null) || (this.postType == null)) {
      this.toastService.presentToast("top", "Bud this was an empty post, imma pretend this never happened.");
      return;
    }
    this.postService.savePost(text, this.imageUploaded, this.youtubeVideoId, this.postType, this.uploadImage).subscribe(data => {
      // const response: CreateCommentResponse = data;
      form.reset();
      this.hidden = true;
      this.imageSrc = null;
    });
  }

  takePictureInstantly() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1500,
      targetHeight: 2000,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }

    this.camera.getPicture(options).then(async (imageData) => {
      const filename = imageData.substring(imageData.lastIndexOf('/') + 1);
      const path = imageData.substring(0, imageData.lastIndexOf('/') + 1);
      const image = path + filename;
      console.log("image: " + image);

      this.imgResult = Capacitor.convertFileSrc(image);
      console.log("resolvedImg: " + this.imgResult);

      this.safeImg = this.sanitizer.bypassSecurityTrustUrl(this.imgResult);
      this.uploadImage = true;
      console.log("BEFORE");
      this.fileUriToFile(imageData, filename)
        .then((value) => {
          console.log("IM IIIIINN YOOOOOOO!: " + value);
          this.imageUploaded = value;
          console.log("IM IIIIINN YOOOOOOO2!: " + this.imageUploaded);
        })
        .catch((error) => {
          console.log("IM IIIIINN ERROR!: " + error);
        });
      console.log("AFTER");
    }, (err) => {
      this.toastService.presentToast("bottom", "Some error occuradoed: " + err);
    });
  }

  fileUriToFile(imageData: any, filename: string): Promise<File> {
    return new Promise((resolve, reject) => {
      console.log("working on it");

      // @ts-ignore
      this.file.resolveLocalFilesystemUrl(imageData).then((fileEntry: FileEntry) => {
        console.log("working on it more");

        // @ts-ignore
        fileEntry.file((resFile: IFile) => {
            console.log("working on it merrier");

            var reader = new FileReader();
            reader.onloadend = function (evt: any) {
              alert("working on it marriado");
              var imgFile: any = new File([evt?.target?.result], filename, {
                type: "image/jpeg"
              });
              console.log("RESOLVED: " + imgFile);
              resolve(imgFile);
            };

            reader.onerror = function (e) {
              console.log('Failed file read: ' + e.toString());
              console.log("REJECTED: " + e);
              reject(e);
            };
            console.log("RESFILE: " + resFile.name.toString());
            reader.readAsArrayBuffer(resFile);
          }
          , (err: FileError) => {
            console.error(err);
          });
      });
    });
  }

  compressFile() {
    this.ngxImageCompressService.uploadFile()
      .then(async ({image, fileName, orientation}) => {
          const loading = await this.loadingCtrl.create({
            spinner: 'bubbles',
            message: 'Optimizing this lil picture',
            duration: 10000,
            cssClass: 'custom-loading',
          });

          await loading.present();

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
                  let newSize = this.ngxImageCompressService.byteCount(compressedImage) / 1000000;
                  this.toastService.presentToastWithDuration("bottom", "Compressed this one from " + oldSize + "MB down to " + newSize + "MB", 1200)
                  // window.alert("old size: "+oldSize+" mb, new size: "+newSize+" mb");
                  console.log("Size in bytes after compression is now:", this.ngxImageCompressService.byteCount(compressedImage) / 1000000, 'MB');
                  // console.log(compressedImage)
                  this.imageUploaded = this.dataURItoBlob(compressedImage, fileName);
                  loading.dismiss()
                  // this.imageUploaded = new File([this.imgResult], fileName);
                }
              );
          } else {
            this.imgResult = image;
            this.uploadImage = true;
            console.log("aint compressadoing this one..")
            this.imageUploaded = this.dataURItoBlob(image, fileName);
            loading.dismiss()
          }
        }
      );
  }

  dataURItoBlob(dataURI: string, fileName: string) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    let type = 'image/' + fileName.split('.').pop();
    console.log("type: " + type);
    return new File([new Uint8Array(array)], fileName, {
      type: type
    });
  }
}
