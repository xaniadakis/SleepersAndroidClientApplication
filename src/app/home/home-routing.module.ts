import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

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
