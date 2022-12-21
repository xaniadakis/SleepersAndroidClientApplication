import {Component, OnInit} from '@angular/core';
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(
    private toastController: ToastController, private router: Router
  ) {
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, url: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      buttons: [
        {
          text: 'Ok navigate me home.',
          role: 'cancel',
          handler: () => {
            this.navigateToHome();
          }
        }
      ]
    });
    this.navigateToUrl(url)
    await toast.present();
  }

  navigateToHome() {
    this.router.navigateByUrl("/home/tabs/tab2")
  }

  navigateToUrl(url: string) {
    this.router.navigateByUrl(url)
  }

  ngOnInit() {
  }

}
