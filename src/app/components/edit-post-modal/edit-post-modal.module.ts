import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';
import {TranslateModule} from "@ngx-translate/core";
import {EditPostModalComponent} from "./edit-post-modal.component";
import {EditPostModalRoutingModule} from "./edit-post-modal-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPostModalRoutingModule,
    TranslateModule
  ],
  declarations: [EditPostModalComponent]
})
export class EditPostModalModule {
}
