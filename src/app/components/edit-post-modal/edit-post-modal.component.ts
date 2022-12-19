import {Component, Input} from '@angular/core';

import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import {GlobalConstants} from "../../util/global-constants";
import {NgForm} from "@angular/forms";
import {PostService} from "../../service/post.service";
import getVideoId from "get-video-id";
import {PostType} from "../../dto/post-type";
import {ToastService} from "../../service/toast.service";
import {SharedService} from "../../service/shared.service";
import {NgxImageCompressService} from "ngx-image-compress";
import {ImageCompressService} from "../../service/image-compress.service";

@Component({
  selector: 'app-edit-post-modal',
  templateUrl: 'edit-post-modal.component.html',
  styleUrls: ['./edit-post-modal.component.scss', '../tab2/tab2.page.scss']

})
export class EditPostModalComponent {
  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";
  name: string;
  imageSrc: string | ArrayBuffer | null;
  hidden: boolean = true;
  youtubeVideoId: string | null = null;
  imageUploaded: File;
  imgResult: string | null;
  youtubeThumbnail: string | null;

  @Input("image") image: string;
  @Input("text") text: string;
  @Input("type") type: PostType;
  @Input("id") id: bigint;

  editPostForm = {
    text: '',
    image: ''
  };
  compressing: boolean = false;


  constructor(private modalCtrl: ModalController
    , private postService: PostService
    , private alertController: AlertController
    , private toastService: ToastService
    , private sharedService: SharedService
    , public ngxImageCompressService: NgxImageCompressService
    , private loadingCtrl: LoadingController
  ) {
  }

  ngOnInit() {
    //print 123
    console.log(this.image);
    //print 234
    console.log(this.text);
    this.postService.findImage(this.image).subscribe(data => {
      const file = data;
      this.editPostForm.image = file.name;
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
      console.log(event);
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(form: NgForm) {
    this.onModify(form);
    setTimeout(() => {
      this.sharedService.posted(this.type);
      console.log("notified em about whats comin: " + this.type)
    }, 300);
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  compressFileWithAlgorithm() {
    const MAX_MEGABYTE = 0.5;
    this.ngxImageCompressService
      .uploadAndGetImageWithMaxSize(MAX_MEGABYTE) // this function can provide debug information using (MAX_MEGABYTE,true) parameters
      .then(
        (result: string) => {
          this.imgResult = result;
          console.error('img size: ', this.ngxImageCompressService.byteCount(result) / 1000000, 'MB')
        },
        (result: string) => {
          console.error('The compression algorithm didn\'t succed! The best size we can do is', this.ngxImageCompressService.byteCount(result), 'bytes')
          this.imgResult = result;
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
          // .then(({image, orientation}) => {

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
            console.log("aint compressadoing this one..")
            this.imageUploaded = this.dataURItoBlob(image, fileName);
            await loading.dismiss()
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

  notEmpty(string: string) {
    if (string == null || string.trim().length === 0)
      return false;
    else
      return true;
    // console.log("image: '"+string+"' = "+value);
  }

  unloadImage() {
    this.imgResult = null;
  }

  unloadYoutubeVideo() {
    this.youtubeThumbnail = null;
    this.youtubeVideoId = null;
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
              this.toastService.presentToast("middle","Gimme a valid link lil mate");
            else
              this.youtubeThumbnail = "http://img.youtube.com/vi/" + this.youtubeVideoId + "/0.jpg"
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


  onFileChanged(event: any, type: string): void {
    if (type == "image") {
      const file = event.target.files[0];
      this.imageUploaded = event.target.files[0];
      this.editPostForm.image = file;
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      this.hidden = false;
      reader.readAsDataURL(file);
    }
    console.log(event);
  }

  onModify(form: NgForm) {
    const text = form.controls["text"].value;
    if (((text == null || text == '') && this.imgResult == '' && this.youtubeVideoId == null) || (this.type == null)) {
      this.toastService.presentToast("top", "Mate why did you bother editing, if you aint editing.");
      return;
    }
    this.postService.modifyPost(this.id, text, this.imageUploaded, this.youtubeVideoId, this.type).subscribe(data => {
      // const response: CreateCommentResponse = data;
      form.reset();
      this.hidden = true;
      this.imageSrc = null;
    });
  }
}
