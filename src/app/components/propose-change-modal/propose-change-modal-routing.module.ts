import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProposeChangeModalComponent} from "./propose-change-modal.component";

const routes: Routes = [
  {
    path: '',
    component: ProposeChangeModalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProposeChangeModalRoutingModule {
}
