import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {TripsRoutingModule} from './trips-routing.module';

import {TripsPage} from './trips.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TripsRoutingModule,
  ],
  declarations: [TripsPage]
})
export class TripsModule {
}
