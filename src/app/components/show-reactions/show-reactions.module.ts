import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from "@angular/forms";
import {ShowReactionsComponent} from "./show-reactions.component";
import {ShowReactionsRoutingModule} from "./show-reactions-routing.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ShowReactionsRoutingModule
  ],
  declarations: [ShowReactionsComponent]
})
export class ReactionsPageModule {
}
