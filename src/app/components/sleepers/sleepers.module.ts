import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SleepersPage} from './sleepers.page';
import {SleepersRoutingModule} from './sleepers-routing.module';
import {FormsModule} from "@angular/forms";
import {AppModule} from "../app/app.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SleepersRoutingModule,
    AppModule
  ],
  declarations: [SleepersPage]
})
export class SleepersModule {
}
