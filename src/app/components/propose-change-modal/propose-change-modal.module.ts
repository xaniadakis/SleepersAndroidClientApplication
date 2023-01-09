import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';
import {TranslateModule} from "@ngx-translate/core";
import {ProposeChangeModalRoutingModule} from "./propose-change-modal-routing.module";
import {ProposeChangeModalComponent} from "./propose-change-modal.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProposeChangeModalRoutingModule,
    TranslateModule
  ],
  declarations: [ProposeChangeModalComponent]
})
export class ProposeChangeModalModule {
}
