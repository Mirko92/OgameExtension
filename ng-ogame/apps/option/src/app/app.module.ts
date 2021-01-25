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
import { OgameSpeedComponent } from '../components/ogame-speed/ogame-speed.component';
import { StickyClassDirective } from '../directives/sticky-class.directive';
import { OgameCardComponent } from '../components/ogame-card/ogame-card.component';
import { FleetConfigurationComponent } from './pages/fleet-configuration/fleet-configuration.component';
import { MainMenuComponent } from '../components/main-menu/main-menu.component';
import { AboutComponent } from './pages/about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    ShipComponent,
    FleetComponent,
    OgameCardComponent,
    OgameMenuComponent,
    OgamePlanetComponent,
    OgameMissionsComponent,
    OgameSpeedComponent,
    StickyClassDirective,
    // PAGES
    FleetConfigurationComponent,
    AboutComponent
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
