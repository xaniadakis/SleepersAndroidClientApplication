import { IonicModule } from '@ionic/angular';
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import {RouterLink, RouterLinkActive} from "@angular/router";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        TabsPageRoutingModule,
        RouterLinkActive,
        RouterLink,
    ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
