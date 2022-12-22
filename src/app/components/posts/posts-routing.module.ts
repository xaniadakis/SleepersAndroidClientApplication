import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PostsPage} from "./posts.page";

const routes: Routes = [
  {
    path: '',
    component: PostsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsRoutingModule {
}
