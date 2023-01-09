import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ProfileRoutingModule} from './profile-routing.module';

import {ProfilePage} from './profile.page';
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileRoutingModule,
    TranslateModule
  ],
  declarations: [ProfilePage]
})
export class ProfileModule {
}
