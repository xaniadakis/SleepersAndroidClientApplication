import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EditPostModalComponent} from "./edit-post-modal.component";

const routes: Routes = [
  {
    path: '',
    component: EditPostModalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPostModalRoutingModule {
}
