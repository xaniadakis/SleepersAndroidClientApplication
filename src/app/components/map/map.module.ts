import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapComponent} from './map.component';
import {MapRoutingModule} from './map-routing.module';
import {FormsModule} from "@angular/forms";
import {AppModule} from "../app/app.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MapRoutingModule,
    AppModule
  ],
  declarations: [MapComponent]
})
export class MapModule {
}
