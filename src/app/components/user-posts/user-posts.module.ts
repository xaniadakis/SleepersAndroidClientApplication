import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserPostsPage} from './user-posts.page';
import {UserPostsRoutingModule} from './user-posts-routing.module';
import {FormsModule} from "@angular/forms";
import {AppModule} from "../app/app.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    UserPostsRoutingModule,
    AppModule
  ],
  declarations: [UserPostsPage]
})
export class UserPostsModule {
}
