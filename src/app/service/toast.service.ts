import {ToastController} from "@ionic/angular";
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

  async presentToastWithDuration(position: 'top' | 'middle' | 'bottom', message: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position
    });
    await toast.present();
  }
}
