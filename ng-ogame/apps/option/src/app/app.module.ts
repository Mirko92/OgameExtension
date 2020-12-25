import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ShipComponent } from '../components/ship/ship.component';
import { FormsModule } from '@angular/forms';
import { FleetComponent } from '../components/fleet/fleet.component';
import { OgameMenuComponent } from '../components/ogame-menu/ogame-menu.component';
import { OgamePlanetComponent } from '../components/ogame-planet/ogame-planet.component';
import { OgameMissionsComponent } from '../components/ogame-missions/ogame-missions.component';

@NgModule({
  declarations: [
    AppComponent,
    ShipComponent,
    FleetComponent,
    OgameMenuComponent,
    OgamePlanetComponent,
    OgameMissionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
