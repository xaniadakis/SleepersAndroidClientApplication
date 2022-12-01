import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(
    // private formBuilder: FormBuilder
    private router: Router
    // ,private http: HttpClient
    ,private activatedRoute: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngOnInit(){}

  async presentToast(position: 'top' | 'middle' | 'bottom', message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      buttons: [
        {
          text: 'Ok bro I get it.',
          role: 'cancel',
          handler: () => { window.alert("Cool bro..forgive a lad tho..") }
        }
      ]
    });
    await toast.present();
  }

  goBack(){
    this.router.navigateByUrl("/home/tabs/tab1")
  }

  goForward(){
    this.router.navigateByUrl("/home/tabs/tab3")
  }
}
