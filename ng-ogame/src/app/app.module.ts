import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TraderComponent } from './components/trader/trader.component';
import { FleetComponent } from './components/fleet/fleet.component';

@NgModule({
  declarations: [
    AppComponent,
    TraderComponent,
    FleetComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule, 
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
