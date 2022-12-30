import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SleepersPage} from './sleepers.page';

const routes: Routes = [
  {
    path: '',
    component: SleepersPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SleepersRoutingModule {
}
