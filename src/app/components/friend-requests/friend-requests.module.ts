import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FriendRequestsPage} from './friend-requests.page';
import {FriendRequestsRoutingModule} from './friend-requests-routing.module';
import {FormsModule} from "@angular/forms";
import {AppModule} from "../app/app.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FriendRequestsRoutingModule,
    AppModule
  ],
  declarations: [FriendRequestsPage]
})
export class FriendRequestsModule {
}
