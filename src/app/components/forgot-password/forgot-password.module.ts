import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ForgotPasswordPageRoutingModule} from './forgot-password-routing.module';

import {ForgotPasswordPage} from './forgot-password.page';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotPasswordPageRoutingModule,
    TranslateModule
  ],
  declarations: [ForgotPasswordPage]
})
export class ForgotPasswordPageModule {
}
