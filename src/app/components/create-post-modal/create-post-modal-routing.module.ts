import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreatePostModalComponent} from "./create-post-modal.component";

const routes: Routes = [
  {
    path: '',
    component: CreatePostModalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePostModalRoutingModule {
}
