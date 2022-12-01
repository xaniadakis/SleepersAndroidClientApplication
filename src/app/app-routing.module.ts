import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HomePage} from "./home/home.page";
import {TabsPage} from "./tabs/tabs.page";
import {Tab1Page} from "./tab1/tab1.page";
import {Tab2Page} from "./tab2/tab2.page";
import {Tab3Page} from "./tab3/tab3.page";
import {TabsPageModule} from "./tabs/tabs.module";
import {Tab1PageModule} from "./tab1/tab1.module";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'home',
    component: HomePage,
    children: [{
      path: 'tabs',
      component: TabsPage,
      children: [{
        path: 'tab1',
        component: Tab1Page,
      },
        {
          path: 'tab2',
          component: Tab2Page,
        },
        {
          path: 'tab3',
          component: Tab3Page,
        }]
    }]
    // ,loadChildren: () => Tab1PageModule
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
