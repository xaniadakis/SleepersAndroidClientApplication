import {ActionPerformed, PushNotifications, PushNotificationSchema, Token} from "@capacitor/push-notifications";
import {Injectable} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {ToastService} from "./toast.service";
import {ToastButton} from "@ionic/angular";
import {Clipboard} from "@awesome-cordova-plugins/clipboard/ngx";
import {UserService} from "./user.service";
import {ProfilePicChangeResponse} from "../dto/profile-pic-change-response";

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  constructor(private toastService: ToastService,
              private clipboard: Clipboard,
              private userService: UserService
  ) {
  }

  initPush() {
    const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');

    if (isPushNotificationsAvailable) {
      this.initPushNotifications();
    }
  }

  private initPushNotifications() {
    // Need to request permission to register push notifications. Use below code snippet to do that.
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        PushNotifications.register();
        console.log("granted notifications: " + result.receive);
      } else {
        console.log("no pushados: " + result.receive)
      }
    });

    // Use the below code snippet to get the FCM token. We can save that token for sending push notifications to registered devices later.
    PushNotifications.addListener('registration', (token: Token) => {
      console.log("token: " + token.value);
      this.clipboard.copy(token.value);
      this.userService.sendFcmToken(token.value).subscribe(data => {
        console.log(data)
        // this.toastService.presentToast("bottom", data.toString());
        localStorage.setItem('token', token.value);
      });
      // this.toastService.presentToast("middle", "Copied your fcm token to the clipboard!")
    });

    // Use the code snippet below for errors during the registration to the push notifications.
    PushNotifications.addListener('registrationError', (error: any) => {
      // Handle push notification registration error here.
      // this.toastService.presentToastWithDuration("middle","registrationError: " + error, 5000);
    });

    // Use the below code snippet to handle the push notification payload when the app is open on the device.
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        // handle the notification payload
        this.toastService.presentToastWithDuration("middle", "" + notification.title + ": " + notification.body, 5000);

      }
    );

    // Use the below code snippet to take the needed action when the user taps on the notification.
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (actionPerformed: ActionPerformed) => {
        actionPerformed.actionId
        // this.toastService.presentToastWithDuration("middle","notification tapped: " + notification.notification.body, 5000);
        // Take needed action on notification tap
      }
    );
  }

}
