import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {WelcomePageRoutingModule} from './welcome-routing.module';

import {WelcomePage} from './welcome.page';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomePageRoutingModule,
    TranslateModule
  ],
  declarations: [WelcomePage]
})
export class WelcomePageModule {
}
