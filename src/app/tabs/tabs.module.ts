import { IonicModule } from '@ionic/angular';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import {RouterLink, RouterLinkActive} from "@angular/router";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TabsPageRoutingModule,
        RouterLinkActive,
        RouterLink,
    ],
  declarations: [TabsPage]
  // ,schemas: [NO_ERRORS_SCHEMA]
})
export class TabsPageModule {}
