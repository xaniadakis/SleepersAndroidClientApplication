import {Component, OnInit} from '@angular/core';
import {SharedService} from "../../service/shared.service";
import {GlobalConstants} from "../../util/global-constants";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingController, Platform} from "@ionic/angular";
import {NgxImageCompressService} from "ngx-image-compress";
import {ToastService} from "../../service/toast.service";
import {ProfilePicChangeResponse} from "../../dto/profile-pic-change-response";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../service/user.service";
import {UserDetailsDto} from "../../dto/get-user-details-response";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {PostType} from "../../dto/post-type";
import GeneralUtils from "src/app/util/general.utils"
import {Camera, CameraOptions} from "@awesome-cordova-plugins/camera/ngx";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-home-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";
  postType: PostType = PostType.ALL;

  // @ts-ignore
  userId: bigint;
  myUserId: string | null = localStorage.getItem('userId');

  imageUploaded: File;
  imgResult: string | null;

  userDetails: UserDetailsDto = new UserDetailsDto();

  editUser: FormGroup = new FormBuilder().group({
    email: ['', Validators.pattern("^(?=.{1,64}@)[A-Za-z0-9_-]+(\\\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\\\.[A-Za-z0-9-]+)*(\\\\.[A-Za-z]{2,})$")],
    nickname: '',
    fullName: '',
    myQuote: '',
    myOccupation: '',
    myHobby: '',
    newPassword: '',
    oldPassword: ''
  });

  checkedUsername: boolean = false;
  checkedMailAddress: boolean = false;

  shortUsername: boolean | null = false;
  validUsername: boolean | null = null;
  checkingUsernameValidity: boolean = false;
  startedCheckingUsernameValidity: boolean = false;

  validMailAddress: boolean | null = null;
  shortMailAddress: boolean | null = false;
  checkingMailValidity: boolean = false;
  startedCheckingMailValidity: boolean = false;

  editMode: boolean = false;
  toSubmit: boolean = false;
  usernameMinlength: number = 3;
  fetching: boolean = true;
  showOldPasswordDiv: boolean = false;

  hiddenEditButton: boolean = false;

  backToSleepersList: boolean = false;

  myOccupationPlaceholder: string = this.translate.instant('profile.myOccupationPlaceholder');
  myHobbyPlaceholder: string = this.translate.instant('profile.myHobbyPlaceholder');
  myQuotePlaceholder: string = this.translate.instant('profile.myQuotePlaceholder');
  oldPasswordPlaceholder: string = this.translate.instant('profile.oldPasswordPlaceholder');
  newPasswordPlaceholder: string = this.translate.instant('profile.newPasswordPlaceholder');
  fullNamePlaceholder: string = this.translate.instant('profile.fullNamePlaceholder');
  emailPlaceholder: string = this.translate.instant('profile.emailPlaceholder');
  nicknamePlaceholder: string = this.translate.instant('profile.nicknamePlaceholder');
  checkPostsButton: string = this.translate.instant('profile.checkPosts');

  constructor(private sharedService: SharedService,
              private router: Router,
              private platform: Platform,
              private ngxImageCompressService: NgxImageCompressService,
              private toastService: ToastService,
              private loadingCtrl: LoadingController,
              private userService: UserService,
              private route: ActivatedRoute,
              private camera: Camera,
              private translate: TranslateService
  ) {
    let userIdString = this.route.snapshot.paramMap.get('userId');
    if (userIdString != null)
      this.userId = BigInt(userIdString);

    if (userIdString != "0" && userIdString != this.myUserId) {
      this.hiddenEditButton = true;
      this.sharedService.checkingSbsProfile(true);
    } else {
      if (this.myUserId != null)
        this.userId = BigInt(this.myUserId);
      this.sharedService.checkingMyProfile(true);
    }
    let naviedFromUsersList = this.route.snapshot.paramMap.get('naviedFromUsersList');
    if (naviedFromUsersList == "1")
      this.backToSleepersList = true;
    else
      this.backToSleepersList = false;
    this.platform.backButton.subscribeWithPriority(9999, (processNextHandler) => {
      this.goBack();
    })
    console.log("userId: " + this.userId);
    console.log("naviedFromUsersList: " + this.backToSleepersList);

  }

  ngOnInit() {
    this.sharedService.editProfile.subscribe({
      next: (event: boolean) => {
        console.log(`Received message #${event}`);
        this.setEditMode(event);
      }
    })
    console.log("imma retrieve those user details");
    this.retrieveUserDetails(this.userId);
    console.log("did ma best");
    console.log('Initializing TripsPage for: ' + this.userDetails.username);
  }

  goBack() {
    if (!this.backToSleepersList) {
      GeneralUtils.goBack(this.router, this.sharedService);
    } else {
      this.sharedService.checkingOtherSection(true, PostType.PROFILE);
      this.router.navigateByUrl('/home/sleepers');
    }
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
      this.userService.changeProfilePicV2(this.imgResult).subscribe(data => {
        const jsonResponse: ProfilePicChangeResponse = data;
        console.log(jsonResponse)
        localStorage.setItem('profilePic', jsonResponse.profilePic);
        location.reload()
        this.router.navigateByUrl('/home/profile')
      });
      loading.dismiss();
    }, (err) => {
      loading.dismiss();
      this.toastService.presentToast("bottom", "Some error occuradoed: " + err);
    });
  }

  checkIfUserExists(event: Event) {
    let username = (event.target as HTMLInputElement).value;
    console.log("checking name: " + username);
    this.startedCheckingUsernameValidity = true;
    this.checkingUsernameValidity = true;
    this.shortUsername = null;
    this.validUsername = null;
    if (username.trim().length >= this.usernameMinlength) {
      this.userService.checkIfUserExists(username)
        .subscribe(data => {
        this.validUsername = !data;
        this.checkedUsername = true;
        this.checkingUsernameValidity = false;
        console.log("name: " + username + ", valid: " + this.validUsername)
      });
    } else {
      this.shortUsername = true;
      this.checkedUsername = true;
      this.checkingUsernameValidity = false;
      console.log("name: " + username + ", short: " + this.shortUsername)
    }
  }

  onEdit(form: FormGroup) {
    this.userService.modifyUserDetails(form.controls['email'].value,
      form.controls['nickname'].value,
      form.controls['fullName'].value,
      form.controls['myQuote'].value,
      form.controls['myOccupation'].value,
      form.controls['myHobby'].value,
      form.controls['newPassword'].value,
      form.controls['oldPassword'].value)
      .pipe(catchError(err => {
        this.toastService.presentToastWithDuration("middle", err, 3000);
        // window.alert(err);
        return throwError(err);
      }))
      .subscribe(data => {
        // const response: CreateCommentResponse = data;
        // this.toastService.presentToastWithDuration("middle", data.message, 3000);
        form.reset();
        this.editMode = false;
        this.retrieveUserDetails(this.userId);
      });
  }

  async retrieveUserDetails(userId: bigint) {
    this.fetching = true;
    console.log("retrieving detailados for userId: " + this.userId);
    this.userService.retrieveUserDetails(userId)
      .pipe(catchError(err => {
        this.toastService.presentToastWithDuration("middle", err, 3000);
        // this.oldPasswordWrong;
        // window.alert(err);
        return throwError(err);
      }))
      .subscribe(data => {
        console.log(data.message);
        console.log(data.userDetailsDto);
        this.userDetails = data.userDetailsDto;
      });
    this.fetching = false;
  }

  checkIfUserExistsWithMail(event: Event) {
    let mail = (event.target as HTMLInputElement).value;

    console.log("checking mail: " + mail);
    this.checkingMailValidity = true;
    this.startedCheckingMailValidity = true;
    this.shortMailAddress = null;
    this.validMailAddress = null;
    if (mail.trim().length >= 9) {
      this.userService.checkIfUserExistsWithMail(mail).subscribe(data => {
        console.log("got this exists: " + data);
        this.validMailAddress = !data;
        this.checkedMailAddress = true;
        this.checkingMailValidity = false;
        console.log("mail: " + mail + ", valid: " + this.validUsername)
      });
    } else {
      this.shortMailAddress = true;
      this.checkedMailAddress = true;
      this.checkingMailValidity = false;
      console.log("mail: " + mail + ", short: " + this.shortMailAddress)
    }
  }

  notEmpty(string: string | null) {
    return !(string == null || string.trim().length === 0);
  }

  async setEditMode(editMode: boolean) {
    console.log("edit those: " + this.userDetails.myQuote)
    this.editUser = new FormBuilder().group({
      email: [this.userDetails.email, Validators.pattern("^(?=.{1,64}@)[A-Za-z0-9_-]+(\\\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\\\.[A-Za-z0-9-]+)*(\\\\.[A-Za-z]{2,})$")],
      nickname: this.userDetails.username,
      fullName: this.userDetails.fullName,
      myQuote: this.userDetails.myQuote,
      myOccupation: this.userDetails.myOccupation,
      myHobby: this.userDetails.myHobby,
      newPassword: '',
      oldPassword: ''
    });
    this.editMode = editMode
    this.toSubmit = editMode
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }

  gimmeOldPasswordToo(event: Event) {
    let pass = (event.target as HTMLInputElement).value;
    if (pass.length == 0)
      this.showOldPasswordDiv = false;
    else
      this.showOldPasswordDiv = true;
  }

  goToUserPosts() {
    // this.sharedService.hideEditButtonForALilWhile(true);
    this.sharedService.checkingOtherSection(true, PostType.USER_POSTS);
    var i = this.backToSleepersList ? 1 : 0;
    this.router.navigateByUrl('/home/userPosts/' + this.userId + "/" + i);
  }

  // @ts-ignore
  noSpaces(event: KeyboardEvent) {
    let newValue = (<HTMLIonInputElement>event.target)?.value;
    let regExp = new RegExp("\\s", "g");
    if (regExp.test(<string>newValue)) {
      // @ts-ignore
      event.target.value = newValue.slice(0, -1);
    }
  }
  // compressFile() {
  //   this.ngxImageCompressService.uploadFile()
  //     .then(async ({image, fileName, orientation}) => {
  //         const loading = await this.loadingCtrl.create({
  //           spinner: 'bubbles',
  //           message: 'Optimizing this lil picture',
  //           duration: 10000,
  //           cssClass: 'custom-loading',
  //         });
  //
  //         await loading.present();
  //         // .then(({image, orientation}) => {
  //         // this.imgResultBeforeCompression = image;
  //         let oldSize = this.ngxImageCompressService.byteCount(image) / 1000000;
  //
  //         console.log("Size in bytes of the uploaded image: " + fileName + " was:", oldSize, 'MB');
  //         if (oldSize > 0.6) {
  //           console.log("imma compress this one..")
  //           this.ngxImageCompressService
  //             .compressFile(image, orientation, 50, 40) // 50% ratio, 50% quality
  //             .then(
  //               (compressedImage) => {
  //                 this.imgResult = compressedImage;
  //                 let newSize = this.ngxImageCompressService.byteCount(compressedImage) / 1000000;
  //                 this.toastService.presentToastWithDuration("bottom", "Compressed this one from " + oldSize + "MB down to " + newSize + "MB", 1200)
  //                 // window.alert("old size: "+oldSize+" mb, new size: "+newSize+" mb");
  //                 console.log("Size in bytes after compression is now:", this.ngxImageCompressService.byteCount(compressedImage) / 1000000, 'MB');
  //                 // console.log(compressedImage)
  //                 this.imageUploaded = this.dataURItoBlob(compressedImage, fileName);
  //                 this.userService.changeProfilePic(this.imageUploaded).subscribe(data => {
  //                   const jsonResponse: ProfilePicChangeResponse = data;
  //                   console.log(jsonResponse)
  //                   localStorage.setItem('profilePic', jsonResponse.profilePic);
  //                   location.reload()
  //                   this.router.navigateByUrl('/home/profile')
  //                 });
  //                 loading.dismiss()
  //                 // this.imageUploaded = new File([this.imgResult], fileName);
  //               }
  //             );
  //         } else {
  //           this.imgResult = image;
  //           console.log("aint compressadoing this one..")
  //           this.imageUploaded = this.dataURItoBlob(image, fileName);
  //           this.userService.changeProfilePic(this.imageUploaded).subscribe(data => {
  //             const jsonResponse: ProfilePicChangeResponse = data;
  //             console.log(jsonResponse)
  //             localStorage.setItem('profilePic', jsonResponse.profilePic);
  //             location.reload()
  //             this.router.navigateByUrl('/home/profile')
  //           });
  //           await loading.dismiss()
  //         }
  //       }
  //     );
  // }
}
