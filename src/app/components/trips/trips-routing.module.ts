import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TripsPage} from "./trips.page";

const routes: Routes = [
  {
    path: '',
    component: TripsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripsRoutingModule {
}
