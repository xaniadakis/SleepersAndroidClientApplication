import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from "@angular/forms";
import {ReactionsComponent} from "./reactions.component";
import {ReactionsRoutingModule} from "./reactions-routing.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactionsRoutingModule
  ],
  declarations: [ReactionsComponent]
})
export class ReactionsPageModule {}
