import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FriendRequestsPage} from './friend-requests.page';

const routes: Routes = [
  {
    path: '',
    component: FriendRequestsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FriendRequestsRoutingModule {
}
