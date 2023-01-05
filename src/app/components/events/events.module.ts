import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EventsPage} from './events.page';
import {EventsRoutingModule} from './events-routing.module';
import {FormsModule} from "@angular/forms";
import {AppModule} from "../app/app.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    EventsRoutingModule,
    AppModule
  ],
  declarations: [EventsPage]
})
export class EventsModule {
}
