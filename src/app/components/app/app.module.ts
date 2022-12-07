import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {HomePage} from "../home/home.page";
import {StoriesService} from "../../service/stories.service";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {ToastService} from "../../service/toast.service";
import {CarPostService} from "../../service/car-post.service";
import {ArtPostService} from "../../service/art-post.service";
import {SharedService} from "../../service/shared.service";
import {TabsPage} from "../tabs/tabs.page";
import {Tab3Page} from "../tab3/tab3.page";
import {Tab1Page} from "../tab1/tab1.page";
import {Tab2Page} from "../tab2/tab2.page";
import {AuthorizationInterceptorService} from "../../configuration/authentication/auth.inter.service";
import {GuardService} from "../../configuration/authentication/guard.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from "../../../environments/environment.prod";

@NgModule({
  declarations: [AppComponent
    , HomePage
    , TabsPage
    , Tab1Page
    , Tab2Page
    , Tab3Page
    // , MustMatchDirective
    // , LoginPage, SignupPage, WelcomePage
  ],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: !isDevMode(),
    //   // Register the ServiceWorker as soon as the application is stable
    //   // or after 30 seconds (whichever comes first).
    //   registrationStrategy: 'registerWhenStable:30000'
    // }),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    // ScrollingModule,
  ],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    StoriesService,
    CarPostService,
    ArtPostService,
    ToastService,
    SharedService,
    HttpClient,
    {
      provide: JwtHelperService,
      useFactory: () => new JwtHelperService()
    },
    GuardService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptorService, multi: true},
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
