import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {UserService} from "../../service/user.service";
import {ToastService} from "../../service/toast.service";
import {Router} from "@angular/router";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss', "../welcome/welcome.page.scss"],
})
export class ForgotPasswordPage implements OnInit {

  constructor(private userService: UserService,
              private toastService: ToastService,
              private router: Router,
              private loadingCtrl: LoadingController) {
  }

  forgot = {
    email: ''
  };

  ngOnInit() {
  }

  async forgotPassword(form: NgForm) {
    if (form.valid) {
      const loading = await this.loadingCtrl.create({
        spinner: 'bubbles',
        message: 'Tryina find the coolest lil password possible for you',
        duration: 10000,
        cssClass: 'custom-loading',
      });
      loading.present();
      let email = form.controls["email"].value;
      this.userService.forgotPassword(email)
        .pipe(catchError(err => {
          loading.dismiss();
          this.toastService.presentToastWithDuration("middle", "This email doesnt exist.", 2000);
          form.reset();
          return throwError(err);
        }))
        .subscribe(data => {
          loading.dismiss();
          this.toastService.presentToastWithDuration("middle", data.message, 2000);
          this.router.navigateByUrl("/login");
        });
    }
  }

}
