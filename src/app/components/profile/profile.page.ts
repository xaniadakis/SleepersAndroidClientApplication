import {Component, OnInit} from '@angular/core';
import {SharedService} from "../../service/shared.service";
import {GlobalConstants} from "../../util/global-constants";
import {Router} from "@angular/router";
import {LoadingController, Platform} from "@ionic/angular";
import {NgxImageCompressService} from "ngx-image-compress";
import {ToastService} from "../../service/toast.service";
import {ProfilePicChangeResponse} from "../../dto/profile-pic-change-response";
import {NgForm} from "@angular/forms";
import {UserService} from "../../service/user.service";


@Component({
  selector: 'app-home-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";
  name: string | null = localStorage.getItem("name");
  profilePicado: string | null = localStorage.getItem("profilePic");
  imageUploaded: File;
  imgResult: string | null;

  nicknameValue: string | null = localStorage.getItem('name');
  emailAddressValue: string | null = localStorage.getItem('email');

  fullNameValue: string | null = "";
  myQuoteValue: string | null = "";
  myOccupationValue: string | null = "";
  myHobbyValue: string | null = "";

  editUser = {
    email: this.emailAddressValue,
    nickname: this.nicknameValue,
    fullName: this.fullNameValue,
    myQuote: this.myQuoteValue,
    myOccupation: this.myOccupationValue,
    myHobby: this.myHobbyValue,
    password: '',
    profilePic: ''
  };

  checkedUsername: boolean = false;
  checkedMailAddress: boolean = false;

  shortUsername: boolean | null = false;
  validUsername: boolean | null = null;
  validMailAddress: boolean | null = null;
  shortMailAddress: boolean | null = false;

  constructor(private sharedService: SharedService,
              private router: Router,
              private platform: Platform,
              private ngxImageCompressService: NgxImageCompressService,
              private toastService: ToastService,
              private loadingCtrl: LoadingController,
              private userService: UserService
  ) {
    this.platform.backButton.subscribeWithPriority(9999, (processNextHandler) => {
      this.sharedService.hidePostButtonForALilWhile(false);
      this.router.navigateByUrl('/home/tabs/tab3');
    })
  }

  ngOnInit() {
    this.sharedService.hidePostButtonForALilWhile(true);
    this.nicknameValue = localStorage.getItem("name");
    this.emailAddressValue = localStorage.getItem('email');
    console.log('Initializing ProfilePage: '+this.nicknameValue +", "+this.emailAddressValue);
  }

  goBack() {
    this.sharedService.hidePostButtonForALilWhile(false);
    this.router.navigateByUrl('/home/tabs/tab3');
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
                  this.userService.changeProfilePic(this.imageUploaded).subscribe(data => {
                    const jsonResponse: ProfilePicChangeResponse = data;
                    console.log(jsonResponse)
                    localStorage.setItem('profilePic', jsonResponse.profilePic);
                    location.reload()
                    this.router.navigateByUrl('/home/profile')
                  });
                  loading.dismiss()
                  // this.imageUploaded = new File([this.imgResult], fileName);
                }
              );
          } else {
            this.imgResult = image;
            console.log("aint compressadoing this one..")
            this.imageUploaded = this.dataURItoBlob(image, fileName);
            this.userService.changeProfilePic(this.imageUploaded).subscribe(data => {
              const jsonResponse: ProfilePicChangeResponse = data;
              console.log(jsonResponse)
              localStorage.setItem('profilePic', jsonResponse.profilePic);
              location.reload()
              this.router.navigateByUrl('/home/profile')
            });
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

  checkIfUserExists(username: string){
    this.shortUsername = null;
    this.validUsername = null;
    if(username.trim().length>=4) {
      this.userService.checkIfUserExists(username).subscribe(data => {
        this.validUsername = !data;
        this.checkedUsername = true;
        console.log(this.validUsername)
      });
    }
    else {
      this.shortUsername = true;
      this.checkedUsername = true;
    }
  }

  onEdit(form: NgForm) {

  }

  checkIfUserExistsWithMail(value: any) {
    this.shortMailAddress = null;
    this.validMailAddress = null;
    if(value.trim().length>=9) {
      this.userService.checkIfUserExistsWithMail(value).subscribe(data => {
        this.validUsername = !data;
        this.checkedMailAddress = true;
        console.log(this.validMailAddress)
      });
    }
    else {
      this.shortMailAddress = true;
      this.checkedMailAddress = true;
    }
  }
}
