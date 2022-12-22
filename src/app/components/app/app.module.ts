import {NgModule} from '@angular/core';
import {BrowserModule, HammerModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HomePage} from "../home/home.page";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {ToastService} from "../../service/toast.service";
import {PostService} from "../../service/post.service";
import {SharedService} from "../../service/shared.service";
import {TabsPage} from "../tabs/tabs.page";
import {Tab3Page} from "../tab3/tab3.page";
import {Tab1Page} from "../tab1/tab1.page";
import {Tab2Page} from "../tab2/tab2.page";
import {AuthorizationInterceptorService} from "../../configuration/authentication/auth.inter.service";
import {GuardService} from "../../configuration/authentication/guard.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {EditPostModalComponent} from "../edit-post-modal/edit-post-modal.component";
import {ShowPostModalComponent} from "../show-post-modal/show-post-modal.component";
import {OuterPostService} from "../../service/outer-post.service";
import {ModalService} from "../../service/modal.service";
import {CreatePostModalComponent} from "../create-post-modal/create-post-modal.component";
import {ReactionsComponent} from "../react-to-post/reactions.component";
import {AppVersion} from "@awesome-cordova-plugins/app-version/ngx";
import {Clipboard} from '@awesome-cordova-plugins/clipboard/ngx';
import {ShowReactionsComponent} from "../show-reactions/show-reactions.component";
import {SafePipe} from "../safe-pipe/safe.pipe";
import {NgxImageCompressService} from "ngx-image-compress";
import {ImageCompressService} from "../../service/image-compress.service";
import {ProfilePage} from "../profile/profile.page";
import {UserService} from "../../service/user.service";
import {PostsPage} from "../posts/posts.page";
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { AppUpdate } from '@ionic-native/app-update/ngx';

@NgModule({
  declarations: [AppComponent
    , HomePage
    , TabsPage
    , Tab1Page
    , Tab2Page
    , Tab3Page
    , EditPostModalComponent
    , ShowPostModalComponent
    , CreatePostModalComponent
    , ReactionsComponent
    , ShowReactionsComponent
    , ProfilePage
    , SafePipe
    , PostsPage
    // , MustMatchDirective
    // , LoginPage, SignupPage, WelcomePage
  ],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HammerModule, ReactiveFormsModule,
    // ScrollingModule,
  ],
  providers: [
    // StatusBar,
    // SplashScreen,
    // AppUpdate,
    AppVersion,
    Clipboard,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    OuterPostService,
    PostService,
    ModalService,
    ToastService,
    SharedService,
    HttpClient,
    {
      provide: JwtHelperService,
      useFactory: () => new JwtHelperService()
    },
    GuardService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptorService, multi: true},
    NgxImageCompressService,
    ImageCompressService,
    UserService,
    FormBuilder
    // CdkVirtualScrollViewport,
    // LogUpdateService,
    // CheckForUpdateService
  ],
  bootstrap: [AppComponent]
  // ,schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

// exports: [
  //   MustMatchDirective
  // ]
})
export class AppModule {
}
