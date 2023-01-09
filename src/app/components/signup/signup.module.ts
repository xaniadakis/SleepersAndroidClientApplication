import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SignupPageRoutingModule} from './signup-routing.module';

import {SignupPage} from './signup.page';
import {DisallowSpacesDirective} from "../../util/no-spaces.directive";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignupPageRoutingModule,
    TranslateModule
  ],
  declarations: [SignupPage, DisallowSpacesDirective]
})
export class SignupPageModule {
}
