import {ToastController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {StoriesService} from "./stories.service";
import {Injectable} from "@angular/core";

@Injectable()

export class ToastService {

  constructor(private toastController: ToastController) {
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      position: position
    });
    await toast.present();
  }
}
