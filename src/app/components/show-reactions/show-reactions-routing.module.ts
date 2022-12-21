import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShowReactionsComponent} from "./show-reactions.component";

const routes: Routes = [
  {
    path: '',
    component: ShowReactionsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowReactionsRoutingModule {
}
