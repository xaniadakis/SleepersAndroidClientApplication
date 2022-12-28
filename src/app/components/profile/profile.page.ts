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


@Component({
  selector: 'app-home-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";

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

  constructor(private sharedService: SharedService,
              private router: Router,
              private platform: Platform,
              private ngxImageCompressService: NgxImageCompressService,
              private toastService: ToastService,
              private loadingCtrl: LoadingController,
              private userService: UserService,
              private route: ActivatedRoute
  ) {
    let userIdString = this.route.snapshot.paramMap.get('userId');
    if (userIdString != null)
      this.userId = BigInt(userIdString);

    if (userIdString != "0") {
      this.hiddenEditButton = true;
      this.sharedService.hideEditButtonForALilWhile(true);
    } else {
      if (this.myUserId != null)
        this.userId = BigInt(this.myUserId);
    }
    this.platform.backButton.subscribeWithPriority(9999, (processNextHandler) => {
      if (this.hiddenEditButton)
        this.sharedService.hideEditButtonForALilWhile(false);
      this.sharedService.hidePostButtonForALilWhile(false);
      this.router.navigateByUrl('/home/tabs/tab3');
    })
  }

  ngOnInit() {
    this.sharedService.editProfile.subscribe({
      next: (event: boolean) => {
        console.log(`Received message #${event}`);
        this.setEditMode(event);
      }
    })
    this.sharedService.hidePostButtonForALilWhile(true);
    console.log("imma retrieve those user details");
    this.retrieveUserDetails(this.userId);
    console.log("did ma best");
    console.log('Initializing PostsPage for: ' + this.userDetails.username);
  }

  goBack() {
    if (this.hiddenEditButton)
      this.sharedService.hideEditButtonForALilWhile(false);
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

  checkIfUserExists(event: Event) {
    let username = (event.target as HTMLInputElement).value;
    console.log("checking name: " + username);
    this.startedCheckingUsernameValidity = true;
    this.checkingUsernameValidity = true;
    this.shortUsername = null;
    this.validUsername = null;
    if (username.trim().length >= this.usernameMinlength) {
      this.userService.checkIfUserExists(username).subscribe(data => {
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
    if (true) {
      console.log("YOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOoo");
      console.log(form);
    }
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
}
