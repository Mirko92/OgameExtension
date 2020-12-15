import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ShipComponent } from '../components/ship/ship.component';
import { FormsModule } from '@angular/forms';
import { FleetComponent } from '../components/fleet/fleet.component';

@NgModule({
  declarations: [
    AppComponent,
    ShipComponent,
    FleetComponent
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
