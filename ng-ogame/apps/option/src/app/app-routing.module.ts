import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// PAGES
import { ExpeditionConfigurationComponent } from './pages/expedition-configuration/expedition-configuration.component';
import { FleetConfigurationComponent }      from './pages/fleet-configuration/fleet-configuration.component';

// ABOUT
import { AboutComponent } from './pages/about/about.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/fleet-configuration'
  },

  {
    path: 'fleet-configuration',
    pathMatch: 'full',
    component: FleetConfigurationComponent
  },

  {
    path: 'expedition-configuration',
    pathMatch: 'full',
    component: ExpeditionConfigurationComponent
  },

  {
    path: 'about',
    pathMatch: 'full',
    component: AboutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', anchorScrolling: 'enabled', })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
