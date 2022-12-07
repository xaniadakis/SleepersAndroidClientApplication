import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import {TabsPage} from "../tabs/tabs.page";
import {Tab1Page} from "../tab1/tab1.page";
import {Tab2Page} from "../tab2/tab2.page";
import {Tab3Page} from "../tab3/tab3.page";

const routes: Routes = [
  {
    path: '',
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
