import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HomePage} from "../home/home.page";
import {TabsPage} from "../tabs/tabs.page";
import {Tab1Page} from "../tab1/tab1.page";
import {Tab2Page} from "../tab2/tab2.page";
import {Tab3Page} from "../tab3/tab3.page";
import {GuardService} from "../../configuration/authentication/guard.service";
import {ProfilePage} from "../profile/profile.page";
import {UserPostsPage} from "../user-posts/user-posts.page";
import {SleepersPage} from "../sleepers/sleepers.page";
import {FriendRequestsPage} from "../friend-requests/friend-requests.page";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('../login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('../signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('../forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'home',
    component: HomePage,
    // canActivate: [ GuardService ],
    children: [{
      path: 'tabs',
      component: TabsPage,
      // canActivate: [ GuardService ],
      children: [{
        path: 'tab1',
        component: Tab1Page,
        canActivate: [GuardService],
      },
        {
          path: 'tab2',
          component: Tab2Page,
          canActivate: [GuardService],
        },
        {
          path: 'tab3',
          component: Tab3Page,
          canActivate: [GuardService],
        }]
    }, {
      path: 'profile/:userId/:naviedFromUsersList',
      component: ProfilePage,
      canActivate: [GuardService]
    }, {
      path: 'userPosts/:userId/:naviedFromUsersList',
      component: UserPostsPage,
      canActivate: [GuardService]
    }, {
      path: 'sleepers',
      component: SleepersPage,
      canActivate: [GuardService]
    }, {
      path: 'friend-requests',
      component: FriendRequestsPage,
      canActivate: [GuardService]
    }]
    // ,loadChildren: () => Tab1PageModule
  },
  {
    path: 'welcome',
    loadChildren: () => import('../welcome/welcome.module').then(m => m.WelcomePageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
