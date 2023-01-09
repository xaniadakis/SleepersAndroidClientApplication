import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';
import {TranslateModule} from "@ngx-translate/core";
import {CreatePostModalComponent} from "./create-post-modal.component";
import {CreatePostModalRoutingModule} from "./create-post-modal-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePostModalRoutingModule,
    TranslateModule
  ],
  declarations: [CreatePostModalComponent]
})
export class CreatePostModalModule {
}
